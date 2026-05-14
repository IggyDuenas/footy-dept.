import Link from 'next/link'

const links = {
  Shop: [
    { label: 'Clubs', href: '/shop?type=club' },
    { label: 'Retro Collection', href: '/shop?type=retro' },
    { label: 'National Teams', href: '/shop?type=national' },
    { label: 'Mystery Box', href: '/shop?type=mystery' },
  ],
  Support: [
    { label: 'Track Order', href: '/track' },
    { label: 'Sizing Guide', href: '#' },
    { label: 'Returns', href: '#' },
    { label: 'Contact', href: '#' },
  ],
  Brand: [
    { label: 'About', href: '#' },
    { label: 'Football Culture', href: '#' },
    { label: 'Wholesale', href: '#' },
    { label: 'Admin', href: '/admin' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-black text-2xl tracking-widest text-white uppercase mb-3">Footy Dept.</p>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Premium football culture. Modern fanwear built for matchday and beyond.
            </p>
            <p className="text-blue-400 text-xs tracking-widest uppercase mt-4">Built for Matchday.</p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-white font-black text-xs tracking-widest uppercase mb-5">{group}</p>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-white/40 text-sm hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-xs">
            © 2026 Footy Dept. All rights reserved. Not affiliated with any official football body.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">Privacy</Link>
            <Link href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">Terms</Link>
            <Link href="#" className="text-white/20 text-xs hover:text-white/40 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
