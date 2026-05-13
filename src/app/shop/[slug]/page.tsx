'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Truck, RotateCcw, ChevronDown, Heart } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { useCartStore, useWishlistStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

const DEMO: Record<string, Product> = {
  'brazil-home-2026': { id:'1', name:'Brazil Home Jersey 2026', slug:'brazil-home-2026', category:'jersey', country:'brazil', season:'2026', version_type:'fan', description:'The iconic Seleção returns in full force. Crafted for the fanwear faithful — bold yellow, deep green, and a cut that moves with you.', price:89.99, compare_at_price:119.99, images:['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80','https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=900&q=80'], sizes:['XS','S','M','L','XL','XXL'], featured:true, inventory:50, created_at:'' },
  'france-away-2026': { id:'2', name:'France Away Kit 2026', slug:'france-away-2026', category:'jersey', country:'france', season:'2026', version_type:'fan', description:'Les Bleus go clean. The 2026 away edition in stark white with signature blue trim — a modern classic.', price:94.99, compare_at_price:124.99, images:['https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=900&q=80','https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=900&q=80'], sizes:['XS','S','M','L','XL','XXL'], featured:true, inventory:35, created_at:'' },
  'mystery-box-premium': { id:'4', name:'Mystery Box — Premium', slug:'mystery-box-premium', category:'mystery', country:'various', season:'2026', version_type:'mystery', description:'You pick the size, we pick the kit. Could be a retro gem, a current national team, or a limited edition. Always premium, always a surprise.', price:59.99, compare_at_price:99.99, images:['https://images.unsplash.com/photo-1614632537239-e2258b9ef5f2?w=900&q=80'], sizes:['S','M','L','XL'], featured:true, inventory:100, created_at:'' },
}

const accordions = [
  { title: 'Size Guide', content: 'XS: 34-36", S: 36-38", M: 38-40", L: 40-42", XL: 42-44", XXL: 44-46". We recommend sizing up for a relaxed fit.' },
  { title: 'Shipping Info', content: 'Standard shipping 5-7 business days. Express 2-3 days. All orders are tracked and insured. Free shipping on orders over $100.' },
  { title: 'Returns & FAQ', content: 'Unworn items can be returned within 30 days. Mystery boxes are final sale. Contact support for any sizing issues — we\'ll make it right.' },
]

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { addItem } = useCartStore()
  const { toggle, has } = useWishlistStore()

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
      setProduct(data || DEMO[slug] || null)
      setLoading(false)
    }
    fetch()
  }, [slug])

  if (loading) {
    return (
      <main>
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
        <div className="pt-16 min-h-screen">
          <div className="max-w-[1400px] mx-auto px-6 py-16 grid md:grid-cols-2 gap-16">
            <div className="aspect-square bg-white/5 animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 bg-white/5 animate-pulse w-2/3" />
              <div className="h-6 bg-white/5 animate-pulse w-1/4" />
              <div className="h-24 bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main>
        <Navbar onSearchOpen={() => setSearchOpen(true)} />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-white/40 text-xl mb-4">Product not found</p>
            <Link href="/shop" className="text-blue-400 hover:text-blue-300 underline underline-offset-4">
              Back to shop
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    addItem(product, selectedSize, quantity)
    toast.success(`${product.name} added to cart`)
  }

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null

  return (
    <main>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className="pt-16">
        <div className="max-w-[1400px] mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/30 text-xs tracking-wider uppercase mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-white transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-white/50">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* LEFT — Image gallery */}
            <div>
              <div className="relative aspect-square overflow-hidden bg-zinc-900 mb-4 group">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={product.images[selectedImage] || product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
                {discount && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-black px-3 py-1 tracking-wider uppercase">
                    -{discount}% OFF
                  </div>
                )}
                <button
                  onClick={() => toggle(product.id)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <Heart
                    size={16}
                    className={has(product.id) ? 'fill-red-500 text-red-500' : 'text-white'}
                  />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-20 h-20 overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-white' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT — Product info */}
            <div className="flex flex-col">
              <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-2">
                {product.country} · {product.season}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
                {product.compare_at_price && (
                  <span className="text-white/30 text-xl line-through">${product.compare_at_price.toFixed(2)}</span>
                )}
                {discount && (
                  <span className="text-blue-400 text-sm font-bold">Save ${(product.compare_at_price! - product.price).toFixed(2)}</span>
                )}
              </div>

              <p className="text-white/50 leading-relaxed mb-8">{product.description}</p>

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-sm font-semibold tracking-wider uppercase">Size</p>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'Size Guide' ? null : 'Size Guide')}
                    className="text-white/40 text-xs hover:text-white/60 underline underline-offset-2"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[52px] h-11 border text-sm font-semibold transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <p className="text-white text-sm font-semibold tracking-wider uppercase mb-3">Quantity</p>
                <div className="flex items-center gap-0 border border-white/20 w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-12 h-11 flex items-center justify-center text-white font-semibold border-x border-white/20">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-11 h-11 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="w-full py-5 bg-white text-black font-black text-sm tracking-widest uppercase hover:bg-blue-500 hover:text-white transition-colors duration-300 mb-4"
              >
                Add to Cart — ${(product.price * quantity).toFixed(2)}
              </motion.button>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/10 mb-8">
                {[
                  { icon: ShieldCheck, label: 'Secure Checkout' },
                  { icon: Truck, label: 'Tracked Shipping' },
                  { icon: RotateCcw, label: '30-Day Returns' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-2 text-center">
                    <Icon size={18} className="text-white/40" />
                    <span className="text-white/40 text-[10px] tracking-wider uppercase leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              {/* Accordions */}
              <div className="space-y-0">
                {accordions.map((acc) => (
                  <div key={acc.title} className="border-b border-white/10">
                    <button
                      onClick={() => setOpenAccordion(openAccordion === acc.title ? null : acc.title)}
                      className="w-full flex items-center justify-between py-4 text-white/70 hover:text-white transition-colors"
                    >
                      <span className="text-sm font-semibold tracking-wider uppercase">{acc.title}</span>
                      <motion.div
                        animate={{ rotate: openAccordion === acc.title ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {openAccordion === acc.title && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <p className="text-white/40 text-sm leading-relaxed pb-4">{acc.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
