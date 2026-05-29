'use client'

import { createContext, useContext, useState } from 'react'

interface BannerContextType {
  bannerVisible: boolean
  setBannerVisible: (v: boolean) => void
}

const BannerContext = createContext<BannerContextType>({
  bannerVisible: true,
  setBannerVisible: () => {},
})

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [bannerVisible, setBannerVisible] = useState(true)
  return (
    <BannerContext.Provider value={{ bannerVisible, setBannerVisible }}>
      {children}
    </BannerContext.Provider>
  )
}

export const useBanner = () => useContext(BannerContext)
