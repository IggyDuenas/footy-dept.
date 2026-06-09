import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Cup 2026 — Footy Dept.',
  description: 'Shop all 48 World Cup 2026 national team kits. Browse by group. USA, Mexico and Canada host the tournament.',
}

export default function WorldCupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
