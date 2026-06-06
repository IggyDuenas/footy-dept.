export function parseTeamFromSlug(slug: string): string {
  if (!slug) return ''

  const parts = slug.split('-')

  // Remove first part if it's a 4-digit year
  const withoutYear = /^\d{4}$/.test(parts[0]) ? parts.slice(1) : parts

  // Known descriptor words to strip from the end
  const descriptors = new Set([
    'home', 'away', 'third', 'kit', 'jersey', 'shirt',
    'special', 'edition', 'retro', 'classic', 'cup',
    'champions', 'league', 'version', 'fan', 'player',
    'goalkeeper', 'gk', 'alternate', 'fourth', 'training',
    '2024', '2025', '2026', '2023', '2022', '2021', '2020',
  ])

  // Strip descriptors from the end
  let end = withoutYear.length
  while (end > 1 && descriptors.has(withoutYear[end - 1])) {
    end--
  }

  const teamParts = withoutYear.slice(0, end)

  // Format: capitalize each word
  return teamParts
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function formatLeague(league: string): string {
  const special: Record<string, string> = {
    'mls': 'MLS',
    'la liga': 'La Liga',
    'serie a': 'Serie A',
    'ligue 1': 'Ligue 1',
    'bundesliga': 'Bundesliga',
    'premier league': 'Premier League',
    'liga portugal': 'Liga Portugal',
    'brasileirao': 'Brasileirao',
    'primera division': 'Primera Division',
    'eredivisie': 'Eredivisie',
    'saudi pro league': 'Saudi Pro League',
    'liga mx': 'Liga MX',
  }
  return special[league.toLowerCase()] ?? league.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}
