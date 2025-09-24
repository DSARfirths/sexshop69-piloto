'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'

type InspirationalBannerProps = {
  title: string
  description: string
  image: string
  imageAlt: string
  eyebrow?: string
  align?: 'left' | 'right'
  ctaHref?: string
  ctaLabel?: string
}

export default function InspirationalBanner({
  title,
  description,
  image,
  imageAlt,
  eyebrow,
  align = 'left',
  ctaHref,
  ctaLabel
}: InspirationalBannerProps) {
  const imageElement = (
    <div className="relative h-64 overflow-hidden rounded-[2.25rem] lg:h-full">
      <Image src={image} alt={imageAlt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_70%)] mix-blend-screen"
        aria-hidden
      />
    </div>
  )

  const contentElement = (
    <div className="flex flex-col justify-center gap-6 px-8 py-10 text-night-foreground">
      {eyebrow && <span className="text-xs font-semibold uppercase tracking-[0.35em] text-night-muted">{eyebrow}</span>}
      <div className="space-y-4">
        <h3 className="text-3xl font-semibold text-white">{title}</h3>
        <p className="text-base leading-relaxed text-night-muted">{description}</p>
      </div>
      {ctaHref && ctaLabel && (
        <div>
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-neon transition hover:from-fuchsia-400 hover:to-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
          >
            {ctaLabel}
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-[2.25rem] border border-night-border bg-night-surface text-night-foreground shadow-neon"
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
    </motion.section>
  )
}
