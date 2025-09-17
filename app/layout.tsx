import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChatBubble } from '@/components/ChatBubble'
import { AgeGate } from '@/components/AgeGate'

export const metadata: Metadata = {
  title: 'SexShop del Perú 69 — Piloto',
  description: 'Piloto seguro, mobile-first, con landings A/B y anti-indexación de imágenes sensibles.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <Header />
        <main className="max-w-6xl mx-auto px-4 pb-24 pt-2">
          {children}
        </main>
        <Footer />
        <Suspense>
          <ChatBubble />
        </Suspense>
        <AgeGate />
        {/* Plausible (opcional). Configure dominio en producción */}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <script defer data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN} src="https://plausible.io/js/script.js" />
        )}
      </body>
    </html>
  )
}
