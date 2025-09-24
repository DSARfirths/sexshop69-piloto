'use client'

import { useEffect, useMemo, useState, forwardRef, type FocusEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type CTA = {
  href: string
  label: string
}

type HeroSlide = {
  id: string
  tag: string
  title: string
  description: string
  primaryCta: CTA
  secondaryCta: CTA
  image: string
}

export const heroCarouselSlides: HeroSlide[] = [
  {
    id: 'parejas-curiosas',
    tag: 'Parejas curiosas',
    title: 'Exploraciones sensuales sincronizadas',
    description:
      'Accesorios conectados y aromas inmersivos que encienden el juego previo y amplifican el placer compartido.',
    primaryCta: { href: '/categoria/pareja', label: 'Ver sets para parejas' },
    secondaryCta: { href: '/experiencias/guiadas', label: 'Descubrir experiencias guiadas' },
    image: '/hero/parejas-curiosas-neon.webp'
  },
  {
    id: 'autocuidado-vibrante',
    tag: 'Autocuidado vibrante',
    title: 'Rituales de placer high-tech',
    description:
      'Vibradores inteligentes, aceites sensoriales y playlists binaurales listos para elevar tu energía personal.',
    primaryCta: { href: '/categoria/bienestar', label: 'Explorar autocuidado futurista' },
    secondaryCta: { href: '/club-vibes', label: 'Unirme al Club Vibes' },
    image: 'public/hero/autocuidado.webp'
  },
  {
    id: 'juguetes-anales-premium',
    tag: 'Juguetes anales premium',
    title: 'Sensaciones profundas con precisión',
    description:
      'Diseños ergonómicos en silicona médica y acabados cromados para explorar con seguridad, lujo y control total.',
    primaryCta: { href: '/categoria/accesorios', label: 'Ver selección premium' },
    secondaryCta: { href: '/blog/guia-anal', label: 'Leer guía de uso experto' },
    image: 'public/hero/juguetes-anales.webp'
  },
  {
    id: 'noches-electricas',
    tag: 'Noches eléctricas',
    title: 'Lencería y bondage glow',
    description:
      'Atuendos lumínicos, cueros suaves y accesorios modulables para construir fantasías futuristas que brillan en la oscuridad.',
    primaryCta: { href: '/categoria/fetish', label: 'Descubrir lencería glow' },
    secondaryCta: { href: '/rituales/nocturnos', label: 'Diseñar mi ritual nocturno' },
    image: 'public/hero/noches-electricas.webp'
  }
]

type HeroCarouselProps = {
  slides?: HeroSlide[]
  autoPlay?: boolean
  autoPlayDelay?: number
  className?: string
}

const baseButtonClasses =
  'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300'
const primaryButtonClasses =
  `${baseButtonClasses} bg-fuchsia-600 text-white shadow-neon hover:bg-fuchsia-700`
const secondaryButtonClasses =
  `${baseButtonClasses} border border-neutral-300 bg-transparent text-neutral-700 hover:border-neutral-400 hover:text-neutral-900`
type SlideMotionProps = HTMLMotionProps<'div'> & { className?: string }

const SlideMotion = forwardRef<HTMLDivElement, SlideMotionProps>((props, ref) => <motion.div ref={ref} {...props} />)
SlideMotion.displayName = 'SlideMotion'

export default function HeroCarousel({
  slides: providedSlides,
  autoPlay = true,
  autoPlayDelay = 7000,
  className
}: HeroCarouselProps) {
  const slides = useMemo(() => providedSlides ?? heroCarouselSlides, [providedSlides])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (slides.length === 0) {
      setActiveIndex(0)
    }
  }, [slides.length])

  useEffect(() => {
    if (!autoPlay || isPaused || slides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveIndex(prev => (prev + 1) % slides.length)
    }, autoPlayDelay)

    return () => window.clearInterval(timer)
  }, [autoPlay, autoPlayDelay, isPaused, slides.length])

  useEffect(() => {
    if (activeIndex >= slides.length) {
      setActiveIndex(0)
    }
  }, [activeIndex, slides.length])

  const goTo = (index: number) => {
    setActiveIndex(((index % slides.length) + slides.length) % slides.length)
  }

  const handlePrevious = () => {
    goTo(activeIndex - 1)
  }

  const handleNext = () => {
    goTo(activeIndex + 1)
  }

  if (slides.length === 0) {
    return null
  }

  const activeSlide = slides[activeIndex]

  const containerClasses = [
    'relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-6 text-neutral-900 shadow-md backdrop-blur lg:p-10',
    className
  ]
    .filter(Boolean)
    .join(' ')

  const handleBlurCapture = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsPaused(false)
    }
  }

  return (
    <section
      aria-label="Destacados del catálogo"
      className={containerClasses}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={handleBlurCapture}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-600">{activeSlide.tag}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevious}
            aria-label="Ver anterior"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
          >
            <ChevronLeft className="h-4 w-4 text-fuchsia-600" aria-hidden />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Ver siguiente"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
          >
            <ChevronRight className="h-4 w-4 text-fuchsia-600" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait" initial={false}>
          <SlideMotion
            key={activeSlide.id}
            className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div aria-live="polite" className="contents">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-neutral-900 sm:text-3xl lg:text-[2.4rem] lg:leading-[1.05]">
                    {activeSlide.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">{activeSlide.description}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href={activeSlide.primaryCta.href} className={primaryButtonClasses}>
                    {activeSlide.primaryCta.label}
                  </Link>
                  <Link href={activeSlide.secondaryCta.href} className={secondaryButtonClasses}>
                    {activeSlide.secondaryCta.label}
                  </Link>
                </div>
              </div>

              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-neutral-200 bg-gradient-to-br from-fuchsia-100/40 via-transparent to-purple-100/40">
                <Image
                  src={activeSlide.image}
                  alt={activeSlide.title}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 480px, 100vw"
                  priority={activeIndex === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65),_transparent_65%)] mix-blend-soft-light" aria-hidden />
              </div>
            </div>
          </SlideMotion>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-600">
        <div className="flex items-center gap-2">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition ${isActive ? 'w-7 bg-fuchsia-500' : 'w-2.5 bg-neutral-200 hover:bg-neutral-300'}`}
                aria-label={`Ir a la diapositiva: ${slide.title}`}
                aria-current={isActive ? 'true' : 'false'}
              />
            )
          })}
        </div>
        <span>
          {activeIndex + 1}/{slides.length}
        </span>
      </div>
    </section>
  )
}
