'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

const AUTO_PLAY_DELAY = 9000

const baseButtonClasses =
  'inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

const primaryButtonClasses = `${baseButtonClasses} bg-white text-neutral-900 shadow-xl shadow-black/30 hover:bg-neutral-200`
const secondaryButtonClasses = `${baseButtonClasses} border border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white/20`

type SlideMedia =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; poster?: string; alt?: string }

type Slide = {
  id: string
  tag: string
  title: string
  description: string
  media: SlideMedia
}

const slides: Slide[] = [
  {
    id: 'neon-seduction',
    tag: 'Noches eléctricas',
    title: 'Luces bajas, fantasías altas',
    description:
      'Escenarios inmersivos con lencería glow-in-the-dark, texturas líquidas y accesorios que responden a cada caricia.',
    media: {
      type: 'image',
      src: '/hero/noches-electricas.svg',
      alt: 'Pareja en un ambiente nocturno con luces neón'
    }
  },
  {
    id: 'rituales-high-tech',
    tag: 'Autocuidado vibrante',
    title: 'Rituales sensoriales high-tech',
    description:
      'Dispositivos inteligentes sincronizados con respiraciones, aceites multisensoriales y playlists binaurales a un toque.',
    media: {
      type: 'video',
      src: 'https://cdn.coverr.co/videos/coverr-passing-lights-on-a-night-highway-4105/1080p.mp4',
      poster: '/hero/autocuidado-vibrante-neon.svg',
      alt: 'Luces desenfocadas en movimiento evocando una ciudad nocturna'
    }
  },
  {
    id: 'parejas-sincronizadas',
    tag: 'Parejas curiosas',
    title: 'Placer sincronizado sin tabúes',
    description:
      'Juguetes conectados, aromas envolventes y coaching íntimo para explorar en conjunto a tu ritmo.',
    media: {
      type: 'image',
      src: '/hero/parejas-curiosas-neon.svg',
      alt: 'Ilustración de dos siluetas tocándose en ambiente futurista'
    }
  }
]

export default function Hero() {
  const preparedSlides = useMemo(() => slides, [])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused || preparedSlides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % preparedSlides.length)
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
      aria-label="Experiencias destacadas"
      className="relative isolate flex min-h-[80vh] flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-neutral-950 text-white shadow-[0_40px_120px_-40px_rgba(126,34,206,0.45)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="absolute inset-0">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSlide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            aria-hidden
          >
            {activeSlide.media.type === 'image' ? (
              <Image
                src={activeSlide.media.src}
                alt={activeSlide.media.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            ) : (
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                poster={activeSlide.media.poster}
              >
                <source src={activeSlide.media.src} type="video/mp4" />
              </video>
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/85 via-neutral-950/45 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(126,34,206,0.35),_transparent_60%)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-between px-6 py-14 sm:px-10 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
          <span>{activeSlide.tag}</span>
          <span>
            {activeIndex + 1}/{preparedSlides.length}
          </span>
        </div>

        <div className="mt-10 grid flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.6fr)]">
          <div className="space-y-6">
            <motion.h1
              key={activeSlide.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-4xl font-semibold leading-tight sm:text-5xl lg:text-[3.6rem] lg:leading-[1.05]"
            >
              {activeSlide.title}
            </motion.h1>
            <motion.p
              key={activeSlide.description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
              className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
            >
              {activeSlide.description}
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
            >
              <Link href="#catalogo" className={primaryButtonClasses}>
                Explorar catálogo
              </Link>
              <Link href="/experiencias" className={secondaryButtonClasses}>
                Descubre el placer
              </Link>
            </motion.div>
          </div>

          <div className="hidden h-full min-h-[320px] lg:block">
            <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/20 bg-white/5">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={`preview-${activeSlide.id}`}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  aria-hidden
                >
                  {activeSlide.media.type === 'image' ? (
                    <Image
                      src={activeSlide.media.src}
                      alt={activeSlide.media.alt}
                      fill
                      sizes="40vw"
                      className="object-cover object-center"
                    />
                  ) : (
                    <video
                      className="h-full w-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                      poster={activeSlide.media.poster}
                    >
                      <source src={activeSlide.media.src} type="video/mp4" />
                    </video>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 via-transparent to-brand-accent/30 mix-blend-screen" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between gap-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Ver historia anterior"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Ver siguiente historia"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur transition hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              ›
            </button>
          </div>
          <div className="flex flex-1 justify-end gap-2">
            {preparedSlides.map((slide, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Ir a la experiencia ${slide.title}`}
                  aria-current={isActive}
                  className={`h-2 rounded-full transition-all ${isActive ? 'w-12 bg-white' : 'w-6 bg-white/40 hover:bg-white/70'}`}
                />
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
