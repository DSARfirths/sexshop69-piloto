'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

type StickyCTAProps = {
  price: number
  checkoutHref: string
  whatsappHref: string
}

const MotionContainer = motion<{ className?: string; style?: CSSProperties }>('div')

export default function StickyCTA({ price, checkoutHref, whatsappHref }: StickyCTAProps) {
  const containerClassName = 'fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-white via-white/95 to-white/20 pb-4 pt-2 md:hidden'
  const containerStyle: CSSProperties = {
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)'
  }

  return (
    <MotionContainer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={containerClassName}
      style={containerStyle}
    >
      <div className="mx-auto mb-4 w-full max-w-md px-4">
        <div className="rounded-3xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur">
          <div className="flex items-baseline justify-between text-neutral-900">
            <span className="text-xs uppercase tracking-wide text-neutral-500">Total estimado</span>
            <span className="text-lg font-semibold">S/ {price.toFixed(2)}</span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={checkoutHref}
              className="group inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-brand-primary px-4 py-3 text-center text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <span className="text-sm font-semibold">Comprar ahora</span>
              <span className="text-[11px] text-white/80">Pago cifrado y discreto</span>
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-brand-primary/30 bg-white px-4 py-3 text-center text-brand-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/50 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <span className="text-sm font-semibold">WhatsApp 24/7</span>
              <span className="text-[11px] text-brand-primary/80">Respuesta inmediata</span>
            </a>
          </div>
        </div>
      </div>
    </MotionContainer>
  )
}
