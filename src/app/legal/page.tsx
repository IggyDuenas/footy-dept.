'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'

const sections = [
  {
    title: 'Terms of Service',
    slug: 'terms',
    content: [
      {
        heading: 'Overview',
        body: 'By accessing or purchasing from Footy Dept. ("we", "us", "our"), you agree to be bound by these Terms of Service. We reserve the right to update these terms at any time. Continued use of the site after changes constitutes acceptance.',
      },
      {
        heading: 'Products',
        body: 'Footy Dept. sells unofficial fan kits and football apparel. We are not affiliated with, endorsed by, or licensed by any football club, league, federation, or governing body. All team names, crests, and trademarks belong to their respective owners. Our products are fan-grade replicas, not official licensed merchandise.',
      },
      {
        heading: 'Orders & Payments',
        body: 'All prices are listed in USD. We reserve the right to cancel or refuse any order at our discretion. Payment is processed securely via Stripe. By placing an order you confirm that the payment information you provide is accurate and authorised.',
      },
      {
        heading: 'Shipping',
        body: 'Standard shipping takes 5–7 business days. Express shipping takes 2–3 business days. All orders are tracked. We are not liable for delays caused by customs, carrier issues, or circumstances outside our control.',
      },
      {
        heading: 'Returns',
        body: 'Unworn items in original condition may be returned within 30 days of delivery. Items must be unwashed and unaltered. Return shipping is the responsibility of the customer unless the item arrived damaged or incorrect. Refunds are processed within 5–7 business days of receiving the return.',
      },
      {
        heading: 'Limitation of Liability',
        body: 'Footy Dept. is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our maximum liability is limited to the total amount paid for the order in question.',
      },
    ],
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    content: [
      {
        heading: 'What We Collect',
        body: 'We collect information you provide directly — name, email address, shipping address, and payment details. We also collect standard usage data (pages visited, device type, browser) via analytics tools to improve the site.',
      },
      {
        heading: 'How We Use It',
        body: 'Your information is used to process orders, send shipping updates, and communicate with you about your account. We do not sell your personal data to third parties.',
      },
      {
        heading: 'Third-Party Services',
        body: 'We use Stripe for payment processing and Supabase for data storage. These services have their own privacy policies. We only share data with third parties to the extent necessary to fulfil your order.',
      },
      {
        heading: 'Cookies',
        body: 'We use essential cookies to keep your cart and session active. We may also use analytics cookies to understand how visitors use the site. You can disable cookies in your browser settings, though some features may not work correctly.',
      },
      {
        heading: 'Data Retention',
        body: 'We retain your order and account data for as long as necessary to fulfil orders and comply with legal obligations. You may request deletion of your personal data by contacting us at support@footydept.com.',
      },
      {
        heading: 'Your Rights',
        body: 'You have the right to access, correct, or delete your personal data at any time. To exercise these rights, email us at support@footydept.com. We will respond within 30 days.',
      },
    ],
  },
  {
    title: 'Cookie Policy',
    slug: 'cookies',
    content: [
      {
        heading: 'What Are Cookies',
        body: 'Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences and provide a better experience.',
      },
      {
        heading: 'Essential Cookies',
        body: 'These are required for the site to function. They manage your shopping cart, session state, and security tokens. You cannot opt out of essential cookies while using the site.',
      },
      {
        heading: 'Analytics Cookies',
        body: 'We use analytics to understand traffic patterns and improve the site. These cookies collect anonymous data about pages visited and time spent. You can opt out via your browser settings or a cookie management tool.',
      },
      {
        heading: 'Managing Cookies',
        body: 'You can control or delete cookies through your browser settings. Disabling non-essential cookies will not affect your ability to browse or purchase from the site.',
      },
    ],
  },
]

function LegalContent() {
  const searchParams = useSearchParams()
  const [searchOpen, setSearchOpen] = useState(false)
  const [active, setActive] = useState('terms')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && sections.some((s) => s.slug === tab)) setActive(tab)
  }, [searchParams])

  const current = sections.find((s) => s.slug === active)!

  return (
    <main className="bg-black min-h-screen">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Header */}
      <section className="pt-40 pb-16 px-6 border-b border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4"
          >
            Legal
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tight uppercase leading-none"
          >
            The Fine Print.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-white/40 text-base mt-6 max-w-md"
          >
            Last updated May 2026. These policies govern your use of Footy Dept. and any purchases made through the site.
          </motion.p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[1400px] mx-auto px-6 py-16 flex flex-col lg:flex-row gap-16">

        {/* Sidebar nav */}
        <aside className="lg:w-56 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2">
            {sections.map((s) => (
              <button
                key={s.slug}
                onClick={() => setActive(s.slug)}
                className={`text-left text-sm font-black tracking-wider uppercase px-4 py-3 border transition-colors ${
                  active === s.slug
                    ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                }`}
              >
                {s.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 max-w-3xl"
        >
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase mb-10">
            {current.title}
          </h2>
          <div className="space-y-10">
            {current.content.map((block, i) => (
              <div key={i} className="border-t border-white/5 pt-8">
                <h3 className="text-white font-black text-sm tracking-widest uppercase mb-3">
                  {block.heading}
                </h3>
                <p className="text-white/50 text-base leading-relaxed">{block.body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}

export default function LegalPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LegalContent />
    </Suspense>
  )
}
