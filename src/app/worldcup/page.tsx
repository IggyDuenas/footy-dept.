'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import SearchModal from '@/components/SearchModal'
import Footer from '@/components/Footer'

// ─── World Cup 2026 Groups ──────────────────────────────────────────────────

const WC_GROUPS: Record<string, { name: string; flag: string; rank: number; slug: string }[]> = {
  'A': [
    { name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', rank: 15, slug: 'mexico' },
    { name: 'South Korea', flag: '\u{1F1F0}\u{1F1F7}', rank: 25, slug: 'south-korea' },
    { name: 'Czechia', flag: '\u{1F1E8}\u{1F1FF}', rank: 41, slug: 'czechia' },
    { name: 'South Africa', flag: '\u{1F1FF}\u{1F1E6}', rank: 60, slug: 'south-africa' },
  ],
  'B': [
    { name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', rank: 30, slug: 'canada' },
    { name: 'Bosnia and Herzegovina', flag: '\u{1F1E7}\u{1F1E6}', rank: 65, slug: 'bosnia-and-herzegovina' },
    { name: 'Qatar', flag: '\u{1F1F6}\u{1F1E6}', rank: 55, slug: 'qatar' },
    { name: 'Switzerland', flag: '\u{1F1E8}\u{1F1ED}', rank: 19, slug: 'switzerland' },
  ],
  'C': [
    { name: 'Brazil', flag: '\u{1F1E7}\u{1F1F7}', rank: 6, slug: 'brazil' },
    { name: 'Morocco', flag: '\u{1F1F2}\u{1F1E6}', rank: 8, slug: 'morocco' },
    { name: 'Haiti', flag: '\u{1F1ED}\u{1F1F9}', rank: 83, slug: 'haiti' },
    { name: 'Scotland', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}', rank: 43, slug: 'scotland' },
  ],
  'D': [
    { name: 'USA', flag: '\u{1F1FA}\u{1F1F8}', rank: 16, slug: 'usa' },
    { name: 'Australia', flag: '\u{1F1E6}\u{1F1FA}', rank: 27, slug: 'australia' },
    { name: 'Paraguay', flag: '\u{1F1F5}\u{1F1FE}', rank: 40, slug: 'paraguay' },
    { name: 'T\u00FCrkiye', flag: '\u{1F1F9}\u{1F1F7}', rank: 22, slug: 'turkey' },
  ],
  'E': [
    { name: 'Germany', flag: '\u{1F1E9}\u{1F1EA}', rank: 10, slug: 'germany' },
    { name: 'C\u00F4te d\'Ivoire', flag: '\u{1F1E8}\u{1F1EE}', rank: 34, slug: 'ivory-coast' },
    { name: 'Ecuador', flag: '\u{1F1EA}\u{1F1E8}', rank: 23, slug: 'ecuador' },
    { name: 'Cura\u00E7ao', flag: '\u{1F1E8}\u{1F1FC}', rank: 82, slug: 'curacao' },
  ],
  'F': [
    { name: 'Japan', flag: '\u{1F1EF}\u{1F1F5}', rank: 18, slug: 'japan' },
    { name: 'Netherlands', flag: '\u{1F1F3}\u{1F1F1}', rank: 7, slug: 'netherlands' },
    { name: 'Sweden', flag: '\u{1F1F8}\u{1F1EA}', rank: 38, slug: 'sweden' },
    { name: 'Tunisia', flag: '\u{1F1F9}\u{1F1F3}', rank: 44, slug: 'tunisia' },
  ],
  'G': [
    { name: 'Belgium', flag: '\u{1F1E7}\u{1F1EA}', rank: 9, slug: 'belgium' },
    { name: 'Egypt', flag: '\u{1F1EA}\u{1F1EC}', rank: 29, slug: 'egypt' },
    { name: 'IR Iran', flag: '\u{1F1EE}\u{1F1F7}', rank: 21, slug: 'iran' },
    { name: 'New Zealand', flag: '\u{1F1F3}\u{1F1FF}', rank: 85, slug: 'new-zealand' },
  ],
  'H': [
    { name: 'Spain', flag: '\u{1F1EA}\u{1F1F8}', rank: 2, slug: 'spain' },
    { name: 'Saudi Arabia', flag: '\u{1F1F8}\u{1F1E6}', rank: 61, slug: 'saudi-arabia' },
    { name: 'Uruguay', flag: '\u{1F1FA}\u{1F1FE}', rank: 17, slug: 'uruguay' },
    { name: 'Cabo Verde', flag: '\u{1F1E8}\u{1F1FB}', rank: 69, slug: 'cabo-verde' },
  ],
  'I': [
    { name: 'France', flag: '\u{1F1EB}\u{1F1F7}', rank: 1, slug: 'france' },
    { name: 'Iraq', flag: '\u{1F1EE}\u{1F1F6}', rank: 57, slug: 'iraq' },
    { name: 'Norway', flag: '\u{1F1F3}\u{1F1F4}', rank: 31, slug: 'norway' },
    { name: 'Senegal', flag: '\u{1F1F8}\u{1F1F3}', rank: 14, slug: 'senegal' },
  ],
  'J': [
    { name: 'Argentina', flag: '\u{1F1E6}\u{1F1F7}', rank: 3, slug: 'argentina' },
    { name: 'Algeria', flag: '\u{1F1E9}\u{1F1FF}', rank: 28, slug: 'algeria' },
    { name: 'Austria', flag: '\u{1F1E6}\u{1F1F9}', rank: 24, slug: 'austria' },
    { name: 'Jordan', flag: '\u{1F1EF}\u{1F1F4}', rank: 63, slug: 'jordan' },
  ],
  'K': [
    { name: 'Portugal', flag: '\u{1F1F5}\u{1F1F9}', rank: 5, slug: 'portugal' },
    { name: 'Colombia', flag: '\u{1F1E8}\u{1F1F4}', rank: 13, slug: 'colombia' },
    { name: 'Congo DR', flag: '\u{1F1E8}\u{1F1E9}', rank: 46, slug: 'congo-dr' },
    { name: 'Uzbekistan', flag: '\u{1F1FA}\u{1F1FF}', rank: 50, slug: 'uzbekistan' },
  ],
  'L': [
    { name: 'England', flag: '\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}', rank: 4, slug: 'england' },
    { name: 'Croatia', flag: '\u{1F1ED}\u{1F1F7}', rank: 11, slug: 'croatia' },
    { name: 'Ghana', flag: '\u{1F1EC}\u{1F1ED}', rank: 74, slug: 'ghana' },
    { name: 'Panama', flag: '\u{1F1F5}\u{1F1E6}', rank: 33, slug: 'panama' },
  ],
}

const HOST_NATIONS = [
  { name: 'USA', flag: '\u{1F1FA}\u{1F1F8}', slug: 'usa' },
  { name: 'Mexico', flag: '\u{1F1F2}\u{1F1FD}', slug: 'mexico' },
  { name: 'Canada', flag: '\u{1F1E8}\u{1F1E6}', slug: 'canada' },
]

// ─── Component ──────────────────────────────────────────────────────────────

export default function WorldCupPage() {
  const [searchOpen, setSearchOpen] = useState(false)
  const router = useRouter()

  const handleCopy = () => {
    navigator.clipboard.writeText('WORLDCUP')
    toast.success('Code copied!')
  }

  const handleTeamClick = (slug: string) => {
    router.push(`/shop?type=national&country=${slug}`)
  }

  return (
    <main>
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <CartDrawer />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-16"
        style={{ background: 'linear-gradient(160deg, #000000 0%, #0a0a1a 50%, #000820 100%)' }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/8 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <p className="text-blue-400 text-xs tracking-[0.4em] uppercase mb-6">FIFA World Cup</p>
            <h1 className="text-[120px] md:text-[180px] font-black text-white tracking-tighter uppercase leading-none mb-4">
              2026.
            </h1>
            <p className="text-white/40 text-lg md:text-xl tracking-widest uppercase mt-4 mb-12">
              USA &middot; Mexico &middot; Canada
            </p>

            {/* Coupon callout */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3">
              <p className="text-white/60 text-sm tracking-wider">
                Use code <span className="text-blue-400 font-black">WORLDCUP</span> at checkout
              </p>
              <button
                onClick={handleCopy}
                className="text-white/40 hover:text-blue-400 transition-colors flex-shrink-0"
                aria-label="Copy code"
              >
                <Copy size={14} />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Groups ───────────────────────────────────────────────────────── */}
      <section className="bg-[#080808] py-24 px-6">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Group Stage</p>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
              The Groups.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(WC_GROUPS).map(([letter, teams], gi) => (
              <motion.div
                key={letter}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: gi * 0.04 }}
                className="bg-zinc-900 border border-white/10 p-4"
              >
                {/* Group header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-500/30">
                  <p className="text-blue-400 font-black tracking-widest text-xs uppercase">
                    Group {letter}
                  </p>
                </div>

                {/* Team rows */}
                <div>
                  {teams.map((team, ti) => (
                    <button
                      key={team.slug}
                      onClick={() => handleTeamClick(team.slug)}
                      className={`group w-full flex items-center gap-3 px-2 py-2.5 rounded cursor-pointer hover:bg-white/5 transition-colors ${
                        ti < teams.length - 1 ? 'border-b border-white/5' : ''
                      }`}
                    >
                      <span className="text-2xl leading-none flex-shrink-0">{team.flag}</span>
                      <span className="text-white text-sm font-semibold group-hover:text-white transition-colors text-left">
                        {team.name}
                      </span>
                      <span className="ml-auto flex items-center gap-3">
                        <span className="text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Shop Kits &rarr;
                        </span>
                        <span className="text-white/30 text-xs group-hover:text-blue-400 transition-colors">
                          #{team.rank}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Host Nations ─────────────────────────────────────────────────── */}
      <section className="bg-black py-20 px-6 border-t border-white/5">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-10 text-center"
          >
            <p className="text-blue-400 text-xs tracking-[0.3em] uppercase mb-4">Host Nations</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
              The Hosts.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {HOST_NATIONS.map((nation, i) => (
              <motion.button
                key={nation.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                onClick={() => handleTeamClick(nation.slug)}
                className="group flex flex-col items-center gap-3 bg-zinc-900 border border-white/10 p-8 hover:border-blue-500/40 transition-all cursor-pointer"
              >
                <span className="text-5xl leading-none">{nation.flag}</span>
                <span className="text-white font-black text-lg tracking-widest uppercase group-hover:text-blue-400 transition-colors">
                  {nation.name}
                </span>
                <span className="text-blue-400 text-[10px] font-bold tracking-widest uppercase border border-blue-500/30 px-2 py-0.5">
                  Host Nation
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
