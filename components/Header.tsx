'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-brand-primary">SexShop del Perú 69</Link>
        <nav className="hidden md:flex gap-6 text-sm">
          <Link href="/categoria/bienestar" className="hover:opacity-80">Bienestar</Link>
          <Link href="/categoria/lenceria" className="hover:opacity-80">Lencería</Link>
          <Link href="/categoria/kits" className="hover:opacity-80">Kits</Link>
          <Link href="/ads/variant-a" className="hover:opacity-80">Promo A</Link>
        </nav>
        <button aria-label="Abrir menú" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 text-sm">
            <Link href="/categoria/bienestar" onClick={() => setOpen(false)}>Bienestar</Link>
            <Link href="/categoria/lenceria" onClick={() => setOpen(false)}>Lencería</Link>
            <Link href="/categoria/kits" onClick={() => setOpen(false)}>Kits</Link>
            <Link href="/ads/variant-a" onClick={() => setOpen(false)}>Promo A</Link>
          </div>
        </div>
      )}
    </header>
  )
}
