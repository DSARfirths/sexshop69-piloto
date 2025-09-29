import type { Product, ProductAttributeValue } from './products'

export type CatalogFilters = {
  query: string
  brands: string[]
  materials: string[]
  longitud: string | null
  diametro: string | null
}

export type CatalogFilterOptions = {
  brands: string[]
  materials: string[]
  longitudes: string[]
  diametros: string[]
}

function isMeaningfulAttribute(value: ProductAttributeValue): value is string {
  if (value === null || value === undefined) return false
  if (typeof value === 'boolean') return true
  if (typeof value === 'number') return true
  if (typeof value !== 'string') return false
  const normalized = value.trim()
  if (!normalized) return false
  return !normalized.toLowerCase().includes('valor por defecto')
}

export function normalizeCatalogText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

export function parseCatalogSearchParams(searchParams: URLSearchParams): CatalogFilters {
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

export function buildCatalogSearchParams(filters: CatalogFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.query) params.set('q', filters.query)
  filters.brands.forEach(brand => {
    if (brand) params.append('brand', brand)
  })
  filters.materials.forEach(material => {
    if (material) params.append('material', material)
  })
  if (filters.longitud) params.set('longitud', filters.longitud)
  if (filters.diametro) params.set('diametro', filters.diametro)
  return params
}

export function filterCatalogProducts(products: Product[], filters: CatalogFilters): Product[] {
  const normalizedQuery = normalizeCatalogText(filters.query).trim()

  return products.filter(product => {
    if (normalizedQuery) {
      const haystack = [
        product.name,
        product.brand,
        ...Object.values(product.attributes ?? {})
      ]
        .filter((value): value is string => typeof value === 'string')
        .map(value => normalizeCatalogText(value))
        .join(' ')
      if (!haystack.includes(normalizedQuery)) return false
    }

    if (filters.brands.length) {
      const brand = product.brand
      if (!brand) return false
      if (!filters.brands.some(value => normalizeCatalogText(value) === normalizeCatalogText(brand))) {
        return false
      }
    }

    if (filters.materials.length) {
      const material = product.attributes?.material
      if (!material || typeof material !== 'string') return false
      if (!filters.materials.some(value => normalizeCatalogText(value) === normalizeCatalogText(material))) {
        return false
      }
    }

    if (filters.longitud) {
      const longitud = product.attributes?.longitud
      if (!longitud || typeof longitud !== 'string') return false
      if (normalizeCatalogText(longitud) !== normalizeCatalogText(filters.longitud)) return false
    }

    if (filters.diametro) {
      const diametro = product.attributes?.diametro
      if (!diametro || typeof diametro !== 'string') return false
      if (normalizeCatalogText(diametro) !== normalizeCatalogText(filters.diametro)) return false
    }

    return true
  })
}

export function collectCatalogOptions(products: Product[]): CatalogFilterOptions {
  const brandSet = new Set<string>()
  const materialSet = new Set<string>()
  const longitudSet = new Set<string>()
  const diametroSet = new Set<string>()

  products.forEach(product => {
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
