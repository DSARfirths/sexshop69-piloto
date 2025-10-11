'use client'

import { useMemo, useState, type MouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, ShoppingCart } from 'lucide-react'

import type { Product } from '@/lib/products'

type ProductShowcaseProps = {
  products: Product[]
  headingId?: string
  title?: string
  description?: string
}

const FALLBACK_IMAGE_SRC =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 520"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#18181b"/><stop offset="100%" stop-color="#3f3f46"/></linearGradient></defs><rect width="480" height="520" fill="url(#g)"/><text x="50%" y="50%" fill="#d4d4d8" font-family="sans-serif" font-size="24" font-weight="600" text-anchor="middle" dominant-baseline="middle">Producto</text></svg>`
  )

const IMAGE_SLOTS = 3

export function ProductShowcase({
  products,
  headingId,
  title = 'Destacados del momento',
  description = 'Una selección diversa de experiencias para distintos gustos y momentos. Prueba texturas, intensidades y sensaciones que despiertan el placer.'
}: ProductShowcaseProps) {
  const visibleProducts = useMemo(() => products.slice(0, 12), [products])
  if (visibleProducts.length === 0) return null

  return (
    <section className="space-y-8" aria-labelledby={headingId}>
      <div className="space-y-2">
        <h2
          id={headingId}
          className="font-heading text-3xl font-semibold text-neutral-900 sm:text-4xl"
        >
          {title}
        </h2>
        <p className="max-w-3xl text-sm text-neutral-600 sm:text-base">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {visibleProducts.map(product => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  )
}

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const images = useMemo(() => {
    const filenames = product.imageFilenames.slice(0, IMAGE_SLOTS)
    const fallback = product.primaryImageFilename ? [product.primaryImageFilename] : []
    return filenames.length > 0 ? filenames : fallback
  }, [product.imageFilenames, product.primaryImageFilename])

  const normalizedImages =
    images.length > 0
      ? images.map(filename => `/products/${product.slug}/${filename}`)
      : [FALLBACK_IMAGE_SRC]

  const imageCount = normalizedImages.length
  const safeIndex = activeIndex >= imageCount ? 0 : activeIndex
  const currentImage = normalizedImages[safeIndex] ?? FALLBACK_IMAGE_SRC

  const hasMultipleImages = imageCount > 1

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!hasMultipleImages) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (rect.width === 0) return
    const relativeX = Math.min(Math.max(event.clientX - rect.left, 0), rect.width)
    const ratio = relativeX / rect.width
    const index = Math.min(imageCount - 1, Math.floor(ratio * imageCount))
    if (index !== activeIndex) {
      setActiveIndex(index)
    }
  }

  const handleMouseLeave = () => {
    setActiveIndex(0)
  }

  const effectiveRegularPrice = product.regularPrice
  const effectiveSalePrice =
    product.salePrice !== null && product.salePrice < effectiveRegularPrice
      ? product.salePrice
      : null

  const discountPercentage =
    effectiveSalePrice !== null && effectiveRegularPrice > 0
      ? Math.round(((effectiveRegularPrice - effectiveSalePrice) / effectiveRegularPrice) * 100)
      : null

  const formattedRegularPrice = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(effectiveRegularPrice)

  const formattedSalePrice =
    effectiveSalePrice !== null
      ? new Intl.NumberFormat('es-PE', {
          style: 'currency',
          currency: 'PEN'
        }).format(effectiveSalePrice)
      : null

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-xl transition hover:-translate-y-1.5 hover:shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {discountPercentage !== null && (
        <div className="absolute left-5 top-5 z-10 inline-flex items-center rounded-full bg-fuchsia-600/95 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-lg">
          Ahorra {discountPercentage}%
        </div>
      )}

      <div className="relative min-h-[240px] flex-1 overflow-hidden bg-neutral-100">
        <Image
          key={currentImage}
          src={currentImage}
          alt={product.name}
          fill
          sizes="(min-width: 1536px) 12vw, (min-width: 1280px) 18vw, (min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
          className="object-contain object-center transition duration-500"
          priority={false}
        />
        {hasMultipleImages && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {normalizedImages.map((_, index) => (
              <span
                key={index}
                aria-hidden
                className={`h-1.5 w-4 rounded-full transition ${
                  index === safeIndex ? 'bg-fuchsia-500' : 'bg-white/60 group-hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 p-6">
        {product.brand && (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-400">
            {product.brand}
          </p>
        )}
        <h3 className="font-heading text-lg font-semibold text-neutral-900 sm:text-xl">
          {product.name}
        </h3>

        <div className="space-y-1">
          {formattedSalePrice ? (
            <>
              <p className="text-lg font-semibold text-fuchsia-600 sm:text-xl">
                {formattedSalePrice}
              </p>
              <p className="text-sm text-neutral-400 line-through">{formattedRegularPrice}</p>
            </>
          ) : (
            <p className="text-lg font-semibold text-neutral-900 sm:text-xl">
              {formattedRegularPrice}
            </p>
          )}
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-6 bg-gradient-to-t from-neutral-900/80 via-neutral-900/30 to-transparent opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <div className="pointer-events-auto flex items-center justify-between px-6 py-5 text-white">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <ShoppingCart className="h-4 w-4" aria-hidden />
            Añadir
          </button>
          <Link
            href={`/producto/${product.slug}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          >
            <Eye className="h-4 w-4" aria-hidden />
            Vista rápida
          </Link>
        </div>
      </div>
    </article>
  )
}
