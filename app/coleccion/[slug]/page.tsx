import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import CollectionFiltersClient from './collection-filters-client'
import {
  collectCatalogOptions,
  filterCatalogProducts,
  parseCatalogSearchParams,
  type CatalogFilters
} from '@/lib/catalog-filters'
import {
  getCollectionBySlug,
  getCollections,
  getProductsForCollection
} from '@/lib/collections.server'

export const runtime = 'nodejs'

function toURLSearchParams(searchParams: Record<string, string | string[] | undefined>): URLSearchParams {
  const params = new URLSearchParams()
  Object.entries(searchParams).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(entry => {
        if (entry !== undefined) params.append(key, entry)
      })
      return
    }
    if (value !== undefined) params.append(key, value)
  })
  return params
}

export function generateStaticParams() {
  return getCollections().map(collection => ({ slug: collection.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug)
  if (!collection) return {}

  const title = collection.seo?.title ?? `${collection.name} — SexShop del Perú 69`
  const description = collection.seo?.description ?? collection.description ?? undefined
  const canonical = `/coleccion/${collection.slug}`

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: 'SexShop del Perú 69'
    }
  }
}

export default async function CollectionPage({
  params,
  searchParams
}: {
  params: { slug: string }
  searchParams: Record<string, string | string[] | undefined>
}) {
  const collection = getCollectionBySlug(params.slug)
  if (!collection) return notFound()

  const urlSearchParams = toURLSearchParams(searchParams)
  const initialFilters: CatalogFilters = parseCatalogSearchParams(urlSearchParams)
  const allMatchingProducts = await getProductsForCollection(collection)
  const filteredProducts = filterCatalogProducts(allMatchingProducts, initialFilters)
  const options = collectCatalogOptions(allMatchingProducts)

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-neutral-900">{collection.name}</h1>
        {collection.headline && <p className="text-sm font-medium text-brand-pink">{collection.headline}</p>}
        {collection.description && <p className="max-w-2xl text-sm text-neutral-600">{collection.description}</p>}
        <p className="text-xs text-neutral-500">{filteredProducts.length} productos disponibles</p>
      </div>
      <CollectionFiltersClient
        slug={collection.slug}
        products={allMatchingProducts}
        options={options}
        initialFilters={initialFilters}
      />
    </div>
  )
}
