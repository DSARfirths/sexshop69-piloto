"use client"

import Link from "next/link"
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronRight, Menu, X } from "lucide-react"

import type { MegaMenuCategory } from "@/data/mega-menu.config"

import { createFocusTrap } from "./menu-utils"
import styles from "./MobileMenu.module.css"

type MobileMenuProps = {
  categories: MegaMenuCategory[]
  onNavigate?: () => void
}

const MENU_ID = "nav-mega-menu-mobile"

export function MobileMenu({ categories, onNavigate }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null)

  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const lastFocusedRef = useRef<HTMLElement | null>(null)

  const shouldReduceMotion = useReducedMotion()

  const defaultAccent = categories[0]?.accentColor ?? "#ff2193"

  const activeAccent = useMemo(() => {
    const expanded = categories.find((category) => category.id === expandedCategoryId)
    return expanded?.accentColor ?? defaultAccent
  }, [categories, defaultAccent, expandedCategoryId])

  useEffect(() => {
    if (!open) {
      document.documentElement.style.overflow = ""
      return
    }
    document.documentElement.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const menu = menuRef.current
    if (!menu) {
      return
    }

    const extras = [hamburgerRef.current].filter(
      (element): element is HTMLElement => Boolean(element)
    )
    const trap = createFocusTrap(menu, extras)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeMenu()
        return
      }
      trap(event)
    }

    menu.addEventListener("keydown", handleKeyDown)

    return () => {
      menu.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const closeMenu = useCallback(() => {
    setOpen(false)
    setExpandedCategoryId(null)
  }, [])

  const openMenu = useCallback(() => {
    lastFocusedRef.current = document.activeElement as HTMLElement | null
    setOpen(true)
  }, [])

  useEffect(() => {
    if (!open) {
      const lastFocused = lastFocusedRef.current
      if (lastFocused) {
        lastFocused.focus()
      }
    }
  }, [open])

  const panelVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : -48
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: 140,
          damping: 22,
          duration: shouldReduceMotion ? 0.18 : undefined
        }
      },
      exit: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : -42,
        transition: {
          duration: 0.16,
          ease: "easeInOut"
        }
      }
    }),
    [shouldReduceMotion]
  )

  const backdropVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { duration: 0.18, ease: "easeOut" }
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.12, ease: "easeInOut" }
      }
    }),
    []
  )

  const itemVariants = useMemo(
    () => ({
      hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: 220,
          damping: 26,
          duration: shouldReduceMotion ? 0.16 : undefined
        }
      }
    }),
    [shouldReduceMotion]
  )

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setExpandedCategoryId((current) => (current === categoryId ? null : categoryId))
  }, [])

  const handleNavigate = useCallback(() => {
    onNavigate?.()
    closeMenu()
  }, [closeMenu, onNavigate])

  if (!categories.length) {
    return null
  }

  const containerStyle = {
    "--active-accent": activeAccent
  } as CSSProperties

  return (
    <div className="flex items-center md:hidden">
      <button
        ref={hamburgerRef}
        type="button"
        aria-expanded={open}
        aria-controls={MENU_ID}
        onClick={() => {
          if (open) {
            closeMenu()
            return
          }
          openMenu()
        }}
        className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-black/10 bg-neutral-100 text-neutral-900 transition hover:-translate-y-0.5 hover:text-[var(--active-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--active-accent)]/60"
        style={containerStyle}
      >
        <span className="sr-only">{open ? "Cerrar men\u00FA" : "Abrir men\u00FA"}</span>
        {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              className={`fixed inset-0 z-[49] bg-black/55 ${styles.backdrop}`}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-hidden
            />

            <motion.div
              ref={menuRef}
              id={MENU_ID}
              role="dialog"
              aria-modal="true"
              className={`fixed inset-0 z-[50] flex flex-col bg-[#050505] text-white ${styles.panel}`}
              style={containerStyle}
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="flex items-center justify-between px-[clamp(16px,6vw,28px)] pb-3 pt-[calc(var(--nav-height)+12px)]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--active-accent)]">
                  Explorar categor\u00EDas
                </p>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-[var(--active-accent)]/80 hover:text-[var(--active-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--active-accent)]/70"
                >
                  <span className="sr-only">Cerrar men\u00FA</span>
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-[clamp(16px,6vw,28px)] pb-10">
                <nav className="flex flex-col gap-3">
                  {categories.map((category) => {
                    const isExpanded = expandedCategoryId === category.id
                    return (
                      <div key={category.id} className="rounded-2xl border border-white/8 bg-white/5">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-[clamp(0.95rem,0.9rem+0.4vw,1.1rem)] font-semibold uppercase tracking-[0.14em] transition hover:text-[var(--active-accent)]"
                          aria-expanded={isExpanded}
                          data-expanded={isExpanded}
                          onClick={() => handleCategoryToggle(category.id)}
                        >
                          <span>{category.label}</span>
                          <ChevronRight
                            className="h-5 w-5 transition-transform duration-200 data-[expanded='true']:rotate-90"
                            data-expanded={isExpanded}
                            aria-hidden
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded ? (
                            <motion.div
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="overflow-hidden px-5 pb-4"
                            >
                              <div className="flex flex-col gap-6">
                                {category.sections.map((section) => (
                                  <div key={section.name} className="flex flex-col gap-3">
                                    <p className="text-[var(--active-accent)] text-sm font-semibold uppercase tracking-[0.16em]">
                                      {section.name}
                                    </p>
                                    <ul className="flex flex-col gap-2">
                                      {section.subcategories.map((subcategory) => (
                                        <li key={subcategory.name}>
                                          <Link
                                            href={subcategory.href}
                                            className="block rounded-xl px-2 py-2 text-[clamp(0.95rem,0.9rem+0.3vw,1.05rem)] font-medium text-white/90 transition hover:translate-x-1 hover:text-[var(--active-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--active-accent)]/60"
                                            onClick={handleNavigate}
                                          >
                                            {subcategory.name}
                                          </Link>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </nav>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}


