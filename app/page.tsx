import Image from 'next/image'
import Link from 'next/link'
import { PackageCheck, ShieldCheck, LockKeyhole } from 'lucide-react'
import Hero from '@/components/Hero'
import { allProducts } from '@/lib/products'
import CategoryCarousel from '@/components/home/CategoryCarousel'
import BestSellers from '@/components/home/BestSellers'
import TrustBadgesStrip from '@/components/home/TrustBadgesStrip'
import HeroCarousel from '@/components/home/HeroCarousel'
import categoriesData from '@/data/categories.json'

const featuredCategories = ['bienestar', 'lenceria', 'kits'] as const

type CategoryDefinition = {
  slug: string
  label: string
  image: string | null
  isSensitive?: boolean
}

type AvailableCategory = Omit<CategoryDefinition, 'image'> & { image: string; isSensitive: boolean }

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
  const nsfwCategories = new Set(products.filter(p => p.nsfw).map(p => p.category))
  const catalogCategories = new Set(products.map(p => p.category))
  const typedCategories = categoriesData as CategoryDefinition[]
  const availableCategories: AvailableCategory[] = typedCategories
    .filter(category => catalogCategories.has(category.slug))
    .map(category => ({
      ...category,
      image: category.image ?? CATEGORY_FALLBACK_IMAGE,
      isSensitive: category.isSensitive || nsfwCategories.has(category.slug)
    }))
  const availableBySlug = new Map(availableCategories.map(category => [category.slug, category]))
  const featured = featuredCategories
    .map(slug => availableBySlug.get(slug))
    .filter((category): category is AvailableCategory => Boolean(category))
  const featuredSet = new Set(featured.map(category => category.slug))
  const otherCategories = availableCategories.filter(category => !featuredSet.has(category.slug))
  const categoriesForCarousel = [...featured, ...otherCategories]
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
          headingId="explora-por-categoria"
          categories={categoriesForCarousel}
        />
      </div>
      <div className="mt-10 space-y-10">
        <BestSellers products={bestSellers} headingId="mas-vendidos" />
        {otherCategories.length > 0 && (
          <section className="space-y-4">
            <h2 id="buscas-algo-mas-especifico" className="text-xl font-semibold text-neutral-900">
              ¿Buscas algo más específico?
            </h2>
            <p className="text-sm text-neutral-600">
              Recorre las categorías sensibles y temáticas creadas para diferentes niveles de experiencia.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherCategories.map(category => (
                    <Link
                      key={category.slug}
                      href={`/categoria/${category.slug}`}
                      className="flex flex-col items-center rounded-2xl border border-neutral-200 bg-white/90 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
                        <Image
                          src={category.image ?? CATEGORY_FALLBACK_IMAGE}
                          alt={`${category.label} — miniatura de categoría`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="text-base font-semibold text-neutral-900">{category.label}</div>
                      <div className="mt-2 text-sm text-neutral-600">
                        {category.isSensitive ? 'Contenido sensible (18+)' : 'Explorar con seguridad'}
                      </div>
                    </Link>
                  ))}
                </div>
            </section>
        )}
      </div>
    </>
  )
}
const CATEGORY_FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#e4e4e7"/></linearGradient></defs><rect width="160" height="160" fill="url(#g)"/><text x="50%" y="50%" fill="#a1a1aa" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="middle">Categoría</text></svg>`
  )

