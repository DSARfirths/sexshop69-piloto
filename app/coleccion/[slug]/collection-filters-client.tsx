'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import FilterSheet from '@/components/category/FilterSheet'
import ProductCard from '@/components/ProductCard'
import { CategoryFiltersProvider, type CategoryFilterState } from '@/components/category/filters-context'
import {
  buildCatalogSearchParams,
  filterCatalogProducts,
  normalizeCatalogText,
  parseCatalogSearchParams,
  type CatalogFilterOptions
} from '@/lib/catalog-filters'
import type { Product } from '@/lib/products'

type CollectionFiltersClientProps = {
  slug: string
  products: Product[]
  options: CatalogFilterOptions
  initialFilters: CategoryFilterState
}

export default function CollectionFiltersClient({
  slug,
  products,
  options,
  initialFilters
}: CollectionFiltersClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [filters, setFilters] = useState<CategoryFilterState>(initialFilters)

  useEffect(() => {
    setFilters(parseCatalogSearchParams(new URLSearchParams(searchParams)))
  }, [searchParams])

  useEffect(() => {
    const params = buildCatalogSearchParams(filters)
    const next = params.toString()
    const current = searchParams.toString()
    if (next === current) return
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [filters, pathname, router, searchParams])

  const filteredProducts = useMemo(() => filterCatalogProducts(products, filters), [products, filters])

  useEffect(() => {
    if (!slug) return
    if (products.length > 0) {
      console.info(
        `[CollectionFiltersClient] ${products.length} productos disponibles para la colección "${slug}".`
      )
    } else {
      console.warn(`[CollectionFiltersClient] No se encontraron productos para la colección "${slug}".`)
    }
  }, [slug, products.length])

  const toggleValue = useCallback(
    (key: 'brands' | 'materials', value: string) => {
      setFilters(prev => {
        const current = prev[key]
        const exists = current.includes(value)
        const nextValues = exists ? current.filter(item => item !== value) : [...current, value]
        return { ...prev, [key]: nextValues }
      })
    },
    []
  )

  const setDimension = useCallback((key: 'longitud' | 'diametro', value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ query: '', brands: [], materials: [], longitud: null, diametro: null })
  }, [])

  const onQueryChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, query: value }))
  }, [])

  const contextValue = useMemo(
    () => ({
      filters,
      isBrandSelected: (brand?: string | null) => {
        if (!brand) return false
        return filters.brands.some(value => normalizeCatalogText(value) === normalizeCatalogText(brand))
      },
      isMaterialSelected: (material?: string | null) => {
        if (!material) return false
        return filters.materials.some(
          value => normalizeCatalogText(value) === normalizeCatalogText(material)
        )
      }
    }),
    [filters]
  )

  return (
    <CategoryFiltersProvider value={contextValue}>
      <div className="mt-6 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <input
              value={filters.query}
              onChange={event => onQueryChange(event.target.value)}
              placeholder="Buscar en la colección"
              aria-label="Buscar"
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
            <div className="relative">
              <button
                type="button"
                aria-expanded={isSheetOpen}
                aria-haspopup="dialog"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-brand-primary/60 hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary sm:w-auto"
                onClick={() => setIsSheetOpen(prev => !prev)}
              >
                Filtros
              </button>
              <FilterSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                filters={filters}
                options={options}
                onToggleBrand={value => toggleValue('brands', value)}
                onToggleMaterial={value => toggleValue('materials', value)}
                onSelectLongitud={value => setDimension('longitud', value)}
                onSelectDiametro={value => setDimension('diametro', value)}
                onReset={resetFilters}
              />
            </div>
          </div>
          <p className="text-sm text-neutral-500">{filteredProducts.length} productos</p>
        </div>
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
              No se encontraron productos con los filtros seleccionados.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.slug} p={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </CategoryFiltersProvider>
  )
}
