'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, type HTMLMotionProps } from 'framer-motion'
import { ComponentType, PropsWithChildren } from 'react'

type InspirationalBannerProps = {
  title: string
  description: string
  image: string
  imageAlt: string
  eyebrow?: string
  align?: 'left' | 'right'
  ctaHref?: string
  ctaLabel?: string
  tone?: 'night' | 'fuchsia'
  imageAspect?: 'landscape' | 'portrait' | 'square'
  imagePriority?: boolean
  className?: string
}

type MotionElementProps<T extends keyof HTMLElementTagNameMap> = PropsWithChildren<
  HTMLMotionProps<T> & { className?: string }
>

const MotionSection = motion.section as ComponentType<MotionElementProps<'section'>>

export default function InspirationalBanner({
  title,
  description,
  image,
  imageAlt,
  eyebrow,
  align = 'left',
  ctaHref,
  ctaLabel,
  tone = 'night',
  imageAspect = 'landscape',
  imagePriority = false,
  className
}: InspirationalBannerProps) {
  const aspectClassName =
    imageAspect === 'portrait'
      ? 'aspect-[3/4]'
      : imageAspect === 'square'
        ? 'aspect-square'
        : 'aspect-[16/10]'

  const sectionToneClassName =
    tone === 'fuchsia'
      ? 'bg-gradient-to-br from-fuchsia-50 via-rose-50 to-white'
      : 'bg-neutral-50'

  const imageElement = (
    <div className={`relative h-64 overflow-hidden rounded-[2.25rem] ${aspectClassName} lg:h-full lg:aspect-auto`}>
      <Image
        src={image}
        alt={imageAlt}
        fill
        priority={imagePriority}
        className="object-cover object-center"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_70%)] mix-blend-screen"
        aria-hidden
      />
    </div>
  )

  const contentElement = (
    <div className="flex flex-col justify-center gap-6 px-8 py-10 text-neutral-900">
      {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-600">{eyebrow}</span>}
      <div className="space-y-4">
        <h3 className="text-3xl font-semibold text-neutral-900">{title}</h3>
        <p className="text-base leading-relaxed text-neutral-600">{description}</p>
      </div>
      {ctaHref && ctaLabel && (
        <div>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-neon transition hover:bg-fuchsia-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <MotionSection
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-[2.25rem] border border-neutral-200 text-neutral-900 shadow-md ${sectionToneClassName} ${className ?? ''}`}
    >
      <div className="grid gap-8 lg:grid-cols-2">
        {align === 'left' ? (
          <>
            {imageElement}
            {contentElement}
          </>
        ) : (
          <>
            {contentElement}
            {imageElement}
          </>
        )}
      </div>
    </MotionSection>
  )
}
