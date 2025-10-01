'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

import { megaMenuConfig } from '@/data/mega-menu.config'
import type { MegaMenuTab } from '@/data/mega-menu.config'

type MegaMenuProps = {
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
  tabId?: MegaMenuTab['id']
  open?: boolean
  onOpenChange?: (open: boolean) => void
  activeTabId?: MegaMenuTab['id']
  onActiveTabChange?: (tabId: MegaMenuTab['id']) => void
  triggerLabel?: string
  panelTop?: number
  menuId?: string
  menuRef?: React.RefObject<HTMLDivElement | null>
  activeTrigger?: HTMLElement | null
}

type TrackContext = 'column' | 'quick-link' | 'cta'

type TrackPayload = {
  tab: MegaMenuTab
  linkLabel: string
  href: string
  context: TrackContext
  columnTitle?: string
}

function trackMegaMenuInteraction({ tab, linkLabel, href, context, columnTitle }: TrackPayload) {
  if (typeof window === 'undefined') return
  const gtag = (window as any).gtag
  if (typeof gtag !== 'function') return

  gtag('event', 'mega_menu_click', {
    menu_tab: tab.id,
    menu_tab_label: tab.label,
    menu_link_label: linkLabel,
    menu_link_url: href,
    menu_link_context: context,
    ...(columnTitle ? { menu_column: columnTitle } : {})
  })
}

type DesktopMegaMenuProps = {
  tabs: MegaMenuTab[]
  onNavigate?: () => void
  open: boolean
  onOpenChange?: (open: boolean) => void
  activeTabId?: MegaMenuTab['id']
  onActiveTabChange?: (tabId: MegaMenuTab['id']) => void
  panelTop?: number
  menuId: string
  menuRef?: React.RefObject<HTMLDivElement | null>
  activeTrigger?: HTMLElement | null
}

const panelVariants: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 160,
      damping: 20,
      when: 'beforeChildren',
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.15,
      ease: 'easeInOut'
    }
  }
}

const contentWrapperVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08
    }
  }
}

const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 210,
      damping: 24
    }
  }
}

const scrimVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: 'easeInOut'
    }
  }
}

function DesktopMegaMenu({
  tabs,
  onNavigate,
  open,
  onOpenChange,
  activeTabId,
  onActiveTabChange,
  panelTop = 0,
  menuId,
  menuRef,
  activeTrigger
}: DesktopMegaMenuProps) {
  const hasTabs = tabs.length > 0
  const internalMenuRef = useRef<HTMLDivElement | null>(null)
  const resolvedMenuRef = menuRef ?? internalMenuRef

  const fallbackTabId = tabs[0]?.id ?? ''
  const currentTabId = activeTabId ?? fallbackTabId

  const activeTab = useMemo(() => {
    if (!tabs.length) return undefined
    return tabs.find((tab) => tab.id === currentTabId) ?? tabs[0]
  }, [tabs, currentTabId])

  const activePanelId = activeTab ? `${menuId}-${activeTab.id}` : ''
  const panelLabelledBy = [activeTrigger?.id, activeTab ? `mega-tab-${activeTab.id}` : '']
    .filter(Boolean)
    .join(' ') || undefined

  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return
    if (!activeTrigger) return
    if (document.activeElement !== activeTrigger) return

    const focusTarget =
      resolvedMenuRef.current?.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]') ??
      resolvedMenuRef.current?.querySelector<HTMLElement>('a, button')

    focusTarget?.focus({ preventScroll: true })
  }, [open, activeTrigger, activeTab, resolvedMenuRef])

  if (!hasTabs) {
    return null
  }

  if (!activeTab) {
    return null
  }

  const handleOpen = () => {
    onOpenChange?.(true)
  }

  const handleClose = () => {
    onOpenChange?.(false)
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            key="mega-menu-scrim"
            variants={scrimVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-auto fixed inset-0 z-20 bg-black/50"
            aria-hidden
            onClick={handleClose}
          />
          <motion.div
            key={`mega-menu-layer-${activeTab.id}`}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="pointer-events-auto fixed inset-x-4 z-30 overflow-hidden bg-neutral-950 sm:inset-x-6 lg:inset-x-8"
            style={{ top: panelTop }}
            onMouseEnter={handleOpen}
            onMouseLeave={handleClose}
          >
            <div className="flex justify-center pt-1 pb-10">
            <div className="pointer-events-auto w-full max-w-7xl px-4">
              <motion.div
                ref={resolvedMenuRef}
                id={`${menuId}-container`}
                aria-hidden={!open}
                className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl bg-neutral-950 p-8 text-sm text-white shadow-2xl md:p-10"
                variants={contentWrapperVariants}
              >
                <motion.div className="flex flex-col gap-8" variants={contentWrapperVariants}>
                  {tabs.length > 1 ? (
                    <motion.div role="tablist" aria-label="Personas" variants={fadeInUpVariants}>
                      <motion.ul
                        className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.2em]"
                        variants={contentWrapperVariants}
                      >
                        {tabs.map((tab) => {
                          const isActive = tab.id === activeTab.id
                          const tabPanelId = `${menuId}-${tab.id}`
                          return (
                            <motion.li key={tab.id} variants={fadeInUpVariants}>
                              <button
                                type="button"
                                role="tab"
                                id={`mega-tab-${tab.id}`}
                                aria-selected={isActive}
                                aria-controls={tabPanelId}
                                className={`px-0 py-1 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
                                  isActive ? 'text-brand-pink' : 'text-neutral-300 hover:text-brand-pink'
                                }`}
                                onMouseEnter={() => onActiveTabChange?.(tab.id)}
                                onFocus={() => onActiveTabChange?.(tab.id)}
                                onClick={() => onActiveTabChange?.(tab.id)}
                              >
                                {tab.label}
                              </button>
                            </motion.li>
                          )
                        })}
                      </motion.ul>
                    </motion.div>
                  ) : null}

                  <motion.ul
                    className="grid gap-2 text-sm font-medium text-neutral-200 sm:grid-cols-2 lg:grid-cols-3"
                    variants={contentWrapperVariants}
                  >
                    {activeTab.quickLinks.map((link) => (
                      <motion.li key={`${activeTab.id}-${link.href}`} variants={fadeInUpVariants}>
                        <Link
                          href={link.href}
                          className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
                          onClick={() => {
                            trackMegaMenuInteraction({
                              tab: activeTab,
                              linkLabel: link.label,
                              href: link.href,
                              context: 'quick-link'
                            })
                            onNavigate?.()
                            handleClose()
                          }}
                        >
                          <span>{link.label}</span>
                          <ChevronRight className="h-4 w-4 text-brand-pink/70 transition group-hover:translate-x-0.5" aria-hidden />
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>

                  <motion.div
                    id={activePanelId}
                    role="tabpanel"
                    aria-labelledby={panelLabelledBy}
                    className="grid gap-6 md:grid-cols-3"
                    variants={contentWrapperVariants}
                  >
                    {activeTab.columns.map((column) => (
                      <motion.div key={`${activeTab.id}-${column.title}`} className="space-y-3" variants={fadeInUpVariants}>
                        <motion.p
                          className="text-xs font-semibold uppercase tracking-wide text-brand-pink/70"
                          variants={fadeInUpVariants}
                        >
                          {column.title}
                        </motion.p>
                        <motion.ul className="space-y-2" variants={contentWrapperVariants}>
                          {column.links.map((link) => (
                            <motion.li key={`${column.title}-${link.href}`} variants={fadeInUpVariants}>
                              <Link
                                href={link.href}
                                className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm text-white/90 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
                              onClick={() => {
                                trackMegaMenuInteraction({
                                  tab: activeTab,
                                  linkLabel: link.label,
                                  href: link.href,
                                  context: 'column',
                                  columnTitle: column.title
                                })
                                onNavigate?.()
                                handleClose()
                              }}
                            >
                              <span>{link.label}</span>
                              <ChevronRight
                                  className="h-4 w-4 flex-shrink-0 text-brand-pink/70 transition group-hover:translate-x-0.5"
                                  aria-hidden
                                />
                              </Link>
                            </motion.li>
                          ))}
                        </motion.ul>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div className="flex justify-end" variants={fadeInUpVariants}>
                    <Link
                      href={`/coleccion/${activeTab.collectionSlug}?persona=${activeTab.personaFacet}`}
                      className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
                      onClick={() => {
                        trackMegaMenuInteraction({
                          tab: activeTab,
                          linkLabel: activeTab.ctaLabel,
                          href: `/coleccion/${activeTab.collectionSlug}?persona=${activeTab.personaFacet}`,
                          context: 'cta'
                        })
                        onNavigate?.()
                        handleClose()
                      }}
                    >
                      {activeTab.ctaLabel}
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  )
}

type MobileMegaMenuProps = {
  tabs: MegaMenuTab[]
  onNavigate?: () => void
}

function MobileMegaMenu({ tabs, onNavigate }: MobileMegaMenuProps) {
  const visibleTabs = useMemo(() => tabs.slice(0, 3), [tabs])
  const [direction, setDirection] = useState(0)
  const [activeView, setActiveView] = useState<'root' | MegaMenuTab['id']>(() => {
    if (visibleTabs.length === 1) {
      return visibleTabs[0]?.id ?? 'root'
    }
    return 'root'
  })

  useEffect(() => {
    if (!visibleTabs.length) {
      setActiveView('root')
      setDirection(0)
      return
    }

    setActiveView((current) => {
      if (current === 'root') {
        if (visibleTabs.length === 1) {
          return visibleTabs[0].id
        }
        return 'root'
      }

      if (visibleTabs.some((tab) => tab.id === current)) {
        return current
      }

      return visibleTabs.length === 1 ? visibleTabs[0].id : 'root'
    })
    setDirection(0)
  }, [visibleTabs])

  const activeTab = useMemo(() => {
    if (activeView === 'root') return null
    return visibleTabs.find((tab) => tab.id === activeView) ?? null
  }, [activeView, visibleTabs])

  const headingLabel = visibleTabs.length === 1 ? visibleTabs[0]?.label ?? 'Colecciones' : 'Colecciones'

  if (!visibleTabs.length) {
    return null
  }

  const ctaHref = activeTab
    ? `/coleccion/${activeTab.collectionSlug}?persona=${activeTab.personaFacet}`
    : null

  const variants: Variants = {
    enter: (slideDirection: number) => ({
      x: slideDirection > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (slideDirection: number) => ({
      x: slideDirection > 0 ? '-100%' : '100%',
      opacity: 0
    })
  }

  return (
    <div className="space-y-4 md:hidden">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-pink/80">{headingLabel}</p>
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/5">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          {activeView === 'root' ? (
            <motion.div
              key="root-view"
              custom={direction}
              variants={variants}
              initial={direction === 0 ? 'center' : 'enter'}
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-3 p-4 text-sm text-neutral-100"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-pink/70">
                Descubre colecciones pensadas para cada experiencia
              </p>
              <ul className="space-y-2">
                {visibleTabs.map((tab, index) => (
                  <li key={tab.id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 text-left text-sm text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                      onClick={() => {
                        setDirection(index)
                        setActiveView(tab.id)
                      }}
                    >
                      <span className="font-semibold">{tab.label}</span>
                      <ChevronRight className="h-4 w-4 text-brand-pink/70 transition" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : null}

          {activeView !== 'root' && activeTab ? (
            <motion.div
              key={activeTab.id}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4 p-4"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setDirection(-1)
                    setActiveView('root')
                  }}
                  className="absolute left-0 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                  <span className="sr-only">Volver</span>
                </button>
                <span className="text-sm font-semibold uppercase tracking-wide text-brand-pink/70 text-center">
                  {activeTab.label}
                </span>
              </div>
              <div className="space-y-3 text-sm text-neutral-100">
                <ul className="space-y-2">
                  {activeTab.quickLinks.map((link) => (
                    <li key={`${activeTab.id}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="group flex items-center justify-between gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-white/90 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                        onClick={() => {
                          trackMegaMenuInteraction({
                            tab: activeTab,
                            linkLabel: link.label,
                            href: link.href,
                            context: 'quick-link'
                          })
                          onNavigate?.()
                          setDirection(-1)
                          setActiveView('root')
                        }}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-brand-pink/70 transition group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                {activeTab.columns.map((column) => (
                  <div key={`${activeTab.id}-${column.title}`} className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-pink/70">
                      {column.title}
                    </p>
                    <ul className="space-y-2">
                      {column.links.map((link) => (
                        <li key={`${column.title}-${link.href}`}>
                          <Link
                            href={link.href}
                            className="group flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-white/90 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                            onClick={() => {
                              trackMegaMenuInteraction({
                                tab: activeTab,
                                linkLabel: link.label,
                                href: link.href,
                                context: 'column',
                                columnTitle: column.title
                              })
                              onNavigate?.()
                              setDirection(-1)
                              setActiveView('root')
                            }}
                          >
                            <span className="text-sm font-semibold text-white">{link.label}</span>
                            <ChevronRight className="h-4 w-4 text-brand-pink/70 transition group-hover:translate-x-0.5" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {ctaHref && (
                <Link
                  href={ctaHref}
                  className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm"
                  onClick={() => {
                    trackMegaMenuInteraction({
                      tab: activeTab,
                      linkLabel: activeTab.ctaLabel,
                      href: ctaHref,
                      context: 'cta'
                    })
                    onNavigate?.()
                    setDirection(-1)
                    setActiveView('root')
                  }}
                >
                  {activeTab.ctaLabel}
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function MegaMenu({
  variant = 'desktop',
  onNavigate,
  tabId,
  open = false,
  onOpenChange,
  activeTabId,
  onActiveTabChange,
  panelTop = 0,
  menuId = 'mega-menu-panel',
  menuRef,
  activeTrigger
}: MegaMenuProps) {
  const tabs = useMemo(() => {
    if (!tabId) {
      return megaMenuConfig.tabs
    }

    return megaMenuConfig.tabs.filter((tab) => tab.id === tabId)
  }, [tabId])

  if (variant === 'mobile') {
    return <MobileMegaMenu tabs={tabs} onNavigate={onNavigate} />
  }

  return (
    <DesktopMegaMenu
      tabs={tabs}
      onNavigate={onNavigate}
      open={open}
      onOpenChange={onOpenChange}
      activeTabId={activeTabId}
      onActiveTabChange={onActiveTabChange}
      panelTop={panelTop}
      menuId={menuId}
      menuRef={menuRef}
      activeTrigger={activeTrigger}
    />
  )
}
