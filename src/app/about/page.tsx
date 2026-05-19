'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <main className="bg-black min-h-screen">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-400 text-xs md:text-sm font-medium tracking-[0.3em] uppercase mb-6"
          >
            About
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-[110px] font-black text-white leading-none tracking-tighter uppercase mb-6"
          >
            Built for
            <br />
            matchday.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-white/50 text-base md:text-lg max-w-md leading-relaxed"
          >
            Priced for the people who actually watch.
          </motion.p>
        </div>
      </section>

      {/* Section 1 — The problem */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-6">
              Why we started
            </p>
            <div className="space-y-5 text-white/60 text-base md:text-lg leading-relaxed">
              <p>
                Footy Dept. started because the whole kit market is broken.
              </p>
              <p>
                You&apos;ve seen it. An official jersey runs you $120 — $150 if you want the player version. Cheap knockoffs fall apart after two washes. The middle ground — kits that actually look and feel right, priced like you&apos;re a human being and not a luxury shopper — barely exists.
              </p>
              <p>
                We&apos;re a small team of fans who got tired of choosing between getting ripped off and looking like we got ripped off. So we started sourcing kits ourselves.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — What we care about */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-6">
              What we care about
            </p>
            <div className="space-y-5 text-white/60 text-base md:text-lg leading-relaxed">
              <p>
                We grew up on football. Colombia shirts handed down through the family. A Man City obsession that, full disclosure, kicked in right around the trophy years — bandwagon, sure, but a committed one. And a soft spot for the kits nobody else is wearing: your uncle&apos;s third-division side, the South American team with the impossible badge, the 90s European kit nobody remembers but you.
              </p>
              <p>
                That&apos;s the brand. Football as culture, not just sport. Kits as wardrobe, not just merch.
              </p>
              <p>
                Every drop is curated by people who&apos;d actually wear it. If it doesn&apos;t pass that test, it doesn&apos;t make the site.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3 — How we do it */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-6">
              How we do it
            </p>
            <div className="space-y-5 text-white/60 text-base md:text-lg leading-relaxed">
              <p>
                We work with manufacturers in Thailand who make some of the best fan-grade kits in the world. The fabric, the fit, the print quality — it holds up. We&apos;re not selling officially licensed product, and we&apos;re not pretending to. We&apos;re selling kits that look right, feel right, and don&apos;t ask you to remortgage to support your team.
              </p>
              <p>
                Cutting out licensing fees, retail middlemen, and brand tax is how we keep prices fair. That&apos;s the whole model. No magic.
              </p>
              <p>
                Footy Dept. is not affiliated with any club, league, or official football body. We&apos;re just fans, building the brand we wished existed.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing line + CTA */}
      <section className="py-24 px-6 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase mb-12">
              Built for matchday.
            </h2>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-10 py-4 bg-white text-black font-black text-sm tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Shop the Collection
              </Link>
              <Link
                href="/track"
                className="px-10 py-4 border border-white/30 text-white font-black text-sm tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                Track Your Order
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
