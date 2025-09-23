import sanitizeHtml from 'sanitize-html'

import productsData from '@/data/products.json'
import categoriesData from '@/data/categories.json'

export type Specs = Record<string, string | number | boolean>
export type ProductAttributeValue = string | number | boolean | null
export type ProductAttributes = Record<string, ProductAttributeValue>

const PRODUCT_DESCRIPTION_ALLOWED_TAGS = [
  'a',
  'abbr',
  'b',
  'blockquote',
  'br',
  'code',
  'em',
  'i',
  'li',
  'ol',
  'p',
  'strong',
  'sub',
  'sup',
  'ul'
] as const

const PRODUCT_DESCRIPTION_ALLOWED_ATTRIBUTES: Readonly<Record<string, readonly string[]>> = {
  a: ['href', 'rel', 'target', 'title']
}

const PRODUCT_DESCRIPTION_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: PRODUCT_DESCRIPTION_ALLOWED_TAGS as unknown as string[],
  allowedAttributes: PRODUCT_DESCRIPTION_ALLOWED_ATTRIBUTES as sanitizeHtml.IOptions['allowedAttributes'],
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesAppliedToAttributes: ['href'],
  disallowedTagsMode: 'discard',
  allowProtocolRelative: false
}

/**
 * Sanitizes HTML snippets coming from the product catalog before rendering.
 *
 * Allowed tags: a, abbr, b, blockquote, br, code, em, i, li, ol, p, strong, sub, sup, ul.
 * Allowed attributes: a[href|rel|target|title]. Links are limited to http, https, mailto and tel schemes.
 *
 * Any inline style/class/color attributes or event handlers are removed by the sanitizer.
 */
export function sanitizeDescriptionHtml(rawHtml: string | null | undefined): string | null {
  if (!rawHtml) return null
  const sanitized = sanitizeHtml(rawHtml, PRODUCT_DESCRIPTION_SANITIZE_OPTIONS).trim()
  return sanitized.length > 0 ? sanitized : null
}

export { PRODUCT_DESCRIPTION_ALLOWED_TAGS, PRODUCT_DESCRIPTION_ALLOWED_ATTRIBUTES }

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

export const SUPPORTED_IMAGE_EXTENSIONS = ['avif', 'webp', 'jpg', 'jpeg', 'png'] as const

export type ImageExtension = (typeof SUPPORTED_IMAGE_EXTENSIONS)[number]

export const DEFAULT_IMAGE_EXTENSIONS = ['webp'] as const satisfies readonly ImageExtension[]

export type ProductBadge = 'nuevo' | 'top' | 'promo'

type RawProduct = (typeof productsData)[number] & {
  attributes?: Record<string, ProductAttributeValue | undefined>
  imageSet?: ReadonlyArray<string | null | undefined>
  imageFilenames?: ReadonlyArray<string | null | undefined>
  features?: string[]
  using?: string[]
  care?: string[]
  specs?: Specs
  related?: string[]
  tags?: string[]
  badge?: string | null
  bestSeller?: boolean
  nsfw?: boolean
  rating?: number | null
  reviewCount?: number | null
  stockStatus?: string | null
  modifiedAt?: string | null
  descriptionHtml?: string | null
  descriptionText?: string | null
  shortDescription?: string | null
  subCategory?: string | null
  embeddingText?: string | null
  salePrice?: number | null
  regularPrice: number
  sku?: string | null
}
type RawCategory = (typeof categoriesData)[number]

export type Product = {
  id: number
  slug: string
  name: string
  descriptionHtml?: string | null
  descriptionText?: string | null
  shortDescription?: string | null
  regularPrice: number
  salePrice?: number | null
  sku: string
  category: string
  subCategory?: string | null
  tags: string[]
  nsfw?: boolean
  bestSeller?: boolean
  badge?: ProductBadge | string | null
  rating?: number
  reviewCount?: number
  stockStatus?: string | null
  modifiedAt?: string | null
  features?: string[]
  using?: string[]
  care?: string[]
  specs?: Specs
  related?: string[]
  embeddingText?: string
  attributes: ProductAttributes
  imageFilenames: string[]
  imageSet?: ImageExtension[]
  imageCount: number
  imageBasenames: string[]
  primaryImageFilename: string | null
  primaryImageBasename: string | null
  brand?: string | null
}

function normalizeImageSet(imageSet?: ReadonlyArray<string | null | undefined>): ImageExtension[] | undefined {
  if (!imageSet || imageSet.length === 0) return undefined
  const validExtensions = imageSet
    .map(extension => (extension ?? '').toLowerCase())
    .filter((extension): extension is ImageExtension =>
      SUPPORTED_IMAGE_EXTENSIONS.includes(extension as ImageExtension)
    )
  const uniqueExtensions = Array.from(new Set(validExtensions))
  return uniqueExtensions.length > 0 ? uniqueExtensions : undefined
}

function inferImageSetFromFilenames(filenames: string[]): ImageExtension[] | undefined {
  const extensions = filenames
    .map(filename => filename.split('.').pop()?.toLowerCase())
    .filter((extension): extension is ImageExtension =>
      Boolean(extension) && SUPPORTED_IMAGE_EXTENSIONS.includes(extension as ImageExtension)
    )
  const unique = Array.from(new Set(extensions))
  return unique.length > 0 ? unique : undefined
}

export function resolveAssetFolder(_product?: Pick<Product, 'nsfw'> | { nsfw?: boolean }): 'products' {
  return 'products'
}

function normalizeAttributes(attributes?: RawProduct['attributes']): ProductAttributes {
  const normalized: ProductAttributes = { ...DEFAULT_ATTRIBUTES }
  if (!attributes) return normalized

  Object.entries(attributes).forEach(([key, value]) => {
    normalized[key] = (value ?? null) as ProductAttributeValue
  })

  return normalized
}

function normalizeImageFilenames(filenames?: RawProduct['imageFilenames']): string[] {
  if (!filenames || filenames.length === 0) return []
  return Array.from(new Set(filenames.filter((filename): filename is string => Boolean(filename))))
}

function getImageBasename(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename
}

const catalog: Product[] = (productsData as RawProduct[]).map(product => {
  const imageFilenames = normalizeImageFilenames(product.imageFilenames)
  const imageBasenames = imageFilenames.map(getImageBasename)
  const imageSet = normalizeImageSet(product.imageSet) ?? inferImageSetFromFilenames(imageFilenames)
  const attributes = normalizeAttributes(product.attributes)
  const brandValue = attributes.brand
  const brand = typeof brandValue === 'string' && brandValue.trim().length > 0 ? brandValue : null
  const descriptionHtml = sanitizeDescriptionHtml(product.descriptionHtml)

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    descriptionHtml,
    descriptionText: product.descriptionText ?? null,
    shortDescription: product.shortDescription ?? null,
    regularPrice: product.regularPrice,
    salePrice: product.salePrice ?? null,
    sku: product.sku ?? product.slug,
    category: product.category,
    subCategory: product.subCategory ?? null,
    tags: product.tags ?? [],
    nsfw: product.nsfw ?? false,
    bestSeller: product.bestSeller ?? false,
    badge: product.badge ?? null,
    rating: product.rating ?? 0,
    reviewCount: product.reviewCount ?? 0,
    stockStatus: product.stockStatus ?? null,
    modifiedAt: product.modifiedAt ?? null,
    features: product.features ?? [],
    using: product.using ?? [],
    care: product.care ?? [],
    specs: product.specs ?? undefined,
    related: product.related ?? [],
    embeddingText: product.embeddingText ?? undefined,
    attributes,
    imageFilenames,
    imageSet,
    imageCount: imageBasenames.length,
    imageBasenames,
    primaryImageFilename: imageFilenames[0] ?? null,
    primaryImageBasename: imageBasenames[0] ?? null,
    brand
  }
})

const categorySlugLookup = new Map<string, Set<string>>()
const categoryLabelLookup = new Map<string, string>()

function registerCategory(category: RawCategory) {
  const categoryLabel = category.label ?? category.slug
  categoryLabelLookup.set(category.slug, categoryLabel)

  const children = category.children ?? []
  const childSlugs = children.map(child => child.slug)
  const parentSet = new Set<string>([category.slug, ...childSlugs])
  categorySlugLookup.set(category.slug, parentSet)

  children.forEach(child => {
    categoryLabelLookup.set(child.slug, child.label ?? child.slug)
    categorySlugLookup.set(child.slug, new Set<string>([child.slug, category.slug]))
  })
}

categoriesData.forEach(registerCategory)

export function formatAttributeLabel(key: string): string {
  if (ATTRIBUTE_LABELS[key]) return ATTRIBUTE_LABELS[key]
  const withSpaces = key.replace(/_/g, ' ')
  return withSpaces.replace(/\b\w/g, char => char.toUpperCase())
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
    synonyms.forEach(synonym => normalizedKeys.add(synonym.toLowerCase()))
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
  const normalizedSlug = slug.trim()
  const relatedSlugs = categorySlugLookup.get(normalizedSlug) ?? null
  return catalog.filter(product => {
    if (product.category === normalizedSlug) return true
    if (product.subCategory === normalizedSlug) return true
    if (!relatedSlugs) return false
    if (relatedSlugs.has(product.category)) return true
    if (product.subCategory && relatedSlugs.has(product.subCategory)) return true
    return false
  })
}

export function bySlug(slug: string): Product | undefined {
  return catalog.find(product => product.slug === slug)
}

export function getCategoryLabel(slug: string): string | undefined {
  return categoryLabelLookup.get(slug.trim())
}

export function getOffers(): Product[] {
  return catalog.filter(product => {
    const salePrice = product.salePrice
    return salePrice !== null && salePrice !== undefined && salePrice < product.regularPrice
  })
}

export function daysAgo(days: number): Date {
  const now = new Date()
  const reference = new Date(now)
  reference.setHours(0, 0, 0, 0)
  reference.setDate(reference.getDate() - Math.max(days, 0))
  return reference
}

export function getNewArrivals(withinDays = 30): Product[] {
  const threshold = daysAgo(withinDays).getTime()
  return catalog.filter(product => {
    if (!product.modifiedAt) return false
    const modifiedTime = new Date(product.modifiedAt).getTime()
    return !Number.isNaN(modifiedTime) && modifiedTime >= threshold
  })
}

export function getBestSellers(): Product[] {
  return catalog.filter(product => Boolean(product.bestSeller))
}
