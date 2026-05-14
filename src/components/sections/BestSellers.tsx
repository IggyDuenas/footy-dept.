'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import ProductCard from '@/components/ProductCard'

// Fallback demo products when DB is empty
const DEMO_PRODUCTS: Product[] = [
  {
    id: '1', name: 'Brazil Home Jersey 2026', slug: 'brazil-home-2026',
    type: 'national', country: 'Brazil', version: 'fan', year: 2026,
    description: 'Iconic yellow and green.', price: 89.99, compare_at_price: 119.99,
    images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'],
    sizes: ['S','M','L','XL'], featured: true, inventory: 50, created_at: '',
  },
  {
    id: '2', name: 'France Away Kit 2026', slug: 'france-away-2026',
    type: 'national', country: 'France', version: 'fan', year: 2026,
    description: 'Clean white away edition.', price: 94.99, compare_at_price: 124.99,
    images: ['https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=600&q=80'],
    sizes: ['S','M','L','XL'], featured: true, inventory: 35, created_at: '',
  },
  {
    id: '3', name: "Argentina '86 Retro", slug: 'argentina-86-retro',
    type: 'national', country: 'Argentina', version: 'retro', year: 1986,
    description: 'Hand-of-God era classic.', price: 79.99,
    images: ['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80'],
    sizes: ['S','M','L','XL'], featured: true, inventory: 20, created_at: '',
  },
  {
    id: '4', name: 'Mystery Box — Premium', slug: 'mystery-box-premium',
    type: 'mystery', country: 'Various', version: 'fan', year: 2026,
    description: 'Surprise kit, always premium.', price: 59.99, compare_at_price: 99.99,
    images: ['https://images.unsplash.com/photo-1614632537239-e2258b9ef5f2?w=600&q=80'],
    sizes: ['S','M','L','XL'], featured: true, inventory: 100, created_at: '',
  },
  {
    id: '5', name: 'USA 2026 World Cup Kit', slug: 'usa-2026-home',
    type: 'national', country: 'USA', version: 'fan', year: 2026,
    description: 'Host nation, home edition.', price: 84.99, compare_at_price: 109.99,
    images: ['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80'],
    sizes: ['S','M','L','XL','XXL'], featured: true, inventory: 60, created_at: '',
  },
  {
    id: '6', name: "Germany Classic '90 Retro", slug: 'germany-90-retro',
    type: 'national', country: 'Germany', version: 'retro', year: 1990,
    description: 'World Cup winners edition.', price: 74.99,
    images: ['https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80'],
    sizes: ['S','M','L','XL'], featured: false, inventory: 15, created_at: '',
  },
]

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(8)
      .then(({ data }) => setProducts(data?.length ? data : DEMO_PRODUCTS))
  }, [])

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -340 : 340, behavior: 'smooth' })
  }

  const displayProducts = products.length ? products : DEMO_PRODUCTS

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
