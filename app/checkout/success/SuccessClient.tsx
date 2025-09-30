'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function SuccessClient() {
  const searchParams = useSearchParams()
  const sku = searchParams.get('sku') ?? 'SKU'
  const value = parseFloat(searchParams.get('value') ?? '0.0')

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
      <a href="/" className="btn-primary mt-6">Volver al inicio</a>
    </main>
  )
}
