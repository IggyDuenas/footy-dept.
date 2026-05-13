'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

const collections = [
  {
    name: 'Brazil',
    tag: 'Home & Away Kits',
    href: '/shop?country=brazil',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=80',
    color: 'from-yellow-900/40',
  },
  {
    name: 'France',
    tag: 'Les Bleus 2026',
    href: '/shop?country=france',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
    color: 'from-blue-900/40',
  },
  {
    name: 'USA',
    tag: 'World Cup Edition',
    href: '/shop?country=usa',
    image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
    color: 'from-red-900/40',
  },
  {
    name: 'Retro Kits',
    tag: 'Classic Editions',
    href: '/shop?category=retro',
    image: '/images/collections/retrokits.png',
    color: 'from-stone-900/40',
  },
]

export default function FeaturedCollections() {
  return (
    <section className="bg-black py-24 px-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-3">Collections</p>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight uppercase leading-none">
            Shop by Nation.
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {collections.map((col, i) => (
            <motion.div
              key={col.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <Link href={col.href} className="group block relative overflow-hidden aspect-[3/4] bg-zinc-900">
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${col.color} via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white/50 text-xs tracking-widest uppercase mb-1">{col.tag}</p>
                  <h3 className="text-white font-black text-2xl tracking-tight uppercase">{col.name}</h3>
                  <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs tracking-widest uppercase">Shop Now</span>
                    <div className="w-6 h-px bg-white" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
