'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore, useWishlistStore } from '@/store/cartStore'
import { getDiscountPercent } from '@/lib/volumeDiscount'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)
  const [adding, setAdding] = useState(false)
  const { addItem, itemCount } = useCartStore()
  const count = itemCount()
  const atLimit = count >= 10
  const volumeDiscount = getDiscountPercent(count)
  const { toggle, has } = useWishlistStore()
  const wishlisted = has(product.id)

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const defaultSize = product.sizes[1] || product.sizes[0] || 'M'
    const success = addItem(product, { size: defaultSize })
    if (!success) {
      toast.error('Maximum 10 jerseys per order. Please checkout to continue.')
      return
    }
    setAdding(true)
    setTimeout(() => setAdding(false), 1000)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggle(product.id)
  }

  const discount = product.compare_at_price
    ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    : null

  const outOfStock = product.inventory === 0

  return (
    <Link href={`/shop/${product.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative bg-zinc-900 cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden bg-zinc-800">
          <Image
            src={product.images[hovered && product.images[1] ? 1 : 0] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${outOfStock ? 'grayscale opacity-60' : ''}`}
          />

          {/* Out of stock overlay */}
          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-black/70 backdrop-blur-sm text-white text-[10px] font-black px-4 py-2 tracking-[0.2em] uppercase border border-white/20">
                Out of Stock
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.version === 'retro' && (
              <span className="bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 tracking-wider uppercase">Retro</span>
            )}
            {product.version === 'player' && (
              <span className="bg-white text-black text-[10px] font-black px-2 py-0.5 tracking-wider uppercase">Player</span>
            )}
            {discount && !outOfStock && (
              <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 tracking-wider uppercase">-{discount}%</span>
            )}
            {volumeDiscount > 0 && !outOfStock && (
              <span className="bg-green-500 text-black text-[10px] font-black px-2 py-0.5 tracking-wider uppercase">{volumeDiscount}% off in your cart</span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/80"
          >
            <Heart
              size={14}
              className={wishlisted ? 'fill-red-500 text-red-500' : 'text-white'}
            />
          </button>

          {/* Quick add — hidden when out of stock */}
          {!outOfStock && (
            <motion.button
              onClick={handleQuickAdd}
              disabled={atLimit}
              initial={{ y: 10, opacity: 0 }}
              animate={hovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`absolute bottom-0 left-0 right-0 bg-white text-black font-black text-xs tracking-widest uppercase py-3 flex items-center justify-center gap-2 transition-colors ${
                atLimit ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 hover:text-white'
              }`}
            >
              <ShoppingBag size={13} />
              {atLimit ? 'Cart Full' : adding ? 'Added!' : 'Quick Add'}
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-white/40 text-[10px] tracking-widest uppercase mb-1">{product.country}</p>
          <h3 className="text-white font-semibold text-sm leading-tight">{product.name}</h3>
          <div className="flex items-center gap-2 mt-2">
            {outOfStock ? (
              <span className="text-white/30 text-xs tracking-widest uppercase font-black">Out of Stock</span>
            ) : (
              <>
                <span className="text-white font-bold">${product.price.toFixed(2)}</span>
                {product.compare_at_price && (
                  <span className="text-white/30 text-sm line-through">${product.compare_at_price.toFixed(2)}</span>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
