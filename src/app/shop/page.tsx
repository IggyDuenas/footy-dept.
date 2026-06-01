'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

function formatCountryName(country: string): string {
  const special: Record<string, string> = {
    'usa': 'USA',
    'uae': 'UAE',
    'uk': 'UK',
  }
  if (special[country.toLowerCase()]) return special[country.toLowerCase()]
  return country
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchOpen, setSearchOpen] = useState(false)
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableLeagues, setAvailableLeagues] = useState<string[]>([])

  const [filters, setFilters] = useState({
    type: '',
    country: '',
    league: '',
    version: '',
    era: '',
  })

  const setFilter = (key: string, value: string) => {
    setFilters(prev => {
      const prevRecord = prev as Record<string, string>
      const next = { ...prev, [key]: prevRecord[key] === value ? '' : value }
      if (key === 'type') {
        next.country = ''
        next.league = ''
      }
      return next
    })
  }

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      let query = supabase.from('products').select('*')

      if (filters.type !== '') {
        query = query.eq('type', filters.type)
      }

      if (filters.type === 'national' && filters.country !== '') {
        query = query.eq('country', filters.country)
      }

      if (filters.type === 'club' && filters.league !== '') {
        query = query.eq('league', filters.league)
      }

      if (filters.version !== '') {
        query = query.eq('version', filters.version)
      }

      if (filters.era !== '') {
        const decade = parseInt(filters.era)
        query = query.gte('year', decade).lte('year', decade + 9)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Filter query error:', error)
        setProducts([])
      } else {
        setProducts(data ?? [])
      }

      setLoading(false)
    }

    fetchProducts()
  }, [filters])

  // Fetch countries that have at least one national team product
  useEffect(() => {
    supabase
      .from('products')
      .select('country')
      .eq('type', 'national')
      .neq('country', '')
      .then(({ data }) => {
        const unique = Array.from(
          new Set((data ?? []).map((r: any) => r.country))
        ).sort() as string[]
        setAvailableCountries(unique)
      })
  }, [])

  // Fetch leagues that have at least one club product
  useEffect(() => {
    supabase
      .from('products')
      .select('league')
      .eq('type', 'club')
      .not('league', 'is', null)
      .neq('league', '')
      .then(({ data }) => {
        const unique = Array.from(
          new Set((data ?? []).map((r: any) => r.league))
        ).sort() as string[]
        setAvailableLeagues(unique)
      })
  }, [])

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
          <div className="mb-8">
            {/* ROW 1 — type pills + product count */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-2 flex-wrap">
                {['club', 'national', 'mystery'].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilter('type', type)}
                    className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                      filters.type === type
                        ? 'bg-white text-black border-white'
                        : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {type === 'club' ? 'Clubs' : type === 'national' ? 'National Teams' : 'Mystery Box'}
                  </button>
                ))}
                {Object.values(filters).some(v => v !== '') && (
                  <button
                    onClick={() => setFilters({ type: '', country: '', league: '', version: '', era: '' })}
                    className="px-4 py-2 text-xs text-white/30 hover:text-white transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <span className="ml-auto text-white/30 text-sm">{products.length} products</span>
            </div>

            {/* ROW 2 — conditional sub-filters */}
            {filters.type === 'national' && (
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="text-white/30 text-xs uppercase tracking-widest self-center mr-2">Country:</span>
                {availableCountries.map(country => (
                  <button
                    key={country}
                    onClick={() => setFilter('country', country)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      filters.country === country
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {formatCountryName(country)}
                  </button>
                ))}
              </div>
            )}

            {filters.type === 'club' && (
              <div className="flex gap-2 flex-wrap mt-3">
                <span className="text-white/30 text-xs uppercase tracking-widest self-center mr-2">League:</span>
                {availableLeagues.map(league => (
                  <button
                    key={league}
                    onClick={() => setFilter('league', league)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      filters.league === league
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-white/20 text-white/50 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {league.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </button>
                ))}
              </div>
            )}

            {/* ROW 3 — version and era */}
            <div className="flex gap-6 flex-wrap mt-3">
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-white/30 text-xs uppercase tracking-widest mr-2">Version:</span>
                {['fan', 'player', 'retro'].map(version => (
                  <button
                    key={version}
                    onClick={() => setFilter('version', version)}
                    className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                      filters.version === version
                        ? 'bg-white text-black border-white'
                        : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {version.charAt(0).toUpperCase() + version.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <span className="text-white/30 text-xs uppercase tracking-widest mr-2">Era:</span>
                {[
                  { value: '2020', label: '2020s' },
                  { value: '2010', label: '2010s' },
                  { value: '2000', label: '2000s' },
                  { value: '1990', label: '1990s' },
                  { value: '1980', label: '1980s' },
                  { value: '1970', label: '1970s' },
                ].map(era => (
                  <button
                    key={era.value}
                    onClick={() => setFilter('era', era.value)}
                    className={`px-4 py-2 text-xs font-bold tracking-widest uppercase border transition-colors ${
                      filters.era === era.value
                        ? 'bg-white text-black border-white'
                        : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                    }`}
                  >
                    {era.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

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
                onClick={() => setFilters({ type: '', country: '', league: '', version: '', era: '' })}
                className="mt-4 text-blue-400 text-sm hover:text-blue-300"
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
