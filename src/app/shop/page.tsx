'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { parseTeamFromSlug, formatLeague } from '@/lib/parseTeam'
import { getAvailableContinents, getCountriesInContinent, formatCountryName } from '@/lib/continents'

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ShopContent />
    </Suspense>
  )
}

function ShopContent() {
  const searchParams = useSearchParams()
  const [searchOpen, setSearchOpen] = useState(false)

  // Filter state
  const [activeType, setActiveType] = useState('')
  const [activeLeague, setActiveLeague] = useState('')
  const [activeTeam, setActiveTeam] = useState('')
  const [activeContinent, setActiveContinent] = useState('')
  const [activeCountry, setActiveCountry] = useState('')
  const [activeEra, setActiveEra] = useState('')

  // Available options
  const [availableLeagues, setAvailableLeagues] = useState<string[]>([])
  const [availableTeams, setAvailableTeams] = useState<string[]>([])
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [availableContinents, setAvailableContinents] = useState<string[]>([])

  // Products
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  // Read URL params and apply as filters — re-runs on every URL change
  useEffect(() => {
    const type = searchParams.get('type')
    const country = searchParams.get('country')
    const league = searchParams.get('league')

    // Reset all filters first
    setActiveType('')
    setActiveLeague('')
    setActiveTeam('')
    setActiveContinent('')
    setActiveCountry('')
    setActiveEra('')

    // Then apply URL params
    if (type) {
      setActiveType(type.toLowerCase())
    }
    if (country) {
      const normalized = country
        .toLowerCase()
        .replace(/-/g, ' ')
        .trim()
      setActiveCountry(normalized)
      setActiveType('national')
    }
    if (league) setActiveLeague(league.toLowerCase())
  }, [searchParams])

  // Fetch available leagues (clubs)
  useEffect(() => {
    supabase
      .from('products')
      .select('league')
      .eq('type', 'club')
      .not('league', 'is', null)
      .neq('league', '')
      .then(({ data }) => {
        const unique = Array.from(
          new Set((data ?? []).map((r: { league: string }) => r.league.toLowerCase().trim()))
        ).sort()
        setAvailableLeagues(unique)
      })
  }, [])

  // Fetch available countries (nationals)
  useEffect(() => {
    supabase
      .from('products')
      .select('country')
      .eq('type', 'national')
      .neq('country', '')
      .then(({ data }) => {
        const unique = Array.from(
          new Set((data ?? []).map((r: { country: string }) => r.country.toLowerCase().trim()))
        ).sort()
        setAvailableCountries(unique)
        setAvailableContinents(getAvailableContinents(unique))
      })
  }, [])

  // Fetch teams when a league is selected
  useEffect(() => {
    if (!activeLeague) {
      setAvailableTeams([])
      return
    }
    supabase
      .from('products')
      .select('slug')
      .eq('type', 'club')
      .ilike('league', activeLeague)
      .then(({ data }) => {
        const teams = Array.from(
          new Set((data ?? []).map((r: { slug: string }) => parseTeamFromSlug(r.slug)))
        ).filter(Boolean).sort()
        setAvailableTeams(teams)
      })
  }, [activeLeague])

  // Main product fetch
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)

      let query = supabase.from('products').select('*')

      if (activeType === 'retro') {
        query = query.eq('version', 'retro')
      } else if (activeType) {
        query = query.eq('type', activeType)
      }

      if (activeType === 'club' && activeLeague) {
        query = query.ilike('league', activeLeague)
      }

      if (activeType === 'club' && activeTeam) {
        const teamSlug = activeTeam.toLowerCase().replace(/\s+/g, '-')
        query = query.ilike('slug', `%${teamSlug}%`)
      }

      if (activeType === 'national' && activeCountry) {
        query = query.ilike('country', activeCountry)
      } else if (activeType === 'national' && activeContinent) {
        const continentCountries = getCountriesInContinent(activeContinent, availableCountries)
        if (continentCountries.length > 0) {
          query = query.in('country', continentCountries)
        }
      }

      if (activeEra) {
        const decade = parseInt(activeEra)
        query = query.gte('year', decade).lte('year', decade + 9)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('Filter error:', error)
        setProducts([])
        setTotalCount(0)
      } else {
        setProducts(data ?? [])
        setTotalCount(data?.length ?? 0)
      }

      setLoading(false)
    }

    fetchProducts()
  }, [activeType, activeLeague, activeTeam, activeContinent, activeCountry, activeEra, availableCountries])

  // Helpers
  const clearAll = () => {
    setActiveType('')
    setActiveLeague('')
    setActiveTeam('')
    setActiveContinent('')
    setActiveCountry('')
    setActiveEra('')
  }

  const hasActiveFilters = activeType || activeLeague || activeTeam || activeContinent || activeCountry || activeEra

  const handleTypeChange = (type: string) => {
    setActiveType(prev => prev === type ? '' : type)
    setActiveLeague('')
    setActiveTeam('')
    setActiveContinent('')
    setActiveCountry('')
  }

  const handleLeagueChange = (league: string) => {
    setActiveLeague(prev => prev === league ? '' : league)
    setActiveTeam('')
  }

  const handleContinentChange = (continent: string) => {
    setActiveContinent(prev => prev === continent ? '' : continent)
    setActiveCountry('')
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
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-3">{{
              '': 'All Products',
              'club': 'Club Kits',
              'national': 'National Teams',
              'retro': 'Retro Collection',
            }[activeType] ?? 'All Products'}</p>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight uppercase leading-none">
              The Shop.
            </h1>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          {/* Filter bar */}
          <div className="mb-8">
            {/* ROW 1 — Type pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { value: 'club', label: 'Clubs' },
                { value: 'national', label: 'National Teams' },
                { value: 'retro', label: 'Retro' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleTypeChange(value)}
                  className={`px-4 py-2 text-xs font-black tracking-widest uppercase border transition-all duration-200 ${
                    activeType === value
                      ? 'bg-white text-black border-white'
                      : 'border-white/20 text-white/50 hover:border-white/60 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}

              {hasActiveFilters && (
                <button
                  onClick={clearAll}
                  className="px-3 py-2 text-xs text-white/30 hover:text-white/60 transition-colors"
                >
                  Clear all
                </button>
              )}

              <span className="ml-auto text-white/30 text-sm">
                {totalCount} products
              </span>
            </div>

            {/* ROW 2 — League pills (clubs) */}
            {activeType === 'club' && availableLeagues.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="text-white/30 text-[10px] tracking-widest uppercase mr-1">League:</span>
                {availableLeagues.map(league => (
                  <button
                    key={league}
                    onClick={() => handleLeagueChange(league)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                      activeLeague === league
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {formatLeague(league)}
                  </button>
                ))}
              </div>
            )}

            {/* ROW 3 — Team pills (when league selected) */}
            {activeType === 'club' && activeLeague && availableTeams.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-2 pl-3 border-l-2 border-blue-500/30">
                <span className="text-white/20 text-[10px] tracking-widest uppercase mr-1">Club:</span>
                {availableTeams.map(team => (
                  <button
                    key={team}
                    onClick={() => setActiveTeam(prev => prev === team ? '' : team)}
                    className={`px-3 py-1 text-xs font-semibold border transition-all duration-200 ${
                      activeTeam === team
                        ? 'bg-white text-black border-white'
                        : 'border-white/10 text-white/35 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    {team}
                  </button>
                ))}
              </div>
            )}

            {/* ROW 4 — Continent pills (nationals) */}
            {activeType === 'national' && availableContinents.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="text-white/30 text-[10px] tracking-widest uppercase mr-1">Region:</span>
                {availableContinents.map(continent => (
                  <button
                    key={continent}
                    onClick={() => handleContinentChange(continent)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                      activeContinent === continent
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {continent}
                  </button>
                ))}
              </div>
            )}

            {/* ROW 5 — Country pills (when continent selected) */}
            {activeType === 'national' && activeContinent && (() => {
              const continentCountries = getCountriesInContinent(activeContinent, availableCountries)
              if (continentCountries.length <= 1) return null
              return (
                <div className="flex items-center gap-2 flex-wrap mt-2 pl-3 border-l-2 border-blue-500/30">
                  <span className="text-white/20 text-[10px] tracking-widest uppercase mr-1">Country:</span>
                  {continentCountries.map(country => (
                    <button
                      key={country}
                      onClick={() => setActiveCountry(prev => prev === country ? '' : country)}
                      className={`px-3 py-1 text-xs font-semibold border transition-all duration-200 ${
                        activeCountry === country
                          ? 'bg-white text-black border-white'
                          : 'border-white/10 text-white/35 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {formatCountryName(country)}
                    </button>
                  ))}
                </div>
              )
            })()}

            {/* ROW 6 — Era pills */}
            {activeType && (
              <div className="flex items-center gap-2 flex-wrap mt-3">
                <span className="text-white/30 text-[10px] tracking-widest uppercase mr-1">Era:</span>
                {['2020', '2010', '2000', '1990', '1980', '1970'].map(decade => (
                  <button
                    key={decade}
                    onClick={() => setActiveEra(prev => prev === decade ? '' : decade)}
                    className={`px-3 py-1.5 text-xs font-semibold border transition-all duration-200 ${
                      activeEra === decade
                        ? 'bg-white text-black border-white'
                        : 'border-white/15 text-white/40 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    {decade}s
                  </button>
                ))}
              </div>
            )}

            {/* Active filter breadcrumb */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                <span className="text-white/20 text-[10px] tracking-widest uppercase">Filtered by:</span>
                {activeType && <span className="text-white/50 text-xs">{activeType === 'club' ? 'Clubs' : activeType === 'national' ? 'National Teams' : activeType === 'retro' ? 'Retro' : activeType}</span>}
                {activeLeague && <><span className="text-white/20">›</span><span className="text-white/50 text-xs">{formatLeague(activeLeague)}</span></>}
                {activeTeam && <><span className="text-white/20">›</span><span className="text-blue-400 text-xs font-semibold">{activeTeam}</span></>}
                {activeContinent && <><span className="text-white/20">›</span><span className="text-white/50 text-xs">{activeContinent}</span></>}
                {activeCountry && <><span className="text-white/20">›</span><span className="text-blue-400 text-xs font-semibold">{formatCountryName(activeCountry)}</span></>}
                {activeEra && <><span className="text-white/20">›</span><span className="text-white/50 text-xs">{activeEra}s</span></>}
              </div>
            )}
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
              <p className="text-white/30 text-lg mb-2">No products found.</p>
              <p className="text-white/20 text-sm mb-6">Try adjusting your filters or browse the full collection.</p>
              <button
                onClick={clearAll}
                className="px-6 py-3 border border-white/20 text-white/50 text-xs tracking-widest uppercase hover:border-white/40 hover:text-white transition-colors"
              >
                Clear all filters
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
