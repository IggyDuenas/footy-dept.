import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'World Cup 2026 Kits — Footy Dept.',
  description: 'Shop World Cup 2026 national team kits. Built for matchday.',
}

export default function WorldCupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
