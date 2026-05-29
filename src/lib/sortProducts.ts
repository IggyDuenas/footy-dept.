import { Product } from '@/types'

// ─── Seeded PRNG (mulberry32) ──────────────────────────────────────────────────

export function getDateSeed(): number {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return parseInt(`${yyyy}${mm}${dd}`, 10)
}

function mulberry32(seed: number) {
  let s = seed
  return function (): number {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// ─── Seeded Fisher-Yates shuffle ──────────────────────────────────────────────

export function seededShuffle<T>(array: T[], seed: number): T[] {
  const result = array.slice()
  const rand = mulberry32(seed)
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    const tmp = result[i]
    result[i] = result[j]
    result[j] = tmp
  }
  return result
}

// ─── Mixed sort ───────────────────────────────────────────────────────────────

export function mixedSort(products: Product[]): Product[] {
  const seed = getDateSeed()

  // Split into buckets
  const clubs:     Product[] = []
  const nationals: Product[] = []
  const retro:     Product[] = []
  const mystery:   Product[] = []

  for (const p of products) {
    if (p.type === 'mystery') {
      mystery.push(p)
    } else if (p.version === 'retro') {
      retro.push(p)
    } else if (p.type === 'national') {
      nationals.push(p)
    } else {
      clubs.push(p)
    }
  }

  // Float featured to the top of each bucket, then seeded-shuffle within each half
  function sortBucket(bucket: Product[]): Product[] {
    const featured    = bucket.filter((p) => p.featured)
    const nonFeatured = bucket.filter((p) => !p.featured)
    return [
      ...seededShuffle(featured, seed),
      ...seededShuffle(nonFeatured, seed + 1),
    ]
  }

  const buckets = [
    sortBucket(clubs),
    sortBucket(nationals),
    sortBucket(retro),
    sortBucket(mystery),
  ].filter((b) => b.length > 0)

  // Round-robin interleave
  const result: Product[] = []
  const indices = buckets.map(() => 0)

  let placed = true
  while (placed) {
    placed = false
    for (let b = 0; b < buckets.length; b++) {
      if (indices[b] < buckets[b].length) {
        result.push(buckets[b][indices[b]])
        indices[b]++
        placed = true
      }
    }
  }

  return result
}
