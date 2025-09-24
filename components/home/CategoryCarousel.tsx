'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'

type CategoryItem = {
  slug: string
  label: string
  description?: string
  subtitle?: string
  isSensitive?: boolean
  image?: string
}

type DragBounds = { left: number; right: number }

type CategoryCarouselProps = {
  title?: string
  subtitle?: string
  headingId?: string
  categories: CategoryItem[]
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.05, duration: 0.4, ease: 'easeOut' }
  })
}

const MotionTrack = motion.div as any

const MotionCard = motion.div as any
const MotionArticle = motion.article

export type CategoryCardProps = {
  category: CategoryItem & { description: string; subtitle: string }
  href?: string
}

export function CategoryCard({ category, href = `/categoria/${category.slug}` }: CategoryCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <MotionArticle
        whileHover={{ y: -6, boxShadow: '0 22px 38px -18px rgba(236,72,153,0.45)' }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="flex h-full min-h-[280px] w-full flex-col overflow-hidden rounded-2xl border border-night-border bg-night-surface/95 text-left text-night-foreground shadow-neon-sm"
      >
        {category.image ? (
          <div className="relative h-40 w-full overflow-hidden rounded-t-2xl bg-night-surface-strong/80">
            <Image
              src={category.image}
              alt={`${category.label} — miniatura de categoría`}
              fill
              sizes="(max-width: 768px) 220px, 280px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
            />
          </div>
        ) : (
          <div className="flex h-40 w-full items-center justify-center rounded-t-2xl bg-night-surface-strong/80 text-xs font-semibold uppercase tracking-[0.08em] text-night-muted">
            Explorar categoría
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1 px-5 pb-6 pt-4">
          <h3 className="text-lg font-extrabold uppercase text-white">{category.label}</h3>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-night-muted">{category.subtitle}</p>
          <p className="text-sm font-semibold uppercase text-night-subtle">{category.description}</p>
        </div>
      </MotionArticle>
    </Link>
  )
}

export default function CategoryCarousel({ title, subtitle, headingId, categories }: CategoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragConstraints, setDragConstraints] = useState<DragBounds>({ left: 0, right: 0 })

  const computedCategories = useMemo(() => categories.map(category => ({
    ...category,
    description:
      category.description ?? (category.isSensitive ? 'Contenido sensible (18+)' : 'Explorar con seguridad'),
    subtitle:
      category.subtitle ?? (category.isSensitive ? 'Contenido adulto' : 'Bienestar y cuidado')
  })), [categories])

  const highlightedCategories = useMemo(
    () => computedCategories.slice(0, 8),
    [computedCategories]
  )

  const remainingCategories = useMemo(
    () => computedCategories.slice(8),
    [computedCategories]
  )

  useEffect(() => {
    function updateBounds() {
      const container = containerRef.current
      const track = trackRef.current
      if (!container || !track) return
      const maxOffset = track.scrollWidth - container.offsetWidth
      setDragConstraints({ left: -Math.max(0, maxOffset), right: 0 })
    }

    updateBounds()
    window.addEventListener('resize', updateBounds)
    return () => window.removeEventListener('resize', updateBounds)
  }, [computedCategories])

  return (
    <section className="space-y-4" id="catalogo">
      {title && (
        <div className="space-y-1">
          <h2 id={headingId} className="text-xl font-semibold text-white">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-night-muted">{subtitle}</p>}
        </div>
      )}
      <div
        ref={containerRef}
        className="overflow-hidden md:hidden"
      >
        <MotionTrack
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          drag="x"
          dragConstraints={dragConstraints}
          dragElastic={0.12}
        >
          {computedCategories.map((category, index) => (
            <MotionCard
              key={category.slug}
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="min-w-[200px] max-w-[220px] snap-start"
            >
              <CategoryCard category={category} />
            </MotionCard>
          ))}
          <MotionCard className="min-w-[200px] max-w-[220px] snap-start">
            <Link href="/categoria" className="block h-full">
              <MotionArticle
                whileHover={{ y: -6, boxShadow: '0 22px 38px -18px rgba(236,72,153,0.45)' }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="flex h-full min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-night-border bg-night-surface/90 text-center font-semibold uppercase text-night-foreground/80 shadow-neon-sm"
              >
                Ver todas
              </MotionArticle>
            </Link>
          </MotionCard>
        </MotionTrack>
      </div>
      <div className="hidden gap-5 md:grid md:grid-cols-3 xl:grid-cols-4">
        {highlightedCategories.map(category => (
          <CategoryCard key={category.slug} category={category} />
        ))}
        {remainingCategories.length > 0 && (
          <Link href="/categoria" className="block h-full">
            <MotionArticle
              whileHover={{ y: -6, boxShadow: '0 22px 38px -18px rgba(236,72,153,0.45)' }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex h-full min-h-[280px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-night-border bg-night-surface/90 text-center font-semibold uppercase text-night-foreground/80 shadow-neon-sm"
            >
              Ver más categorías
            </MotionArticle>
          </Link>
        )}
      </div>
    </section>
  )
}
