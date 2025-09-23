'use client'

import Link from 'next/link'
import { FocusEvent, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronDown,
  ChevronRight,
  Menu,
  MessageCircle,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react'

import SearchOverlay from './header/SearchOverlay'
import categoriesData from '@/data/categories.json'

const MotionWrapper: any = motion.div

type Category = {
  slug: string
  label: string
  children?: {
    slug: string
    label: string
  }[]
}

const primaryLinks = [
  { href: '/novedades', label: 'Novedades' },
  { href: '/ofertas', label: 'Ofertas' },
  { href: '/blog', label: 'Blog/Guías' },
]

const categoryIcons = [Sparkles, ShoppingBag, MessageCircle]

const categories = categoriesData as Category[]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false)

  const toggleMenu = () => setMenuOpen((prev) => !prev)
  const openSearch = () => {
    setSearchOpen(true)
    setMenuOpen(false)
  }

  const openChat = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sexshop:chat-open'))
    }
  }

  const desktopCategories = categories.slice(0, 6)
  const desktopMenuId = 'desktop-categories-menu'

  const handleDesktopBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setDesktopCategoriesOpen(false)
    }
  }

  return (
    <>
      <MotionWrapper
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="sticky top-0 z-40 border-b border-fuchsia-700/50 bg-neutral-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-neutral-950/60"
      >
        <header className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-neutral-100">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold tracking-tight text-fuchsia-100 transition hover:bg-fuchsia-500/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 md:text-base"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-fuchsia-500/90 text-base font-bold uppercase">
              69
            </span>
            <span className="flex flex-col leading-tight">
              <span>SexShop del Perú</span>
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-fuchsia-200/80 md:text-xs">
                Placer sin tabúes
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-2 text-sm font-medium md:flex">
            <div
              className="relative"
              onMouseEnter={() => setDesktopCategoriesOpen(true)}
              onMouseLeave={() => setDesktopCategoriesOpen(false)}
              onFocus={() => setDesktopCategoriesOpen(true)}
              onBlur={handleDesktopBlur}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  setDesktopCategoriesOpen(false)
                }
              }}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={desktopCategoriesOpen}
                aria-controls={desktopMenuId}
                onClick={() => setDesktopCategoriesOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-fuchsia-100/90 transition hover:bg-fuchsia-500/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Categorías
                <ChevronDown
                  className={`h-4 w-4 transition ${desktopCategoriesOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </button>

              <div
                id={desktopMenuId}
                className={`absolute left-0 top-full z-10 min-w-[18rem] rounded-2xl border border-fuchsia-500/30 bg-neutral-950/95 p-4 text-sm text-neutral-100 shadow-2xl ring-1 ring-white/5 transition duration-150 ${
                  desktopCategoriesOpen
                    ? 'pointer-events-auto block translate-y-2 opacity-100'
                    : 'pointer-events-none hidden -translate-y-1 opacity-0'
                }`}
              >
                <ul className="grid grid-cols-1 gap-3">
                  {desktopCategories.map((category, index) => {
                    const Icon = categoryIcons[index % categoryIcons.length]
                    const previewChildren = category.children
                      ?.slice(0, 2)
                      .map((child) => child.label)
                    return (
                      <li key={category.slug}>
                        <Link
                          href={`/categoria/${category.slug}`}
                          className="flex items-start gap-3 rounded-xl border border-transparent bg-white/5 px-3 py-2 transition hover:border-fuchsia-500/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                        >
                          <span className="mt-1 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-200">
                            <Icon className="h-4 w-4" aria-hidden />
                          </span>
                          <span className="flex flex-col">
                            <span className="font-semibold">{category.label}</span>
                            <span className="text-xs text-neutral-300">
                              {previewChildren?.length
                                ? previewChildren.join(' · ')
                                : 'Explora las subcategorías'}
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
                <Link
                  href="/categorias"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-fuchsia-200/80 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
                >
                  Ver todas las categorías
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>

            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-2 text-fuchsia-100/90 transition hover:bg-fuchsia-500/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 md:gap-2">
            <button
              type="button"
              onClick={openSearch}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fuchsia-100 transition hover:border-fuchsia-400/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70 md:w-auto md:px-3"
              aria-label="Abrir buscador"
            >
              <Search className="h-4 w-4" aria-hidden />
              <span className="hidden pl-2 text-sm font-medium md:inline">Buscar</span>
            </button>

            <Link
              href="/carrito"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fuchsia-100 transition hover:border-fuchsia-400/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70 md:w-auto md:px-3"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden />
              <span className="hidden pl-2 text-sm font-medium md:inline">Carrito</span>
            </Link>

            <button
              type="button"
              onClick={openChat}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-fuchsia-400/40 bg-fuchsia-500/20 px-4 text-sm font-semibold text-fuchsia-100 transition hover:border-fuchsia-300 hover:bg-fuchsia-500/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/80"
            >
              <MessageCircle className="h-4 w-4" aria-hidden />
              <span className="hidden md:inline">Asistente</span>
              <span className="sr-only">Asistente AI</span>
            </button>

            <button
              type="button"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-fuchsia-100 transition hover:border-fuchsia-400/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70 md:hidden"
              onClick={toggleMenu}
            >
              {menuOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </button>
          </div>
        </header>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="fixed inset-0 z-40 flex md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                type="button"
                aria-label="Cerrar menú"
                className="flex-1 bg-black/40"
                onClick={toggleMenu}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                className="flex h-full w-[min(20rem,85vw)] flex-col bg-neutral-950/95 text-neutral-100 shadow-2xl"
              >
                <div className="flex items-center justify-between px-4 pb-2 pt-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-fuchsia-200/80">Explorar</p>
                  <button
                    type="button"
                    onClick={toggleMenu}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-fuchsia-100 transition hover:border-fuchsia-400/60 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
                  >
                    <X className="h-4 w-4" aria-hidden />
                    <span className="sr-only">Cerrar menú</span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-6">
                  <nav className="space-y-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-200/80">Categorías</p>
                      <ul className="mt-3 space-y-4">
                        {categories.map((category, index) => {
                          const Icon = categoryIcons[index % categoryIcons.length]
                          return (
                            <li key={category.slug}>
                              <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-3 text-sm transition hover:border-fuchsia-400/40 hover:bg-white/10 focus-within:border-fuchsia-400/40 focus-within:bg-white/10">
                                <Link
                                  href={`/categoria/${category.slug}`}
                                  onClick={() => setMenuOpen(false)}
                                  className="flex items-center gap-2 font-semibold text-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
                                >
                                  <Icon className="h-4 w-4 text-fuchsia-200" aria-hidden />
                                  {category.label}
                                </Link>
                                {category.children && category.children.length > 0 && (
                                  <ul className="mt-2 space-y-1 text-xs text-neutral-200">
                                    {category.children.map((child) => (
                                      <li key={child.slug}>
                                        <Link
                                          href={`/categoria/${child.slug}`}
                                          onClick={() => setMenuOpen(false)}
                                          className="flex items-center justify-between rounded-md px-2 py-1 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fuchsia-300/70"
                                        >
                                          <span>{child.label}</span>
                                          <ChevronRight className="h-3.5 w-3.5 text-fuchsia-200/70" aria-hidden />
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-fuchsia-200/80">Descubre más</p>
                      {primaryLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-sm transition hover:border-fuchsia-400/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </nav>
                </div>

                <div className="border-t border-white/10 p-4">
                  <button
                    type="button"
                    onClick={() => {
                      openChat()
                      setMenuOpen(false)
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-fuchsia-500/90 px-4 py-3 text-sm font-semibold text-white transition hover:bg-fuchsia-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/80"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden />
                    Abrir asistente
                  </button>
                </div>
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>
      </MotionWrapper>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
