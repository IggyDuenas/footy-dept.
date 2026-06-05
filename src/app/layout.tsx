import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { Analytics } from '@vercel/analytics/next'
import AnnouncementBanner from '@/components/AnnouncementBanner'
import { BannerProvider } from '@/context/BannerContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Footy Dept. — Built for Matchday.',
    template: '%s — Footy Dept.',
  },
  description: 'Premium football culture. Shop fan jerseys, retro kits, national team shirts and mystery boxes. Quality fan-grade kits at fair prices. Built for matchday.',
  keywords: ['football jerseys', 'soccer jerseys', 'replica football kits', 'retro football shirts', 'national team jerseys', 'fan kits', 'football culture', 'world cup jerseys'],
  authors: [{ name: 'Footy Dept.' }],
  creator: 'Footy Dept.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://footydept.com'),
  openGraph: {
    title: 'Footy Dept. — Built for Matchday.',
    description: 'Premium football culture. Fan jerseys, retro kits, national team shirts.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://footydept.com',
    siteName: 'Footy Dept.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Footy Dept. — Built for Matchday.',
    description: 'Premium football culture. Fan jerseys, retro kits, national team shirts.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <BannerProvider>
          <AnnouncementBanner />
          {children}
          <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '0',
              fontSize: '13px',
            },
          }}
        />
        </BannerProvider>
        <Analytics />
      </body>
    </html>
  )
}
