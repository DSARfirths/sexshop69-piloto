export default function SuccessPage({ searchParams }: any) {
  const sku = searchParams.sku ?? 'SKU'
  return (
    <main className="max-w-lg mx-auto text-center py-12">
      <h1 className="text-2xl font-semibold">Checkout sandbox</h1>
      <p className="mt-2">Pedido simulado para <b>{sku}</b>. Aquí conectaremos la pasarela (Culqi/Niubiz) tras aprobación.</p>
      <a href="/" className="inline-block mt-6 px-5 py-3 rounded-xl bg-brand-primary text-white">Volver al inicio</a>
    </main>
  )
}
