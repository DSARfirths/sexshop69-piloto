'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, X } from 'lucide-react'

import SearchOverlay from './header/SearchOverlay'

const MotionWrapper: any = motion.div
const MotionMobileMenu: any = motion.div

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const openSearch = () => {
    setSearchOpen(true)
    setMenuOpen(false)
  }

  return (
    <>
      <MotionWrapper
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-40 border-b bg-white/70 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60"
      >
        <header className="mx-auto flex h-12 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-sm font-semibold text-brand-primary md:text-base">
            SexShop del Perú 69
          </Link>

          <nav className="hidden gap-6 text-sm md:flex">
            <Link href="/categoria/bienestar" className="transition hover:text-brand-primary">
              Bienestar
            </Link>
            <Link href="/categoria/lenceria" className="transition hover:text-brand-primary">
              Lencería
            </Link>
            <Link href="/categoria/kits" className="transition hover:text-brand-primary">
              Kits
            </Link>
            <Link href="/ads/variant-a" className="transition hover:text-brand-primary">
              Promo A
            </Link>
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/60 text-neutral-700 shadow-sm transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 md:w-auto md:px-3"
              aria-label="Abrir buscador"
            >
              <Search className="h-4 w-4" />
              <span className="hidden pl-2 text-sm font-medium md:inline">Buscar</span>
            </button>

            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 bg-white/60 text-neutral-700 shadow-sm transition hover:border-brand-primary hover:text-brand-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40 md:hidden"
              onClick={toggleMenu}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <MotionMobileMenu
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="overflow-hidden border-t border-neutral-100 bg-white/90 backdrop-blur md:hidden"
            >
              <div className="mx-auto flex flex-col gap-3 px-4 py-3 text-sm">
                <Link href="/categoria/bienestar" onClick={() => setMenuOpen(false)} className="py-1">
                  Bienestar
                </Link>
                <Link href="/categoria/lenceria" onClick={() => setMenuOpen(false)} className="py-1">
                  Lencería
                </Link>
                <Link href="/categoria/kits" onClick={() => setMenuOpen(false)} className="py-1">
                  Kits
                </Link>
                <Link href="/ads/variant-a" onClick={() => setMenuOpen(false)} className="py-1">
                  Promo A
                </Link>
              </div>
            </MotionMobileMenu>
          )}
        </AnimatePresence>
      </MotionWrapper>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
