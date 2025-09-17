import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ChatBubble } from '@/components/ChatBubble'

export const metadata: Metadata = {
  title: 'SexShop del Perú 69 — Piloto',
  description: 'Piloto seguro para validación de Ads y anti-indexación de imágenes sensibles.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-neutral-900">
        <div className="max-w-6xl mx-auto px-4 pb-24">
          <header className="py-4 flex items-center justify-between">
            <div className="text-2xl font-bold text-brand-primary">SexShop del Perú 69</div>
            <nav className="text-sm opacity-80">Bienestar íntimo · Lencería · Kits</nav>
          </header>
          {children}
        </div>
        <Suspense>
          <ChatBubble />
        </Suspense>
      </body>
    </html>
  )
}
