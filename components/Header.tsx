'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ComponentType, PropsWithChildren, useState } from 'react'
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react'

import SearchOverlay from './header/SearchOverlay'
import PersonaMegaMenu from './nav/PersonaMegaMenu'
import { openChatAssistant } from '@/lib/chat-assistant'

const MotionWrapper: any = motion.div
const MotionMobileOverlay = motion.div as ComponentType<
  PropsWithChildren<HTMLMotionProps<'div'> & { className?: string }>
>
const MotionButton: any = motion.button
const MotionAside: any = motion.aside

const promoBanner = {
  text: 'Celebra el placer con 15% de descuento en juguetes premium usando el código PINK15.',
  link: {
    href: '/ofertas',
    label: 'Descubre la promo',
  },
  hideOnMobile: false,
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const openSearch = () => {
    setSearchOpen(true)
    setMenuOpen(false)
  }

  const openChat = () => {
    openChatAssistant()
  }

  return (
    <>
      {promoBanner.text ? (
        <div
          className={`bg-brand-pink text-white ${promoBanner.hideOnMobile ? 'hidden sm:block' : ''}`}
        >
          <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-3 px-3 py-1 text-xs sm:px-4 sm:text-sm">
            <p className="text-center font-medium leading-tight">{promoBanner.text}</p>
            {promoBanner.link ? (
              <Link
                href={promoBanner.link.href}
                className="inline-flex items-center gap-1 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--brand-pink)] sm:text-[0.8rem]"
              >
                {promoBanner.link.label}
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
      <MotionWrapper
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-40 border-b border-brand-pink/60 bg-black"
      >
        <header className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 text-neutral-100 sm:px-6">
          <Link
            href="/"
            aria-label="Inicio de Sex Shop del Perú"
            className="flex h-full items-center rounded-full px-3 transition hover:bg-brand-pink/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
          >
            <Image
              src="/logo-moderno-para-fondos-oscuros.png"
              alt="Logotipo de Sex Shop del Perú con isotipo y tagline"
              width={176}
              height={56}
              className="h-14 w-auto"
              priority
            />
          </Link>

          <nav className="hidden h-full items-center gap-3 text-sm font-medium md:flex">
            <PersonaMegaMenu personaFacet="him" />
            <PersonaMegaMenu personaFacet="her" />
            <PersonaMegaMenu personaFacet="couples" />
          </nav>

          <div className="flex h-full items-center gap-2 md:gap-3">
            <button
              type="button"
              onClick={openSearch}
              className="icon-button"
              aria-label="Abrir buscador"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="sr-only">Buscar</span>
            </button>

            <Link
              href="/carrito"
              className="icon-button"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span className="sr-only">Carrito</span>
            </Link>

            <button
              type="button"
              onClick={openChat}
              className="icon-button"
              aria-label="Abrir asistente"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span className="sr-only">Abrir chat con el asistente</span>
            </button>

            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="icon-button md:hidden"
              onClick={toggleMenu}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <MotionMobileOverlay
              className="fixed inset-0 z-40 flex md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MotionButton
                type="button"
                aria-label="Cerrar menú"
                className="flex-1 bg-black/90"
                onClick={toggleMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <MotionAside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className="flex h-full w-[min(20rem,85vw)] flex-col bg-black text-neutral-100 shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 pb-2 pt-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-pink/80">Explorar</p>
                  <button
                    type="button"
                    onClick={toggleMenu}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-brand-pink transition hover:border-brand-pink/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                  >
                    <X className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Cerrar menú</span>
                  </button>
                </div>
                <div className="relative flex-1 overflow-hidden">
                  <div className="h-full overflow-y-auto px-4 pb-10">
                    <nav className="space-y-6">
                      <PersonaMegaMenu
                        personaFacet="him"
                        variant="mobile"
                        onNavigate={() => setMenuOpen(false)}
                      />
                      <PersonaMegaMenu
                        personaFacet="her"
                        variant="mobile"
                        onNavigate={() => setMenuOpen(false)}
                      />
                      <PersonaMegaMenu
                        personaFacet="couples"
                        variant="mobile"
                        onNavigate={() => setMenuOpen(false)}
                      />
                    </nav>
                  </div>
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black via-black/70 to-transparent"
                    aria-hidden="true"
                  />
                </div>

                <div className="border-t border-white/10 p-4">
                  <button
                    type="button"
                    onClick={() => {
                      openChat()
                      setMenuOpen(false)
                    }}
                    className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Abrir asistente
                  </button>
                </div>
              </MotionAside>
            </MotionMobileOverlay>
          )}
        </AnimatePresence>
      </MotionWrapper>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
