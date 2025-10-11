'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'

const AUTO_PLAY_DELAY = 9000

type SlideMedia =
  | {
      type: 'image'
      src: string
      alt: string
      priority?: boolean
    }
  | {
      type: 'video'
      src: string
      poster?: string
      alt?: string
      priority?: boolean
    }

type Slide = {
  id: string
  media: SlideMedia
}

const slides: Slide[] = [
  {
    id: 'rituales-fucsia',
    media: {
      type: 'image',
      src: '/landing/hero/chica-con-vibrador.webp',
      alt: 'Escena sensual con iluminacion violeta'
    }
  },
  {
    id: 'parejas-curiosas',
    media: {
      type: 'image',
      src: '/landing/hero/vibrador-en-manos-chica.webp',
      alt: 'Vibrador en manos sobre fondo oscuro'
    }
  },
  {
    id: 'exploracion-intensa',
    media: {
      type: 'image',
      src: '/landing/hero/redescubre-pareja.webp',
      alt: 'Pareja disfrutando en ambiente intimo'
    }
  }
]

const MotionSlide = motion.div

export default function Hero() {
  const preparedSlides = useMemo(() => slides, [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const hasMultipleSlides = preparedSlides.length > 1

  useEffect(() => {
    if (isPaused || preparedSlides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex(previous => (previous + 1) % preparedSlides.length)
    }, AUTO_PLAY_DELAY)

    return () => window.clearInterval(timer)
  }, [isPaused, preparedSlides.length])

  const goTo = (index: number) => {
    setActiveIndex(((index % preparedSlides.length) + preparedSlides.length) % preparedSlides.length)
  }

  const handlePrevious = () => {
    goTo(activeIndex - 1)
  }

  const handleNext = () => {
    goTo(activeIndex + 1)
  }

  const activeSlide = preparedSlides[activeIndex]

  return (
    <section
      aria-roledescription="carrusel"
      aria-label="Destacados visuales"
      className="relative flex h-[min(92vh,720px)] w-full overflow-hidden bg-black text-white"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          <MotionSlide
            key={activeSlide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            aria-hidden
          >
            <HeroMedia media={activeSlide.media} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-black/50" />
          </MotionSlide>
        </AnimatePresence>
      </div>

      {hasMultipleSlides && (
        <>
          <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Mostrar visual anterior"
              className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden className="text-2xl leading-none">&#8249;</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Mostrar visual siguiente"
              className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span aria-hidden className="text-2xl leading-none">&#8250;</span>
            </button>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2">
            {preparedSlides.map((slide, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir a la diapositiva ${index + 1}`}
                  aria-current={isActive}
                  className={`pointer-events-auto h-2 rounded-full transition-all ${
                    isActive ? 'w-10 bg-white' : 'w-5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}

type HeroMediaProps = {
  media: SlideMedia
}

function HeroMedia({ media }: HeroMediaProps) {
  if (media.type === 'video') {
    return (
      <video
        src={media.src}
        poster={media.poster}
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />
    )
  }

  return (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      priority={media.priority}
      sizes="100vw"
      className="object-cover"
    />
  )
}
