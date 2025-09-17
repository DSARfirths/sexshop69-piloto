// ========== app/ads/variant-a/page.tsx (CTA a categoría bienestar) ==========
export default function AdsA() {
  return (
    <main className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-semibold">Bienestar íntimo con asesoría segura</h1>
      <p className="mt-3 text-neutral-700">Productos para adultos — información clara, envíos discretos y atención profesional. Página apta para revisión de políticas (sin imágenes explícitas).</p>
      <ul className="list-disc pl-5 mt-4 text-neutral-700">
        <li>Atención en 22 tiendas a nivel nacional</li>
        <li>Pagos seguros y discretos</li>
        <li>Asesoría personalizada</li>
      </ul>
      <a href="/categoria/bienestar" className="inline-block mt-6 px-5 py-3 rounded-xl bg-brand-primary text-white">Explorar Bienestar</a>
    </main>
  )
}