'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, Search, X } from 'lucide-react'

import SearchOverlay from './header/SearchOverlay'
import categoriesData from '@/data/categories.json'

const MotionWrapper: any = motion.div
const MotionMobileMenu: any = motion.div

type Category = {
  slug: string
  label: string
  children?: {
    slug: string
    label: string
  }[]
}

const staticLinks = [
  {
    href: '/ads/variant-a',
    label: 'Promo A',
  },
]

const categories = categoriesData as Category[]

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
            {categories.map((category) => {
              const hasChildren = category.children && category.children.length > 0

              if (!hasChildren) {
                return (
                  <Link
                    key={category.slug}
                    href={`/categoria/${category.slug}`}
                    className="transition hover:text-brand-primary"
                  >
                    {category.label}
                  </Link>
                )
              }

              return (
                <div key={category.slug} className="group relative">
                  <Link
                    href={`/categoria/${category.slug}`}
                    className="transition hover:text-brand-primary"
                  >
                    {category.label}
                  </Link>

                  <div className="pointer-events-none absolute left-0 top-full hidden min-w-[14rem] flex-col gap-1 rounded-lg border border-neutral-100 bg-white p-3 text-sm text-neutral-700 shadow-lg transition group-hover:pointer-events-auto group-hover:flex group-focus-within:pointer-events-auto group-focus-within:flex">
                    {category.children?.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/categoria/${child.slug}`}
                        className="rounded-md px-2 py-1 transition hover:bg-neutral-50 hover:text-brand-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}

            {staticLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-brand-primary">
                {link.label}
              </Link>
            ))}
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
                {categories.map((category) => (
                  <div key={category.slug} className="flex flex-col gap-2">
                    <Link
                      href={`/categoria/${category.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="py-1"
                    >
                      {category.label}
                    </Link>

                    {category.children && category.children.length > 0 && (
                      <div className="ml-3 flex flex-col gap-2 border-l border-neutral-200 pl-3 text-sm text-neutral-600">
                        {category.children.map((child) => (
                          <Link
                            key={child.slug}
                            href={`/categoria/${child.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="py-0.5"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {staticLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="py-1">
                    {link.label}
                  </Link>
                ))}
              </div>
            </MotionMobileMenu>
          )}
        </AnimatePresence>
      </MotionWrapper>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
