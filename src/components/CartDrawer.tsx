'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCartStore()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (items.length === 0) return
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        closeCart()
        window.location.href = data.url
      } else {
        setCheckoutError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('Checkout error:', err)
      setCheckoutError('Could not reach checkout. Check your connection.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0a0a0a] border-l border-white/10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-white" />
                <span className="font-bold text-white tracking-wider uppercase text-sm">
                  Your Cart ({items.length})
                </span>
              </div>
              <button onClick={closeCart} className="text-white/50 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-white/20" />
                  <p className="text-white/40 text-sm tracking-wide">Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="text-sm text-blue-400 hover:text-blue-300 underline underline-offset-4"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <AnimatePresence>
                    {items.map((item) => {
                      const linePrice = (item.product.price + (item.customizationTotal || 0)) * item.quantity
                      return (
                        <motion.div
                          key={item.cartKey}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                          className="flex gap-4"
                        >
                          <div className="relative w-20 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={item.product.images[0] || '/placeholder.jpg'}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-semibold text-sm truncate">{item.product.name}</p>
                            <p className="text-white/40 text-xs mt-0.5">Size: {item.size}</p>

                            {/* Custom name/number */}
                            {(item.customName || item.customNumber != null) && (
                              <p className="text-white/40 text-xs mt-0.5">
                                Name: {item.customName} {item.customNumber}
                              </p>
                            )}

                            {/* Badge chips */}
                            {item.selectedBadges && item.selectedBadges.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {item.selectedBadges.map((b) => (
                                  <span
                                    key={b.id}
                                    className="text-[10px] bg-blue-500/10 border border-blue-500/20 text-blue-400 px-1.5 py-0.5 leading-none"
                                  >
                                    {b.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            <p className="text-blue-400 font-bold text-sm mt-1">
                              ${linePrice.toFixed(2)}
                            </p>

                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                                className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-white text-sm font-medium w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                                className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                              <button
                                onClick={() => removeItem(item.cartKey)}
                                className="ml-auto text-white/30 hover:text-red-400 transition-colors text-xs"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Subtotal</span>
                  <span className="text-white font-bold text-lg">${total().toFixed(2)}</span>
                </div>
                <p className="text-white/30 text-xs">Shipping calculated at checkout</p>
                {checkoutError && (
                  <p className="text-red-400 text-xs text-center">{checkoutError}</p>
                )}
                <button
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  className="w-full bg-white text-black font-black tracking-widest uppercase text-sm py-4 rounded-none hover:bg-blue-500 hover:text-white transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? 'Redirecting...' : `Checkout — $${total().toFixed(2)}`}
                </button>
                <button
                  onClick={closeCart}
                  className="w-full text-white/40 text-xs tracking-wider uppercase hover:text-white/60 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
