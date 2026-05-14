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

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPES = [
  { value: 'club',     label: 'Clubs' },
  { value: 'national', label: 'National Teams' },
  { value: 'mystery',  label: 'Mystery Box' },
]

const LEAGUES = [
  'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1',
  'MLS', 'Liga Portugal', 'Eredivisie', 'Saudi Pro League',
  'Brasileirão', 'Liga MX', 'Primera División',
]

const COUNTRIES = [
  'Brazil', 'France', 'Argentina', 'Germany', 'Spain', 'England',
  'USA', 'Italy', 'Portugal', 'Netherlands', 'Mexico', 'Belgium',
  'Croatia', 'Uruguay', 'Japan', 'Morocco',
]

const ERAS = ['2020s', '2010s', '2000s', '1990s', '1980s', '1970s']

const ERA_RANGES: Record<string, [number, number]> = {
  '2020s': [2020, 2029],
  '2010s': [2010, 2019],
  '2000s': [2000, 2009],
  '1990s': [1990, 1999],
  '1980s': [1980, 1989],
  '1970s': [1970, 1979],
}

// URL slug helpers
const toSlug = (s: string) =>
  s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
const fromSlug = (slug: string, list: string[]) =>
  list.find((item) => toSlug(item) === slug) ?? null

// ─── Demo products ────────────────────────────────────────────────────────────

const DEMO_PRODUCTS: Product[] = [
  { id:'1', name:'Brazil Home Jersey 2026', slug:'brazil-home-2026', type:'national', country:'Brazil', version:'fan', year:2026, description:'Iconic yellow and green.', price:89.99, compare_at_price:119.99, images:['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:50, created_at:'' },
  { id:'2', name:'France Away Kit 2026', slug:'france-away-2026', type:'national', country:'France', version:'fan', year:2026, description:'Clean white away edition.', price:94.99, compare_at_price:124.99, images:['https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:35, created_at:'' },
  { id:'3', name:"Argentina '86 Retro", slug:'argentina-86-retro', type:'national', country:'Argentina', version:'retro', year:1986, description:'Hand-of-God era classic.', price:79.99, images:['https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:20, created_at:'' },
  { id:'4', name:'Mystery Box — Premium', slug:'mystery-box-premium', type:'mystery', country:'Various', version:'fan', year:2026, description:'Surprise kit.', price:59.99, compare_at_price:99.99, images:['https://images.unsplash.com/photo-1614632537239-e2258b9ef5f2?w=600&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:100, created_at:'' },
  { id:'5', name:'USA 2026 World Cup Kit', slug:'usa-2026-home', type:'national', country:'USA', version:'fan', year:2026, description:'Host nation, home edition.', price:84.99, compare_at_price:109.99, images:['https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80'], sizes:['S','M','L','XL','XXL'], featured:true, inventory:60, created_at:'' },
  { id:'6', name:"Germany Classic '90 Retro", slug:'germany-90-retro', type:'national', country:'Germany', version:'retro', year:1990, description:'World Cup winners edition.', price:74.99, images:['https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=600&q=80'], sizes:['S','M','L','XL'], featured:false, inventory:15, created_at:'' },
  { id:'7', name:'Spain Home 2026', slug:'spain-home-2026', type:'national', country:'Spain', version:'fan', year:2026, description:'La Roja returns.', price:89.99, images:['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=600&q=80'], sizes:['S','M','L','XL'], featured:false, inventory:40, created_at:'' },
  { id:'8', name:'England Away 2026', slug:'england-away-2026', type:'national', country:'England', version:'fan', year:2026, description:'Three Lions away.', price:92.99, compare_at_price:119.99, images:['https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=600&q=80'], sizes:['S','M','L','XL'], featured:false, inventory:30, created_at:'' },
]

// ─── Filter state type ─────────────────────────────────────────────────────────

interface Filters {
  type?: string
  league?: string
  country?: string
  version?: string
  era?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<Filters>({})

  // Initialise filters from URL params on mount
  useEffect(() => {
    const initial: Filters = {}
    const typeParam = searchParams.get('type')
    if (typeParam && TYPES.some((t) => t.value === typeParam)) initial.type = typeParam

    const leagueParam = searchParams.get('league')
    if (leagueParam) {
      const found = fromSlug(leagueParam, LEAGUES)
      if (found) initial.league = found
    }

    const countryParam = searchParams.get('country')
    if (countryParam) {
      const found = fromSlug(countryParam, COUNTRIES) ?? COUNTRIES.find(
        (c) => c.toLowerCase() === countryParam.toLowerCase()
      )
      if (found) initial.country = found
    }

    const versionParam = searchParams.get('version')
    if (versionParam === 'fan' || versionParam === 'player' || versionParam === 'retro') initial.version = versionParam

    const eraParam = searchParams.get('era')
    if (eraParam && ERA_RANGES[eraParam]) initial.era = eraParam

    setActiveFilters(initial)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      let query = supabase.from('products').select('*')

      if (activeFilters.type)    query = query.eq('type', activeFilters.type)
      if (activeFilters.league)  query = query.eq('league', activeFilters.league)
      if (activeFilters.country) query = query.ilike('country', activeFilters.country)
      if (activeFilters.version) query = query.eq('version', activeFilters.version)
      if (activeFilters.era) {
        const [min, max] = ERA_RANGES[activeFilters.era]
        query = query.gte('year', min).lte('year', max)
      }

      const { data } = await query.order('created_at', { ascending: false })
      setProducts(data?.length ? data : filterDemo(activeFilters))
      setLoading(false)
    }
    fetchProducts()
  }, [activeFilters])

  const filterDemo = (filters: Filters) =>
    DEMO_PRODUCTS.filter((p) => {
      if (filters.type    && p.type !== filters.type) return false
      if (filters.league  && p.league !== filters.league) return false
      if (filters.country && p.country.toLowerCase() !== filters.country.toLowerCase()) return false
      if (filters.version && p.version !== filters.version) return false
      if (filters.era) {
        const [min, max] = ERA_RANGES[filters.era]
        if (p.year < min || p.year > max) return false
      }
      return true
    })

  // When type changes, clear filters that no longer apply
  const setType = (value: string) => {
    setActiveFilters((prev) => {
      if (prev.type === value) {
        // deselect
        const { type: _t, league: _l, country: _c, version: _v, ...rest } = prev
        return rest
      }
      const next: Filters = { ...prev, type: value }
      // clear league when not club
      if (value !== 'club') delete next.league
      // clear country when not national
      if (value !== 'national') delete next.country
      // clear version when mystery
      if (value === 'mystery') delete next.version
      return next
    })
  }

  const toggleFilter = (key: keyof Omit<Filters, 'type'>, value: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev }
      if (next[key] === value) delete next[key]
      else next[key] = value
      return next
    })
  }

  const activeCount = Object.keys(activeFilters).length
  const activeType = activeFilters.type

  // Pill display label
  const pillLabel = (key: string, val: string) => {
    if (key === 'type') return TYPES.find((t) => t.value === val)?.label ?? val
    return val
  }

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
                onClick={() =>
                  key === 'type'
                    ? setType(val)
                    : toggleFilter(key as keyof Omit<Filters, 'type'>, val)
                }
                className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 text-xs tracking-wider uppercase"
              >
                {pillLabel(key, val)}
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
              {/* TYPE — always visible */}
              <div>
                <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Type</p>
                <div className="flex flex-col gap-2">
                  {TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setType(value)}
                      className={`text-left text-sm transition-colors ${
                        activeFilters.type === value ? 'text-blue-400' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* LEAGUE — only when type === 'club' */}
              {activeType === 'club' && (
                <div>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">League</p>
                  <div className="flex flex-col gap-2">
                    {LEAGUES.map((league) => (
                      <button
                        key={league}
                        onClick={() => toggleFilter('league', league)}
                        className={`text-left text-sm transition-colors ${
                          activeFilters.league === league ? 'text-blue-400' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {league}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* COUNTRY — only when type === 'national' */}
              {activeType === 'national' && (
                <div>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Country</p>
                  <div className="flex flex-col gap-2">
                    {COUNTRIES.map((country) => (
                      <button
                        key={country}
                        onClick={() => toggleFilter('country', country)}
                        className={`text-left text-sm transition-colors ${
                          activeFilters.country === country ? 'text-blue-400' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* VERSION — hidden only when type === 'mystery' */}
              {activeType !== 'mystery' && (
                <div>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Version</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'fan',    label: 'Fan' },
                      { value: 'player', label: 'Player' },
                      { value: 'retro',  label: 'Retro' },
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => toggleFilter('version', value)}
                        className={`text-left text-sm transition-colors ${
                          activeFilters.version === value ? 'text-blue-400' : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ERA — always visible */}
              <div>
                <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Era</p>
                <div className="flex flex-col gap-2">
                  {ERAS.map((era) => (
                    <button
                      key={era}
                      onClick={() => toggleFilter('era', era)}
                      className={`text-left text-sm transition-colors ${
                        activeFilters.era === era ? 'text-blue-400' : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {era}
                    </button>
                  ))}
                </div>
              </div>
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
