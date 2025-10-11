'use client'

import { Fragment, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Dialog, Transition } from '@headlessui/react'
import { X, MessageCircle, ShoppingBag } from 'lucide-react'
import { formatAttributeLabel, formatAttributeValue, getProductProperties, type Product } from '@/lib/products'

const FALLBACK_IMAGE_SRC =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#e4e4e7"/></linearGradient></defs><rect width="320" height="240" fill="url(#g)"/><text x="50%" y="50%" fill="#a1a1aa" font-family="sans-serif" font-size="20" font-weight="600" text-anchor="middle" dominant-baseline="middle">Producto</text></svg>`
  )

const WHATSAPP_NUMBER = '51924281623'

type AssetImageProps = {
  productSlug: string
  filename?: string | null
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

function buildImageSrc(productSlug: string, filename?: string | null) {
  if (!filename) return null
  const basename = filename.replace(/\..+$/, '')
  if (!basename) return null
  return `/products/${productSlug}/${basename}.webp`
}

function AssetImage({ productSlug, filename, alt, className, priority, sizes }: AssetImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [filename, productSlug])

  const src = !failed ? buildImageSrc(productSlug, filename) ?? FALLBACK_IMAGE_SRC : FALLBACK_IMAGE_SRC

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
      onError={() => {
        if (!filename) return
        setFailed(true)
      }}
    />
  )
}

type QuickViewDialogProps = {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function QuickViewDialog({ product, open, onOpenChange }: QuickViewDialogProps) {
  const hasImages = product.imageCount > 0 && product.imageFilenames.length > 0
  const galleryImages = useMemo(() => {
    if (!hasImages) return []
    const filenames = product.imageFilenames.slice(0, Math.min(product.imageCount, 4))
    return filenames.map((filename, index) => ({
      filename,
      alt: `${product.name} — imagen ${index + 1}`
    }))
  }, [hasImages, product.imageCount, product.imageFilenames, product.name])

  const properties = useMemo(() => {
    return getProductProperties(product.attributes, product.specs).slice(0, 4)
  }, [product])

  const features = product.features?.slice(0, 3) ?? []
  const mainImage = galleryImages[0] ?? { filename: null, alt: product.name }
  const salePrice = typeof product.salePrice === 'number' ? product.salePrice : null
  const hasSalePrice = salePrice !== null
  const checkoutPrice = salePrice ?? product.regularPrice
  const displayPrice = checkoutPrice.toFixed(2)
  const regularPrice = product.regularPrice.toFixed(2)
  const discountPercentage =
    hasSalePrice && product.regularPrice > 0
      ? Math.round(((product.regularPrice - checkoutPrice) / product.regularPrice) * 100)
      : null
  const checkoutHref = `/checkout/success?sku=${product.sku}&value=${checkoutPrice}`
  const whatsappMessage = encodeURIComponent(`Consulta ${product.sku} - S/ ${displayPrice}`)
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onOpenChange}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-900/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-neutral-500 shadow-md transition hover:bg-white hover:text-neutral-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
                  aria-label="Cerrar vista rápida"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="grid gap-6 p-6 md:grid-cols-[1.2fr,1fr] md:p-8">
                  <div>
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                      <AssetImage
                        productSlug={product.slug}
                        filename={mainImage.filename}
                        alt={mainImage.alt}
                        priority={open}
                        sizes="(min-width: 1024px) 480px, 80vw"
                        className={`object-cover ${
                          galleryImages.length > 0 ? 'md:hover:scale-[1.02] md:transition-transform md:duration-500' : ''
                        }`}
                      />
                    </div>
                    {galleryImages.length > 1 && (
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {galleryImages.slice(1).map((image, index) => (
                          <div
                            key={image.filename ?? index}
                            className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100"
                          >
                            <AssetImage
                              productSlug={product.slug}
                              filename={image.filename}
                              alt={image.alt}
                              sizes="96px"
                              priority={open && index < 2}
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      <Dialog.Title className="text-2xl font-semibold text-neutral-900">{product.name}</Dialog.Title>
                      <Dialog.Description className="text-sm text-neutral-500">
                        {product.brand && <span className="font-medium uppercase tracking-wide text-neutral-600">{product.brand}</span>}
                        {product.brand && product.badge && <span className="mx-2 text-neutral-300">•</span>}
                        {product.badge && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold uppercase text-amber-700">{product.badge}</span>}
                      </Dialog.Description>
                      <div className="flex flex-wrap items-baseline gap-3">
                        <span className="text-2xl font-bold text-brand-pink">S/ {displayPrice}</span>
                        {hasSalePrice && (
                          <span className="text-base font-medium text-neutral-400 line-through">S/ {regularPrice}</span>
                        )}
                        {hasSalePrice && discountPercentage && discountPercentage > 0 && (
                          <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            -{discountPercentage}%
                          </span>
                        )}
                      </div>
                      {features.length > 0 && (
                        <ul className="space-y-2 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
                          {features.map((feature, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-pink" aria-hidden />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {properties.length > 0 && (
                        <dl className="grid gap-x-4 gap-y-2 text-sm text-neutral-600 sm:grid-cols-2">
                          {properties.map(([key, value]) => (
                            <div key={key} className="rounded-xl border border-neutral-200 bg-white px-3 py-2">
                              <dt className="text-xs font-medium uppercase tracking-wide text-neutral-400">{formatAttributeLabel(key)}</dt>
                              <dd className="mt-1 text-neutral-700">{formatAttributeValue(value)}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Link
                        href={checkoutHref}
                        className="btn-primary w-full gap-2 rounded-2xl px-4 py-3 text-sm shadow-lg transition hover:opacity-95"
                        onClick={() => onOpenChange(false)}
                      >
                        <ShoppingBag className="h-4 w-4" /> Comprar ahora
                      </Link>
                      <a
                        href={whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-sm transition hover:border-brand-pink hover:text-brand-pink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
