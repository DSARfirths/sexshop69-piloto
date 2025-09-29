'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, Sparkles } from 'lucide-react'

import { megaMenuConfig } from '@/data/mega-menu.config'
import type { MegaMenuLink, MegaMenuTab } from '@/data/mega-menu.config'

type MegaMenuProps = {
  variant?: 'desktop' | 'mobile'
  onNavigate?: () => void
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

function DesktopMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const tabs = megaMenuConfig.tabs
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
        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 ${
          open
            ? 'bg-brand-primary/20 text-white'
            : 'text-brand-primary/90 hover:bg-brand-primary/15 hover:text-white'
        }`}
      >
        <Sparkles className="h-4 w-4" aria-hidden />
        Categorías
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      <div
        ref={menuRef}
        id="mega-menu-panel"
        aria-hidden={!open}
        className={`absolute left-0 top-full z-30 w-[min(48rem,calc(100vw-2rem))] pt-3 transition duration-150 ease-out ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ transform: open ? 'translateY(0.5rem)' : 'translateY(0.25rem)' }}
      >
        <div className="rounded-3xl border border-brand-primary/30 bg-neutral-950/95 p-6 text-sm text-neutral-100 shadow-2xl ring-1 ring-white/5">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary/80">
                  {activeTab.tagline}
                </span>
                <p className="text-base font-semibold text-neutral-50">{activeTab.label}</p>
                <p className="text-sm text-neutral-300">{activeTab.description}</p>
              </div>

              <div role="tablist" aria-label="Personas" className="flex flex-wrap gap-2">
                {tabs.map((tab) => {
                  const isActive = tab.id === activeTab.id
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      id={`mega-tab-${tab.id}`}
                      aria-selected={isActive}
                      aria-controls={`mega-panel-${tab.id}`}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60 ${
                        isActive
                          ? 'border-brand-primary/70 bg-brand-primary/20 text-white'
                          : 'border-transparent bg-white/5 text-brand-primary/70 hover:border-brand-primary/40 hover:bg-white/10 hover:text-white'
                      }`}
                      onMouseEnter={() => setActiveTabId(tab.id)}
                      onFocus={() => setActiveTabId(tab.id)}
                      onClick={() => setActiveTabId(tab.id)}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeTab.quickLinks.map((link) => (
                  <Link
                    key={`${activeTab.id}-${link.href}`}
                    href={link.href}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-neutral-100 transition hover:border-brand-primary/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
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
                    <ChevronRight className="h-3 w-3 text-brand-primary/80" aria-hidden />
                  </Link>
                ))}
              </div>
            </div>

            <div
              id={`mega-panel-${activeTab.id}`}
              role="tabpanel"
              aria-labelledby={`mega-tab-${activeTab.id}`}
              className="grid gap-6 md:grid-cols-3"
            >
              {activeTab.columns.map((column) => (
                <div key={`${activeTab.id}-${column.title}`} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary/70">
                    {column.title}
                  </p>
                  <ul className="space-y-2">
                    {column.links.map((link: MegaMenuLink) => (
                      <li key={`${column.title}-${link.href}`}>
                        <Link
                          href={link.href}
                          className="group block rounded-xl border border-white/5 bg-white/5 px-3 py-2 transition hover:border-brand-primary/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/60"
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
                              <p className="text-sm font-semibold text-neutral-50">{link.label}</p>
                              {link.description && (
                                <p className="mt-0.5 text-xs text-neutral-300">{link.description}</p>
                              )}
                            </div>
                            <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-primary/80 transition group-hover:translate-x-0.5" aria-hidden />
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
                className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70"
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

function MobileMegaMenu({ onNavigate }: { onNavigate?: () => void }) {
  const tabs = megaMenuConfig.tabs
  const [openTab, setOpenTab] = useState<string | null>(null)

  if (!tabs.length) {
    return null
  }

  return (
    <div className="space-y-4 md:hidden">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary/80">Colecciones</p>
      <div className="space-y-3">
        {tabs.map((tab) => {
          const isOpen = openTab === tab.id
          const panelId = `mega-mobile-${tab.id}`
          const ctaHref = `/coleccion/${tab.collectionSlug}?persona=${tab.personaFacet}`
          return (
            <div key={tab.id} className="overflow-hidden rounded-2xl border border-white/5 bg-white/5">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-semibold text-neutral-50 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70"
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

                <div className="flex flex-wrap gap-2">
                  {tab.quickLinks.map((link) => (
                    <Link
                      key={`${tab.id}-${link.href}`}
                      href={link.href}
                      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-neutral-100 transition hover:border-brand-primary/50 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70"
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
                      <ChevronRight className="h-3 w-3 text-brand-primary/80" aria-hidden />
                    </Link>
                  ))}
                </div>

                <div className="space-y-3">
                  {tab.columns.map((column) => (
                    <div key={`${tab.id}-${column.title}`}>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-primary/70">
                        {column.title}
                      </p>
                      <ul className="mt-2 space-y-2">
                        {column.links.map((link) => (
                          <li key={`${column.title}-${link.href}`}>
                            <Link
                              href={link.href}
                              className="block rounded-xl border border-white/5 bg-white/10 px-3 py-2 text-sm transition hover:border-brand-primary/60 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70"
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
                                  <p className="text-sm font-semibold text-neutral-50">{link.label}</p>
                                  {link.description && (
                                    <p className="mt-0.5 text-xs text-neutral-300">{link.description}</p>
                                  )}
                                </div>
                                <ChevronRight className="mt-1 h-4 w-4 flex-shrink-0 text-brand-primary/80" aria-hidden />
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
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/70"
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

export default function MegaMenu({ variant = 'desktop', onNavigate }: MegaMenuProps) {
  if (variant === 'mobile') {
    return <MobileMegaMenu onNavigate={onNavigate} />
  }

  return <DesktopMegaMenu onNavigate={onNavigate} />
}
