'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import type { Product } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

type BestSellersProps = {
  products: Product[]
  headingId?: string
  title?: string
  description?: string
  ctaHref?: string
  ctaLabel?: string
  highlightBadges?: Record<string, string>
  showBestSellerHighlight?: boolean
  layout?: 'grid' | 'carousel'
  maxVisible?: number
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

export default function BestSellers({
  products,
  headingId,
  title = 'Más vendidos',
  description = 'Selección curada por preferencia de la comunidad y disponibilidad inmediata.',
  ctaHref = '/categoria/bienestar',
  ctaLabel = 'Descubrir más',
  highlightBadges,
  showBestSellerHighlight = true,
  layout = 'grid',
  maxVisible
}: BestSellersProps) {
  const displayedProducts = useMemo(
    () => (maxVisible ? products.slice(0, maxVisible) : products),
    [maxVisible, products]
  )

  const railRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    const rail = railRef.current
    if (!rail) return
    const { scrollLeft, scrollWidth, clientWidth } = rail
    setCanScrollLeft(scrollLeft > 8)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 8)
  }

  useEffect(() => {
    if (layout !== 'carousel') return

    updateScrollButtons()
    const rail = railRef.current
    if (!rail) return

    const handleScroll = () => updateScrollButtons()
    rail.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)

    return () => {
      rail.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [layout, displayedProducts.length])

  if (!displayedProducts.length) return null

  const scrollBy = (direction: 'left' | 'right') => {
    const rail = railRef.current
    if (!rail) return
    const amount = direction === 'left' ? -rail.clientWidth + 120 : rail.clientWidth - 120
    rail.scrollBy({ left: amount, behavior: 'smooth' })
  }

  return (
    <section className="space-y-6" aria-labelledby={headingId ?? undefined}>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id={headingId} className="text-2xl font-semibold text-neutral-900">
              {title}
            </h2>
            <p className="text-sm text-neutral-600">{description}</p>
          </div>
          {ctaHref && (
            <Link
              href={ctaHref}
              role="button"
              className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-primary transition-colors hover:text-brand-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {ctaLabel}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </motion.div>
      {layout === 'carousel' ? (
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/60 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/60 to-transparent"
            aria-hidden
          />
          <div
            ref={railRef}
            className="-mx-4 flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-live="polite"
          >
            {displayedProducts.map((product, index) => (
              <motion.div
                key={product.slug}
                className="min-w-[240px] max-w-[320px] basis-[80%] snap-start flex-shrink-0 sm:basis-[45%] lg:basis-[28%] xl:basis-[22%]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
              >
                <ProductCard
                  p={product}
                  highlightBadge={
                    highlightBadges?.[product.slug] ??
                    (showBestSellerHighlight && product.bestSeller ? 'Best Seller' : undefined)
                  }
                />
              </motion.div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-1">
            <button
              type="button"
              onClick={() => scrollBy('left')}
              disabled={!canScrollLeft}
              aria-label="Ver productos anteriores"
              className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-900 shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                canScrollLeft ? 'hover:bg-white' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollBy('right')}
              disabled={!canScrollRight}
              aria-label="Ver productos siguientes"
              className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-900 shadow-lg transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 ${
                canScrollRight ? 'hover:bg-white' : 'cursor-not-allowed opacity-50'
              }`}
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
            >
              <ProductCard
                p={product}
                highlightBadge={
                  highlightBadges?.[product.slug] ??
                  (showBestSellerHighlight && product.bestSeller ? 'Best Seller' : undefined)
                }
              />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  )
}
