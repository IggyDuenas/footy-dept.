'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const stats = [
  { value: '50+', label: 'Nations Represented' },
  { value: '2K+', label: 'Kits in Archive' },
  { value: '100%', label: 'Football Obsessed' },
]

export default function About() {
  return (
    <section className="bg-zinc-950 py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — image stack */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/mainpage/bornforthepitch.jpg"
                alt="Born for the Pitch"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 bg-blue-500 p-6 w-44"
            >
              <p className="text-white font-black text-4xl leading-none">No.</p>
              <p className="text-white font-black text-4xl leading-none">10</p>
              <p className="text-white/80 text-xs tracking-widest uppercase mt-2">The Beautiful Game</p>
            </motion.div>
          </motion.div>

          {/* Right — content */}
          <div className="lg:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase leading-none mb-6">
                Born from
                <br />
                the Pitch.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-6 max-w-md">
                Footy Dept. started with one idea: football culture deserves better fanwear. Not just club colours — but pieces that carry the history, the passion, and the style of the world&apos;s game.
              </p>
              <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-md">
                We curate kits, retros, and matchday essentials from across the globe — so whether you bleed yellow and green or blue and red, you&apos;re covered.
              </p>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <p className="text-white font-black text-3xl md:text-4xl leading-none mb-1">{stat.value}</p>
                  <p className="text-white/40 text-xs tracking-widest uppercase">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
