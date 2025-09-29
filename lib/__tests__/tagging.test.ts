import { describe, expect, it } from 'vitest'

import { enrichTags, parseTagStrings, type Tag } from '../tagging'

describe('parseTagStrings', () => {
  it('parses raw tag strings into Tag objects', () => {
    const tags = parseTagStrings(['persona:parejas', 'feature:Vibración intensa', 'material:silicona'])

    expect(tags).toEqual<Tag[]>([
      { type: 'persona', value: 'parejas' },
      { type: 'feature', value: 'Vibración intensa' },
      { type: 'material', value: 'silicona' }
    ])
  })
})

describe('enrichTags', () => {
  it('preserves manual tags and appends automatic category and keyword tags without duplicates', () => {
    const manualTags = parseTagStrings(['feature:Edición limitada', 'material:Silicona'])

    const tags = enrichTags({
      category: 'feromonas',
      subCategory: null,
      name: 'Perfume en spray con feromona y base de silicona',
      shortDescription: 'Fragancia con feromonas para atraer',
      descriptionHtml: '<p>Elaborado con silicona líquida.</p>',
      descriptionText: null,
      tags: manualTags
    })

    expect(tags).toEqual<Tag[]>([
      { type: 'feature', value: 'Edición limitada' },
      { type: 'material', value: 'Silicona' },
      { type: 'feature', value: 'Feromonas' }
    ])
  })

  it('adds subcategory tags and keyword matches from descriptive text', () => {
    const tags = enrichTags({
      category: 'vibradores',
      subCategory: 'rabbits',
      name: 'Vibrador rabbit resistente al agua',
      shortDescription: 'Vibrador de silicona doble estimulación',
      descriptionHtml: '<p>Incluye vibración intensa y es resistente al agua.</p>',
      descriptionText: 'Un vibrador rabbit diseñado para doble estimulación.',
      tags: []
    })

    expect(tags).toContainEqual({ type: 'uso', value: 'Estimulación vibratoria' })
    expect(tags).toContainEqual({ type: 'feature', value: 'Estimulación dual' })
    expect(tags).toContainEqual({ type: 'feature', value: 'Resistente al agua' })
    expect(tags).toContainEqual({ type: 'material', value: 'Silicona' })
  })

  it('returns an empty array when there are no manual or automatic matches', () => {
    const tags = enrichTags({
      category: 'accesorios',
      subCategory: null,
      name: 'Bolsa de almacenamiento',
      shortDescription: 'Bolsa neutra',
      descriptionHtml: null,
      descriptionText: null,
      tags: []
    })

    expect(tags).toEqual([])
  })
})
