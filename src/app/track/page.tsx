'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Truck, CheckCircle, Clock, Search } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Order } from '@/types'

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
]

function getStepIndex(status: string) {
  return STATUS_STEPS.findIndex((s) => s.key === status)
}

export default function TrackPage() {
  const [orderNum, setOrderNum] = useState('')
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setOrder(null)

    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(*))')
      .eq('id', orderNum.trim())
      .eq('customer_email', email.trim().toLowerCase())
      .single()

    if (data) {
      setOrder(data)
    } else {
      setError('No order found. Check your order number and email.')
    }
    setLoading(false)
  }

  const activeStep = order ? getStepIndex(order.status) : -1

  return (
    <main>
      <Navbar onSearchOpen={() => {}} />
      <div className="pt-16 min-h-screen bg-black">
        <div className="max-w-2xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Track</p>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none mb-4">
              Your Order.
            </h1>
            <p className="text-white/40 text-base mb-10">
              Enter your order number and email address to track your shipment.
            </p>

            {/* Form */}
            <form onSubmit={handleSearch} className="space-y-4 mb-10">
              <div>
                <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Order Number</label>
                <input
                  type="text"
                  value={orderNum}
                  onChange={(e) => setOrderNum(e.target.value)}
                  placeholder="e.g. fd_abc123"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-5 py-4 text-sm outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs tracking-widest uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-5 py-4 text-sm outline-none focus:border-white/30 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black text-sm tracking-widest uppercase py-4 hover:bg-blue-500 hover:text-white transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Search size={16} />
                {loading ? 'Searching...' : 'Track Order'}
              </button>
            </form>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-red-500/20 bg-red-500/5 text-red-400 text-sm px-5 py-4 mb-8"
              >
                {error}
              </motion.div>
            )}

            {/* Order result */}
            {order && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="border border-white/10 p-6 mb-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="text-white/40 text-xs tracking-widest uppercase">Order</p>
                      <p className="text-white font-bold text-lg">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-xs tracking-widest uppercase">Total</p>
                      <p className="text-white font-bold text-lg">${order.total_price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Status steps */}
                  <div className="relative">
                    <div className="flex justify-between relative z-10">
                      {STATUS_STEPS.map((step, i) => {
                        const Icon = step.icon
                        const isActive = i <= activeStep
                        const isCurrent = i === activeStep
                        return (
                          <div key={step.key} className="flex flex-col items-center gap-2 flex-1">
                            <div
                              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isActive
                                  ? 'border-blue-500 bg-blue-500 text-white'
                                  : 'border-white/20 text-white/20'
                              } ${isCurrent ? 'ring-2 ring-blue-500/30 ring-offset-2 ring-offset-black' : ''}`}
                            >
                              <Icon size={16} />
                            </div>
                            <p className={`text-[10px] tracking-wider uppercase text-center ${isActive ? 'text-white' : 'text-white/20'}`}>
                              {step.label}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                    {/* Progress line */}
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-white/10 -z-0">
                      <div
                        className="h-full bg-blue-500 transition-all duration-700"
                        style={{ width: `${(activeStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping address */}
                <div className="border border-white/10 p-6">
                  <p className="text-white/40 text-xs tracking-widest uppercase mb-3">Ship To</p>
                  <p className="text-white font-semibold">{order.customer_name}</p>
                  <p className="text-white/50 text-sm mt-1">
                    {order.shipping_address.line1}
                    {order.shipping_address.line2 && `, ${order.shipping_address.line2}`}
                    <br />
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                    <br />
                    {order.shipping_address.country}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
