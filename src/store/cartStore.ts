'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Badge, CartItem, Product } from '@/types'
import { getDiscountPercent, calcCartTotals } from '@/lib/volumeDiscount'

interface AddItemOptions {
  size: string
  quantity?: number
  customName?: string | null
  customNumber?: number | null
  selectedBadges?: Badge[]
  customizationTotal?: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, options: AddItemOptions) => boolean
  removeItem: (cartKey: string) => void
  updateQuantity: (cartKey: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  total: () => number
  itemCount: () => number
  discountPercent: () => number
  savings: () => number
}

function buildCartKey(
  productId: string,
  size: string,
  customName?: string | null,
  customNumber?: number | null,
  selectedBadges?: Badge[]
): string {
  const badgeIds = (selectedBadges || []).map((b) => b.id).sort().join(',')
  return `${productId}-${size}-${customName || ''}-${customNumber ?? ''}-${badgeIds}`
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, options) => {
        const {
          size,
          quantity = 1,
          customName,
          customNumber,
          selectedBadges,
          customizationTotal,
        } = options

        const currentCount = get().itemCount()
        if (currentCount + quantity > 10) {
          return false
        }

        const cartKey = buildCartKey(product.id, size, customName, customNumber, selectedBadges)
        const items = get().items
        const existing = items.find((i) => i.cartKey === cartKey)

        if (existing) {
          set({
            items: items.map((i) =>
              i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i
            ),
          })
        } else {
          const newItem: CartItem = {
            cartKey,
            product,
            size,
            quantity,
            customName: customName || undefined,
            customNumber: customNumber ?? undefined,
            selectedBadges: selectedBadges?.length ? selectedBadges : undefined,
            customizationTotal: customizationTotal || undefined,
          }
          set({ items: [...items, newItem] })
        }
        set({ isOpen: true })
        return true
      },

      removeItem: (cartKey) => {
        set({ items: get().items.filter((i) => i.cartKey !== cartKey) })
      },

      updateQuantity: (cartKey, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartKey)
          return
        }
        set({
          items: get().items.map((i) =>
            i.cartKey === cartKey ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      openCart:  () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      total: () => {
        const items = get().items
        const totalItems = get().itemCount()
        const dp = getDiscountPercent(totalItems)
        const { finalTotal } = calcCartTotals(items, dp)
        return finalTotal
      },

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      discountPercent: () => getDiscountPercent(get().itemCount()),

      savings: () => {
        const items = get().items
        const totalItems = get().itemCount()
        const dp = getDiscountPercent(totalItems)
        const { savings } = calcCartTotals(items, dp)
        return savings
      },
    }),
    {
      name: 'footy-dept-cart',
      version: 1,
      // Clears legacy cart items that lack cartKey (pre-customisation build)
      migrate: (_state, version) => {
        if (version === 0) return { items: [], isOpen: false }
        return _state as CartStore
      },
    }
  )
)

export const useWishlistStore = create<{
  items: string[]
  toggle: (id: string) => void
  has: (id: string) => boolean
}>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (id) => {
        const items = get().items
        set({
          items: items.includes(id)
            ? items.filter((i) => i !== id)
            : [...items, id],
        })
      },
      has: (id) => get().items.includes(id),
    }),
    { name: 'footy-dept-wishlist' }
  )
)
