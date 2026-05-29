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
import { mixedSort } from '@/lib/sortProducts'

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPES = [
  { value: 'club',     label: 'Clubs' },
  { value: 'national', label: 'National Teams' },
]

const LEAGUES = [
  'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1',
  'MLS', 'Liga Portugal', 'Eredivisie', 'Saudi Pro League',
  'Brasileirão', 'Liga MX', 'Primera División',
]

// Maps every country name → its continent for the dynamic filter
const CONTINENT_MAP: Record<string, string> = {
  // Europe
  England: 'Europe', France: 'Europe', Germany: 'Europe', Spain: 'Europe',
  Italy: 'Europe', Portugal: 'Europe', Netherlands: 'Europe', Belgium: 'Europe',
  Croatia: 'Europe', Norway: 'Europe', Sweden: 'Europe', Denmark: 'Europe',
  Switzerland: 'Europe', Austria: 'Europe', Scotland: 'Europe', Wales: 'Europe',
  Ireland: 'Europe', Greece: 'Europe', Turkey: 'Europe', Ukraine: 'Europe',
  Poland: 'Europe', Serbia: 'Europe', Hungary: 'Europe', Romania: 'Europe',
  Slovakia: 'Europe', Albania: 'Europe', Slovenia: 'Europe', Finland: 'Europe',
  Iceland: 'Europe', Georgia: 'Europe', Russia: 'Europe', 'Czech Republic': 'Europe',
  'North Macedonia': 'Europe', 'Bosnia and Herzegovina': 'Europe', Montenegro: 'Europe',
  // Americas
  Brazil: 'Americas', Argentina: 'Americas', USA: 'Americas', Mexico: 'Americas',
  Uruguay: 'Americas', Colombia: 'Americas', Chile: 'Americas', Ecuador: 'Americas',
  Peru: 'Americas', Bolivia: 'Americas', Venezuela: 'Americas', Paraguay: 'Americas',
  Canada: 'Americas', Jamaica: 'Americas', 'Costa Rica': 'Americas',
  Honduras: 'Americas', Panama: 'Americas', 'El Salvador': 'Americas',
  Guatemala: 'Americas', 'Trinidad and Tobago': 'Americas',
  // Africa
  Morocco: 'Africa', Nigeria: 'Africa', Senegal: 'Africa', Cameroon: 'Africa',
  Ghana: 'Africa', Egypt: 'Africa', Algeria: 'Africa', Tunisia: 'Africa',
  'Ivory Coast': 'Africa', 'South Africa': 'Africa', Mali: 'Africa',
  'DR Congo': 'Africa', Ethiopia: 'Africa', Kenya: 'Africa', Zambia: 'Africa',
  Zimbabwe: 'Africa', Angola: 'Africa', Uganda: 'Africa', Guinea: 'Africa',
  'Burkina Faso': 'Africa', 'Cape Verde': 'Africa', Gabon: 'Africa',
  // Asia / Oceania
  Japan: 'Asia', 'South Korea': 'Asia', 'Saudi Arabia': 'Asia', Iran: 'Asia',
  Australia: 'Asia', Qatar: 'Asia', UAE: 'Asia', China: 'Asia',
  India: 'Asia', Iraq: 'Asia', Jordan: 'Asia', Bahrain: 'Asia',
  Kuwait: 'Asia', Oman: 'Asia', Thailand: 'Asia', Vietnam: 'Asia',
  Indonesia: 'Asia', Uzbekistan: 'Asia', Kazakhstan: 'Asia',
}

const CONTINENT_ORDER = ['Europe', 'Americas', 'Africa', 'Asia']

// Still used for URL slug matching — derived from the map keys
const COUNTRIES = Object.keys(CONTINENT_MAP)

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
  const [filterCountries, setFilterCountries] = useState<string[]>([])

  // Fetch distinct national countries once for the filter sidebar
  useEffect(() => {
    supabase
      .from('products')
      .select('country')
      .eq('type', 'national')
      .neq('country', '')
      .then(({ data }) => {
        const unique = Array.from(new Set((data ?? []).map((r: { country: string }) => r.country))).sort()
        setFilterCountries(unique)
      })
  }, [])

  // Initialise filters from URL params on mount
  useEffect(() => {
    const initial: Filters = {}
    const typeParam = searchParams.get('type')?.toLowerCase()
    if (typeParam && TYPES.some((t) => t.value === typeParam)) initial.type = typeParam

    const leagueParam = searchParams.get('league')?.toLowerCase()
    if (leagueParam) {
      const found = fromSlug(leagueParam, LEAGUES)
      if (found) initial.league = found.toLowerCase()
    }

    const countryParam = searchParams.get('country')?.toLowerCase()
    if (countryParam) {
      const found = fromSlug(countryParam, COUNTRIES) ?? COUNTRIES.find(
        (c) => c.toLowerCase() === countryParam
      )
      if (found) initial.country = found.toLowerCase()
    }

    const versionParam = searchParams.get('version')?.toLowerCase()
    if (versionParam === 'fan' || versionParam === 'player' || versionParam === 'retro') initial.version = versionParam

    const eraParam = searchParams.get('era')
    if (eraParam && ERA_RANGES[eraParam]) initial.era = eraParam

    setActiveFilters(initial)
  }, [searchParams])

  // Fetch products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      let query = supabase.from('products').select('*')

      if (activeFilters.type)    query = query.ilike('type', activeFilters.type)
      if (activeFilters.league)  query = query.ilike('league', activeFilters.league)
      if (activeFilters.country) query = query.ilike('country', activeFilters.country)
      if (activeFilters.version) query = query.ilike('version', activeFilters.version)
      if (activeFilters.era) {
        const [min, max] = ERA_RANGES[activeFilters.era]
        query = query.gte('year', min).lte('year', max)
      }

      const { data } = await query
      setProducts(mixedSort(data ?? []))
      setLoading(false)
    }
    fetchProducts()
  }, [activeFilters])

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
              {activeType === 'national' && filterCountries.length > 0 && (() => {
                // Group fetched countries by continent using the map
                const grouped: Record<string, string[]> = {}
                filterCountries.forEach((c) => {
                  const continent = CONTINENT_MAP[c] ?? 'Other'
                  ;(grouped[continent] ??= []).push(c)
                })
                const sections = [
                  ...CONTINENT_ORDER.filter((c) => grouped[c]).map((c) => ({ label: c, countries: grouped[c] })),
                  ...(grouped['Other'] ? [{ label: 'Other', countries: grouped['Other'] }] : []),
                ]
                return (
                  <div>
                    <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Country</p>
                    <div className="flex flex-col">
                      {sections.map((region) => (
                        <div key={region.label} className="mb-4">
                          <p className="text-white/20 text-[9px] tracking-widest uppercase mb-2">{region.label}</p>
                          {region.countries.map((country) => (
                            <button
                              key={country}
                              onClick={() => toggleFilter('country', country)}
                              className={`block text-left text-sm transition-colors mb-2 ${
                                activeFilters.country === country ? 'text-blue-400' : 'text-white/50 hover:text-white'
                              }`}
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()}

              {/* VERSION */}
              {(
                <div>
                  <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Version</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: 'fan',   label: 'Fan' },
                      { value: 'retro', label: 'Retro' },
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
