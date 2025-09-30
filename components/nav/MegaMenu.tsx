'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

import { megaMenuConfig } from '@/data/mega-menu.config'
import type { MegaMenuTab } from '@/data/mega-menu.config'

type MegaMenuProps = {
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
  tabId?: MegaMenuTab['id']
  triggerLabel?: string
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
  triggerLabel?: string
}

function DesktopMegaMenu({ tabs, onNavigate, triggerLabel }: DesktopMegaMenuProps) {
  const hasTabs = tabs.length > 0
  const [open, setOpen] = useState(false)
  const [activeTabId, setActiveTabId] = useState(tabs[0]?.id ?? '')
  const containerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [panelTop, setPanelTop] = useState(0)

  const activeTab = useMemo(() => {
    if (!tabs.length) return undefined
    return tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]
  }, [tabs, activeTabId])

  useEffect(() => {
    if (!tabs.length) {
      setActiveTabId('')
      return
    }

    setActiveTabId((currentId) => {
      if (tabs.some((tab) => tab.id === currentId)) {
        return currentId
      }

      return tabs[0].id
    })
  }, [tabs])

  const buttonLabel = triggerLabel ?? (tabs.length === 1 ? tabs[0]?.label ?? 'Categorías' : 'Categorías')

  const clearScheduledClose = useCallback(() => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
  }, [])

  const scheduleClose = useCallback(() => {
    clearScheduledClose()
    closeTimeout.current = setTimeout(() => {
      setOpen(false)
      closeTimeout.current = null
    }, 160)
  }, [clearScheduledClose])

  const handleOpen = useCallback(() => {
    if (!hasTabs) return
    clearScheduledClose()
    setOpen(true)
  }, [clearScheduledClose, hasTabs])

  const handleClose = useCallback(() => {
    clearScheduledClose()
    setOpen(false)
  }, [clearScheduledClose])

  const updatePanelPosition = useCallback(() => {
    const header = containerRef.current?.closest('header')
    if (header) {
      const rect = header.getBoundingClientRect()
      setPanelTop(rect.bottom)
      return
    }

    const triggerRect = triggerRef.current?.getBoundingClientRect()
    if (triggerRect) {
      setPanelTop(triggerRect.bottom)
      return
    }

    setPanelTop(0)
  }, [])

  useEffect(() => {
    return () => {
      clearScheduledClose()
    }
  }, [clearScheduledClose])

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

  useEffect(() => {
    if (!open) return

    function onPointerDown(event: MouseEvent) {
      const target = event.target as Node | null
      if (!target) return
      if (containerRef.current?.contains(target)) return
      handleClose()
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return
      if (!open) return
      event.preventDefault()
      handleClose()
      triggerRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onEscape)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onEscape)
    }
  }, [open, handleClose])

  useEffect(() => {
    if (!open) return
    if (typeof document === 'undefined') return
    if (document.activeElement !== triggerRef.current) return

    const focusable = menuRef.current?.querySelector<HTMLElement>('button, a')
    focusable?.focus({ preventScroll: true })
  }, [open, activeTab])

  if (!hasTabs) {
    return null
  }

  if (!activeTab) {
    return null
  }

  return (
    <div
      ref={containerRef}
      className="relative hidden md:block"
      onMouseEnter={handleOpen}
      onMouseLeave={scheduleClose}
      onFocusCapture={handleOpen}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          scheduleClose()
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mega-menu-panel"
        onClick={() => {
          if (open) {
            handleClose()
          } else {
            handleOpen()
          }
        }}
        data-active={open}
        className="nav-link inline-flex items-center justify-center rounded-full px-5 py-3 text-lg font-semibold uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
      >
        <span className="relative z-10">{buttonLabel}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mega-menu-layer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-x-0 z-30 flex justify-center pt-4 pb-10"
            style={{ top: panelTop }}
            onMouseEnter={clearScheduledClose}
            onMouseLeave={scheduleClose}
          >
            <div className="pointer-events-auto w-full max-w-7xl px-4">
              <div
                ref={menuRef}
                id="mega-menu-panel"
                aria-hidden={!open}
                className="max-h-[calc(100vh-6rem)] overflow-y-auto rounded-3xl bg-neutral-950 p-8 text-sm text-white shadow-2xl md:p-10"
              >
                <div className="flex flex-col gap-8">
                  {tabs.length > 1 ? (
                    <div role="tablist" aria-label="Personas">
                      <ul className="flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-[0.2em]">
                        {tabs.map((tab) => {
                          const isActive = tab.id === activeTab.id
                          return (
                            <li key={tab.id}>
                              <button
                                type="button"
                                role="tab"
                                id={`mega-tab-${tab.id}`}
                                aria-selected={isActive}
                                aria-controls={`mega-panel-${tab.id}`}
                                className={`px-0 py-1 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink ${
                                  isActive
                                    ? 'text-brand-pink'
                                    : 'text-neutral-300 hover:text-brand-pink'
                                }`}
                                onMouseEnter={() => setActiveTabId(tab.id)}
                                onFocus={() => setActiveTabId(tab.id)}
                                onClick={() => setActiveTabId(tab.id)}
                              >
                                {tab.label}
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  ) : null}

                  <ul className="grid gap-2 text-sm font-medium text-neutral-200 sm:grid-cols-2 lg:grid-cols-3">
                    {activeTab.quickLinks.map((link) => (
                      <li key={`${activeTab.id}-${link.href}`}>
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
                      </li>
                    ))}
                  </ul>

                  <div
                    id={`mega-panel-${activeTab.id}`}
                    role="tabpanel"
                    aria-labelledby={`mega-tab-${activeTab.id}`}
                    className="grid gap-6 md:grid-cols-3"
                  >
                    {activeTab.columns.map((column) => (
                      <div key={`${activeTab.id}-${column.title}`} className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-pink/70">
                          {column.title}
                        </p>
                        <ul className="space-y-2">
                          {column.links.map((link) => (
                            <li key={`${column.title}-${link.href}`}>
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
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
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
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
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
              transition={{ duration: 0.28, ease: 'easeInOut' }}
              className="space-y-3 px-4 py-5"
            >
              <div className="space-y-2">
                {visibleTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setDirection(1)
                      setActiveView(tab.id)
                    }}
                    className="group flex w-full items-center justify-between gap-2 rounded-xl bg-white/5 px-4 py-3 text-left transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                  >
                    <span className="text-sm font-semibold text-white">{tab.label}</span>
                    <ChevronRight className="h-4 w-4 text-brand-pink/70 transition group-hover:translate-x-0.5" aria-hidden />
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            activeTab && (
              <motion.div
                key={activeTab.id}
                custom={direction}
                variants={variants}
                initial={direction === 0 ? 'center' : 'enter'}
                animate="center"
                exit="exit"
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="space-y-5 px-4 py-5"
              >
                <div className="relative flex min-h-[2.75rem] items-center justify-center px-12">
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
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function MegaMenu({
  variant = 'desktop',
  onNavigate,
  tabId,
  triggerLabel
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

  return <DesktopMegaMenu tabs={tabs} onNavigate={onNavigate} triggerLabel={triggerLabel} />
}
