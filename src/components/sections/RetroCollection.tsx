'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const retroProducts = [
  { name: "Italy '94 Retro", price: 79.99, image: 'https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&q=80' },
  { name: "Brazil '70 Retro", price: 84.99, image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=400&q=80' },
  { name: "England '66 Retro", price: 74.99, image: 'https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400&q=80' },
]

export default function RetroCollection() {
  return (
    <section className="bg-black py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — big image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative aspect-[3/4] overflow-hidden"
          >
            <Image
              src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&q=80"
              alt="Retro collection"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="bg-amber-500 text-black text-xs font-black px-3 py-1 tracking-widest uppercase">
                Retro Collection
              </span>
            </div>
          </motion.div>

          {/* Right — content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-amber-500 text-xs tracking-[0.3em] uppercase mb-4">Classic Editions</p>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase leading-none mb-6">
                Legends
                <br />
                Never Fade.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-md">
                From Wembley &apos;66 to the Maracanã. Our retro collection brings back the kits that defined eras and inspired generations.
              </p>
              <Link
                href="/shop?version=retro"
                className="inline-block px-10 py-4 border border-white/30 text-white font-black text-sm tracking-widest uppercase hover:border-white hover:bg-white hover:text-black transition-all duration-300 mb-12"
              >
                Shop Retro
              </Link>
            </motion.div>

            {/* Mini product grid */}
            <div className="grid grid-cols-3 gap-3">
              {retroProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group cursor-pointer"
                >
                  <Link href="/shop?version=retro">
                    <div className="relative aspect-square overflow-hidden bg-zinc-900 mb-2">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-white text-xs font-medium leading-tight">{p.name}</p>
                    <p className="text-white/50 text-xs">${p.price}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
