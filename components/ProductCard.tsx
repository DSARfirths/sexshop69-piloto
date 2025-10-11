'use client'

import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, ShoppingCart } from 'lucide-react'

import QuickViewDialog from '@/components/product/QuickViewDialog'
import { useCategoryFilters } from '@/components/category/filters-context'
import { type Product } from '@/lib/products'

const BADGE_LABELS: Record<'nuevo' | 'top' | 'promo', string> = {
  nuevo: 'Nuevo',
  top: 'Top',
  promo: 'Promo'
}

const FALLBACK_IMAGE_SRC =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 600"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#e4e4e7"/></linearGradient></defs><rect width="480" height="600" fill="url(#g)"/><text x="50%" y="50%" fill="#a1a1aa" font-family="sans-serif" font-size="24" font-weight="600" text-anchor="middle" dominant-baseline="middle">Producto</text></svg>`
  )

const IMAGE_SLOTS = 3

type ProductCardProps = {
  p: Product
  highlightBadge?: string
}

export default function ProductCard({ p, highlightBadge }: ProductCardProps) {
  const filtersContext = useCategoryFilters()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const longPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didTriggerQuickView = useRef(false)

  const filterBadge = useMemo(() => {
    if (!filtersContext) return undefined
    if (filtersContext.isBrandSelected(p.brand)) {
      return p.brand ? `Marca: ${p.brand}` : undefined
    }
    const material = typeof p.attributes?.material === 'string' ? p.attributes.material : null
    if (filtersContext.isMaterialSelected(material)) {
      return material ? `Material: ${material}` : undefined
    }
    return undefined
  }, [filtersContext, p.attributes?.material, p.brand])

  const resolvedBadge =
    p.badge && typeof p.badge === 'string' && p.badge in BADGE_LABELS
      ? BADGE_LABELS[p.badge as keyof typeof BADGE_LABELS]
      : p.badge ?? undefined
  const displayBadge = highlightBadge ?? filterBadge ?? resolvedBadge

  const galleryBasenames = useMemo(() => {
    const filenames = p.imageFilenames.slice(0, IMAGE_SLOTS)
    const basenames = filenames
      .map(filename => filename?.replace(/\..+$/, '') ?? null)
      .filter((value): value is string => Boolean(value))

    if (basenames.length === 0 && p.primaryImageFilename) {
      const primaryBasename = p.primaryImageFilename.replace(/\..+$/, '')
      return primaryBasename ? [primaryBasename] : []
    }

    return Array.from(new Set(basenames))
  }, [p.imageFilenames, p.primaryImageFilename])

  const normalizedImages =
    galleryBasenames.length > 0
      ? galleryBasenames.map(basename => `/products/${p.slug}/${basename}.webp`)
      : [FALLBACK_IMAGE_SRC]

  const imageCount = normalizedImages.length
  const safeImageIndex = Math.min(Math.max(activeImageIndex, 0), imageCount - 1)
  const currentImage = imageFailed ? FALLBACK_IMAGE_SRC : normalizedImages[safeImageIndex]
  const hasMultipleImages = imageCount > 1

  const salePrice = typeof p.salePrice === 'number' ? p.salePrice : null
  const hasSalePrice = salePrice !== null && salePrice < p.regularPrice
  const currentPrice = hasSalePrice ? salePrice! : p.regularPrice
  const discountPercentage =
    hasSalePrice && p.regularPrice > 0
      ? Math.round(((p.regularPrice - salePrice!) / p.regularPrice) * 100)
      : null

  const formattedRegularPrice = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(p.regularPrice)
  const formattedSalePrice = hasSalePrice
    ? new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
      }).format(currentPrice)
    : null

  const shouldPriorityLoad = Boolean(highlightBadge || p.badge === 'top')

  useEffect(() => {
    setImageFailed(false)
  }, [p.slug, galleryBasenames])

  useEffect(() => {
    return () => {
      if (longPressTimeout.current) {
        clearTimeout(longPressTimeout.current)
      }
    }
  }, [])

  const cancelLongPress = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
    didTriggerQuickView.current = false
  }

  const handleTouchStart = () => {
    didTriggerQuickView.current = false
    cancelLongPress()
    longPressTimeout.current = setTimeout(() => {
      didTriggerQuickView.current = true
      setIsQuickViewOpen(true)
    }, 500)
  }

  const handleTouchEnd: React.TouchEventHandler<HTMLAnchorElement> = event => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
    if (didTriggerQuickView.current) {
      event.preventDefault()
      event.stopPropagation()
      didTriggerQuickView.current = false
    }
  }

  const handleTouchMove: React.TouchEventHandler<HTMLAnchorElement> = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current)
      longPressTimeout.current = null
    }
    didTriggerQuickView.current = false
  }

  const handleImageMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!hasMultipleImages) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width === 0) return
    const relativeX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
    const ratio = relativeX / rect.width
    const index = Math.min(imageCount - 1, Math.floor(ratio * imageCount))
    if (index !== activeImageIndex) {
      setActiveImageIndex(index)
    }
  }

  const handleImageMouseLeave = () => {
    if (activeImageIndex !== 0) {
      setActiveImageIndex(0)
    }
  }

  const handleOpenQuickView: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault()
    event.stopPropagation()
    cancelLongPress()
    setIsQuickViewOpen(true)
  }

  const handleAddToCart: React.MouseEventHandler<HTMLButtonElement> = event => {
    event.preventDefault()
    event.stopPropagation()
    // TODO: Integrar logica real de anadir a la cesta cuando este disponible.
  }

  const imageLinkProps = {
    href: `/producto/${p.slug}`,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchMove,
    onTouchMove: handleTouchMove
  }

  return (
    <article className="group relative flex h-full flex-col transition-transform duration-300 ease-brand hover:-translate-y-1.5 focus-within:-translate-y-1.5">
      <div className="relative">
        <Link {...imageLinkProps} className="block">
          <div
            className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] border border-neutral-200 bg-white"
            onMouseEnter={handleImageMouseMove}
            onMouseMove={handleImageMouseMove}
            onMouseLeave={handleImageMouseLeave}
          >
            {discountPercentage && discountPercentage > 0 && (
              <div className="absolute left-5 top-5 z-20 inline-flex items-center rounded-full bg-brand-pink px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-brand-soft">
                Ahorra un {discountPercentage}%
              </div>
            )}
            <Image
              src={currentImage}
              alt={p.name}
              fill
              priority={shouldPriorityLoad}
              sizes="(min-width: 1536px) 12vw, (min-width: 1280px) 16vw, (min-width: 1024px) 22vw, (min-width: 640px) 44vw, 92vw"
              className="h-full w-full object-contain object-center transition duration-200 ease-linear"
              onError={() => {
                setImageFailed(true)
              }}
            />
            {hasMultipleImages && (
              <div className="pointer-events-none absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
                {normalizedImages.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 w-5 rounded-full transition ${
                      index === safeImageIndex ? 'bg-brand-pink' : 'bg-neutral-300 group-hover:bg-neutral-400'
                    }`}
                    aria-hidden
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end opacity-0 transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <div className="flex items-center justify-between gap-3 px-6 pb-6">
            <button
              type="button"
              onClick={handleAddToCart}
              className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 shadow-lg transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200"
            >
              <ShoppingCart className="h-4 w-4" aria-hidden />
              Anadir a la cesta
            </button>
            <button
              type="button"
              onClick={handleOpenQuickView}
              aria-label="Vista rapida"
              className="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-200"
            >
              <Eye className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <Link
        href={`/producto/${p.slug}`}
        className="mt-6 block rounded-[2rem] border border-neutral-200 bg-white p-6 text-neutral-900 transition hover:border-neutral-300 hover:shadow-brand-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-pink/50"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchMove}
        onTouchMove={handleTouchMove}
      >
        {displayBadge && (
          <span className="inline-flex items-center rounded-full bg-neutral-100 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            {displayBadge}
          </span>
        )}
        {p.brand && (
          <p className="mt-4 text-xs font-medium uppercase tracking-[0.28em] text-neutral-400">{p.brand}</p>
        )}
        <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-neutral-900 sm:text-[1.45rem]">
          <span className="relative inline box-decoration-clone bg-[linear-gradient(90deg,#ff2193,#ff65b9)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat transition-[background-size] duration-300 ease-brand group-hover:bg-[length:100%_1px] group-focus-within:bg-[length:100%_1px]">
            {p.name}
          </span>
        </h3>
        <div className="mt-5 space-y-2">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-neutral-400">
            {hasSalePrice ? 'Precio oferta' : 'Precio regular'}
          </span>
          <div className="flex flex-wrap items-baseline gap-3">
            <span className={`text-xl font-semibold ${hasSalePrice ? 'text-brand-pink' : 'text-neutral-900'}`}>
              {hasSalePrice && formattedSalePrice ? formattedSalePrice : formattedRegularPrice}
            </span>
            {hasSalePrice && (
              <span className="text-sm font-medium text-neutral-400 line-through">{formattedRegularPrice}</span>
            )}
          </div>
        </div>
      </Link>

      <QuickViewDialog product={p} open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
    </article>
  )
}
