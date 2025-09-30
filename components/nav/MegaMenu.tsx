'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

import { megaMenuConfig } from '@/data/mega-menu.config'
import type { MegaMenuLink, MegaMenuTab } from '@/data/mega-menu.config'

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

  useEffect(() => {
    return () => {
      clearScheduledClose()
    }
  }, [clearScheduledClose])

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

      <div
        ref={menuRef}
        id="mega-menu-panel"
        aria-hidden={!open}
        className={`absolute left-0 right-0 top-full z-30 mx-auto w-full max-w-7xl px-4 pt-3 transition duration-150 ease-out ${
          open
            ? 'pointer-events-auto translate-y-2 opacity-100'
            : 'pointer-events-none translate-y-1 opacity-0'
        }`}
      >
        <div className="mx-auto w-full rounded-3xl bg-neutral-950 p-8 text-sm text-white shadow-2xl md:p-10">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-pink/80">
                  {activeTab.tagline}
                </span>
                <p className="text-base font-semibold text-neutral-50">{activeTab.label}</p>
                <p className="text-sm text-neutral-300">{activeTab.description}</p>
              </div>

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

              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-xs font-medium text-neutral-200">
                {activeTab.quickLinks.map((link) => (
                  <li key={`${activeTab.id}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-1 transition hover:text-brand-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
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
                      <ChevronRight className="h-3 w-3 text-brand-pink/70" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div
              id={`mega-panel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`mega-tab-${activeTab.id}`}
              className="grid gap-8 md:grid-cols-4 xl:grid-cols-5"
            >
              {activeTab.columns.map((column) => (
                <div key={`${activeTab.id}-${column.title}`} className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-pink/70">
                    {column.title}
                  </p>
                  <ul className="space-y-2">
                    {column.links.map((link: MegaMenuLink) => (
                      <li key={`${column.title}-${link.href}`}>
                        <Link
                          href={link.href}
                          className="group block px-1 py-1 text-sm text-white/90 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
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
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-white">{link.label}</p>
                              {link.description && (
                                <p className="mt-0.5 text-xs text-white/70">{link.description}</p>
                              )}
                            </div>
                            <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-pink/70 transition group-hover:translate-x-0.5" aria-hidden />
                          </div>
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
    </div>
  )
}

type MobileMegaMenuProps = {
  tabs: MegaMenuTab[]
  onNavigate?: () => void
}

function MobileMegaMenu({ tabs, onNavigate }: MobileMegaMenuProps) {
  const [openTab, setOpenTab] = useState<string | null>(() => (tabs.length === 1 ? tabs[0]?.id ?? null : null))

  useEffect(() => {
    if (!tabs.length) {
      setOpenTab(null)
      return
    }

    setOpenTab((current) => {
      if (tabs.length === 1) {
        return tabs[0].id
      }

      if (current && tabs.some((tab) => tab.id === current)) {
        return current
      }

      return null
    })
  }, [tabs])

  const headingLabel = tabs.length === 1 ? tabs[0]?.label ?? 'Colecciones' : 'Colecciones'

  if (!tabs.length) {
    return null
  }

  return (
    <div className="space-y-4 md:hidden">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-pink/80">{headingLabel}</p>
      <div className="space-y-3">
        {tabs.map((tab) => {
          const isOpen = openTab === tab.id
          const panelId = `mega-mobile-${tab.id}`
          const ctaHref = `/coleccion/${tab.collectionSlug}?persona=${tab.personaFacet}`
          return (
            <div key={tab.id} className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-neutral-50 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpenTab((current) => (current === tab.id ? null : tab.id))
                }}
              >
                <span>{tab.label}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>

              <div
                id={panelId}
                className={`space-y-4 border-t border-white/5 px-4 pb-4 pt-4 text-sm text-neutral-100 transition ${
                  isOpen ? 'opacity-100' : 'hidden opacity-0'
                }`}
              >
                <p className="text-neutral-300">{tab.description}</p>

                <ul className="space-y-2 text-sm">
                  {tab.quickLinks.map((link) => (
                    <li key={`${tab.id}-${link.href}`}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-white/90 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                        onClick={() => {
                          trackMegaMenuInteraction({
                            tab,
                            linkLabel: link.label,
                            href: link.href,
                            context: 'quick-link'
                          })
                          onNavigate?.()
                          setOpenTab(null)
                        }}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-3 w-3 text-brand-pink/70" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="space-y-3">
                  {tab.columns.map((column) => (
                    <div key={`${tab.id}-${column.title}`}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-pink/70">
                        {column.title}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {column.links.map((link) => (
                          <li key={`${column.title}-${link.href}`}>
                            <Link
                              href={link.href}
                              className="block px-1 py-1 text-sm text-white/90 transition hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                              onClick={() => {
                                trackMegaMenuInteraction({
                                  tab,
                                  linkLabel: link.label,
                                  href: link.href,
                                  context: 'column',
                                  columnTitle: column.title
                                })
                                onNavigate?.()
                                setOpenTab(null)
                              }}
                            >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-white">{link.label}</p>
                                    {link.description && (
                                      <p className="mt-0.5 text-xs text-white/70">{link.description}</p>
                                    )}
                                  </div>
                                  <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-pink/70" aria-hidden />
                                </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                  <Link
                    href={ctaHref}
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-2 text-sm"
                    onClick={() => {
                      trackMegaMenuInteraction({
                        tab,
                        linkLabel: tab.ctaLabel,
                        href: ctaHref,
                        context: 'cta'
                      })
                      onNavigate?.()
                      setOpenTab(null)
                    }}
                  >
                    {tab.ctaLabel}
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Link>
              </div>
            </div>
          )
        })}
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
