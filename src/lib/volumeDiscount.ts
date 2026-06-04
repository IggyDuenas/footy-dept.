import { CartItem } from '@/types'

export const VOLUME_TIERS = [
  { minItems: 1,  maxItems: 2,  discountPercent: 0  },
  { minItems: 3,  maxItems: 4,  discountPercent: 5  },
  { minItems: 5,  maxItems: 6,  discountPercent: 10 },
  { minItems: 7,  maxItems: 9,  discountPercent: 15 },
  { minItems: 10, maxItems: 10, discountPercent: 20 },
]

export function getDiscountPercent(totalItems: number): number {
  const tier = VOLUME_TIERS.slice().reverse().find(t => totalItems >= t.minItems)
  return tier?.discountPercent ?? 0
}

export function getNextTier(totalItems: number): { itemsNeeded: number; nextPercent: number } | null {
  const next = VOLUME_TIERS.find(t => t.minItems > totalItems)
  if (!next) return null
  return {
    itemsNeeded: next.minItems - totalItems,
    nextPercent: next.discountPercent,
  }
}

export function applyDiscount(basePrice: number, discountPercent: number): number {
  if (discountPercent === 0) return basePrice
  return Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100
}

export function calcCartTotals(items: CartItem[], discountPercent: number) {
  let originalTotal = 0
  let discountedTotal = 0
  let customizationTotal = 0
  let totalItems = 0

  for (const item of items) {
    const baseLineTotal = item.product.price * item.quantity
    const customLineTotal = (item.customizationTotal ?? 0) * item.quantity
    const discountedLineTotal = applyDiscount(item.product.price, discountPercent) * item.quantity

    originalTotal += baseLineTotal
    discountedTotal += discountedLineTotal
    customizationTotal += customLineTotal
    totalItems += item.quantity
  }

  const savings = originalTotal - discountedTotal
  const finalTotal = discountedTotal + customizationTotal

  return { originalTotal, discountedTotal, customizationTotal, savings, finalTotal, totalItems }
}
