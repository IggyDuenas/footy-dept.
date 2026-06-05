'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'

export default function NavShell() {
  const [searchOpen, setSearchOpen] = useState(false)
  return (
    <>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
