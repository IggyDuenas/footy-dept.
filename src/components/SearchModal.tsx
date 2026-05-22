'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

const POPULAR = ['Brazil Jersey', 'France Kit', 'Retro 90s', 'USA 2026']

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .limit(6)
      setResults(data || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-white/10"
          >
            <div className="max-w-3xl mx-auto px-6 py-6">
              <div className="flex items-center gap-4">
                <Search size={20} className="text-white/40 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search jerseys, kits, collections..."
                  className="flex-1 bg-transparent text-white text-xl placeholder:text-white/20 outline-none"
                />
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Popular searches */}
              {!query && (
                <div className="mt-6">
                  <p className="text-white/30 text-xs tracking-widest uppercase mb-3">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {POPULAR.map((term) => (
                      <button
                        key={term}
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 border border-white/10 text-white/50 text-sm hover:text-white hover:border-white/30 transition-colors rounded-sm"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Results */}
              {query && (
                <div className="mt-4">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-14 bg-white/5 animate-pulse rounded" />
                      ))}
                    </div>
                  ) : results.length > 0 ? (
                    <div className="space-y-2">
                      {results.map((product) => (
                        <Link
                          key={product.id}
                          href={`/shop/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-4 p-3 rounded hover:bg-white/5 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-white/10 rounded overflow-hidden flex-shrink-0 relative">
                            <Image src={product.images[0] || '/placeholder.jpg'} alt={product.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-sm font-medium truncate">{product.name}</p>
                            <p className="text-white/40 text-xs">${product.price.toFixed(2)}</p>
                          </div>
                          <ArrowRight size={16} className="text-white/20 group-hover:text-white/60 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/30 text-sm py-4">No results for &quot;{query}&quot;</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
