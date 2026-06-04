import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@/lib/supabase'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const supabase = createServerClient()

    try {
      const rawItems = session.metadata?.items
      if (!rawItems) throw new Error('No items metadata')

      // Expand minified keys back to full names
      const items: Array<{
        product_id: string
        quantity: number
        size: string
        unit_price: number
        custom_name: string | null
        custom_number: number | null
        selected_badges: Array<{ badge_id: string; name: string; price: number }>
        customization_total: number
      }> = JSON.parse(rawItems).map((min: Record<string, unknown>) => ({
        product_id: min.p,
        quantity: min.q,
        size: min.s,
        unit_price: min.u,
        custom_name: min.n ?? null,
        custom_number: min.num ?? null,
        selected_badges: min.b ?? [],
        customization_total: min.ct ?? 0,
      }))

      const shippingAddress = (
        session as Stripe.Checkout.Session & {
          shipping_details?: { address?: Stripe.Address }
        }
      ).shipping_details?.address

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_email: session.customer_details?.email || '',
          customer_name: session.customer_details?.name || '',
          shipping_address: {
            line1: shippingAddress?.line1 || '',
            line2: shippingAddress?.line2 || '',
            city: shippingAddress?.city || '',
            state: shippingAddress?.state || '',
            postal_code: shippingAddress?.postal_code || '',
            country: shippingAddress?.country || '',
          },
          total_price: (session.amount_total || 0) / 100,
          status: 'pending',
          stripe_session_id: session.id,
        })
        .select()
        .single()

      if (orderError || !order) {
        throw new Error(`Order creation failed: ${orderError?.message}`)
      }

      // Create order items with customization snapshots
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        unit_price: item.unit_price,
        custom_name: item.custom_name || null,
        custom_number: item.custom_number ?? null,
        selected_badges: item.selected_badges || [],
        customization_total: item.customization_total || 0,
      }))

      await supabase.from('order_items').insert(orderItems)

      // Update inventory
      for (const item of items) {
        await supabase.rpc('decrement_inventory', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })
      }

      console.log('Order created:', order.id)
    } catch (err) {
      console.error('Order creation error:', err)
      return NextResponse.json({ error: 'Order processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
