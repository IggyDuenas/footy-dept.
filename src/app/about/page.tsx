'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'

const values = [
  {
    label: '01',
    heading: 'Football as culture.',
    body: 'Colombia shirts handed down through the family. A Man City obsession that kicked in right around the trophy years — bandwagon, sure, but a committed one. We grew up on this game.',
  },
  {
    label: '02',
    heading: 'The kits nobody else is wearing.',
    body: 'Your uncle\'s third-division side. The South American team with the impossible badge. The 90s European kit nobody remembers but you. That\'s what we curate for.',
  },
  {
    label: '03',
    heading: 'Passes the wear test.',
    body: 'Every drop is curated by people who\'d actually wear it. If it doesn\'t pass that test, it doesn\'t make the site. No exceptions.',
  },
]

export default function AboutPage() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <main className="bg-black min-h-screen">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-6"
          >
            About
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-[7.5rem] font-black text-white tracking-tight uppercase leading-none mb-6 max-w-4xl"
          >
            Built for
            <br />
            <span className="text-blue-400">Matchday.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/40 text-xl md:text-2xl max-w-xl leading-relaxed"
          >
            Priced for the people who actually watch.
          </motion.p>
        </div>
      </section>

      {/* The problem */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Why we exist</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">
              The whole kit market is broken.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-5"
          >
            <p className="text-white/50 text-lg leading-relaxed">
              You&apos;ve seen it. An official jersey runs you $120 — $150 if you want the player version. Cheap knockoffs fall apart after two washes.
            </p>
            <p className="text-white/50 text-lg leading-relaxed">
              The middle ground — kits that actually look and feel right, priced like you&apos;re a human being and not a luxury shopper — barely exists.
            </p>
            <p className="text-white text-lg leading-relaxed font-medium">
              We&apos;re a small team of fans who got tired of choosing between getting ripped off and looking like we got ripped off. So we started sourcing kits ourselves.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What we care about */}
      <section className="py-24 px-6 bg-zinc-950 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">What we care about</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight max-w-2xl">
              Football as culture, not just sport.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-px bg-white/5">
            {values.map((val, i) => (
              <motion.div
                key={val.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="bg-zinc-950 p-8 md:p-10"
              >
                <p className="text-white/20 font-black text-5xl mb-6 leading-none">{val.label}</p>
                <p className="text-white font-black text-lg uppercase tracking-tight mb-4">{val.heading}</p>
                <p className="text-white/40 text-sm leading-relaxed">{val.body}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="text-white/30 text-sm leading-relaxed mt-10 max-w-xl"
          >
            Kits as wardrobe, not just merch. That&apos;s the brand.
          </motion.p>
        </div>
      </section>

      {/* How we do it */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">How we do it</p>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight mb-8">
              No magic.
              <br />
              Just honest pricing.
            </h2>

            <div className="space-y-5 border-t border-white/10 pt-8">
              <p className="text-white/50 text-base leading-relaxed">
                We work with manufacturers in Thailand who make some of the best fan-grade kits in the world. The fabric, the fit, the print quality — it holds up.
              </p>
              <p className="text-white/50 text-base leading-relaxed">
                We&apos;re not selling officially licensed product, and we&apos;re not pretending to. We&apos;re selling kits that look right, feel right, and don&apos;t ask you to remortgage to support your team.
              </p>
              <p className="text-white/70 text-base leading-relaxed">
                Cutting out licensing fees, retail middlemen, and brand tax is how we keep prices fair. That&apos;s the whole model.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: '$0', label: 'Licensing Markup' },
              { value: '$0', label: 'Retail Middlemen' },
              { value: '$0', label: 'Brand Tax' },
              { value: '100%', label: 'Fan First' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                className={`p-8 border border-white/5 ${i === 3 ? 'bg-blue-500' : 'bg-zinc-950'}`}
              >
                <p className={`font-black text-4xl leading-none mb-2 ${i === 3 ? 'text-white' : 'text-white'}`}>
                  {item.value}
                </p>
                <p className={`text-xs tracking-widest uppercase ${i === 3 ? 'text-white/80' : 'text-white/30'}`}>
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-24 px-6">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-white/20 text-sm leading-relaxed max-w-lg mx-auto mb-12">
              Footy Dept. is not affiliated with any club, league, or official football body. We&apos;re just fans, building the brand we wished existed.
            </p>
            <p className="text-white font-black text-5xl md:text-8xl tracking-tight uppercase leading-none">
              Built for
            </p>
            <p className="text-blue-400 font-black text-5xl md:text-8xl tracking-tight uppercase leading-none">
              Matchday.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
