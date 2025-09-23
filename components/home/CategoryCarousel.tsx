'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, type Variants } from 'framer-motion'

type CategoryItem = {
  slug: string
  label: string
  description?: string
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

export default function CategoryCarousel({ title, subtitle, headingId, categories }: CategoryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragConstraints, setDragConstraints] = useState<DragBounds>({ left: 0, right: 0 })

  const computedCategories = useMemo(() => categories.map(category => ({
    ...category,
    description:
      category.description ?? (category.isSensitive ? 'Contenido sensible (18+)' : 'Explorar con seguridad')
  })), [categories])

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
          <h2 id={headingId} className="text-xl font-semibold text-neutral-900">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-neutral-600">{subtitle}</p>}
        </div>
      )}
      <div ref={containerRef} className="overflow-hidden">
        <MotionTrack
          ref={trackRef}
          className="flex gap-4 pb-2"
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
              className="min-w-[220px] max-w-[240px] flex-1"
            >
              <Link
                href={`/categoria/${category.slug}`}
                className="flex h-full flex-col items-center rounded-2xl border border-neutral-200 bg-white/90 p-4 text-center shadow-sm shadow-neutral-200/60 transition hover:-translate-y-1 hover:shadow-lg"
              >
                {category.image && (
                  <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
                    <Image
                      src={category.image}
                      alt={`${category.label} — miniatura de categoría`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="text-base font-semibold text-neutral-900">{category.label}</div>
                <div className="mt-2 text-sm text-neutral-600">{category.description}</div>
              </Link>
            </MotionCard>
          ))}
        </MotionTrack>
      </div>
      <div className="hidden gap-4 md:grid md:grid-cols-3">
        {computedCategories.map(category => (
          <Link
            key={category.slug}
            href={`/categoria/${category.slug}`}
            className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white/90 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {category.image && (
              <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
                <Image
                  src={category.image}
                  alt={`${category.label} — miniatura de categoría`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="text-base font-semibold text-neutral-900">{category.label}</div>
            <div className="mt-2 text-sm text-neutral-600">{category.description}</div>
          </Link>
        ))}
      </div>
    </section>
  )
}
