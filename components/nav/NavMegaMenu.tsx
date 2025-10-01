'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { FocusEvent as ReactFocusEvent, MouseEvent as ReactMouseEvent } from 'react'

import MegaMenu from './MegaMenu'
import { megaMenuConfig } from '@/data/mega-menu.config'
import type { MegaMenuTab } from '@/data/mega-menu.config'

type NavMegaMenuProps = {
  onNavigate?: () => void
}

const PERSONA_ORDER: MegaMenuTab['personaFacet'][] = ['him', 'her', 'couples']

export default function NavMegaMenu({ onNavigate }: NavMegaMenuProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const headerRef = useRef<HTMLElement | null>(null)
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})
  const [open, setOpen] = useState(false)
  const [activeTabId, setActiveTabId] = useState<string>('')
  const [panelTop, setPanelTop] = useState(0)

  const personaTabs = useMemo(() => {
    return PERSONA_ORDER.map((facet) =>
      megaMenuConfig.tabs.find((tab) => tab.personaFacet === facet) ?? null
    ).filter((tab): tab is MegaMenuTab => tab !== null)
  }, [])

  const hasTabs = personaTabs.length > 0
  const menuId = 'nav-mega-menu-panel'
  const activeTrigger = activeTabId ? triggerRefs.current[activeTabId] ?? null : null

  useEffect(() => {
    if (!hasTabs) {
      setActiveTabId('')
      setOpen(false)
      return
    }

    setActiveTabId((currentId) => {
      if (personaTabs.some((tab) => tab.id === currentId)) {
        return currentId
      }
      return personaTabs[0].id
    })
  }, [hasTabs, personaTabs])

  const ensureHeaderReference = useCallback(() => {
    if (headerRef.current) return
    if (!containerRef.current) return
    const header = containerRef.current.closest('header')
    if (header instanceof HTMLElement) {
      headerRef.current = header
    }
  }, [])

  const updatePanelPosition = useCallback(() => {
    ensureHeaderReference()
    if (headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect()
      setPanelTop(rect.bottom)
      return
    }

    if (activeTrigger) {
      const rect = activeTrigger.getBoundingClientRect()
      setPanelTop(rect.bottom)
      return
    }

    setPanelTop(0)
  }, [activeTrigger, ensureHeaderReference])

  useEffect(() => {
    if (!open) return

    updatePanelPosition()

    const handleResize = () => {
      updatePanelPosition()
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize, true)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize, true)
    }
  }, [open, updatePanelPosition])

  const isNodeWithinContainer = useCallback(
    (node: Node | null) => {
      if (!node) return false
      if (!containerRef.current) return false
      return containerRef.current.contains(node)
    },
    []
  )

  const handleMouseLeave = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget as Node | null
      if (isNodeWithinContainer(nextTarget)) {
        return
      }
      setOpen(false)
    },
    [isNodeWithinContainer]
  )

  const handleBlur = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      const nextTarget = event.relatedTarget as Node | null
      if (isNodeWithinContainer(nextTarget)) {
        return
      }
      setOpen(false)
    },
    [isNodeWithinContainer]
  )

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null
      if (!target) return
      if (isNodeWithinContainer(target)) return
      setOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (!open) return
      event.preventDefault()
      setOpen(false)
      activeTrigger?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, isNodeWithinContainer, activeTrigger])

  const handleOpenForTab = useCallback(
    (tabId: string) => {
      if (!hasTabs) return
      setActiveTabId(tabId)
      setOpen(true)
    },
    [hasTabs]
  )

  const handleTriggerClick = useCallback(
    (tabId: string) => {
      if (open && activeTabId === tabId) {
        setOpen(false)
        return
      }
      handleOpenForTab(tabId)
    },
    [handleOpenForTab, open, activeTabId]
  )

  const handlePanelMouseEnter = useCallback(
    (_event: ReactMouseEvent<HTMLElement>) => {
      if (!open) {
        setOpen(true)
      }
    },
    [open]
  )

  if (!hasTabs) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-full items-center gap-3"
      onMouseLeave={handleMouseLeave}
      onBlur={handleBlur}
    >
      {personaTabs.map((tab) => {
        const isExpanded = open && activeTabId === tab.id
        return (
          <button
            key={tab.id}
            ref={(node) => {
              triggerRefs.current[tab.id] = node
            }}
            type="button"
            aria-haspopup="true"
            aria-expanded={isExpanded}
            aria-controls={menuId}
            onMouseEnter={() => handleOpenForTab(tab.id)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => handleOpenForTab(tab.id)}
            onBlur={handleBlur}
            onClick={() => handleTriggerClick(tab.id)}
            data-active={isExpanded}
            className="nav-link inline-flex items-center justify-center rounded-full px-5 py-3 text-lg font-semibold uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
          >
            <span className="relative z-10">{tab.label}</span>
          </button>
        )
      })}

      <MegaMenu
        onNavigate={onNavigate}
        open={open}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        onClose={() => setOpen(false)}
        panelTop={panelTop}
        onPanelMouseEnter={handlePanelMouseEnter}
        onPanelMouseLeave={handleMouseLeave}
        menuId={menuId}
        menuRef={menuRef}
        activeTrigger={activeTrigger}
      />
    </div>
  )
}
