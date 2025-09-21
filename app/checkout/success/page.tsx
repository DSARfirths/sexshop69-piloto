'use client'

import { useEffect } from 'react'

interface SuccessPageProps {
  searchParams: {
    sku?: string;
    value?: string;
  }
}
export default function SuccessPage({ searchParams }: SuccessPageProps) {
  const sku = searchParams.sku ?? 'SKU'
  const value = parseFloat(searchParams.value ?? '0.0')

  useEffect(() => {
    // Dispara el evento de conversión de compra a Google Analytics / Ads
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'purchase', {
        currency: 'PEN',
        value: value,
        transaction_id: `T_${Date.now()}` // Genera un ID de transacción único
      });
    }
  }, [value]); // El efecto se ejecuta si el valor cambia

  return (
    <main className="max-w-lg mx-auto text-center py-12">
      <h1 className="text-2xl font-semibold">Checkout sandbox</h1>
      <p className="mt-2">Pedido simulado para <b>{sku}</b>. Aquí conectaremos la pasarela (Culqi/Niubiz) tras aprobación.</p>
      <a href="/" className="inline-block mt-6 px-5 py-3 rounded-xl bg-brand-primary text-white">Volver al inicio</a>
    </main>
  )
}
