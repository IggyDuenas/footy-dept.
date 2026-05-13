'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

const DEMO_PRODUCTS: Product[] = [
  { id:'1', name:'Brazil Home Jersey 2026', slug:'brazil-home-2026', category:'jersey', country:'brazil', season:'2026', version_type:'fan', description:'Iconic yellow and green.', price:89.99, compare_at_price:119.99, images:['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:50, created_at:'' },
  { id:'2', name:'France Away Kit 2026', slug:'france-away-2026', category:'jersey', country:'france', season:'2026', version_type:'fan', description:'Clean white away edition.', price:94.99, compare_at_price:124.99, images:['https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:35, created_at:'' },
  { id:'3', name:"Argentina '86 Retro", slug:'argentina-86-retro', category:'retro', country:'argentina', season:'1986', version_type:'retro', description:'Hand-of-God era classic.', price:79.99, images:['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:20, created_at:'' },
  { id:'4', name:'Mystery Box — Premium', slug:'mystery-box-premium', category:'mystery', country:'various', season:'2026', version_type:'mystery', description:'Surprise kit.', price:59.99, compare_at_price:99.99, images:['https://images.unsplash.com/photo-1614632537239-e2258b9ef5f2?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:100, created_at:'' },
  { id:'5', name:'USA 2026 World Cup Kit', slug:'usa-2026-home', category:'national', country:'usa', season:'2026', version_type:'fan', description:'Host nation, home edition.', price:84.99, compare_at_price:109.99, images:['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80'], sizes:['S','M','L','XL','XXL'], featured:true, inventory:60, created_at:'' },
  { id:'6', name:"Germany Classic '90 Retro", slug:'germany-90-retro', category:'retro', country:'germany', season:'1990', version_type:'retro', description:'World Cup winners edition.', price:74.99, images:['https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80'], sizes:['S','M','L','XL'], featured:false, inventory:15, created_at:'' },
  { id:'7', name:'Spain Home 2026', slug:'spain-home-2026', category:'jersey', country:'spain', season:'2026', version_type:'fan', description:'La Roja returns.', price:89.99, images:['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80'], sizes:['S','M','L','XL'], featured:false, inventory:40, created_at:'' },
  { id:'8', name:'England Away 2026', slug:'england-away-2026', category:'jersey', country:'england', season:'2026', version_type:'fan', description:'Three Lions away.', price:92.99, compare_at_price:119.99, images:['https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80'], sizes:['S','M','L','XL'], featured:false, inventory:30, created_at:'' },
]

const FILTERS = {
  category: ['jersey', 'retro', 'national', 'mystery'],
  country: ['brazil', 'france', 'argentina', 'germany', 'spain', 'england', 'usa', 'italy'],
  version_type: ['fan', 'player', 'retro', 'mystery'],
  season: ['2026', '2024', '2022', '1990', '1986', '1970'],
}

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})

  useEffect(() => {
    const initial: Record<string, string> = {}
    if (searchParams.get('category')) initial.category = searchParams.get('category')!
    if (searchParams.get('country')) initial.country = searchParams.get('country')!
    setActiveFilters(initial)
  }, [searchParams])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      let query = supabase.from('products').select('*')
      if (activeFilters.category) query = query.eq('category', activeFilters.category)
      if (activeFilters.country) query = query.eq('country', activeFilters.country)
      if (activeFilters.version_type) query = query.eq('version_type', activeFilters.version_type)
      if (activeFilters.season) query = query.eq('season', activeFilters.season)
      const { data } = await query.order('created_at', { ascending: false })
      setProducts(data?.length ? data : filterDemo(activeFilters))
      setLoading(false)
    }
    fetchProducts()
  }, [activeFilters])

  const filterDemo = (filters: Record<string, string>) => {
    return DEMO_PRODUCTS.filter((p) => {
      if (filters.category && p.category !== filters.category) return false
      if (filters.country && p.country !== filters.country) return false
      if (filters.version_type && p.version_type !== filters.version_type) return false
      if (filters.season && p.season !== filters.season) return false
      return true
    })
  }

  const toggleFilter = (key: string, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev }
      if (next[key] === value) delete next[key]
      else next[key] = value
      return next
    })
  }

  const activeCount = Object.keys(activeFilters).length

  return (
    <main>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="pt-16">
        {/* Page header */}
        <div className="border-b border-white/5 bg-[#080808] px-6 py-12">
          <div className="max-w-[1400px] mx-auto">
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-3">All Products</p>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight uppercase leading-none">
              The Shop.
            </h1>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Filter bar */}
          <div className="flex items-center gap-4 mb-8 flex-wrap">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 border border-white/20 text-white/60 hover:text-white hover:border-white/40 px-4 py-2 text-sm tracking-wider uppercase transition-colors"
            >
              <SlidersHorizontal size={14} />
              Filters
              {activeCount > 0 && (
                <span className="bg-blue-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {activeCount}
                </span>
              )}
            </button>

            {/* Active filter pills */}
            {Object.entries(activeFilters).map(([key, val]) => (
              <button
                key={key}
                onClick={() => toggleFilter(key, val)}
                className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 text-xs tracking-wider uppercase"
              >
                {val}
                <X size={10} />
              </button>
            ))}

            {activeCount > 0 && (
              <button
                onClick={() => setActiveFilters({})}
                className="text-white/30 text-xs hover:text-white/60 transition-colors"
              >
                Clear all
              </button>
            )}

            <span className="ml-auto text-white/30 text-sm">{products.length} products</span>
          </div>

          {/* Filter panel */}
          {filtersOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-8 border border-white/10 p-6 grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {Object.entries(FILTERS).map(([key, values]) => (
                <div key={key}>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">{key.replace('_', ' ')}</p>
                  <div className="flex flex-col gap-2">
                    {values.map((val) => (
                      <button
                        key={val}
                        onClick={() => toggleFilter(key, val)}
                        className={`text-left text-sm capitalize transition-colors ${
                          activeFilters[key] === val
                            ? 'text-blue-400'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Product grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-white/30 text-lg">No products found.</p>
              <button
                onClick={() => setActiveFilters({})}
                className="mt-4 text-blue-400 text-sm hover:text-blue-300 underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ShopContent />
    </Suspense>
  )
}
