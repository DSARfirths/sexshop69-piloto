import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChatBubble } from '@/components/ChatBubble'
import { AgeGate } from '@/components/AgeGate'
import Tracker from './Tracker'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

const baseMetadata: Metadata = {
  title: 'SexShop del Perú 69 — Piloto',
  description: 'Piloto seguro, mobile-first, con landings A/B y anti-indexación de imágenes sensibles.'
}

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: siteUrl ? new URL(siteUrl) : undefined
}

// Nota: para personalizar títulos y descripciones por categoría o producto,
// actualice los métodos `generateMetadata` en `app/categoria/[slug]/page.tsx`
// y `app/producto/[slug]/page.tsx`. Allí también se pueden ajustar etiquetas
// canonical, Open Graph o reglas de indexación específicas.

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gadsId = process.env.NEXT_PUBLIC_GADS_ID;

  return (
    <html lang="es">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2"
          crossOrigin="anonymous"
        />
        {gaId && (
          <>
            <link
              rel="preconnect"
              href="https://www.googletagmanager.com"
            />
            <link rel="preconnect" href="https://www.google-analytics.com" />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
                ${gadsId ? `gtag('config', '${gadsId}');` : ''}
              `}
            </Script>
          </>
        )}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <link rel="preconnect" href="https://plausible.io" />
        )}
      </head>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <Suspense fallback={null}>
          <Tracker />
        </Suspense>
        <Header />
        <main className="mx-auto w-full max-w-7xl px-3 pb-24 pt-2 sm:px-4 lg:px-4">
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