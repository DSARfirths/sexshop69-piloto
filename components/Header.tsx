'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ComponentType,
  PropsWithChildren,
  useEffect,
  useState,
} from 'react'
import { AnimatePresence, motion, type HTMLMotionProps } from 'framer-motion'
import { Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react'

import SearchOverlay from './header/SearchOverlay'
import MegaMenu from './nav/MegaMenu'
import { openChatAssistant } from '@/lib/chat-assistant'

const MotionWrapper: any = motion.div
const MotionMobileOverlay = motion.div as ComponentType<
  PropsWithChildren<HTMLMotionProps<'div'> & { className?: string }>
>
const MotionButton: any = motion.button
const MotionAside: any = motion.aside

const primaryLinks = [
  { href: '/novedades', label: 'Novedades' },
  { href: '/ofertas', label: 'Ofertas' },
  { href: '/blog', label: 'Blog/Guías' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

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
      <MotionWrapper
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`sticky top-0 z-40 border-b border-brand-pink/60 backdrop-blur-xl transition-colors duration-300 ${
          isScrolled
            ? 'bg-neutral-950/70 supports-[backdrop-filter]:bg-neutral-950/60'
            : 'bg-neutral-950 supports-[backdrop-filter]:bg-neutral-950'
        }`}
      >
        <header className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-3 text-neutral-100 sm:px-4">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold tracking-tight text-brand-pink transition hover:bg-brand-pink/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60 md:text-base"
          >
            <Image
              src="/logo-moderno-para-fondos-oscuros.png"
              alt="Logo Sex Shop 69"
              width={160}
              height={48}
              priority
              className="h-8 w-auto md:h-9"
            />
            <span className="sr-only">Sex Shop 69 - Placer sin tabues</span>
          </Link>

          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            <MegaMenu />
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-brand-pink/90 transition hover:bg-brand-pink/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-pink transition hover:border-brand-pink/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70 md:w-auto md:px-3"
              aria-label="Abrir buscador"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden pl-2 text-sm font-medium md:inline">Buscar</span>
            </button>

            <Link
              href="/carrito"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-pink transition hover:border-brand-pink/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70 md:w-auto md:px-3"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span className="hidden pl-2 text-sm font-medium md:inline">Carrito</span>
            </Link>

            <button
              type="button"
              onClick={openChat}
              className="btn-primary h-10 px-5"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span className="hidden md:inline">Asistente</span>
              <span className="sr-only">Asistente AI</span>
            </button>

            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-brand-pink transition hover:border-brand-pink/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70 md:hidden"
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
                className="flex-1 bg-black/40"
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
                className="flex h-full w-[min(20rem,85vw)] flex-col bg-neutral-950/95 text-neutral-100 shadow-2xl"
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
                      <MegaMenu variant="mobile" onNavigate={() => setMenuOpen(false)} />
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-brand-pink/80">Descubre más</p>
                        {primaryLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm transition hover:border-brand-pink/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/70"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
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
