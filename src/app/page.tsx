'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Hero from '@/components/sections/Hero'
import FeaturedCollections from '@/components/sections/FeaturedCollections'
import BestSellers from '@/components/sections/BestSellers'
import FullWidthBanner from '@/components/sections/FullWidthBanner'
import RetroCollection from '@/components/sections/RetroCollection'
import Newsletter from '@/components/sections/Newsletter'
import Footer from '@/components/Footer'

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <main>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      <Hero />
      <FeaturedCollections />
      <BestSellers />
      <FullWidthBanner />
      <RetroCollection />
      <Newsletter />
      <Footer />
    </main>
  )
}
