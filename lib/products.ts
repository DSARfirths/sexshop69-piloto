import sanitizeHtml from 'sanitize-html'

import { enrichTags, parseTagStrings, type Tag, type TagType } from './tagging'

export type { Tag } from './tagging'

export type Specs = Record<string, string | number | boolean>
export type ProductAttributeValue = string | number | boolean | null
export type ProductAttributes = Record<string, ProductAttributeValue>

export const PRODUCT_DESCRIPTION_ALLOWED_TAGS = [
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

export const PRODUCT_DESCRIPTION_ALLOWED_ATTRIBUTES: Readonly<
  Record<string, readonly string[]>
> = {
  a: ['href', 'rel', 'target', 'title']
}

const PRODUCT_DESCRIPTION_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: PRODUCT_DESCRIPTION_ALLOWED_TAGS as unknown as string[],
  allowedAttributes:
    PRODUCT_DESCRIPTION_ALLOWED_ATTRIBUTES as sanitizeHtml.IOptions['allowedAttributes'],
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowedSchemesAppliedToAttributes: ['href'],
  disallowedTagsMode: 'discard',
  allowProtocolRelative: false
}

export function sanitizeDescriptionHtml(rawHtml: string | null | undefined): string | null {
  if (!rawHtml) return null
  const sanitized = sanitizeHtml(rawHtml, PRODUCT_DESCRIPTION_SANITIZE_OPTIONS).trim()
  return sanitized.length > 0 ? sanitized : null
}

export const DEFAULT_ATTRIBUTES: ProductAttributes = {
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

export type Product = {
  id: number
  slug: string
  name: string
  descriptionHtml: string | null
  descriptionText: string | null
  shortDescription: string | null
  regularPrice: number
  salePrice: number | null
  stockStatus: string | null
  sku: string | null
  brand: string | null
  category: string
  categoryLabel: string
  subCategory: string | null
  subCategoryLabel: string | null
  attributes: ProductAttributes
  specs: Specs | null
  features?: string[] | null
  using?: string[] | null
  care?: string[] | null
  related?: string[] | null
  tags: Tag[]
  badge: ProductBadge | null
  bestSeller: boolean
  nsfw: boolean
  rating: number | null
  reviewCount: number | null
  imageFilenames: string[]
  imageBasenames: string[]
  imageSet: ImageExtension[] | null
  primaryImageFilename: string | null
  imageCount: number
  embeddingText: string | null
  createdAt: string
  updatedAt: string
}

export function formatAttributeLabel(key: string): string {
  if (ATTRIBUTE_LABELS[key]) return ATTRIBUTE_LABELS[key]
  const withSpaces = key.replace(/_/g, ' ')
  return withSpaces.replace(/\b\w/g, char => char.toUpperCase())
}

export function formatAttributeValue(
  value: ProductAttributeValue | string | number | boolean | null | undefined
): string {
  if (value === null || value === undefined) return 'No disponible'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  return String(value)
}

export function getProductProperties(
  attributes?: ProductAttributes,
  specs?: Specs | null
): Array<[string, ProductAttributeValue]> {
  const attributeEntries = attributes ? Object.entries(attributes) : []
  const normalizedKeys = new Set<string>()
  attributeEntries.forEach(([key]) => {
    const normalizedKey = key.toLowerCase()
    normalizedKeys.add(normalizedKey)
    const synonyms = ATTRIBUTE_EQUIVALENTS[key] ?? []
    synonyms.forEach(synonym => normalizedKeys.add(synonym.toLowerCase()))
  })

  const specEntries: Array<[string, ProductAttributeValue]> = specs
    ? (Object.entries(specs) as [string, ProductAttributeValue][])
        .filter(([key]) => !normalizedKeys.has(key.toLowerCase()))
    : []

  return [...attributeEntries, ...specEntries]
}

export function normalizeAttributes(
  attributes?: Record<string, ProductAttributeValue | undefined> | null
): ProductAttributes {
  const normalized: ProductAttributes = { ...DEFAULT_ATTRIBUTES }
  if (!attributes) return normalized

  Object.entries(attributes).forEach(([key, value]) => {
    normalized[key] = (value ?? null) as ProductAttributeValue
  })

  return normalized
}

export function normalizeImageFilenames(
  filenames?: readonly (string | null | undefined)[] | null
): string[] {
  if (!filenames || filenames.length === 0) return []
  return Array.from(new Set(filenames.filter((filename): filename is string => Boolean(filename))))
}

export function getImageBasename(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.')
  return lastDotIndex > 0 ? filename.slice(0, lastDotIndex) : filename
}

export function normalizeImageSet(
  imageSet?: ReadonlyArray<string | null | undefined>
): ImageExtension[] | undefined {
  if (!imageSet || imageSet.length === 0) return undefined
  const validExtensions = imageSet
    .map(extension => (extension ?? '').toLowerCase())
    .filter((extension): extension is ImageExtension =>
      SUPPORTED_IMAGE_EXTENSIONS.includes(extension as ImageExtension)
    )
  const uniqueExtensions = Array.from(new Set(validExtensions))
  return uniqueExtensions.length > 0 ? uniqueExtensions : undefined
}

export function inferImageSetFromFilenames(filenames: string[]): ImageExtension[] | undefined {
  const extensions = filenames
    .map(filename => filename.split('.').pop()?.toLowerCase())
    .filter((extension): extension is ImageExtension =>
      Boolean(extension) && SUPPORTED_IMAGE_EXTENSIONS.includes(extension as ImageExtension)
    )
  const unique = Array.from(new Set(extensions))
  return unique.length > 0 ? unique : undefined
}

export function buildTags(input: {
  category: string
  subCategory?: string | null
  name: string
  shortDescription?: string | null
  descriptionHtml?: string | null
  descriptionText?: string | null
  tags?: ReadonlyArray<string | null | undefined> | Tag[]
}): Tag[] {
  if (!input.tags || input.tags.length === 0 || typeof input.tags[0] === 'string') {
    const manualTags = parseTagStrings(input.tags as ReadonlyArray<string | null | undefined> | undefined)
    return enrichTags({
      category: input.category,
      subCategory: input.subCategory ?? null,
      name: input.name,
      shortDescription: input.shortDescription ?? null,
      descriptionHtml: input.descriptionHtml ?? null,
      descriptionText: input.descriptionText ?? null,
      tags: manualTags
    })
  }

  return enrichTags({
    category: input.category,
    subCategory: input.subCategory ?? null,
    name: input.name,
    shortDescription: input.shortDescription ?? null,
    descriptionHtml: input.descriptionHtml ?? null,
    descriptionText: input.descriptionText ?? null,
    tags: input.tags as Tag[]
  })
}

export type Filter = Partial<Record<TagType, readonly string[]>>

export function hasAny<T>(
  source: readonly T[] | null | undefined,
  candidates: readonly T[] | null | undefined
): boolean {
  if (!source || source.length === 0) return false
  if (!candidates || candidates.length === 0) return false
  const candidateSet = new Set(candidates)
  return source.some(value => candidateSet.has(value))
}

export function filterProducts(products: readonly Product[], filters: Filter): Product[] {
  const activeFilters = (Object.entries(filters) as Array<[TagType, readonly string[]]>).filter(
    ([, values]) => Array.isArray(values) && values.length > 0
  )

  if (activeFilters.length === 0) {
    return [...products]
  }

  return products.filter(product => {
    const tagsByType = (product.tags ?? []).reduce((acc, tag) => {
      const next = acc[tag.type] ?? []
      next.push(tag.value)
      acc[tag.type] = next
      return acc
    }, {} as Record<TagType, string[]>)

    return activeFilters.every(([type, values]) => hasAny(tagsByType[type] ?? [], values))
  })
}
