import { PrismaClient, type PersonaFacet } from '@prisma/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { enrichTags, parseTagStrings, type Tag } from '../lib/tagging'

type CategoryJson = {
  slug: string
  label: string
  image?: string
  tagline?: string
  subtitle?: string
  isSensitive?: boolean
  children?: Array<{ slug: string; label: string }>
}

type ProductJson = {
  id?: number
  slug: string
  name: string
  descriptionHtml?: string | null
  descriptionText?: string | null
  shortDescription?: string | null
  regularPrice: number
  salePrice?: number | null
  sku?: string | null
  category: string
  subCategory?: string | null
  tags?: Array<string | null | undefined>
  attributes?: Record<string, string | number | boolean | null | undefined>
  imageFilenames?: Array<string | null | undefined>
  nsfw?: boolean
  bestSeller?: boolean
  badge?: 'nuevo' | 'top' | 'promo' | string | null
  rating?: number | null
  reviewCount?: number | null
  stockStatus?: string | null
  modifiedAt?: string | null
  embeddingText?: string | null
}

type MegaMenuSubcategoryConfig = {
  name: string
  href: string
}

type MegaMenuSectionConfig = {
  name: string
  subcategories: MegaMenuSubcategoryConfig[]
}

type MegaMenuCategoryConfig = {
  id: string
  label: string
  personaFacet: 'her' | 'him' | 'couples'
  accentColor: string
  sections: MegaMenuSectionConfig[]
}

type MenuMappingEntry =
  | {
      type: 'category'
      category_slug: string
      create?: { category?: boolean }
      notes?: string
    }
  | {
      type: 'subcategory'
      category_slug: string
      subcategory_slug: string
      create?: { category?: boolean; subcategory?: boolean }
      notes?: string
    }
  | {
      type: 'alias'
      alias_to: { category_slug: string; subcategory_slug?: string }
      notes?: string
    }
  | {
      type: 'collection'
      includes: '*'
        | Record<
            string,
            '*'
              | string[]
          >
      attribute_filter?: Record<string, unknown>
      tags?: string[]
      requires?: Array<{ category_slug: string; subcategory_slug?: string }>
      suggest_create_subcategories?: Array<{ category_slug: string; subcategory_slug: string }>
      notes?: string
    }

type MenuMappingFile = {
  version: string
  mapping: Record<string, MenuMappingEntry>
}

const prisma = new PrismaClient()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

const categoryCache = new Map<string, { id: number; slug: string }>()
const subcategoryCache = new Map<string, { id: number; slug: string; categorySlug: string }>()

type CategorySeedData = Partial<Pick<CategoryJson, 'label' | 'image' | 'tagline' | 'subtitle' | 'isSensitive'>> & {
  accentColor?: string
  description?: string
  personaFacet?: PersonaFacet
}

function toTitle(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function clean<T extends Record<string, unknown>>(input: T): T {
  const result: Record<string, unknown> = {}
  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value
    }
  })
  return result as T
}

async function loadCategories(): Promise<CategoryJson[]> {
  const filePath = path.resolve(projectRoot, 'data/categories.json')
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw) as CategoryJson[]
}

async function loadProducts(): Promise<ProductJson[]> {
  const filePath = path.resolve(projectRoot, 'data/products.json')
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw) as ProductJson[]
}

async function loadMenuMapping(): Promise<MenuMappingFile> {
  const filePath = path.resolve(projectRoot, 'data/menu-mapping.json')
  const raw = await fs.readFile(filePath, 'utf8')
  return JSON.parse(raw) as MenuMappingFile
}

async function loadMegaMenuCategories(): Promise<MegaMenuCategoryConfig[]> {
  const filePath = path.resolve(projectRoot, 'data/mega-menu.config.ts')
  const url = pathToFileURL(filePath).href
  const module = await import(url)
  const config: { categories: MegaMenuCategoryConfig[] } = module.megaMenuConfig ?? module.default ?? {}
  if (!config || !Array.isArray(config.categories)) {
    throw new Error('No se pudo cargar mega-menu.config.ts')
  }
  return config.categories
}

async function ensureCategory(slug: string, data?: CategorySeedData): Promise<{ id: number; slug: string }> {
  const normalized = slug.trim().toLowerCase()
  if (!normalized) {
    throw new Error('Categoria sin slug valido')
  }
  const cached = categoryCache.get(normalized)
  if (cached) return cached

  const label = data?.label ?? toTitle(normalized)
  const updateData = clean({
    label,
    image: data?.image,
    tagline: data?.tagline,
    subtitle: data?.subtitle,
    accentColor: data?.accentColor,
    description: data?.description,
    personaFacet: data?.personaFacet ?? undefined,
    isSensitive: data?.isSensitive
  })

  const category = await prisma.category.upsert({
    where: { slug: normalized },
    update: updateData,
    create: clean({
      slug: normalized,
      label,
      image: data?.image,
      tagline: data?.tagline,
      subtitle: data?.subtitle,
      accentColor: data?.accentColor,
      description: data?.description,
      personaFacet: data?.personaFacet ?? undefined,
      isSensitive: data?.isSensitive ?? false
    })
  })

  categoryCache.set(normalized, { id: category.id, slug: category.slug })
  return { id: category.id, slug: category.slug }
}

async function ensureSubcategory(
  categorySlug: string,
  slug: string,
  label?: string,
  options?: { menuSectionId?: number }
): Promise<{ id: number; slug: string; categorySlug: string }> {
  const normalizedCategory = categorySlug.trim().toLowerCase()
  const normalizedSlug = slug.trim().toLowerCase()
  if (!normalizedSlug) {
    throw new Error(`Subcategoria invalida para la categoria ${normalizedCategory}`)
  }
  const cacheKey = `${normalizedCategory}::${normalizedSlug}`
  const cached = subcategoryCache.get(cacheKey)
  if (cached) return cached

  const category = await ensureCategory(normalizedCategory)
  const computedLabel = label ?? toTitle(normalizedSlug)

  const subcategory = await prisma.subcategory.upsert({
    where: {
      categoryId_slug: {
        categoryId: category.id,
        slug: normalizedSlug
      }
    },
    update: clean({
      label: computedLabel,
      menuSectionId: options?.menuSectionId
    }),
    create: clean({
      slug: normalizedSlug,
      label: computedLabel,
      categoryId: category.id,
      menuSectionId: options?.menuSectionId
    })
  })

  const record = { id: subcategory.id, slug: subcategory.slug, categorySlug: normalizedCategory }
  subcategoryCache.set(cacheKey, record)
  return record
}

async function createAlias(
  aliasSlug: string,
  target: { categoryId: number; subcategoryId?: number | null },
  notes?: string
) {
  const normalizedAlias = aliasSlug.trim().toLowerCase()
  if (!normalizedAlias) return

  await prisma.subcategoryAlias.upsert({
    where: { aliasSlug: normalizedAlias },
    update: clean({
      categoryId: target.categoryId,
      subcategoryId: target.subcategoryId ?? null,
      notes
    }),
    create: clean({
      aliasSlug: normalizedAlias,
      categoryId: target.categoryId,
      subcategoryId: target.subcategoryId ?? null,
      notes
    })
  })
}

async function seedCategoriesAndSubcategories(categoryJson: CategoryJson[]) {
  for (const entry of categoryJson) {
    const category = await ensureCategory(entry.slug, entry)

    for (const child of entry.children ?? []) {
      await ensureSubcategory(category.slug, child.slug, child.label)
    }
  }
}

async function applyMenuMapping(mapping: MenuMappingFile) {
  for (const [slug, entry] of Object.entries(mapping.mapping)) {
    switch (entry.type) {
      case 'category': {
        await ensureCategory(entry.category_slug)
        break
      }
      case 'subcategory': {
        if (entry.create?.category) {
          await ensureCategory(entry.category_slug)
        }
        const category = await ensureCategory(entry.category_slug)
        const subcategory = await ensureSubcategory(entry.category_slug, entry.subcategory_slug)
        await createAlias(slug, { categoryId: category.id, subcategoryId: subcategory.id }, entry.notes)
        break
      }
      case 'alias': {
        const targetCategory = await ensureCategory(entry.alias_to.category_slug)
        if (entry.alias_to.subcategory_slug) {
          const subcategory = await ensureSubcategory(entry.alias_to.category_slug, entry.alias_to.subcategory_slug)
          await createAlias(slug, { categoryId: targetCategory.id, subcategoryId: subcategory.id }, entry.notes)
        } else {
          await createAlias(slug, { categoryId: targetCategory.id }, entry.notes)
        }
        break
      }
      case 'collection': {
        await ensureCollection(slug, entry)
        break
      }
      default: {
        // ignore
      }
    }
  }
}

async function ensureCollection(slug: string, entry: Extract<MenuMappingEntry, { type: 'collection' }>) {
  const name = toTitle(slug)
  const criteria = clean({
    attributeFilter: entry.attribute_filter ?? undefined,
    tags: entry.tags ?? undefined,
    notes: entry.notes ?? undefined
  })

  const collection = await prisma.collection.upsert({
    where: { slug },
    update: {
      name,
      description: entry.notes ?? null,
      criteria: Object.keys(criteria).length > 0 ? criteria : undefined
    },
    create: clean({
      slug,
      name,
      description: entry.notes ?? null,
      criteria: Object.keys(criteria).length > 0 ? criteria : undefined
    })
  })

  await prisma.collectionTarget.deleteMany({ where: { collectionId: collection.id } })

  if (entry.includes === '*') {
    await prisma.collectionTarget.create({
      data: {
        collectionId: collection.id,
        includeAll: true
      }
    })
  } else {
    for (const [rawKey, value] of Object.entries(entry.includes)) {
      const [categorySlug, qualifier] = rawKey.split('#')
      const category = await ensureCategory(categorySlug)

      if (value === '*') {
        await prisma.collectionTarget.create({
          data: {
            collectionId: collection.id,
            categoryId: category.id,
            includeAll: true
          }
        })
      } else if (Array.isArray(value)) {
        const targetSubcategorySlugs = value
        for (const subSlug of targetSubcategorySlugs) {
          const subcategory = await ensureSubcategory(category.slug, subSlug)
          await prisma.collectionTarget.create({
            data: {
              collectionId: collection.id,
              categoryId: category.id,
              subcategoryId: subcategory.id,
              includeAll: false
            }
          })
        }
      }

      if (qualifier === 'subcategories') {
        // already handled above via array iteration
      }
    }
  }

  if (entry.requires) {
    for (const requirement of entry.requires) {
      if (requirement.subcategory_slug) {
        await ensureSubcategory(requirement.category_slug, requirement.subcategory_slug)
      } else {
        await ensureCategory(requirement.category_slug)
      }
    }
  }

  if (entry.suggest_create_subcategories) {
    for (const suggestion of entry.suggest_create_subcategories) {
      await ensureSubcategory(suggestion.category_slug, suggestion.subcategory_slug)
    }
  }
}

type ResolvedSlug =
  | { kind: 'category'; category: { id: number; slug: string } }
  | { kind: 'subcategory'; category: { id: number; slug: string }; subcategory: { id: number; slug: string } }
  | { kind: 'collection'; collectionSlug: string }
  | { kind: 'unknown' }

type ResolvedCategorySlug = Extract<ResolvedSlug, { kind: 'category' | 'subcategory' }>

async function resolveSlug(slug: string, mapping: MenuMappingFile): Promise<ResolvedSlug> {
  const normalized = slug.trim().toLowerCase()
  const entry = mapping.mapping[normalized]
  if (entry) {
    if (entry.type === 'alias') {
      const category = await ensureCategory(entry.alias_to.category_slug)
      if (entry.alias_to.subcategory_slug) {
        const subcategory = await ensureSubcategory(entry.alias_to.category_slug, entry.alias_to.subcategory_slug)
        return { kind: 'subcategory', category, subcategory }
      }
      return { kind: 'category', category }
    }
    if (entry.type === 'subcategory') {
      const subcategory = await ensureSubcategory(entry.category_slug, entry.subcategory_slug)
      const category = await ensureCategory(entry.category_slug)
      return { kind: 'subcategory', category, subcategory }
    }
    if (entry.type === 'category') {
      const category = await ensureCategory(entry.category_slug)
      return { kind: 'category', category }
    }
    if (entry.type === 'collection') {
      return { kind: 'collection', collectionSlug: normalized }
    }
  }

  const directCategory = categoryCache.get(normalized)
  if (directCategory) {
    return { kind: 'category', category: directCategory }
  }

  return { kind: 'unknown' }
}

async function seedMegaMenu(megaCategories: MegaMenuCategoryConfig[], mapping: MenuMappingFile) {
  for (const personaCategory of megaCategories) {
    const personaFacet = personaCategory.personaFacet.toUpperCase() as PersonaFacet

    for (const [sectionIndex, section] of personaCategory.sections.entries()) {
      const resolvedEntries = await Promise.all(
        section.subcategories.map(async subcategoryEntry => {
          const slug = subcategoryEntry.href.replace('/categoria/', '')
          const resolved = await resolveSlug(slug, mapping)
          return { entry: subcategoryEntry, resolved }
        })
      )

      const base = resolvedEntries.find(item => item.resolved.kind === 'category' || item.resolved.kind === 'subcategory')
      if (!base) {
        continue
      }

      const category = (base.resolved as ResolvedCategorySlug).category
      await ensureCategory(category.slug, {
        accentColor: personaCategory.accentColor,
        personaFacet
      })

      const menuSection = await prisma.menuSection.upsert({
        where: {
          categoryId_name: {
            categoryId: category.id,
            name: section.name
          }
        },
        update: {
          order: sectionIndex
        },
        create: {
          name: section.name,
          order: sectionIndex,
          categoryId: category.id
        }
      })

      for (const { entry, resolved } of resolvedEntries) {
        if (resolved.kind === 'subcategory') {
          await prisma.subcategory.update({
            where: { id: resolved.subcategory.id },
            data: {
              menuSectionId: menuSection.id,
              label: entry.name
            }
          })
        }
      }
    }
  }
}

function normalizeBadge(badge: ProductJson['badge']): 'NUEVO' | 'TOP' | 'PROMO' | null {
  if (!badge) return null
  const normalized = badge.toUpperCase()
  if (normalized === 'NUEVO' || normalized === 'TOP' || normalized === 'PROMO') {
    return normalized
  }
  return null
}

async function seedProducts(products: ProductJson[]) {
  for (const product of products) {
    const categorySlug = product.category?.trim().toLowerCase()
    if (!categorySlug) {
      console.warn(`Producto ${product.slug} sin categoría. Saltando.`)
      continue
    }
    const category = await ensureCategory(categorySlug)

    let subcategoryId: number | null = null
    if (product.subCategory) {
      const normalizedSub = product.subCategory.trim().toLowerCase()
      try {
        const subcategory = await ensureSubcategory(categorySlug, normalizedSub)
        subcategoryId = subcategory.id
      } catch (error) {
      console.warn(`Subcategoria "${normalizedSub}" no encontrada para el producto ${product.slug}.`)
      }
    }

    const enrichedTags: Tag[] = enrichTags({
      category: category.slug,
      subCategory: product.subCategory ?? null,
      name: product.name,
      shortDescription: product.shortDescription ?? null,
      descriptionHtml: product.descriptionHtml ?? null,
      descriptionText: product.descriptionText ?? null,
      tags: parseTagStrings(product.tags)
    })

    const dbProduct = await prisma.product.upsert({
      where: { slug: product.slug },
      update: clean({
        externalId: product.id ?? undefined,
        name: product.name,
        shortDescription: product.shortDescription ?? null,
        descriptionHtml: product.descriptionHtml ?? null,
        descriptionText: product.descriptionText ?? null,
        regularPrice: product.regularPrice,
        salePrice: product.salePrice ?? null,
        stockStatus: product.stockStatus ?? null,
        sku: product.sku ?? null,
        nsfw: product.nsfw ?? true,
        bestSeller: product.bestSeller ?? false,
        badge: normalizeBadge(product.badge),
        rating: product.rating ?? 0,
        reviewCount: product.reviewCount ?? 0,
        embeddingText: product.embeddingText ?? null,
        categoryId: category.id,
        subcategoryId
      }),
      create: clean({
        externalId: product.id ?? undefined,
        slug: product.slug,
        name: product.name,
        shortDescription: product.shortDescription ?? null,
        descriptionHtml: product.descriptionHtml ?? null,
        descriptionText: product.descriptionText ?? null,
        regularPrice: product.regularPrice,
        salePrice: product.salePrice ?? null,
        stockStatus: product.stockStatus ?? null,
        sku: product.sku ?? null,
        nsfw: product.nsfw ?? true,
        bestSeller: product.bestSeller ?? false,
        badge: normalizeBadge(product.badge),
        rating: product.rating ?? 0,
        reviewCount: product.reviewCount ?? 0,
        embeddingText: product.embeddingText ?? null,
        categoryId: category.id,
        subcategoryId
      })
    })

    await prisma.productImage.deleteMany({ where: { productId: dbProduct.id } })
    await prisma.productAttribute.deleteMany({ where: { productId: dbProduct.id } })
    await prisma.productTag.deleteMany({ where: { productId: dbProduct.id } })

    const imageFilenames = (product.imageFilenames ?? []).filter((filename): filename is string => Boolean(filename))
    if (imageFilenames.length > 0) {
      await prisma.productImage.createMany({
        data: imageFilenames.map((filename, index) => ({
          productId: dbProduct.id,
          url: `/products/${product.slug}/${filename}`,
          sortOrder: index
        }))
      })
    }

    const attributes = product.attributes ?? {}
    const attributeEntries = Object.entries(attributes).filter(
      ([, value]) => value !== null && value !== undefined && value !== ''
    )
    if (attributeEntries.length > 0) {
      await prisma.productAttribute.createMany({
        data: attributeEntries.map(([key, value]) => ({
          productId: dbProduct.id,
          key,
          value: String(value)
        }))
      })
    }

    if (enrichedTags.length > 0) {
      await prisma.productTag.createMany({
        data: enrichedTags.map(tag => ({
          productId: dbProduct.id,
          type: tag.type,
          value: tag.value
        }))
      })
    }
  }
}

async function main() {
  console.log('Starting seed...')
  const [categoriesJson, productsJson, mapping, megaCategories] = await Promise.all([
    loadCategories(),
    loadProducts(),
    loadMenuMapping(),
    loadMegaMenuCategories()
  ])

  console.log('Seeding base categories and subcategories...')
  await seedCategoriesAndSubcategories(categoriesJson)

  console.log('Applying mega menu mapping...')
  await applyMenuMapping(mapping)

  console.log('Seeding mega menu structure...')
  await seedMegaMenu(megaCategories, mapping)

  console.log('Seeding products...')
  await seedProducts(productsJson)

  console.log('Seed completed successfully.')
}

main()
  .catch(error => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
