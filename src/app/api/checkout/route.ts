import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CartItem } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { items }: { items: CartItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const lineItems = items.map((item) => {
      // Build description with customization details
      const descParts: string[] = [`Size: ${item.size}`]
      if (item.customName || item.customNumber != null) {
        descParts.push(`Name: ${item.customName || ''} ${item.customNumber ?? ''}`.trim())
      }
      if (item.selectedBadges && item.selectedBadges.length > 0) {
        descParts.push(`Badges: ${item.selectedBadges.map((b) => b.name).join(', ')}`)
      }

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: descParts.join(' | '),
            images: item.product.images
              .slice(0, 1)
              .filter((url) => url.startsWith('https://')),
            metadata: {
              product_id: item.product.id,
              slug: item.product.slug,
            },
          },
          // Unit price includes customization add-on total
          unit_amount: Math.round((item.product.price + (item.customizationTotal || 0)) * 100),
        },
        quantity: item.quantity,
      }
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop`,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'FR', 'DE', 'ES', 'IT', 'BR', 'MX'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 0, currency: 'usd' },
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1499, currency: 'usd' },
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 2 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
      // Snapshot all customization data so the webhook can persist it accurately
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            size: i.size,
            unit_price: i.product.price,
            custom_name: i.customName || null,
            custom_number: i.customNumber ?? null,
            // Badge snapshot: prices locked at order time so historical orders are stable
            selected_badges: i.selectedBadges || [],
            customization_total: i.customizationTotal || 0,
          }))
        ),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
