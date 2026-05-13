'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function FullWidthBanner() {
  return (
    <section className="relative overflow-hidden" style={{ minHeight: '60vh' }}>
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=1920&q=80')`,
        }}
      />
      <div className="absolute inset-0 bg-black/65" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[60vh] px-6">
        <div className="max-w-[1400px] mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">The Culture</p>
            <h2 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tight uppercase mb-4">
              Football
              <br />
              <span className="text-white/40">Culture.</span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-lg">
              Modern fanwear inspired by the game. Every kit tells a story — wear yours.
            </p>
            <Link
              href="/shop"
              className="inline-block px-12 py-4 bg-white text-black font-black text-sm tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
