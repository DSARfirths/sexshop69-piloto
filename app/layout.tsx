import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChatBubble } from '@/components/ChatBubble'
import { AgeGate } from '@/components/AgeGate'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_ID = process.env.NEXT_PUBLIC_GADS_ID;

export const metadata: Metadata = {
  title: 'SexShop del Perú 69 — Piloto',
  description: 'Piloto seguro, mobile-first, con landings A/B y anti-indexación de imágenes sensibles.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        {/* Google Analytics & Ads */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
                ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ''}
              `}
            </Script>
          </>
        )}
      </head>
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
