"use client"

import Link from "next/link"
import {
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import type { MegaMenuCategory } from "@/data/mega-menu.config"

import { createFocusTrap, splitIntoColumns, setRootNavOverlay } from "./menu-utils"
import styles from "./HeaderSheet.module.css"

type DesktopMenuProps = {
  categories: MegaMenuCategory[]
  onNavigate?: () => void
}

const BACKDROP_ID = "nav-mega-menu-backdrop"

export function DesktopMenu({ categories, onNavigate }: DesktopMenuProps) {
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState(() => categories[0]?.id ?? "")

  const containerRef = useRef<HTMLDivElement | null>(null)
  const sheetRef = useRef<HTMLDivElement | null>(null)
  const notchRef = useRef<HTMLButtonElement | null>(null)

  const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const shouldReduceMotion = useReducedMotion()

  const activeCategory = useMemo(() => {
    return categories.find((category) => category.id === activeId) ?? categories[0] ?? null
  }, [activeId, categories])

  useEffect(() => {
    if (!categories.length) {
      setActiveId("")
      setOpen(false)
      return
    }

    setActiveId((current) => {
      if (categories.some((category) => category.id === current)) {
        return current
      }
      return categories[0]?.id ?? ""
    })
  }, [categories])

  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  const isNodeWithinInteractiveArea = useCallback(
    (node: Node | null) => {
      if (!node) return false
      if (containerRef.current?.contains(node)) return true
      if (sheetRef.current?.contains(node)) return true
      if (notchRef.current?.contains(node)) return true
      return false
    },
    []
  )

  const scheduleOpen = useCallback(
    (categoryId: string) => {
      if (!categoryId) {
        return
      }
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }

      setActiveId(categoryId)

      openTimeoutRef.current = setTimeout(() => {
        setOpen(true)
      }, open ? 0 : 80)
    },
    [open]
  )

  const scheduleClose = useCallback(
    (delay = 140) => {
      if (openTimeoutRef.current) {
        clearTimeout(openTimeoutRef.current)
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }

      closeTimeoutRef.current = setTimeout(() => {
        setOpen(false)
      }, delay)
    },
    []
  )

  const handleTriggerLeave = useCallback(
    (event: MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement>) => {
      const nextTarget = event.relatedTarget as Node | null
      if (isNodeWithinInteractiveArea(nextTarget)) {
        return
      }
      scheduleClose()
    },
    [isNodeWithinInteractiveArea, scheduleClose]
  )

  useEffect(() => {
    setRootNavOverlay("desktop", open)
    return () => {
      setRootNavOverlay("desktop", false)
    }
  }, [open])
  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (isNodeWithinInteractiveArea(target)) {
        return
      }
      setOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return
      }
      event.preventDefault()
      setOpen(false)
      const trigger = triggerRefs.current[activeCategory?.id ?? ""]
      trigger?.focus()
    }

    document.addEventListener("pointerdown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [open, isNodeWithinInteractiveArea, activeCategory?.id])

  useEffect(() => {
    const sheet = sheetRef.current
    if (!open || !sheet) {
      return
    }

    const extras = notchRef.current ? [notchRef.current] : []


    const trap = createFocusTrap(sheet, extras)

    const handleKeyDown = (event: KeyboardEvent) => {
      trap(event)
    }

    sheet.addEventListener("keydown", handleKeyDown)

    return () => {
      sheet.removeEventListener("keydown", handleKeyDown)
    }
  }, [open])

  const accentStyle = useMemo(() => {
    return {
      "--sheet-accent": activeCategory?.accentColor ?? "#ff2193"
    } as CSSProperties
  }, [activeCategory?.accentColor])

  const sheetVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : -24
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: 160,
          damping: 24,
          duration: shouldReduceMotion ? 0.18 : undefined
        }
      },
      exit: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : -18,
        transition: {
          duration: 0.16,
          ease: "easeInOut"
        }
      }
    }),
    [shouldReduceMotion]
  )

  const itemVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        y: shouldReduceMotion ? 0 : 12
      },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: 220,
          damping: 26,
          duration: shouldReduceMotion ? 0.18 : undefined
        }
      }
    }),
    [shouldReduceMotion]
  )

  const listVariants = useMemo(
    () => ({
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.04,
          delayChildren: shouldReduceMotion ? 0 : 0.08
        }
      }
    }),
    [shouldReduceMotion]
  )

  const notchVariants = useMemo(
    () => ({
      hidden: {
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.92,
        y: shouldReduceMotion ? 0 : -8
      },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          type: shouldReduceMotion ? "tween" : "spring",
          stiffness: 260,
          damping: 18,
          duration: shouldReduceMotion ? 0.16 : undefined
        }
      },
      exit: {
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.9,
        y: shouldReduceMotion ? 0 : -6,
        transition: {
          duration: 0.14,
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

  const renderedSections = useMemo(() => {
    if (!activeCategory) {
      return []
    }
    return splitIntoColumns(activeCategory.sections, 3)
  }, [activeCategory])

  if (!categories.length || !activeCategory) {
    return null
  }

  return (
    <div ref={containerRef} className="relative hidden h-full items-center md:flex">
      <div className="flex items-center gap-2 rounded-full bg-white/10 px-1 py-1 text-sm">
        {categories.map((category) => {
          const isActive = open && activeCategory.id === category.id
          const triggerAccent = {
            "--accent": category.accentColor
          } as CSSProperties

          return (
            <button
              key={category.id}
              ref={(node) => {
                triggerRefs.current[category.id] = node
              }}
              type="button"
              className="relative inline-flex items-center justify-center rounded-full px-6 py-3 font-semibold uppercase tracking-[0.14em] text-white transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 hover:-translate-y-0.5 data-[active='true']:text-brand-black"
              style={triggerAccent}
              data-active={isActive}
              aria-expanded={isActive}
              aria-controls={isActive ? `${category.id}-sheet` : undefined}
              onMouseEnter={() => scheduleOpen(category.id)}
              onFocus={() => scheduleOpen(category.id)}
              onMouseLeave={handleTriggerLeave}
              onBlur={handleTriggerLeave}
              onClick={() => {
                if (isActive) {
                  setOpen(false)
                  return
                }
                scheduleOpen(category.id)
              }}
            >
              <span className="relative z-10 text-[clamp(0.9rem,0.8rem+0.4vw,1.05rem)] font-brand">
                {category.label}
              </span>
              <span
                className="pointer-events-none absolute inset-0 -z-[1] rounded-full bg-gradient-to-r from-white/25 via-white/20 to-[var(--accent)] opacity-0 transition duration-200 data-[active='true']:opacity-100"
                data-active={isActive}
              />
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              key={BACKDROP_ID}
              className={`fixed inset-0 z-[45] bg-black/60 ${styles.backdrop}`}
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-hidden
            />

            <motion.aside
              key={activeCategory.id}
              ref={sheetRef}
              id={`${activeCategory.id}-sheet`}
              aria-labelledby={`${activeCategory.id}-title`}
              aria-modal="true"
              role="dialog"
              className={`fixed inset-0 z-[46] flex justify-center overflow-y-auto px-[clamp(16px,4vw,36px)] pb-[clamp(32px,6vh,64px)] pt-[calc(var(--nav-height)+clamp(12px,2.2vw,28px))] text-white ${styles.sheet}`}
              style={accentStyle}
              variants={sheetVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className={`relative flex w-full max-w-[1180px] flex-col rounded-[32px] p-[clamp(24px,3vw,48px)] text-left max-h-[calc(100vh-160px)] ${styles.sheetContent}`}
              >
                <div className={`flex w-full flex-col gap-8 ${styles.sheetScroller}`}>
                  <header className="flex flex-col gap-3">
                    <p
                      id={`${activeCategory.id}-title`}
                      className="text-[clamp(1.45rem,1.1rem+1vw,2.2rem)] font-semibold uppercase tracking-[0.18em] text-[var(--sheet-accent)]"
                    >
                      Menú principal
                    </p>
                    <p className="text-[clamp(2rem,1.8rem+0.6vw,2.6rem)] font-brand font-semibold uppercase tracking-[0.24em] text-white">
                      {activeCategory.label}
                    </p>
                  </header>

                  <div className="grid w-full gap-[clamp(20px,3vw,40px)] md:grid-cols-3">
                    {renderedSections.map((column, columnIndex) => (
                      <div key={`column-${columnIndex}`} className="flex flex-col gap-8">
                        {column.map((section) => (
                          <div key={section.name} className="flex flex-col gap-4">
                            <p className="text-[var(--sheet-accent)] text-sm font-semibold uppercase tracking-[0.18em]">
                              {section.name}
                            </p>
                            <motion.ul
                              variants={listVariants}
                              initial="hidden"
                              animate="visible"
                              className="flex flex-col gap-3"
                            >
                              {section.subcategories.map((subcategory) => (
                                <motion.li
                                  key={subcategory.name}
                                  variants={itemVariants}
                                  className={styles.listItem}
                                >
                                  <Link
                                    href={subcategory.href}
                                    className="block rounded-[14px] border border-white/10 bg-white/10 px-4 py-3 text-[clamp(0.95rem,0.9rem+0.4vw,1.05rem)] font-medium tracking-[0.04em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-white/15 hover:to-[var(--sheet-accent)] hover:text-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                                    onClick={() => {
                                      onNavigate?.()
                                      setOpen(false)
                                    }}
                                  >
                                    {subcategory.name}
                                  </Link>
                                </motion.li>
                              ))}
                            </motion.ul>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.aside>

            <motion.button
              key="desktop-notch"
              ref={notchRef}
              type="button"
              onClick={() => setOpen(false)}
              className={`fixed right-[clamp(16px,4vw,36px)] top-[calc(var(--nav-height)+clamp(12px,2.2vw,28px)-6px)] z-[47] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white transition hover:border-[var(--sheet-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${styles.notch}`}
              style={accentStyle}
              variants={notchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              aria-label="Cerrar menú"
            >
              <span className="relative block h-4 w-4">
                <span className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </motion.button>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  )
}