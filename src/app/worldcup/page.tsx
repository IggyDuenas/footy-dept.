'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'
import { WORLD_CUP_NATIONS } from '@/lib/worldcup'

export default function WorldCupPage() {
  const [searchOpen, setSearchOpen] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText('WORLDCUP')
    toast.success('Code copied!')
  }

  return (
    <main>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #000000 0%, #0a0a1a 50%, #000820 100%)' }}
      >
        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <p className="text-blue-400 text-xs tracking-[0.4em] uppercase mb-6">Footy Dept. Presents</p>
            <h1 className="text-7xl md:text-[120px] font-black text-white tracking-tighter uppercase leading-none mb-4">
              World<br />
              <span className="text-blue-500">Cup</span><br />
              2026
            </h1>
            <p className="text-white/50 text-xl md:text-2xl font-light mt-6 mb-10 tracking-wide">
              Built for Matchday. Built for This.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-white text-black font-black text-sm tracking-widest uppercase px-12 py-5 hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              Shop All National Kits
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* ── Coupon strip ─────────────────────────────────────────────────── */}
      <div className="bg-blue-500 py-4 px-6 flex items-center justify-center gap-4">
        <p className="text-white font-black text-sm tracking-widest uppercase text-center">
          Use Code{' '}
          <span className="underline underline-offset-2">WORLDCUP</span>
          {' '}for Your World Cup Discount
        </p>
        <button
          onClick={handleCopy}
          className="text-white/70 hover:text-white transition-colors flex-shrink-0"
          aria-label="Copy code"
        >
          <Copy size={16} />
        </button>
      </div>

      {/* ── Country grid ─────────────────────────────────────────────────── */}
      <section className="bg-[#080808] py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">32 Nations</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
              Find Your Nation.
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {WORLD_CUP_NATIONS.map((nation, i) => (
              <motion.div
                key={nation.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.025 }}
              >
                <Link
                  href="/shop"
                  className="group flex flex-col items-center justify-center gap-3 bg-zinc-900 border border-white/5 p-6 hover:border-blue-500/60 hover:scale-[1.03] transition-all duration-200"
                >
                  <span className="text-4xl leading-none">{nation.flag}</span>
                  <span className="text-white font-black text-xs tracking-widest uppercase text-center group-hover:text-blue-400 transition-colors">
                    {nation.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/30 text-sm text-center mt-12 tracking-wide"
          >
            Can&apos;t find your kit? All kits are added regularly — check back soon.
          </motion.p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
