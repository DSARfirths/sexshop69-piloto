'use client'

import { useMemo } from 'react'

import { DesktopMenu } from './DesktopMenu'
import { MobileMenu } from './MobileMenu'
import { megaMenuConfig } from '@/data/mega-menu.config'
import type { MegaMenuCategory } from '@/data/mega-menu.config'

type NavMegaMenuProps = {
  onNavigate?: () => void
}

const PERSONA_ORDER: MegaMenuCategory['personaFacet'][] = ['her', 'him', 'couples']

export default function NavMegaMenu({ onNavigate }: NavMegaMenuProps) {
  const orderedCategories = useMemo(() => {
    const orderMap = new Map(PERSONA_ORDER.map((facet, index) => [facet, index]))

    return [...megaMenuConfig.categories].sort((a, b) => {
      const orderA = orderMap.get(a.personaFacet) ?? PERSONA_ORDER.length
      const orderB = orderMap.get(b.personaFacet) ?? PERSONA_ORDER.length
      if (orderA === orderB) {
        return a.label.localeCompare(b.label)
      }
      return orderA - orderB
    })
  }, [])

  if (!orderedCategories.length) {
    return null
  }

  return (
    <>
      <DesktopMenu categories={orderedCategories} onNavigate={onNavigate} />
      <MobileMenu categories={orderedCategories} onNavigate={onNavigate} />
    </>
  )
}
