'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <section className="bg-[#080808] border-t border-white/5 py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Community</p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase leading-none mb-6">
            Join the
            <br />
            Footy Dept.
          </h2>
          <p className="text-white/40 text-base mb-10 max-w-md mx-auto">
            Early access to drops, exclusive deals, and matchday content — straight to your inbox.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <ArrowRight size={20} className="text-white" />
              </div>
              <p className="text-white font-bold text-xl">You&apos;re in the squad.</p>
              <p className="text-white/40 text-sm">Check your inbox for a welcome drop.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-5 py-4 text-sm outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-white text-black font-black text-sm tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-colors duration-300 whitespace-nowrap"
              >
                Join Now
              </button>
            </form>
          )}

          <p className="text-white/20 text-xs mt-5">No spam. Unsubscribe anytime.</p>
        </motion.div>
      </div>
    </section>
  )
}
