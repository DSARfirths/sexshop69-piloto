export type TagType = 'persona' | 'uso' | 'feature' | 'material'

export type Tag =
  | { type: 'persona'; value: string }
  | { type: 'uso'; value: string }
  | { type: 'feature'; value: string }
  | { type: 'material'; value: string }

export type TaggableProduct = {
  category: string
  subCategory?: string | null
  name: string
  shortDescription?: string | null
  descriptionHtml?: string | null
  descriptionText?: string | null
  tags?: Tag[]
}

export const BY_CATEGORY: Readonly<Record<string, readonly Tag[]>> = {
  feromonas: [{ type: 'feature', value: 'Feromonas' }],
  vibradores: [{ type: 'uso', value: 'Estimulación vibratoria' }],
  lubricantes: [{ type: 'uso', value: 'Lubricación' }]
}

export const BY_SUBCATEGORY: Readonly<Record<string, readonly Tag[]>> = {
  rabbits: [{ type: 'feature', value: 'Estimulación dual' }],
  clasicos: [{ type: 'feature', value: 'Diseño clásico' }],
  anales: [{ type: 'uso', value: 'Estimulación anal' }]
}

type KeywordRule = {
  keyword: string
  tags: readonly Tag[]
}

export const KEYWORDS: readonly KeywordRule[] = [
  { keyword: 'silicona', tags: [{ type: 'material', value: 'Silicona' }] },
  { keyword: 'feromona', tags: [{ type: 'feature', value: 'Feromonas' }] },
  { keyword: 'vibrador', tags: [{ type: 'uso', value: 'Vibración' }] },
  { keyword: 'agua', tags: [{ type: 'feature', value: 'Resistente al agua' }] }
]

const TAG_SEPARATOR = ':'
const TAG_TYPES: readonly TagType[] = ['persona', 'uso', 'feature', 'material']
const TAG_TYPE_SET = new Set<TagType>(TAG_TYPES)

function normalizeTagValue(value: string | null | undefined): string | null {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

function parseRawTag(rawTag: string | null | undefined): Tag | null {
  const normalized = normalizeTagValue(rawTag)
  if (!normalized) return null

  const separatorIndex = normalized.indexOf(TAG_SEPARATOR)
  if (separatorIndex <= 0) {
    return { type: 'feature', value: normalized }
  }

  const possibleType = normalized.slice(0, separatorIndex) as TagType
  const rawValue = normalizeTagValue(normalized.slice(separatorIndex + TAG_SEPARATOR.length))

  if (!rawValue) return null

  if (TAG_TYPE_SET.has(possibleType)) {
    return { type: possibleType, value: rawValue }
  }

  return { type: 'feature', value: normalized }
}

export function parseTagStrings(rawTags?: ReadonlyArray<string | null | undefined>): Tag[] {
  if (!rawTags || rawTags.length === 0) return []

  const parsed = rawTags
    .map(tag => parseRawTag(tag))
    .filter((tag): tag is Tag => Boolean(tag))

  return dedupeTags(parsed)
}

function dedupeTags(tags: readonly Tag[]): Tag[] {
  const seen = new Set<string>()
  const deduped: Tag[] = []

  tags.forEach(tag => {
    const key = `${tag.type}:${tag.value.toLowerCase()}`
    if (seen.has(key)) return
    seen.add(key)
    deduped.push(tag)
  })

  return deduped
}

function gatherKeywordTags(product: TaggableProduct): Tag[] {
  const haystack = [
    product.name,
    product.shortDescription,
    product.descriptionText,
    product.descriptionHtml
  ]
    .filter((value): value is string => Boolean(value))
    .join(' ')
    .toLowerCase()

  if (!haystack) return []

  const keywordTags: Tag[] = []
  KEYWORDS.forEach(rule => {
    if (haystack.includes(rule.keyword.toLowerCase())) {
      keywordTags.push(...rule.tags)
    }
  })
  return keywordTags
}

export function enrichTags(product: TaggableProduct): Tag[] {
  const manualTags = product.tags ?? []
  const categoryTags = BY_CATEGORY[product.category] ?? []
  const subcategoryTags = product.subCategory ? BY_SUBCATEGORY[product.subCategory] ?? [] : []
  const keywordTags = gatherKeywordTags(product)

  return dedupeTags([...manualTags, ...categoryTags, ...subcategoryTags, ...keywordTags])
}
