'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(8)
      .then(({ data }) => setProducts(data ?? []))
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  const displayProducts = products

  return (
    <section className="bg-[#080808] py-24">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-2">Top Picks</p>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
              Best Sellers.
            </h2>
          </motion.div>
          <div className="hidden md:flex gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-6 px-6"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex-none w-[280px]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
