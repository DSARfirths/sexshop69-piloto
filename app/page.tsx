import Link from 'next/link'
import { PackageCheck, ShieldCheck, LockKeyhole } from 'lucide-react'
import Hero from '@/components/Hero'
import { allProducts } from '@/lib/products'
import CategoryCarousel from '@/components/home/CategoryCarousel'
import BestSellers from '@/components/home/BestSellers'
import TrustBadgesStrip from '@/components/home/TrustBadgesStrip'
import HeroCarousel from '@/components/home/HeroCarousel'

const categoryLabels: Record<string, string> = {
  bienestar: 'Bienestar intimo',
  lenceria: 'Lenceria',
  kits: 'Kits de regalo',
  arneses: 'Arneses con arnes',
  consoladores: 'Consoladores',
  fetish: 'Fetish y BDSM',
  munecas: 'Muñecas realistas',
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

const TRUST_BADGES = [
  {
    label: 'Envío discreto 100%',
    description: 'Empaques neutros y seguimiento privado sin revelar contenidos.',
    icon: <PackageCheck className="h-5 w-5" aria-hidden />
  },
  {
    label: 'Pago seguro',
    description: 'Pasarelas encriptadas y múltiples métodos sin cargos ocultos.',
    icon: <ShieldCheck className="h-5 w-5" aria-hidden />
  },
  {
    label: 'Atención confidencial',
    description: 'Consultoría anónima por chat y recomendaciones personalizadas.',
    icon: <LockKeyhole className="h-5 w-5" aria-hidden />
  }
]

export default function Page() {
  const products = allProducts()
  const catalogCategories = Array.from(new Set(products.map(p => p.category)))
  const featuredSet = new Set<string>(featuredCategories)
  const featured = featuredCategories.filter(slug => catalogCategories.includes(slug))
  const otherCategories = catalogCategories.filter(slug => !featuredSet.has(slug))
  const nsfwCategories = new Set(products.filter(p => p.nsfw).map(p => p.category))
  const orderedCategories = [...featured, ...otherCategories]
  const categoriesForCarousel = orderedCategories.map(slug => ({
    slug,
    label: labelFor(slug),
    isSensitive: nsfwCategories.has(slug)
  }))
  const bestSellers = products.filter(product => product.bestSeller)

  return (
    <>
      <Hero />
      <div className="mt-8">
        <HeroCarousel />
      </div>
      <div className="mt-6 space-y-6">
        <TrustBadgesStrip badges={TRUST_BADGES} />
        <CategoryCarousel
          title="Explora por categoría"
          subtitle="Mobile-first con desliz lateral — arrastra para descubrir más."
          categories={categoriesForCarousel}
        />
      </div>
      <div className="mt-10 space-y-10">
        <BestSellers products={bestSellers} />
        {otherCategories.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900">¿Buscas algo más específico?</h2>
            <p className="text-sm text-neutral-600">
              Recorre las categorías sensibles y temáticas creadas para diferentes niveles de experiencia.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherCategories.map(slug => {
                const label = labelFor(slug)
                const isSensitive = nsfwCategories.has(slug)
                return (
                  <Link
                    key={slug}
                    href={`/categoria/${slug}`}
                    className="block rounded-2xl border border-neutral-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="text-base font-semibold text-neutral-900">{label}</div>
                    <div className="mt-2 text-sm text-neutral-600">
                      {isSensitive ? 'Contenido sensible (18+)' : 'Explorar con seguridad'}
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
