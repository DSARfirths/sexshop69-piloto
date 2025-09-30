'use client'

import { ComponentType, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, type Variants, type HTMLMotionProps } from 'framer-motion'
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

type MotionElementProps<T extends keyof HTMLElementTagNameMap> = PropsWithChildren<
  HTMLMotionProps<T> & { className?: string }
>

const MotionDiv = motion.div as ComponentType<MotionElementProps<'div'>>

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
    <section
      className="relative space-y-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white px-4 py-8 shadow-sm sm:px-6 lg:px-8"
      aria-labelledby={headingId ?? undefined}
    >
      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id={headingId} className="font-heading text-2xl font-semibold text-neutral-900">
              {title}
            </h2>
            <p className="text-sm text-neutral-600">{description}</p>
          </div>
          {ctaHref && (
            <Link
              href={ctaHref}
              role="button"
              className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-fuchsia-600 transition-colors hover:text-fuchsia-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {ctaLabel}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </MotionDiv>
      {layout === 'carousel' ? (
        <div className="relative">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent"
            aria-hidden
          />
          <div
            ref={railRef}
            className="-mx-4 flex gap-4 overflow-x-auto scroll-smooth px-4 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-live="polite"
          >
            {displayedProducts.map((product, index) => (
              <MotionDiv
                key={product.slug}
                className="min-w-[220px] max-w-[280px] basis-[70%] snap-start flex-shrink-0 sm:basis-[40%] lg:basis-[22%] xl:basis-[20%]"
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
              </MotionDiv>
            ))}
          </div>
          {displayedProducts.length > 3 && (
            <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 justify-between px-1 md:flex">
              <button
                type="button"
                onClick={() => scrollBy('left')}
                disabled={!canScrollLeft}
                aria-label="Ver productos anteriores"
                className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-fuchsia-600 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 ${
                  canScrollLeft ? 'hover:border-neutral-400 hover:text-fuchsia-700' : 'cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scrollBy('right')}
                disabled={!canScrollRight}
                aria-label="Ver productos siguientes"
                className={`pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 bg-white text-fuchsia-600 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 ${
                  canScrollRight ? 'hover:border-neutral-400 hover:text-fuchsia-700' : 'cursor-not-allowed opacity-40'
                }`}
              >
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayedProducts.map((product, index) => (
            <MotionDiv
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
            </MotionDiv>
          ))}
        </div>
      )}
    </section>
  )
}
