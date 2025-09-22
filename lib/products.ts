import products from '@/data/products.json'

export type Specs = Record<string, string | number | boolean>
export type ProductAttributeValue = string | number | boolean | null
export type ProductAttributes = {
  material: ProductAttributeValue
  longitud: ProductAttributeValue
  diametro: ProductAttributeValue
  vibracion: ProductAttributeValue
  waterproof: ProductAttributeValue
  peso: ProductAttributeValue
  garantia: ProductAttributeValue
  [key: string]: ProductAttributeValue
}

const DEFAULT_ATTRIBUTES: ProductAttributes = {
  material: 'No especificado (valor por defecto)',
  longitud: 'No especificada (valor por defecto)',
  diametro: 'No especificado (valor por defecto)',
  vibracion: 'No informado (valor por defecto)',
  waterproof: 'No informado (valor por defecto)',
  peso: 'No especificado (valor por defecto)',
  garantia: 'Garantía limitada de 1 año por defecto de fabricación (valor por defecto)'
}

export const ATTRIBUTE_LABELS: Record<string, string> = {
  material: 'Material',
  longitud: 'Longitud',
  diametro: 'Diámetro',
  vibracion: 'Vibración',
  waterproof: 'Resistencia al agua',
  peso: 'Peso',
  garantia: 'Garantía'
}

export const ATTRIBUTE_EQUIVALENTS: Record<string, string[]> = {
  material: ['material'],
  longitud: ['longitud', 'longitud_total'],
  diametro: ['diametro', 'diámetro'],
  vibracion: ['vibracion', 'vibración'],
  waterproof: ['waterproof', 'resistente_al_agua'],
  peso: ['peso'],
  garantia: ['garantia', 'garantía']
}

export type Product = {
  slug: string
  name: string
  price: number
  sku: string
  category: string
  nsfw?: boolean
  images?: number
  assetFolder?: 'nsfw-assets' | 'sfw-assets'
  brand?: string
  badge?: 'nuevo' | 'top' | 'promo'
  bestSeller?: boolean
  features?: string[]
  using?: string[]
  care?: string[]
  specs?: Specs
  related?: string[]
  attributes: ProductAttributes
}

type RawProduct = Omit<Product, 'attributes'> & { attributes?: Partial<ProductAttributes> }

const rawProducts = products as RawProduct[]

export const SUPPORTED_IMAGE_EXTENSIONS = ['webp', 'jpg', 'jpeg', 'png', 'avif'] as const

export function resolveAssetFolder(product: Pick<Product, 'assetFolder' | 'nsfw'>): 'nsfw-assets' | 'sfw-assets' {
  if (product.assetFolder) return product.assetFolder
  return product.nsfw ? 'nsfw-assets' : 'sfw-assets'
}

function normalizeAttributes(attributes?: Partial<ProductAttributes>): ProductAttributes {
  const normalized: ProductAttributes = { ...DEFAULT_ATTRIBUTES }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      if (value !== undefined) {
        normalized[key] = value as ProductAttributeValue
      }
    })
  }
  return normalized
}

const catalog: Product[] = rawProducts.map((product) => ({
  ...product,
  assetFolder: resolveAssetFolder(product),
  attributes: normalizeAttributes(product.attributes)
}))

export function formatAttributeLabel(key: string): string {
  if (ATTRIBUTE_LABELS[key]) return ATTRIBUTE_LABELS[key]
  const withSpaces = key.replace(/_/g, ' ')
  return withSpaces.replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatAttributeValue(value: ProductAttributeValue | string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return 'No disponible'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  return String(value)
}

export function getProductProperties(attributes?: ProductAttributes, specs?: Specs): Array<[string, ProductAttributeValue]> {
  const attributeEntries = attributes ? Object.entries(attributes) : []
  const normalizedKeys = new Set<string>()
  attributeEntries.forEach(([key]) => {
    const normalizedKey = key.toLowerCase()
    normalizedKeys.add(normalizedKey)
    const synonyms = ATTRIBUTE_EQUIVALENTS[key] ?? []
    synonyms.forEach((synonym) => normalizedKeys.add(synonym.toLowerCase()))
  })
  const specEntries: Array<[string, ProductAttributeValue]> = specs
    ? (Object.entries(specs) as [string, ProductAttributeValue][]).filter(([key]) => !normalizedKeys.has(key.toLowerCase()))
    : []
  return [...attributeEntries, ...specEntries]
}

export function allProducts(): Product[] {
  return catalog
}

export function byCategory(slug: string): Product[] {
  return catalog.filter((product) => product.category === slug)
}

export function bySlug(slug: string): Product | undefined {
  return catalog.find((product) => product.slug === slug)
}
