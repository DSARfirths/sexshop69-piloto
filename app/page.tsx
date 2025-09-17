import Link from 'next/link'
import Hero from '@/components/Hero'
import { allProducts } from '@/lib/products'

const categoryLabels: Record<string, string> = {
  bienestar: 'Bienestar intimo',
  lenceria: 'Lenceria',
  kits: 'Kits de regalo',
  arneses: 'Arneses con arnes',
  consoladores: 'Consoladores',
  fetish: 'Fetish y BDSM',
  munecas: 'Munecas realistas',
  anales: 'Juegos anales'
}
const featuredCategories = ['bienestar', 'lenceria', 'kits'] as const

function labelFor(slug: string) {
  if (slug in categoryLabels) return categoryLabels[slug]
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function Page(){
  const products = allProducts()
  const catalogCategories = Array.from(new Set(products.map(p => p.category)))
  const otherCategories = catalogCategories.filter(slug => !featuredCategories.includes(slug as typeof featuredCategories[number]))
  const nsfwCategories = new Set(products.filter(p => p.nsfw).map(p => p.category))

  return (
    <>
      <Hero />
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {featuredCategories.map(slug => (
          <Link key={slug} href={`/categoria/${slug}`} className="block p-5 md:p-6 rounded-2xl border hover:shadow-md transition">
            <div className="text-base md:text-lg font-medium">{labelFor(slug)}</div>
            <div className="text-sm text-neutral-600 mt-1">Explorar</div>
          </Link>
        ))}
      </section>

      {otherCategories.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-800 mb-3">Catalogo completo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {otherCategories.map(slug => {
              const label = labelFor(slug)
              const isSensitive = nsfwCategories.has(slug)
              return (
                <Link
                  key={slug}
                  href={`/categoria/${slug}`}
                  className="block p-5 md:p-6 rounded-2xl border hover:shadow-md transition space-y-1"
                >
                  <div className="text-base md:text-lg font-medium">{label}</div>
                  <div className="text-sm text-neutral-600">{isSensitive ? 'Contenido sensible (18+)' : 'Explorar'}</div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </>
  )
}