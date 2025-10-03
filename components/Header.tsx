'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Search, ShoppingBag } from 'lucide-react'

import SearchOverlay from './header/SearchOverlay'
import { DesktopMenu } from './nav/DesktopMenu'
import { MobileMenu } from './nav/MobileMenu'
import { megaMenuConfig, type MegaMenuCategory } from '@/data/mega-menu.config'
import { openChatAssistant } from '@/lib/chat-assistant'

type PromoMessage = {
  id: string
  text: string
  link?: {
    href: string
    label: string
  }
  hideOnMobile?: boolean
}

const promoMessages: PromoMessage[] = [
  {
    id: 'pink15',
    text: 'Celebra el placer con 15% de descuento en juguetes premium usando el código PINK15.',
    link: {
      href: '/ofertas',
      label: 'Descubre la promo'
    }
  },
  {
    id: 'envio-gratis',
    text: 'Envío gratis en compras superiores a S/249 en Lima y Callao durante todo junio.',
    link: {
      href: '/envio-gratis',
      label: 'Ver condiciones'
    }
  },
  {
    id: 'asesoria',
    text: '¿No sabes qué elegir? Agenda una asesoría personalizada y encuentra tu match perfecto.',
    link: {
      href: '/asesoria',
      label: 'Agenda ahora'
    },
    hideOnMobile: true
  }
]

const PERSONA_ORDER: MegaMenuCategory['personaFacet'][] = ['her', 'him', 'couples']

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  const orderedCategories = useMemo(() => {
    const orderMap = new Map(PERSONA_ORDER.map((facet, index) => [facet, index]))
    return [...megaMenuConfig.categories].sort((a, b) => {
      const orderA = orderMap.get(a.personaFacet) ?? PERSONA_ORDER.length
      const orderB = orderMap.get(b.personaFacet) ?? PERSONA_ORDER.length
      if (orderA === orderB) {
        return a.label.localeCompare(b.label)
      }
      return orderA - orderB
    })
  }, [])

  const availablePromos = useMemo(() => {
    if (!isMobile) {
      return promoMessages
    }

    return promoMessages.filter((promo) => !promo.hideOnMobile)
  }, [isMobile])

  const safeIndex = useMemo(() => {
    return availablePromos.length ? currentPromoIndex % availablePromos.length : 0
  }, [availablePromos.length, currentPromoIndex])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')

    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches)
    }

    setIsMobile(mediaQuery.matches)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }

    mediaQuery.addListener(handleChange)
    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [])

  useEffect(() => {
    if (!availablePromos.length) {
      setCurrentPromoIndex(0)
      return
    }

    setCurrentPromoIndex((prevIndex) => {
      if (prevIndex >= availablePromos.length) {
        return 0
      }

      return prevIndex
    })
  }, [availablePromos])

  useEffect(() => {
    if (currentPromoIndex !== safeIndex) {
      setCurrentPromoIndex(safeIndex)
    }
  }, [currentPromoIndex, safeIndex])

  useEffect(() => {
    if (availablePromos.length <= 1) {
      return
    }

    const interval = window.setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % availablePromos.length)
    }, 7000)

    return () => {
      window.clearInterval(interval)
    }
  }, [availablePromos])

  const currentPromo = availablePromos[safeIndex]

  const openSearch = () => {
    setSearchOpen(true)
  }

  const closeSearch = () => {
    setSearchOpen(false)
  }

  const openChat = () => {
    openChatAssistant()
  }

  const handleNavigate = () => {
    closeSearch()
  }

  return (
    <>
      {currentPromo?.text ? (
        <div className="bg-brand-pink text-white">
          <div
            className="mx-auto flex w-full max-w-7xl justify-center px-4 py-2 text-xs sm:text-sm"
            aria-live="polite"
            aria-atomic="true"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentPromo.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex w-full flex-col items-center justify-center gap-2 text-center font-brand sm:flex-row sm:gap-3"
              >
                <p className="promo-rotator-text text-center text-white/90 sm:text-left">
                  {currentPromo.text}
                </p>
                {currentPromo.link ? (
                  <Link
                    href={currentPromo.link.href}
                    className="promo-rotator-text inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-[0.7rem] text-white transition hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--accent-femme)] sm:text-[0.8rem]"
                  >
                    {currentPromo.link.label}
                  </Link>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}

      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-40 bg-brand-black text-white shadow-[0_12px_32px_rgba(0,0,0,0.35)]"
      >
        <header className="mx-auto flex h-[var(--nav-height)] w-full max-w-7xl items-center justify-between px-[clamp(16px,6vw,32px)]">
          <Link
            href="/"
            aria-label="Inicio de Sex Shop del Perú"
            className="flex h-full items-center rounded-full px-3 transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-femme)]/70"
          >
            <Image
              src="/logo-moderno-para-fondos-oscuros.png"
              alt="Logotipo de Sex Shop del Perú con isotipo y tagline"
              width={176}
              height={56}
              className="h-[clamp(48px,6vw,64px)] w-auto"
              priority
            />
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <DesktopMenu categories={orderedCategories} onNavigate={handleNavigate} />
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="md:hidden">
              <MobileMenu categories={orderedCategories} onNavigate={handleNavigate} />
            </div>

            <button
              type="button"
              onClick={openSearch}
              className="icon-button"
              aria-label="Abrir buscador"
            >
              <Search className="h-6 w-6" aria-hidden />
              <span className="sr-only">Buscar</span>
            </button>

            <Link
              href="/carrito"
              className="icon-button"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-6 w-6" aria-hidden />
              <span className="sr-only">Carrito</span>
            </Link>

            <button
              type="button"
              onClick={openChat}
              className="icon-button"
              aria-label="Abrir asistente"
            >
              <MessageCircle className="h-6 w-6" aria-hidden />
              <span className="sr-only">Abrir chat con el asistente</span>
            </button>
          </div>
        </header>
      </motion.div>

      <SearchOverlay open={searchOpen} onClose={closeSearch} />
    </>
  )
}
