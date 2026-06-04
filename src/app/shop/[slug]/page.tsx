'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Truck, RotateCcw, ChevronDown } from 'lucide-react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { Product, Badge } from '@/types'
import { useCartStore } from '@/store/cartStore'
import toast from 'react-hot-toast'

const accordions = [
  { title: 'Size Guide', content: 'XS: 34-36", S: 36-38", M: 38-40", L: 40-42", XL: 42-44", XXL: 44-46". We recommend sizing up for a relaxed fit.' },
  { title: 'Shipping Info', content: 'Standard shipping 5-7 business days. Express 2-3 days. All orders are tracked and insured. Free shipping on orders over $100.' },
  { title: 'Returns & FAQ', content: "Unworn items can be returned within 30 days. Contact support for any sizing issues — we'll make it right." },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  // Customization state
  const [wantsCustomization, setWantsCustomization] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customNumberStr, setCustomNumberStr] = useState('')
  const [selectedBadges, setSelectedBadges] = useState<Badge[]>([])

  const sizeGuideRef = useRef<HTMLDivElement>(null)
  const { addItem, itemCount } = useCartStore()
  const atLimit = itemCount() >= 10

  // ── Fetch product + its badges ─────────────────────────────────────────────
  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from('products').select('*').eq('slug', slug).single()
      let p: Product | null = data || null

      if (p) {
        // Fetch available badges for this product
        const { data: pb } = await supabase
          .from('product_badges')
          .select('badge_id')
          .eq('product_id', p.id)

        if (pb && pb.length > 0) {
          const { data: badges } = await supabase
            .from('badges')
            .select('*')
            .in('id', pb.map((r: { badge_id: string }) => r.badge_id))
          p = { ...p, available_badges: badges || [] }
        } else {
          p = { ...p, available_badges: [] }
        }
      }

      setProduct(p)
      setLoading(false)
    }
    fetchProduct()
  }, [slug])

  // ── Loading skeleton ───────────────────────────────────────────────────────
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

  // ── Derived values ─────────────────────────────────────────────────────────
  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null

  const isCustomizable = product.customization_enabled === true
  const customizationFee = product.customization_price ?? 10

  const customizationTotal = (() => {
    let total = 0
    if (isCustomizable && wantsCustomization) total += customizationFee
    selectedBadges.forEach((b) => { total += b.price })
    return total
  })()

  const lineTotal = (product.price + customizationTotal) * quantity

  const outOfStock = product.inventory === 0

  const toggleBadge = (badge: Badge) => {
    setSelectedBadges((prev) =>
      prev.some((b) => b.id === badge.id)
        ? prev.filter((b) => b.id !== badge.id)
        : [...prev, badge]
    )
  }

  const handleSizeGuide = () => {
    setOpenAccordion('Size Guide')
    setTimeout(() => sizeGuideRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size')
      return
    }
    if (isCustomizable && wantsCustomization) {
      if (!customName.trim()) {
        toast.error('Please enter a name for your kit')
        return
      }
      if (customNumberStr === '') {
        toast.error('Please enter a number for your kit')
        return
      }
    }
    const success = addItem(product, {
      size: selectedSize,
      quantity,
      customName: isCustomizable && wantsCustomization ? customName.trim() : null,
      customNumber: isCustomizable && wantsCustomization ? parseInt(customNumberStr) : null,
      selectedBadges: selectedBadges.length ? selectedBadges : undefined,
      customizationTotal: customizationTotal || undefined,
    })
    if (!success) {
      toast.error('Maximum 10 jerseys per order. Please checkout to continue.')
      return
    }
    toast.success(`${product.name} added to cart`)
  }

  // ── Render ─────────────────────────────────────────────────────────────────
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

            {/* LEFT — Image gallery (no wishlist button) */}
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
                {product.country} · {product.year}
              </p>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-black text-white">${product.price.toFixed(2)}</span>
                  {product.compare_at_price && (
                    <span className="text-white/30 text-xl line-through">${product.compare_at_price.toFixed(2)}</span>
                  )}
                  {discount && (
                    <span className="text-blue-400 text-sm font-bold">
                      Save ${(product.compare_at_price! - product.price).toFixed(2)}
                    </span>
                  )}
                </div>
                {customizationTotal > 0 && (
                  <p className="text-white/40 text-sm mt-1">
                    + ${customizationTotal.toFixed(2)} customizations
                  </p>
                )}
              </div>

              <p className="text-white/50 leading-relaxed mb-8">{product.description}</p>

              {/* Size selector */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white text-sm font-semibold tracking-wider uppercase">Size</p>
                  <button
                    onClick={handleSizeGuide}
                    className="text-white/40 text-xs hover:text-white/60 underline underline-offset-2"
                  >
                    Size Guide
                  </button>
                </div>
                {outOfStock && (
                  <p className="text-red-400 text-xs tracking-wider uppercase mb-3">Out of stock</p>
                )}
                {/* TODO: per-size inventory not yet implemented; product.inventory used as proxy */}
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => !outOfStock && setSelectedSize(size)}
                      disabled={outOfStock}
                      className={`min-w-[52px] h-11 border text-sm font-semibold transition-all duration-200 ${
                        outOfStock
                          ? 'border-white/10 text-white/20 cursor-not-allowed line-through'
                          : selectedSize === size
                          ? 'border-white bg-white text-black'
                          : 'border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Customization section ─────────────────────────────────── */}
              {isCustomizable && (
                <div className="mb-6 border border-white/10 p-5">
                  <p className="text-white text-sm font-black tracking-widest uppercase mb-4">
                    Customize Your Kit
                  </p>

                  {/* Toggle */}
                  <label className="flex items-center gap-3 cursor-pointer mb-4">
                    <div
                      onClick={() => {
                        setWantsCustomization((v) => !v)
                        if (wantsCustomization) { setCustomName(''); setCustomNumberStr('') }
                      }}
                      className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                        wantsCustomization ? 'bg-blue-500' : 'bg-white/10'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${
                        wantsCustomization ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </div>
                    <span className="text-white/70 text-sm">
                      Add name &amp; number{' '}
                      <span className="text-blue-400 font-bold">+${customizationFee.toFixed(2)}</span>
                    </span>
                  </label>

                  {/* Name + Number inputs */}
                  <AnimatePresence>
                    {wantsCustomization && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block text-white/40 text-[10px] tracking-widest uppercase mb-2">
                              Name (max 12)
                            </label>
                            <input
                              type="text"
                              value={customName}
                              onChange={(e) =>
                                setCustomName(
                                  e.target.value.replace(/[^A-Za-z ]/g, '').toUpperCase().slice(0, 12)
                                )
                              }
                              placeholder="SILVA"
                              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 text-sm outline-none focus:border-blue-400 tracking-widest uppercase placeholder:text-white/20 placeholder:normal-case placeholder:tracking-normal"
                            />
                          </div>
                          <div>
                            <label className="block text-white/40 text-[10px] tracking-widest uppercase mb-2">
                              Number (0–99)
                            </label>
                            <input
                              type="number"
                              value={customNumberStr}
                              onChange={(e) => {
                                const v = e.target.value
                                if (v === '' || (Number(v) >= 0 && Number(v) <= 99)) {
                                  setCustomNumberStr(v)
                                }
                              }}
                              placeholder="10"
                              min={0}
                              max={99}
                              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 text-sm outline-none focus:border-blue-400 placeholder:text-white/20"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ── Badges section ────────────────────────────────────────── */}
              {product.available_badges && product.available_badges.length > 0 && (
                <div className="mb-6">
                  <p className="text-white text-sm font-black tracking-widest uppercase mb-3">Add Badges</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {product.available_badges.map((badge) => {
                      const isSelected = selectedBadges.some((b) => b.id === badge.id)
                      return (
                        <button
                          key={badge.id}
                          onClick={() => toggleBadge(badge)}
                          className={`border p-3 text-left transition-all duration-200 ${
                            isSelected
                              ? 'border-blue-400 bg-blue-500/10'
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          <div className="relative aspect-square bg-zinc-900 mb-2 overflow-hidden">
                            <Image
                              src={badge.image_url}
                              alt={badge.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                          <p className="text-white text-xs font-semibold leading-tight truncate">{badge.name}</p>
                          <p className="text-blue-400 text-xs font-bold mt-0.5">+${badge.price.toFixed(2)}</p>
                        </button>
                      )
                    })}
                  </div>
                  {selectedBadges.length > 0 && (
                    <p className="text-white/40 text-xs mt-3 tracking-wider">
                      Badges:{' '}
                      <span className="text-white">
                        +${selectedBadges.reduce((s, b) => s + b.price, 0).toFixed(2)}
                      </span>
                    </p>
                  )}
                </div>
              )}

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
                disabled={outOfStock || atLimit}
                className={`w-full py-5 bg-white text-black font-black text-sm tracking-widest uppercase transition-colors duration-300 mb-4 disabled:cursor-not-allowed ${
                  outOfStock || atLimit ? 'opacity-40' : 'hover:bg-blue-500 hover:text-white'
                }`}
              >
                {outOfStock ? 'Out of Stock' : atLimit ? 'Cart Full — Max 10 Items' : `Add to Cart — $${lineTotal.toFixed(2)}`}
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
                  <div
                    key={acc.title}
                    className="border-b border-white/10"
                    ref={acc.title === 'Size Guide' ? sizeGuideRef : undefined}
                  >
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
