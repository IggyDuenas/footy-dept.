'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { CheckCircle, Package } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCartStore()

  useEffect(() => {
    if (sessionId) clearCart()
  }, [sessionId, clearCart])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <CheckCircle size={36} className="text-white" />
        </motion.div>

        <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Order Confirmed</p>
        <h1 className="text-5xl font-black text-white tracking-tight uppercase leading-none mb-4">
          You&apos;re in the squad.
        </h1>
        <p className="text-white/40 text-base mb-10 leading-relaxed">
          Your order has been placed and is being processed. You&apos;ll receive a confirmation email shortly.
        </p>

        <div className="flex flex-col gap-4">
          <Link
            href="/track"
            className="flex items-center justify-center gap-2 w-full py-4 bg-white text-black font-black text-sm tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-colors"
          >
            <Package size={16} />
            Track Your Order
          </Link>
          <Link
            href="/shop"
            className="text-white/40 text-sm hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SuccessContent />
    </Suspense>
  )
}
