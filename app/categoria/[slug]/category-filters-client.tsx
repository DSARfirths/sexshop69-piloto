'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import FilterSheet from '@/components/category/FilterSheet'
import ProductCard from '@/components/ProductCard'
import { CategoryFiltersProvider, type CategoryFilterState } from '@/components/category/filters-context'
import { byCategory, type Product, type ProductAttributeValue } from '@/lib/products'

function isMeaningfulAttribute(value: ProductAttributeValue): value is string {
  if (value === null || value === undefined) return false
  if (typeof value === 'boolean') return true
  if (typeof value === 'number') return true
  const normalized = value.trim()
  if (!normalized) return false
  return !normalized.toLowerCase().includes('valor por defecto')
}

function normalizeText(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

type CategoryFilterOptions = {
  brands: string[]
  materials: string[]
  longitudes: string[]
  diametros: string[]
}

type CategoryFilters = CategoryFilterState

function parseSearchParams(searchParams: URLSearchParams): CategoryFilters {
  const query = searchParams.get('q') ?? ''
  const brands = searchParams.getAll('brand')
  const materials = searchParams.getAll('material')
  const longitud = searchParams.get('longitud')
  const diametro = searchParams.get('diametro')
  return {
    query,
    brands,
    materials,
    longitud: longitud ?? null,
    diametro: diametro ?? null
  }
}

function buildSearchParams(filters: CategoryFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  filters.brands.forEach((brand) => {
    if (brand) params.append('brand', brand)
  })
  filters.materials.forEach((material) => {
    if (material) params.append('material', material)
  })
  if (filters.longitud) params.set('longitud', filters.longitud)
  if (filters.diametro) params.set('diametro', filters.diametro)
  return params
}

function filterProducts(products: Product[], filters: CategoryFilters): Product[] {
  const normalizedQuery = normalizeText(filters.query).trim()

  return products.filter((product) => {
    if (normalizedQuery) {
      const haystack = [
        product.name,
        product.brand,
        ...Object.values(product.attributes ?? {})
      ]
        .filter((value): value is string => typeof value === 'string')
        .map((value) => normalizeText(value))
        .join(' ')
      if (!haystack.includes(normalizedQuery)) return false
    }

    if (filters.brands.length) {
      const brand = product.brand
      if (!brand) return false
      if (!filters.brands.some((value) => normalizeText(value) === normalizeText(brand))) {
        return false
      }
    }

    if (filters.materials.length) {
      const material = product.attributes?.material
      if (!material || typeof material !== 'string') return false
      if (!filters.materials.some((value) => normalizeText(value) === normalizeText(material))) {
        return false
      }
    }

    if (filters.longitud) {
      const longitud = product.attributes?.longitud
      if (!longitud || typeof longitud !== 'string') return false
      if (normalizeText(longitud) !== normalizeText(filters.longitud)) return false
    }

    if (filters.diametro) {
      const diametro = product.attributes?.diametro
      if (!diametro || typeof diametro !== 'string') return false
      if (normalizeText(diametro) !== normalizeText(filters.diametro)) return false
    }

    return true
  })
}

function collectOptions(products: Product[]): CategoryFilterOptions {
  const brandSet = new Set<string>()
  const materialSet = new Set<string>()
  const longitudSet = new Set<string>()
  const diametroSet = new Set<string>()

  products.forEach((product) => {
    if (product.brand) brandSet.add(product.brand)

    const { material, longitud, diametro } = product.attributes ?? {}
    if (isMeaningfulAttribute(material) && typeof material === 'string') materialSet.add(material)
    if (isMeaningfulAttribute(longitud) && typeof longitud === 'string') longitudSet.add(longitud)
    if (isMeaningfulAttribute(diametro) && typeof diametro === 'string') diametroSet.add(diametro)
  })

  const sortFn = (a: string, b: string) => a.localeCompare(b, 'es')

  return {
    brands: Array.from(brandSet).sort(sortFn),
    materials: Array.from(materialSet).sort(sortFn),
    longitudes: Array.from(longitudSet).sort(sortFn),
    diametros: Array.from(diametroSet).sort(sortFn)
  }
}

export default function CategoryFiltersClient() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const products = useMemo(() => byCategory(slug), [slug])
  const options = useMemo(() => collectOptions(products), [products])

  const [filters, setFilters] = useState<CategoryFilters>(() => parseSearchParams(new URLSearchParams(searchParams)))

  useEffect(() => {
    setFilters(parseSearchParams(new URLSearchParams(searchParams)))
  }, [searchParams])

  useEffect(() => {
    const params = buildSearchParams(filters)
    const next = params.toString()
    const current = searchParams.toString()
    if (next === current) return
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false })
  }, [filters, pathname, router, searchParams])

  const filteredProducts = useMemo(() => filterProducts(products, filters), [products, filters])

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

  const setDimension = useCallback((key: 'longitud' | 'diametro', value: string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({ query: '', brands: [], materials: [], longitud: null, diametro: null })
  }, [])

  const onQueryChange = useCallback((value: string) => {
    setFilters((prev) => ({ ...prev, query: value }))
  }, [])

  const contextValue = useMemo(
    () => ({
      filters,
      isBrandSelected: (brand?: string | null) => {
        if (!brand) return false
        return filters.brands.some((value) => normalizeText(value) === normalizeText(brand))
      },
      isMaterialSelected: (material?: string | null) => {
        if (!material) return false
        return filters.materials.some((value) => normalizeText(value) === normalizeText(material))
      }
    }),
    [filters]
  )

  return (
    <CategoryFiltersProvider value={contextValue}>
      <div className="mt-6 space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <input
              value={filters.query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar en la categoría"
              aria-label="Buscar"
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 text-sm shadow-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/40"
            />
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-brand-primary/60 hover:text-brand-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary md:hidden"
              onClick={() => setIsSheetOpen(true)}
            >
              Filtros
            </button>
          </div>
          <p className="text-sm text-neutral-500">{filteredProducts.length} productos</p>
        </div>
        <div className="grid gap-6 md:grid-cols-[280px,1fr] md:items-start">
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
          />
          <div className="space-y-4">
            {filteredProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
                No se encontraron productos con los filtros seleccionados.
              </div>
            ) : (
              {/* 2 productos por fila en móviles, 3 en tablet, 5 en escritorio mediano y 6 en escritorio grande */}
              <div className="grid gap-y-6 gap-x-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.slug} p={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </CategoryFiltersProvider>
  )
}
