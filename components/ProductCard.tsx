'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { Eye } from 'lucide-react'
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
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#e4e4e7"/></linearGradient></defs><rect width="320" height="240" fill="url(#g)"/><text x="50%" y="50%" fill="#a1a1aa" font-family="sans-serif" font-size="20" font-weight="600" text-anchor="middle" dominant-baseline="middle">Producto</text></svg>`
  )

type ProductCardProps = {
  p: Product
  highlightBadge?: string
}

export default function ProductCard({ p, highlightBadge }: ProductCardProps) {
  const filtersContext = useCategoryFilters()
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
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
  const hasGallery = p.imageCount > 0 && Boolean(p.imageFilenames[0])
  const primaryImageBasename = p.imageFilenames[0]?.replace(/\..+$/, '') ?? null
  const mainImageSrc =
    hasGallery && !imageFailed && primaryImageBasename
      ? `/products/${p.slug}/${primaryImageBasename}.webp`
      : FALLBACK_IMAGE_SRC
  const salePrice = typeof p.salePrice === 'number' ? p.salePrice : null
  const hasSalePrice = salePrice !== null
  const displayPrice = (salePrice ?? p.regularPrice).toFixed(2)
  const regularPrice = p.regularPrice.toFixed(2)
  const shouldPriorityLoad = Boolean(highlightBadge || p.badge === 'top')

  useEffect(() => {
    setImageFailed(false)
  }, [primaryImageBasename, p.slug])

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

  const handleTouchEnd: React.TouchEventHandler<HTMLAnchorElement> = (event) => {
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

  return (
    <div className="relative">
      <Link href={`/producto/${p.slug}`} legacyBehavior passHref>
        <motion.a
          {...({
            href: `/producto/${p.slug}`,
            className: 'group block overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 text-neutral-900 shadow transition-shadow hover:shadow-lg',
            whileHover: { y: -4 },
            whileTap: { scale: 0.98 },
            transition: { type: 'spring', stiffness: 300, damping: 20, mass: 0.6 },
            onTouchStart: handleTouchStart,
            onTouchEnd: handleTouchEnd,
            onTouchCancel: handleTouchMove,
            onTouchMove: handleTouchMove
          } as unknown as HTMLMotionProps<'a'>)}
        >
          <div className="relative aspect-[3/2] overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 p-0 sm:p-4">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              {displayBadge && (
                <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-fuchsia-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
                  {displayBadge}
                </div>
              )}
              <Image
                src={mainImageSrc}
                alt={p.name}
                fill
                priority={shouldPriorityLoad}
                sizes="(min-width: 1024px) 280px, (min-width: 768px) 50vw, 90vw"
                className="h-full w-full object-cover transition duration-500"
                onError={() => {
                  if (!hasGallery) return
                  setImageFailed(true)
                }}
              />
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="line-clamp-2 font-medium text-neutral-900">{p.name}</div>
            <div className="flex items-baseline gap-2 text-neutral-900">
              <span className="font-semibold">S/ {displayPrice}</span>
              {hasSalePrice && (
                <span className="text-sm font-medium text-neutral-500 line-through">S/ {regularPrice}</span>
              )}
            </div>
          </div>
        </motion.a>
      </Link>
      <button
        type="button"
        onClick={() => setIsQuickViewOpen(true)}
        aria-label="Vista rápida"
        className="absolute right-3 top-3 z-10 rounded-full bg-fuchsia-500/10 p-1 text-fuchsia-600 transition hover:bg-fuchsia-500/20"
      >
        <Eye className="h-5 w-5" />
      </button>

      <QuickViewDialog product={p} open={isQuickViewOpen} onOpenChange={setIsQuickViewOpen} />
    </div>
  )
}
