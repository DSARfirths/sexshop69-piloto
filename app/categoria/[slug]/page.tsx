import type { Metadata } from 'next'

import CategoryFiltersClient from './category-filters-client'
import { collectCatalogOptions } from '@/lib/catalog-filters'
import { getCategoryLabel, getProductsByCategory } from '@/lib/products.server'

const FALLBACK_CATEGORY_LABELS: Record<string, string> = {
  bienestar: 'Bienestar íntimo',
  lenceria: 'Lencería',
  kits: 'Kits de regalo',
  arneses: 'Arneses con arnés',
  consoladores: 'Consoladores',
  fetish: 'Fetish y BDSM',
  munecas: 'Muñecas realistas',
  anales: 'Juegos anales'
}

async function resolveCategoryLabel(slug: string): Promise<string> {
  if (FALLBACK_CATEGORY_LABELS[slug]) {
    return FALLBACK_CATEGORY_LABELS[slug]
  }
  const labelFromDb = await getCategoryLabel(slug)
  if (labelFromDb) return labelFromDb
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const [label, products] = await Promise.all([
    resolveCategoryLabel(params.slug),
    getProductsByCategory(params.slug)
  ])

  const isSensitive = products.some(product => product.nsfw)
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

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [products, label] = await Promise.all([
    getProductsByCategory(params.slug),
    resolveCategoryLabel(params.slug)
  ])

  const options = collectCatalogOptions(products)

  return (
    <div>
      <h1 className="text-2xl font-semibold capitalize">{label}</h1>
      <CategoryFiltersClient slug={params.slug} products={products} options={options} />
    </div>
  )
}
