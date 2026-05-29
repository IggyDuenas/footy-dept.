'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

export default function AnnouncementBanner() {
  const [visible, setVisible] = useState(true)

  // Drive the Navbar's top offset via a CSS variable so it sits flush below the banner
  useEffect(() => {
    document.documentElement.style.setProperty('--banner-h', visible ? '40px' : '0px')
    return () => {
      document.documentElement.style.setProperty('--banner-h', '0px')
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-[60] h-10 bg-blue-500 flex items-center justify-center px-10"
        >
          <p className="text-white text-xs font-black tracking-widest uppercase text-center leading-none">
            ⚽ World Cup 2026 Deals — Use Code{' '}
            <span className="underline underline-offset-2">WORLDCUP</span>{' '}
            at Checkout
          </p>
          <button
            onClick={() => setVisible(false)}
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
