'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'

const stats = [
  { value: '50+',  label: 'Nations Represented' },
  { value: '2K+',  label: 'Kits in Archive' },
  { value: '100%', label: 'Football Obsessed' },
]

const values = [
  {
    number: '01',
    title: 'Authenticity Over Hype',
    body: 'We curate kits people actually want to wear — not whatever gets pushed by algorithm. Every drop is reviewed by fans who live the game.',
  },
  {
    number: '02',
    title: 'Fair Pricing, Always',
    body: "Official jerseys shouldn't cost what a car payment does. We cut out the middlemen, licensing markups, and brand tax. That's how we keep it real.",
  },
  {
    number: '03',
    title: 'Football as Culture',
    body: "A kit is more than a shirt. It's a stadium in 1994, a final in extra time, a kit handed down through the family. That's what we're selling.",
  },
]

export default function AboutPage() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <main className="bg-black min-h-screen">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-end overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1800&q=85"
            alt="Stadium atmosphere"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </div>

        <div className="relative max-w-[1400px] mx-auto px-6 pb-24 pt-40 w-full">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-6"
          >
            About Footy Dept.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="text-6xl md:text-8xl lg:text-[110px] font-black text-white leading-none tracking-tighter uppercase mb-8"
          >
            Built for
            <br />
            <span className="text-blue-400">matchday.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="text-white/60 text-lg max-w-lg leading-relaxed"
          >
            Priced for the people who actually watch.
          </motion.p>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="border-y border-white/10 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto px-6 py-10 grid grid-cols-3 divide-x divide-white/10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="px-6 first:pl-0 last:pr-0 text-center"
            >
              <p className="text-white font-black text-4xl md:text-5xl leading-none mb-1">{s.value}</p>
              <p className="text-white/30 text-xs tracking-widest uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Origin story — image left, text right ────────────────────────── */}
      <section className="py-28 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/bornforthepitch.jpg"
                alt="Born for the pitch"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
            {/* Floating label */}
            <div className="absolute -bottom-5 -right-5 bg-blue-500 px-6 py-5">
              <p className="text-white font-black text-xs tracking-widest uppercase">Est. 2024</p>
              <p className="text-white/80 text-xs tracking-widest uppercase mt-0.5">Footy Dept.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-5">Our Story</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none mb-8">
              Born from<br />the Pitch.
            </h2>
            <div className="space-y-5 text-white/55 text-base md:text-lg leading-relaxed">
              <p>
                Footy Dept. started because the whole kit market is broken. An official jersey runs you $120 — $150 if you want the player version. Cheap knockoffs fall apart after two washes.
              </p>
              <p>
                The middle ground — kits that look and feel right, priced like you&apos;re a human being — barely exists. We&apos;re a small team of fans who got tired of choosing between getting ripped off and looking like we got ripped off. So we started sourcing kits ourselves.
              </p>
              <p>
                Footy Dept. is not affiliated with any club, league, or governing body. We&apos;re just fans, building the brand we wished existed.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Full-width image break ────────────────────────────────────────── */}
      <section className="relative h-[60vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1800&q=80"
          alt="Football culture"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-white font-black text-5xl md:text-8xl tracking-tighter uppercase text-center leading-none px-6"
          >
            Football as<br />
            <span className="text-blue-400">Culture.</span>
          </motion.p>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-b border-white/5 bg-zinc-950">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">What We Stand For</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
              The Standard.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {values.map((v, i) => (
              <motion.div
                key={v.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                className="px-8 py-10 first:pl-0 last:pr-0"
              >
                <p className="text-white/15 font-black text-6xl leading-none mb-6">{v.number}</p>
                <h3 className="text-white font-black text-lg uppercase tracking-wide mb-4">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Two-image editorial row ───────────────────────────────────────── */}
      <section className="py-28 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=900&q=80"
              alt="Kit collection"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-black text-xl uppercase tracking-tight">The Collection</p>
              <p className="text-white/50 text-sm mt-1">Kits from every corner of the world</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="flex flex-col gap-6"
          >
            <div className="relative aspect-[3/2] overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80"
                alt="Matchday atmosphere"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-white font-black text-xl uppercase tracking-tight">Matchday Ready</p>
                <p className="text-white/50 text-sm mt-1">Wear it to the stadium. Wear it everywhere.</p>
              </div>
            </div>

            <div className="bg-zinc-900 p-10 flex flex-col justify-center flex-1">
              <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">How We Do It</p>
              <p className="text-white/60 text-base md:text-lg leading-relaxed">
                We work with manufacturers who produce some of the best fan-grade kits available anywhere. The fabric, the fit, the print quality — it holds up. Cutting out licensing fees and retail markups is how we keep prices fair. No magic. Just a better model.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-[1400px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-6">Ready to Kit Up?</p>
            <h2 className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase mb-12">
              Shop the<br />Collection.
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shop"
                className="px-10 py-4 bg-white text-black font-black text-sm tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                Browse All Kits
              </Link>
              <Link
                href="/contact"
                className="px-10 py-4 border border-white/30 text-white font-black text-sm tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
