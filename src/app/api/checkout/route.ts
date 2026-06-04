import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { CartItem } from '@/types'
import { getDiscountPercent, applyDiscount } from '@/lib/volumeDiscount'

export async function POST(req: NextRequest) {
  try {
    const { items, promotionCodeId }: { items: CartItem[]; promotionCodeId?: string } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items in cart' }, { status: 400 })
    }

    const totalItemCount = items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)
    const discountPercent = getDiscountPercent(totalItemCount)

    const lineItems = items.map((item) => {
      // Build description — only include customizations that exist
      const descParts: string[] = [`Size: ${item.size}`]
      if (item.customName) descParts.push(`Name: ${item.customName} ${item.customNumber ?? ''}`.trim())
      if (item.selectedBadges && item.selectedBadges.length > 0) descParts.push(`Badges: ${item.selectedBadges.map((b: { name: string }) => b.name).join(', ')}`)
      if (discountPercent > 0) descParts.push(`${discountPercent}% volume discount applied`)

      const discountedPrice = applyDiscount(item.product.price, discountPercent)

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
          unit_amount: Math.round((discountedPrice + (item.customizationTotal || 0)) * 100),
        },
        quantity: item.quantity,
      }
    })

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      (req.headers.get('origin') ?? `https://${req.headers.get('host')}`) ||
      'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/shop`,
      ...(promotionCodeId
        ? { discounts: [{ promotion_code: promotionCodeId }] }
        : { allow_promotion_codes: true }
      ),
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
      // Snapshot customization data — minified keys to stay under Stripe's 500-char metadata limit
      metadata: (() => {
        const minifiedItems = items.map((item) => {
          const min: Record<string, unknown> = {
            p: item.product.id,
            q: item.quantity,
            s: item.size,
            u: item.product.price,
          }
          if (discountPercent > 0) min.dp = applyDiscount(item.product.price, discountPercent)
          if (item.customName) min.n = item.customName
          if (item.customNumber != null) min.num = item.customNumber
          if (item.selectedBadges && item.selectedBadges.length > 0) min.b = item.selectedBadges
          if (item.customizationTotal && item.customizationTotal > 0) min.ct = item.customizationTotal
          return min
        })
        const itemsString = JSON.stringify(minifiedItems)
        if (itemsString.length > 490) {
          throw new Error('CART_TOO_LARGE')
        }
        return { items: itemsString }
      })(),
    })

    return NextResponse.json({ url: session.url })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    if (message === 'CART_TOO_LARGE') {
      return NextResponse.json(
        { error: 'Cart is too large for checkout. Please reduce the number of items and try again.' },
        { status: 400 }
      )
    }
    console.error('Stripe checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
