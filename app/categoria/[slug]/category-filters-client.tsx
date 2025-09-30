'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import FilterSheet from '@/components/category/FilterSheet'
import ProductCard from '@/components/ProductCard'
import { CategoryFiltersProvider, type CategoryFilterState } from '@/components/category/filters-context'
import {
  buildCatalogSearchParams,
  collectCatalogOptions,
  filterCatalogProducts,
  normalizeCatalogText,
  parseCatalogSearchParams,
  type CatalogFilterOptions
} from '@/lib/catalog-filters'
import { byCategory, filterProducts, type Filter } from '@/lib/products'
import type { TagType } from '@/lib/tagging'

type FacetConfig = { type: TagType; param: string }

const FACET_CONFIG: readonly FacetConfig[] = [
  { type: 'persona', param: 'tag_persona' },
  { type: 'uso', param: 'tag_uso' },
  { type: 'feature', param: 'tag_feature' },
  { type: 'material', param: 'tag_material' }
]

const FACET_TYPE_SET = new Set<TagType>(FACET_CONFIG.map(({ type }) => type))

function parseFacetSearchParams(params: URLSearchParams): Filter {
  const facets: Filter = {}
  FACET_CONFIG.forEach(({ type, param }) => {
    const values = params.getAll(param).map(value => value.trim()).filter(Boolean)
    if (values.length > 0) {
      facets[type] = Array.from(new Set(values))
    }
  })
  return facets
}

function appendFacetsToSearchParams(params: URLSearchParams, facets: Filter): URLSearchParams {
  const next = new URLSearchParams(params)
  FACET_CONFIG.forEach(({ type, param }) => {
    next.delete(param)
    const values = facets[type]
    if (!values || values.length === 0) return
    const uniqueValues = Array.from(new Set(values)).sort((a, b) => a.localeCompare(b, 'es'))
    uniqueValues.forEach(value => {
      if (value) {
        next.append(param, value)
      }
    })
  })
  return next
}

export default function CategoryFiltersClient() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const products = useMemo(() => byCategory(slug), [slug])
  const options = useMemo(() => collectCatalogOptions(products), [products])
  const facetOptions = useMemo(() => {
    const sets = new Map<TagType, Set<string>>()
    products.forEach(product => {
      (product.tags ?? []).forEach(tag => {
        if (!FACET_TYPE_SET.has(tag.type)) return
        const existing = sets.get(tag.type)
        if (existing) {
          existing.add(tag.value)
        } else {
          sets.set(tag.type, new Set([tag.value]))
        }
      })
    })

    const sortFn = (a: string, b: string) => a.localeCompare(b, 'es')
    const facets: Filter = {}
    FACET_CONFIG.forEach(({ type }) => {
      const values = sets.get(type)
      if (values && values.size > 0) {
        facets[type] = Array.from(values).sort(sortFn)
      }
    })
    return facets
  }, [products])

  const [filters, setFilters] = useState<CategoryFilterState>(() =>
    parseCatalogSearchParams(new URLSearchParams(searchParams))
  )
  const [selectedFacets, setSelectedFacets] = useState<Filter>(() =>
    parseFacetSearchParams(new URLSearchParams(searchParams))
  )
  const facetAnalyticsSignature = useRef<string | null>(null)

  useEffect(() => {
    setFilters(parseCatalogSearchParams(new URLSearchParams(searchParams)))
  }, [searchParams])

  useEffect(() => {
    setSelectedFacets(parseFacetSearchParams(new URLSearchParams(searchParams)))
  }, [searchParams])

  useEffect(() => {
    const params = buildCatalogSearchParams(filters)
    const paramsWithFacets = appendFacetsToSearchParams(params, selectedFacets)
    const next = paramsWithFacets.toString()
    const current = searchParams.toString()
    if (next === current) return
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [filters, pathname, router, searchParams, selectedFacets])

  useEffect(() => {
    if (!slug) return
    const normalizedFacets = FACET_CONFIG.reduce((acc, { type }) => {
      const values = selectedFacets[type]
      if (values && values.length > 0) {
        acc[type] = [...values].sort((a, b) => a.localeCompare(b, 'es'))
      }
      return acc
    }, {} as Filter)
    const signature = JSON.stringify(normalizedFacets)
    if (signature === facetAnalyticsSignature.current) return
    facetAnalyticsSignature.current = signature
    const activeEntries = Object.entries(normalizedFacets)
    if (activeEntries.length === 0) return
    if (typeof window === 'undefined') return
    const gtag = window.gtag
    if (typeof gtag !== 'function') return
    const totalSelected = activeEntries.reduce((total, [, values]) => total + values.length, 0)
    gtag('event', 'filter_applied', {
      category_slug: slug,
      filter_persona: normalizedFacets.persona?.join('|'),
      filter_uso: normalizedFacets.uso?.join('|'),
      filter_feature: normalizedFacets.feature?.join('|'),
      filter_material: normalizedFacets.material?.join('|'),
      filter_total_selected: totalSelected,
      filter_facets: JSON.stringify(normalizedFacets)
    })
  }, [selectedFacets, slug])

  const filteredProducts = useMemo(() => {
    const legacyFiltered = filterCatalogProducts(products, filters)
    return filterProducts(legacyFiltered, selectedFacets)
  }, [filters, products, selectedFacets])

  useEffect(() => {
    if (!slug) return
    if (products.length > 0) {
      console.info(
        `[CategoryFiltersClient] ${products.length} productos disponibles para la categoría o subcategoría "${slug}".`
      )
    } else {
      console.warn(
        `[CategoryFiltersClient] No se encontraron productos para la categoría o subcategoría "${slug}".`
      )
    }
  }, [slug, products.length])

  const toggleValue = useCallback(
    (key: 'brands' | 'materials', value: string) => {
      setFilters((prev) => {
        const current = prev[key]
        const exists = current.includes(value)
        const nextValues = exists ? current.filter((item) => item !== value) : [...current, value]
        return { ...prev, [key]: nextValues }
      })
    },
    []
  )

  const toggleFacetValue = useCallback((type: TagType, value: string) => {
    setSelectedFacets(prev => {
      const current = prev[type] ?? []
      const exists = current.includes(value)
      if (exists) {
        const nextValues = current.filter(item => item !== value)
        if (nextValues.length > 0) {
          return { ...prev, [type]: nextValues }
        }
        const { [type]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [type]: [...current, value] }
    })
  }, [])

  const setDimension = useCallback((key: 'longitud' | 'diametro', value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ query: '', brands: [], materials: [], longitud: null, diametro: null })
    setSelectedFacets({})
  }, [])

  const onQueryChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, query: value }))
  }, [])

  const contextValue = useMemo(
    () => ({
      filters,
      isBrandSelected: (brand?: string | null) => {
        if (!brand) return false
        return filters.brands.some((value) => normalizeCatalogText(value) === normalizeCatalogText(brand))
      },
      isMaterialSelected: (material?: string | null) => {
        if (!material) return false
        return filters.materials.some(
          (value) => normalizeCatalogText(value) === normalizeCatalogText(material)
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
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar en la categoría"
              aria-label="Buscar"
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm shadow-sm focus:border-brand-pink focus:outline-none focus:ring-2 focus:ring-brand-pink/40"
            />
            <div className="relative">
              <button
                type="button"
                aria-expanded={isSheetOpen}
                aria-haspopup="dialog"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-brand-pink/60 hover:text-brand-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink sm:w-auto"
                onClick={() => setIsSheetOpen((prev) => !prev)}
              >
                Filtros
              </button>
              <FilterSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                filters={filters}
                options={options}
                onToggleBrand={(value) => toggleValue('brands', value)}
                onToggleMaterial={(value) => toggleValue('materials', value)}
                onSelectLongitud={(value) => setDimension('longitud', value)}
                onSelectDiametro={(value) => setDimension('diametro', value)}
                onReset={resetFilters}
                facetOptions={facetOptions}
                selectedFacets={selectedFacets}
                onToggleFacet={toggleFacetValue}
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
              {filteredProducts.map((product) => (
                <ProductCard key={product.slug} p={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </CategoryFiltersProvider>
  )
}
