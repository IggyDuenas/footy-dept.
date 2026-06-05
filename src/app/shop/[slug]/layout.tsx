import { createClient } from '@supabase/supabase-js'
import { Metadata } from 'next'

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: product } = await supabase
    .from('products')
    .select('name, description, images, price, country, year')
    .eq('slug', params.slug)
    .single()

  if (!product) {
    return { title: 'Product Not Found' }
  }

  const title = product.name
  const description = product.description
    ? `${product.description.slice(0, 140)}...`
    : `Buy the ${product.name} at Footy Dept. Premium fan-grade quality at fair prices.`

  return {
    title,
    description,
    openGraph: {
      title: `${title} — Footy Dept.`,
      description,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — Footy Dept.`,
      description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
