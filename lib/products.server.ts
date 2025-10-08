import { cache } from 'react'

import { Prisma } from '@prisma/client'

import { prisma } from './db'
import {
  Product,
  ProductBadge,
  sanitizeDescriptionHtml,
  normalizeAttributes,
  normalizeImageFilenames,
  inferImageSetFromFilenames,
  getImageBasename
} from './products'

const productWithRelations = Prisma.validator<Prisma.ProductFindManyArgs>()({
  include: {
    images: {
      orderBy: { sortOrder: 'asc' }
    },
    attributes: true,
    tags: true,
    category: true,
    subcategory: true
  }
})

type DbProduct = Prisma.ProductGetPayload<typeof productWithRelations>

type Taxonomy = {
  slugSets: Map<string, Set<string>>
  labelLookup: Map<string, string>
}

function decimalToNumber(value: Prisma.Decimal | number | null | undefined): number | null {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  return value.toNumber()
}

function mapDbProduct(product: DbProduct): Product {
  const descriptionHtml = sanitizeDescriptionHtml(product.descriptionHtml)
  const attributes = normalizeAttributes(
    Object.fromEntries(product.attributes.map(attribute => [attribute.key, attribute.value ?? null]))
  )

  const brandValue = attributes.brand
  const brand =
    typeof brandValue === 'string' && brandValue.trim().length > 0 ? brandValue.trim() : null

  const imageFilenames = normalizeImageFilenames(
    product.images.map(image => image.url?.split('/').pop() ?? null)
  )
  const imageBasenames = imageFilenames.map(getImageBasename)
  const imageSet = inferImageSetFromFilenames(imageFilenames) ?? null

  const regularPrice = decimalToNumber(product.regularPrice) ?? 0
  const salePrice = decimalToNumber(product.salePrice)

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    descriptionHtml,
    descriptionText: product.descriptionText ?? null,
    shortDescription: product.shortDescription ?? null,
    regularPrice,
    salePrice,
    stockStatus: product.stockStatus ?? null,
    sku: product.sku ?? null,
    brand,
    category: product.category.slug,
    categoryLabel: product.category.label ?? product.category.slug,
    subCategory: product.subcategory?.slug ?? null,
    subCategoryLabel: product.subcategory?.label ?? null,
    attributes,
    specs: null,
    features: null,
    using: null,
    care: null,
    related: null,
    tags: product.tags.map(tag => ({
      type: tag.type as Product['tags'][number]['type'],
      value: tag.value
    })),
    badge: product.badge ? (product.badge.toLowerCase() as ProductBadge) : null,
    bestSeller: Boolean(product.bestSeller),
    nsfw: Boolean(product.nsfw),
    rating: product.rating ?? null,
    reviewCount: product.reviewCount ?? null,
    imageFilenames,
    imageBasenames,
    imageSet,
    primaryImageFilename: imageFilenames[0] ?? null,
    imageCount: imageFilenames.length,
    embeddingText: product.embeddingText ?? null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  }
}

const loadTaxonomy = cache(async (): Promise<Taxonomy> => {
  const categories = await prisma.category.findMany({
    include: {
      subcategories: {
        include: {
          aliases: true
        }
      },
      aliases: true
    },
    orderBy: { id: 'asc' }
  })

  const slugSets = new Map<string, Set<string>>()
  const labelLookup = new Map<string, string>()

  categories.forEach(category => {
    const childSlugs = category.subcategories.map(subcategory => subcategory.slug)
    const baseSet = new Set<string>([category.slug, ...childSlugs])
    labelLookup.set(category.slug, category.label ?? category.slug)
    slugSets.set(category.slug, baseSet)

    category.aliases.forEach(alias => {
      slugSets.set(alias.aliasSlug, new Set(baseSet))
      labelLookup.set(alias.aliasSlug, category.label ?? category.slug)
    })

    category.subcategories.forEach(subcategory => {
      labelLookup.set(subcategory.slug, subcategory.label ?? subcategory.slug)
      slugSets.set(subcategory.slug, new Set([subcategory.slug, category.slug]))

      subcategory.aliases.forEach(alias => {
        slugSets.set(alias.aliasSlug, new Set([subcategory.slug, category.slug]))
        labelLookup.set(alias.aliasSlug, subcategory.label ?? subcategory.slug)
      })
    })
  })

  return { slugSets, labelLookup }
})

const loadCatalog = cache(async () => {
  const dbProducts = await prisma.product.findMany({
    ...productWithRelations,
    orderBy: { name: 'asc' }
  })
  return dbProducts.map(mapDbProduct)
})

export async function getAllProducts(): Promise<Product[]> {
  return loadCatalog()
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const normalized = slug.trim().toLowerCase()
  const products = await loadCatalog()
  return products.find(product => product.slug === normalized)
}

export async function getProductsByCategory(slug: string): Promise<Product[]> {
  const normalized = slug.trim().toLowerCase()
  const [taxonomy, products] = await Promise.all([loadTaxonomy(), loadCatalog()])
  const relatedSlugs = taxonomy.slugSets.get(normalized) ?? new Set([normalized])

  return products.filter(product => {
    if (product.category === normalized) return true
    if (product.subCategory === normalized) return true
    if (relatedSlugs.has(product.category)) return true
    if (product.subCategory && relatedSlugs.has(product.subCategory)) return true
    return false
  })
}

export async function getCategoryLabel(slug: string): Promise<string | undefined> {
  const normalized = slug.trim().toLowerCase()
  const taxonomy = await loadTaxonomy()
  if (taxonomy.labelLookup.has(normalized)) {
    return taxonomy.labelLookup.get(normalized)
  }
  const product = await prisma.product.findFirst({
    where: {
      OR: [
        { category: { slug: normalized } },
        { subcategory: { slug: normalized } },
        { category: { aliases: { some: { aliasSlug: normalized } } } },
        { subcategory: { aliases: { some: { aliasSlug: normalized } } } }
      ]
    },
    select: {
      category: { select: { label: true, slug: true } },
      subcategory: { select: { label: true, slug: true } }
    }
  })
  if (!product) return undefined
  if (product.subcategory) {
    return product.subcategory.label ?? product.subcategory.slug
  }
  if (product.category) {
    return product.category.label ?? product.category.slug
  }
  return undefined
}

export async function getOffers(): Promise<Product[]> {
  const products = await loadCatalog()
  return products.filter(product => {
    if (product.salePrice === null || product.salePrice === undefined) return false
    return product.salePrice < product.regularPrice
  })
}

export async function getBestSellers(): Promise<Product[]> {
  const products = await loadCatalog()
  return products.filter(product => Boolean(product.bestSeller))
}

export function daysAgo(days: number): Date {
  const now = new Date()
  const reference = new Date(now)
  reference.setHours(0, 0, 0, 0)
  reference.setDate(reference.getDate() - Math.max(days, 0))
  return reference
}

export async function getNewArrivals(withinDays = 30): Promise<Product[]> {
  const threshold = daysAgo(withinDays).getTime()
  const products = await loadCatalog()
  return products.filter(product => {
    if (!product.updatedAt) return false
    const updatedTime = new Date(product.updatedAt).getTime()
    return !Number.isNaN(updatedTime) && updatedTime >= threshold
  })
}

export async function getProductsBySlugs(slugs: readonly string[]): Promise<Product[]> {
  if (slugs.length === 0) return []
  const normalized = slugs.map(slug => slug.trim().toLowerCase())
  const products = await loadCatalog()
  return products.filter(product => normalized.includes(product.slug))
}
