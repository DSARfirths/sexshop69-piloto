import collectionsData from '@/data/collections.json'
import type { Product } from './products'
import { allProducts } from './products'
import { enrichTags, parseTagStrings, type Tag } from './tagging'

type RawCollection = (typeof collectionsData)[number]

type RawCollectionRule = RawCollection['rule']

type RawAnyOf = NonNullable<RawCollectionRule>['anyOf']

export type CollectionRule = {
  anyOf?: {
    tags: Tag[]
    categories: string[]
  }
}

export type Collection = Omit<RawCollection, 'rule'> & {
  rule: CollectionRule
}

function normalizeCategorySlug(slug: string | null | undefined): string | null {
  if (!slug) return null
  const trimmed = slug.trim().toLowerCase()
  return trimmed.length > 0 ? trimmed : null
}

function normalizeAnyOf(anyOf: RawAnyOf | undefined): CollectionRule['anyOf'] {
  if (!anyOf) return undefined
  const tags = parseTagStrings(anyOf.tags)
  const categories = (anyOf.categories ?? [])
    .map(category => normalizeCategorySlug(category))
    .filter((category): category is string => Boolean(category))
  if (tags.length === 0 && categories.length === 0) return undefined
  return { tags, categories }
}

function normalizeCollection(collection: RawCollection): Collection {
  const anyOf = normalizeAnyOf(collection.rule?.anyOf)
  return {
    ...collection,
    rule: { ...(anyOf ? { anyOf } : {}) }
  }
}

const collections: Collection[] = (collectionsData as RawCollection[]).map(normalizeCollection)

function getProductTags(product: Product): Tag[] {
  if (product.tags && product.tags.length > 0) return product.tags
  return enrichTags({
    category: product.category,
    subCategory: product.subCategory ?? null,
    name: product.name,
    shortDescription: product.shortDescription ?? null,
    descriptionHtml: product.descriptionHtml ?? null,
    descriptionText: product.descriptionText ?? null,
    tags: []
  })
}

function hasMatchingTag(productTags: Tag[], ruleTags: Tag[]): boolean {
  if (ruleTags.length === 0) return false
  const productTagKeys = new Set(productTags.map(tag => `${tag.type}:${tag.value.toLowerCase()}`))
  return ruleTags.some(tag => productTagKeys.has(`${tag.type}:${tag.value.toLowerCase()}`))
}

function hasMatchingCategory(product: Product, categories: string[]): boolean {
  if (categories.length === 0) return false
  const productCategories = [product.category, product.subCategory]
    .map(value => normalizeCategorySlug(value))
    .filter((value): value is string => Boolean(value))
  if (productCategories.length === 0) return false
  return categories.some(category => productCategories.includes(category))
}

export function matchCollection(product: Product, rule: CollectionRule): boolean {
  const anyOf = rule.anyOf
  if (!anyOf) return true
  const tagsMatch = hasMatchingTag(getProductTags(product), anyOf.tags)
  if (tagsMatch) return true
  const categoryMatch = hasMatchingCategory(product, anyOf.categories)
  return categoryMatch
}

export function allCollections(): Collection[] {
  return collections
}

export function findCollection(slug: string): Collection | undefined {
  const normalized = normalizeCategorySlug(slug)
  if (!normalized) return undefined
  return collections.find(collection => collection.slug === normalized)
}

export function productsForCollection(collection: Collection): Product[] {
  return allProducts().filter(product => matchCollection(product, collection.rule))
}
