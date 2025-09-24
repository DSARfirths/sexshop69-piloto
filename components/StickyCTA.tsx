'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { CSSProperties } from 'react'

type StickyCTAProps = {
  price: number
  regularPrice?: number
  checkoutHref: string
  whatsappHref: string
}

const MotionContainer = motion<{ className?: string; style?: CSSProperties }>('div')

export default function StickyCTA({ price, regularPrice, checkoutHref, whatsappHref }: StickyCTAProps) {
  const containerClassName = 'fixed inset-x-0 bottom-0 z-50 bg-gradient-to-t from-white/95 via-white/90 to-transparent pb-4 pt-2 md:hidden'
  const containerStyle: CSSProperties = {
    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)'
  }
  const displayPrice = price.toFixed(2)
  const hasReferencePrice = typeof regularPrice === 'number' && regularPrice > price
  const formattedRegularPrice = hasReferencePrice ? regularPrice.toFixed(2) : null

  return (
    <MotionContainer
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={containerClassName}
      style={containerStyle}
    >
      <div className="mx-auto mb-4 w-full max-w-md px-4">
        <div className="rounded-3xl border border-neutral-200 bg-white p-4 text-neutral-900 shadow-lg backdrop-blur">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wide text-neutral-600">Total estimado</span>
            <span className="flex items-baseline gap-2 text-lg font-semibold text-neutral-900">
              <span>S/ {displayPrice}</span>
              {formattedRegularPrice && (
                <span className="text-sm font-medium text-neutral-500 line-through">S/ {formattedRegularPrice}</span>
              )}
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              href={checkoutHref}
              className="group inline-flex flex-col items-center justify-center gap-1 rounded-2xl bg-fuchsia-600 px-4 py-3 text-center text-white shadow-neon transition-all duration-200 hover:-translate-y-0.5 hover:bg-fuchsia-700 hover:shadow-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
            >
              <span className="text-sm font-semibold">Comprar ahora</span>
              <span className="text-[11px] text-white/80">Pago cifrado y discreto</span>
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex flex-col items-center justify-center gap-1 rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-center text-neutral-800 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-neutral-400 hover:shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
            >
              <span className="text-sm font-semibold">WhatsApp 24/7</span>
              <span className="text-[11px] text-neutral-600">Respuesta inmediata</span>
            </a>
          </div>
        </div>
      </div>
    </MotionContainer>
  )
}
