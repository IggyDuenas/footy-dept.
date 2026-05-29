'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import { WORLD_CUP_NATIONS } from '@/lib/worldcup'

export default function WorldCupSection() {
  const handleCopy = () => {
    navigator.clipboard.writeText('WORLDCUP')
    toast.success('Code copied!')
  }

  return (
    <section className="bg-[#080808] py-24 border-t border-white/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-10"
        >
          <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">World Cup 2026</p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase leading-none mb-4">
            The World&apos;s Game.<br />
            <span className="text-white/40">Your Kit.</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl leading-relaxed">
            32 nations. One tournament. Get your kit before matchday.
          </p>
        </motion.div>

        {/* Country chip scroll */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8 -mx-6 px-6"
        >
          {WORLD_CUP_NATIONS.map((nation) => (
            <Link
              key={nation.name}
              href={`/shop?type=national&country=${encodeURIComponent(nation.name)}`}
              className="flex-none flex items-center gap-1.5 px-3 py-1.5 border border-white/20 text-white/60 text-xs font-medium tracking-wider uppercase whitespace-nowrap hover:border-blue-500 hover:text-blue-400 transition-colors duration-200"
            >
              <span className="text-base leading-none">{nation.flag}</span>
              {nation.name}
            </Link>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Link
            href="/worldcup"
            className="inline-block bg-white text-black font-black text-sm tracking-widest uppercase px-10 py-4 hover:bg-blue-500 hover:text-white transition-colors duration-300 w-full sm:w-auto text-center"
          >
            Shop World Cup Collection →
          </Link>

          {/* Coupon callout */}
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-3">
            <p className="text-white/50 text-xs tracking-wide">
              Use code{' '}
              <span className="text-white font-bold tracking-widest">WORLDCUP</span>
              {' '}at checkout for your World Cup discount
            </p>
            <button
              onClick={handleCopy}
              className="text-white/30 hover:text-blue-400 transition-colors flex-shrink-0"
              aria-label="Copy coupon code"
            >
              <Copy size={14} />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
