'use client'

import MegaMenu from './MegaMenu'
import { megaMenuConfig } from '@/data/mega-menu.config'
import type { MegaMenuTab } from '@/data/mega-menu.config'

type PersonaMegaMenuProps = {
  personaFacet: MegaMenuTab['personaFacet']
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
}

export default function PersonaMegaMenu({ personaFacet, variant, onNavigate }: PersonaMegaMenuProps) {
  const tab = megaMenuConfig.tabs.find((item) => item.personaFacet === personaFacet)

  if (!tab) {
    return null
  }

  return (
    <MegaMenu
      variant={variant}
      onNavigate={onNavigate}
      tabId={tab.id}
      triggerLabel={tab.label}
    />
  )
}
