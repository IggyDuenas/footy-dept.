import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const { code }: { code: string } = await req.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ valid: false, error: 'No code provided' }, { status: 400 })
    }

    const { data } = await stripe.promotionCodes.list({
      code: code.trim().toUpperCase(),
      active: true,
      limit: 1,
      expand: ['data.promotion.coupon'],
    })

    const promoCode = data[0]

    if (!promoCode) {
      return NextResponse.json({ valid: false, error: 'Invalid or expired code' })
    }

    // In SDK v22 the coupon lives under promotion.coupon (expanded above)
    const rawCoupon = promoCode.promotion?.coupon
    const coupon = rawCoupon && typeof rawCoupon === 'object' ? rawCoupon : null

    let discountDescription = ''
    if (coupon?.percent_off != null) {
      discountDescription = `${coupon.percent_off}% off`
    } else if (coupon?.amount_off != null) {
      discountDescription = `$${(coupon.amount_off / 100).toFixed(2)} off`
    } else if (coupon?.name) {
      discountDescription = coupon.name
    } else {
      discountDescription = 'Discount applied'
    }

    return NextResponse.json({
      valid: true,
      promotionCodeId: promoCode.id,
      discountDescription,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Coupon validation error:', message)
    return NextResponse.json({ valid: false, error: 'Could not validate code' }, { status: 500 })
  }
}
