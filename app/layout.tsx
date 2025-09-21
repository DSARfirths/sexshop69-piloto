import './globals.css'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { ChatBubble } from '@/components/ChatBubble'
import { AgeGate } from '@/components/AgeGate'
import Script from "next/script";
import GAProvider from "./ga-provider";

export const metadata: Metadata = {
  title: 'SexShop del Perú 69 — Piloto',
  description: 'Piloto seguro, mobile-first, con landings A/B y anti-indexación de imágenes sensibles.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="es">
      <head>
        {GA_ID && (
          <>
            <Script
              id="gtag-src"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                // Evitamos page_view doble; lo enviamos manual en GAProvider:
                gtag('config', '${GA_ID}', { send_page_view: false });
                // Si algún día usa tag directo de Ads (no necesario si importa desde GA4):
                ${process.env.NEXT_PUBLIC_GADS_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GADS_ID}');` : ""}
              `}
            </Script>
          </>
        )}
      </head>
      <body className="min-h-screen bg-white text-neutral-900 antialiased">
        <GAProvider />
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
