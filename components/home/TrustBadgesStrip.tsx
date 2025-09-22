'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type TrustBadge = {
  label: string
  description?: string
  icon?: ReactNode
}

type TrustBadgesStripProps = {
  badges: TrustBadge[]
}

const MotionBadge = motion.div as any

export default function TrustBadgesStrip({ badges }: TrustBadgesStripProps) {
  if (!badges.length) return null

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {badges.map((badge, index) => (
        <MotionBadge
          key={badge.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.35, ease: 'easeOut' }}
          className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary">
            {badge.icon}
          </div>
          <div>
            <div className="text-sm font-semibold text-neutral-900">{badge.label}</div>
            {badge.description && <p className="text-xs text-neutral-600">{badge.description}</p>}
          </div>
        </MotionBadge>
      ))}
    </div>
  )
}
