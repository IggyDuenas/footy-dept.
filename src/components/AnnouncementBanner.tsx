'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useBanner } from '@/context/BannerContext'

export default function AnnouncementBanner() {
  const { bannerVisible, setBannerVisible } = useBanner()

  return (
    <AnimatePresence>
      {bannerVisible && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[60] h-10 bg-blue-500 flex items-center justify-center px-10 overflow-hidden"
        >
          {/* Desktop text */}
          <p className="hidden sm:block text-white text-xs font-black tracking-widest uppercase text-center leading-none">
            ⚽ World Cup 2026 Deals — Use Code{' '}
            <span className="underline underline-offset-2">WORLDCUP</span>{' '}
            at Checkout
          </p>
          {/* Mobile text */}
          <p className="block sm:hidden text-white text-xs font-black tracking-widest uppercase text-center leading-none">
            ⚽ <span className="underline underline-offset-2">WORLDCUP</span> — World Cup Deals
          </p>

          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-4 text-white/70 hover:text-white transition-colors"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
