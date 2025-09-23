import type { Metadata } from 'next'
import CategoryFiltersClient from './category-filters-client'
import { allProducts, getCategoryLabel } from '@/lib/products'

const CATEGORY_LABELS: Record<string, string> = {
  bienestar: 'Bienestar intimo',
  lenceria: 'Lencería',
  kits: 'Kits de regalo',
  arneses: 'Arneses con arnés',
  consoladores: 'Consoladores',
  fetish: 'Fetish y BDSM',
  munecas: 'Muñecas realistas',
  anales: 'Juegos anales'
}

const sensitiveCategories = new Set(
  allProducts()
    .filter(product => product.nsfw)
    .map(product => product.category)
)

function categoryLabelFor(slug: string) {
  if (CATEGORY_LABELS[slug]) return CATEGORY_LABELS[slug]
  const labelFromData = getCategoryLabel(slug)
  if (labelFromData) return labelFromData
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const label = categoryLabelFor(params.slug)
  const isSensitive = sensitiveCategories.has(params.slug)
  const description = isSensitive
    ? `Explora ${label} con filtros seguros para mayores de 18 años en SexShop del Perú 69.`
    : `Compra ${label} con envíos discretos y asesoría confidencial en SexShop del Perú 69.`

  return {
    title: `${label} — SexShop del Perú 69`,
    description,
    alternates: {
      canonical: `/categoria/${params.slug}`
    },
    openGraph: {
      type: 'website',
      title: `${label} — SexShop del Perú 69`,
      description,
      url: `/categoria/${params.slug}`,
      siteName: 'SexShop del Perú 69'
    },
    robots: isSensitive
      ? {
          index: false,
          follow: true
        }
      : undefined
  }
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold capitalize">{categoryLabelFor(params.slug)}</h1>
      <CategoryFiltersClient />
    </div>
  )
}
