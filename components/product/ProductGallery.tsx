'use client'

import { useEffect, useMemo, useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { AnimatePresence, motion } from 'framer-motion'

const MotionWrapper = motion<{ className?: string }>('div')

const SAFE_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#e4e4e7"/></linearGradient></defs><rect width="600" height="600" fill="url(#g)"/><text x="50%" y="50%" fill="#a1a1aa" font-family="sans-serif" font-size="28" font-weight="600" text-anchor="middle" dominant-baseline="middle">Vista previa</text></svg>`
  )

type GalleryAssetProps = {
  src: string
  alt: string
  className?: string
  enabled: boolean
  priority?: boolean
}

function GalleryAsset({ src, alt, className, enabled, priority }: GalleryAssetProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (!enabled || failed) {
    return (
      <img
        src={SAFE_PLACEHOLDER}
        alt={enabled ? `${alt} no disponible` : alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
      />
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}

type ProductGalleryProps = {
  slug: string
  name: string
  imageCount?: number
  imageFilenames?: string[]
  nsfw?: boolean
}

function buildImageSrc(slug: string, index: number) {
  if (index < 0) return null
  return `/products/${slug}/${index + 1}.webp`
}

export default function ProductGallery({ slug, name, imageCount, imageFilenames, nsfw = false }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVerified, setIsVerified] = useState(false)

  const totalImages = useMemo(() => {
    if (Array.isArray(imageFilenames) && imageFilenames.length > 0) {
      return imageFilenames.length
    }
    return typeof imageCount === 'number' && imageCount > 0 ? imageCount : 0
  }, [imageCount, imageFilenames])

  const hasImages = totalImages > 0
  const requiresVerification = Boolean(nsfw && hasImages)

  useEffect(() => {
    if (!requiresVerification) {
      setIsVerified(true)
      return
    }
    if (typeof document === 'undefined') return
    const isOk = document.cookie.includes('age_ok=1')
    setIsVerified(isOk)
  }, [requiresVerification])

  const imageSources = useMemo(() => {
    if (!hasImages) return []
    const count = totalImages
    return Array.from({ length: count }, (_, index) => buildImageSrc(slug, index)).filter(
      (src): src is string => Boolean(src)
    )
  }, [hasImages, slug, totalImages])

  useEffect(() => {
    if (activeIndex >= imageSources.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, imageSources.length])

  const handleUnlock = () => {
    if (typeof document === 'undefined') return
    document.cookie = 'age_ok=1; path=/; max-age=31536000'
    setIsVerified(true)
  }

  const showPlaceholder = !hasImages
  const unlocked = requiresVerification ? isVerified : true

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
        <div className="aspect-square w-full">
          {showPlaceholder ? (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
              Galería disponible al publicar
            </div>
          ) : (
            <div className="relative h-full w-full">
              {!unlocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-neutral-900/80 px-6 text-center text-white">
                  <div className="text-sm font-semibold">Contenido sensible</div>
                  <p className="text-xs text-white/80">
                    Para proteger tu experiencia mostramos miniaturas difuminadas hasta que confirmes tu mayoría de edad.
                  </p>
                  <button
                    type="button"
                    onClick={handleUnlock}
                    className="rounded-full bg-brand-primary px-5 py-2 text-sm font-semibold text-white shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                  >
                    Ver imágenes
                  </button>
                </div>
              )}
              <AnimatePresence mode="wait">
                <MotionWrapper
                  key={unlocked ? `unlocked-${activeIndex}` : 'locked'}
                  className="h-full w-full"
                  initial={{ opacity: 0.2, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.24, ease: 'easeOut' }}
                >
                  {unlocked ? (
                    <div className="h-full w-full [&_[data-rmiz-content]]:block [&_[data-rmiz-content]]:h-full [&_[data-rmiz-content]]:w-full [&_[data-rmiz-content]_*]:h-full [&_[data-rmiz-content]_*]:w-full [&_[data-rmiz-content]_*]:max-w-full">
                      <Zoom>
                        <GalleryAsset
                          src={imageSources[activeIndex]}
                          alt={`${name} — vista ${activeIndex + 1}`}
                          enabled
                          priority={activeIndex === 0}
                          className="h-full w-full object-cover"
                        />
                      </Zoom>
                    </div>
                  ) : (
                    <GalleryAsset
                      src={imageSources[activeIndex]}
                      alt={`${name} — vista censurada`}
                      enabled={false}
                      className="h-full w-full object-cover blur-xl"
                    />
                  )}
                </MotionWrapper>
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {showPlaceholder ? (
          <div className="flex h-16 flex-1 items-center justify-center rounded-xl border border-dashed border-neutral-300 text-xs text-neutral-500">
            Miniaturas en preparación
          </div>
        ) : (
          imageSources.map((source, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={source}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border transition-all duration-200 ${
                  isActive
                    ? 'border-brand-primary shadow-lg ring-2 ring-brand-primary/30'
                    : 'border-transparent bg-neutral-100 hover:border-neutral-300'
                }`}
                >
                  {unlocked ? (
                    <GalleryAsset
                      src={source}
                      alt={`${name} — miniatura ${index + 1}`}
                      enabled
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-900/70 text-[11px] font-semibold uppercase tracking-wide text-white">
                      18+
                    </div>
                )}
                {!isActive && unlocked && (
                  <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/0 opacity-0 transition-opacity duration-200 hover:opacity-30" />
                )}
              </button>
            )
          })
        )}
      </div>
      {unlocked && hasImages && (
        <p className="text-center text-[11px] text-neutral-500">
          Pincha o acerca los dedos sobre la imagen para hacer zoom; arrastra para explorar los detalles.
        </p>
      )}
    </div>
  )
}
