'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Search, X } from 'lucide-react'

import { allProducts } from '@/lib/products'

const MotionOverlay: any = motion.div
const MotionSheet: any = motion.div
const MotionResult: any = motion.li
const MotionEmpty: any = motion.p

type SearchOverlayProps = {
  open: boolean
  onClose: () => void
}

const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const SHEET_VARIANTS = {
  hidden: { y: '-5%', opacity: 0.8 },
  visible: { y: 0, opacity: 1 }
}

export default function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const products = useMemo(() => allProducts(), [])
  const [mounted, setMounted] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  const filteredProducts = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) {
      return products.slice(0, 12)
    }
    return products
      .filter((product) => {
        const name = product.name.toLowerCase()
        const sku = product.sku.toLowerCase()
        const category = product.category.toLowerCase()
        return name.includes(value) || sku.includes(value) || category.includes(value)
      })
      .slice(0, 20)
  }, [products, query])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <MotionOverlay
          key="search-overlay"
          className="fixed inset-0 z-[9999]"
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <MotionOverlay
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            variants={BACKDROP_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            aria-hidden="true"
            onClick={onClose}
          />
          <MotionSheet
            role="dialog"
            aria-modal="true"
            aria-label="Buscador de productos"
            className="absolute inset-x-0 top-0 mx-auto flex max-w-3xl flex-col rounded-b-3xl border border-neutral-200 bg-white/95 shadow-xl backdrop-blur"
            variants={SHEET_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 border-b border-neutral-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
                <Search className="h-5 w-5" />
              </div>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Busca por nombre, SKU o categoría"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
                aria-label="Cerrar buscador"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-4">
              <AnimatePresence initial={false}>
                {filteredProducts.length > 0 ? (
                  <ul className="space-y-3">
                    {filteredProducts.map((product) => (
                      <MotionResult
                        key={product.slug}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="rounded-2xl border border-neutral-100 bg-white/80 p-4 shadow-sm backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-neutral-900">
                              {highlightMatches(product.name, query)}
                            </h3>
                            <p className="mt-1 text-xs uppercase tracking-wide text-neutral-500">
                              SKU: {highlightMatches(product.sku, query)}
                            </p>
                            <p className="mt-1 text-xs text-neutral-500">
                              Categoría: {highlightMatches(product.category, query)}
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-brand-primary">
                            S/ {(product.salePrice ?? product.regularPrice).toFixed(2)}
                          </span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2 text-sm">
                          <Link
                            href={`/producto/${product.slug}`}
                            onClick={onClose}
                            className="inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/10 px-4 py-2 font-medium text-brand-primary transition hover:bg-brand-primary/20"
                          >
                            Ver producto
                          </Link>
                          <a
                            href={`https://wa.me/51924281623?text=Consulta%20${encodeURIComponent(product.sku)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 font-medium text-neutral-700 transition hover:border-brand-primary/40 hover:text-brand-primary"
                            onClick={onClose}
                          >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </a>
                        </div>
                      </MotionResult>
                    ))}
                  </ul>
                ) : (
                  <MotionEmpty
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-dashed border-neutral-200 bg-white/80 p-6 text-center text-sm text-neutral-500"
                  >
                    No encontramos coincidencias. Prueba con otro término o revisa las categorías destacadas.
                  </MotionEmpty>
                )}
              </AnimatePresence>
            </div>
          </MotionSheet>
        </MotionOverlay>
      )}
    </AnimatePresence>,
    document.body
  )
}

function highlightMatches(text: string, rawQuery: string) {
  if (!rawQuery) return text
  const query = rawQuery.trim()
  if (!query) return text
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(escaped, 'gi')
  const matches = text.match(regex)
  if (!matches) return text
  const parts = text.split(regex)
  const highlighted: ReactNode[] = []
  parts.forEach((part, index) => {
    if (part) {
      highlighted.push(part)
    }
    if (matches[index]) {
      highlighted.push(
        <mark key={`${text}-${index}-${matches[index]}`} className="rounded bg-brand-primary/20 px-1 text-brand-primary">
          {matches[index]}
        </mark>
      )
    }
  })
  return highlighted
}
