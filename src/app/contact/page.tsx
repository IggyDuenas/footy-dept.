'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'

const topics = [
  'Order Issue',
  'Returns & Refunds',
  'Sizing Question',
  'Product Inquiry',
  'Wholesale / Bulk',
  'Other',
]

export default function ContactPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate submission — wire up to a real endpoint when ready
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <main className="bg-black min-h-screen">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4"
          >
            Get in Touch
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tight uppercase leading-none"
          >
            Contact Us.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-white/40 text-base mt-6 max-w-md"
          >
            Got a question about your order or just want to talk football? We&apos;ll get back to you within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 lg:gap-24">

        {/* Left — info */}
        <div>
          <div className="space-y-10">
            {[
              {
                label: 'Email',
                value: 'support@footydept.com',
                sub: 'For order issues, returns, and general enquiries.',
              },
              {
                label: 'Response Time',
                value: 'Within 24 hours',
                sub: 'Monday – Friday. We try to respond same-day when we can.',
              },
              {
                label: 'Based In',
                value: 'United States',
                sub: 'Shipping worldwide from our fulfillment partners.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="border-t border-white/10 pt-8"
              >
                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-1">{item.label}</p>
                <p className="text-white font-black text-lg tracking-tight">{item.value}</p>
                <p className="text-white/40 text-sm mt-1">{item.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {submitted ? (
            <div className="border border-white/10 p-10 text-center">
              <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Message Sent</p>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-4">We got it.</h2>
              <p className="text-white/50 text-sm leading-relaxed">
                We&apos;ll be in touch within 24 hours. Check your inbox — and your spam folder just in case.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name + Email */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-white/30 text-[10px] tracking-widest uppercase block mb-2">Name</label>
                  <input
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-white/30 text-[10px] tracking-widest uppercase block mb-2">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors"
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="text-white/30 text-[10px] tracking-widest uppercase block mb-2">Topic</label>
                <select
                  name="topic"
                  required
                  value={form.topic}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Select a topic</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-white/30 text-[10px] tracking-widest uppercase block mb-2">Message</label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us what's going on..."
                  className="w-full bg-zinc-900 border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-black text-sm tracking-widest uppercase py-4 hover:bg-blue-500 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              <p className="text-white/20 text-xs text-center">
                By submitting this form you agree to our{' '}
                <a href="/legal" className="underline underline-offset-2 hover:text-white/40 transition-colors">
                  Privacy Policy
                </a>.
              </p>
            </form>
          )}
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}
