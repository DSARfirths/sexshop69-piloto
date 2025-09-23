import { PackageCheck, ShieldCheck, LockKeyhole } from 'lucide-react'
import Hero from '@/components/Hero'
import { allProducts, getBestSellers, getNewArrivals, getOffers } from '@/lib/products'
import CategoryCarousel, { CategoryCard } from '@/components/home/CategoryCarousel'
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
  const bestSellers = getBestSellers()
  const newArrivals = getNewArrivals()
  const offers = getOffers()
  const newArrivalHighlightBadges: Record<string, string> = Object.fromEntries(
    newArrivals.map(product => [product.slug, 'Nuevo' as const])
  )
  const offerHighlightBadges: Record<string, string> = Object.fromEntries(
    offers.map(product => [product.slug, 'Oferta' as const])
  )
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
  const featured = availableCategories.filter(category =>
    (featuredCategories as readonly string[]).includes(category.slug)
  )
  const otherCategories = availableCategories.filter(
    category => !featured.some(featuredCategory => featuredCategory.slug === category.slug)
  )
  const normalizedOtherCategories = otherCategories.map(category => ({
    ...category,
    description: category.isSensitive ? 'Contenido sensible (18+)' : 'Explorar con seguridad',
    subtitle: category.isSensitive ? 'Contenido adulto' : 'Bienestar y cuidado'
  }))
  const carouselCategories = featured.length > 0 ? featured : availableCategories

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
          categories={carouselCategories}
        />
      </div>
      <div className="mt-12 space-y-12">
        <BestSellers products={bestSellers} headingId="mas-vendidos" />
        {newArrivals.length > 0 && (
          <BestSellers
            products={newArrivals}
            headingId="nuevos-ingresos"
            title="Novedades destacadas"
            description="Lo último en llegar a nuestro catálogo, con lanzamientos recientes y reposiciones esperadas."
            ctaHref="/categoria/novedades"
            ctaLabel="Ver novedades"
            highlightBadges={newArrivalHighlightBadges}
            showBestSellerHighlight={false}
          />
        )}
        {offers.length > 0 && (
          <BestSellers
            products={offers}
            headingId="ofertas-exclusivas"
            title="Ofertas exclusivas"
            description="Productos con precios especiales por tiempo limitado: aprovecha descuentos y packs promocionales."
            ctaHref="/categoria/ofertas"
            ctaLabel="Ver ofertas"
            highlightBadges={offerHighlightBadges}
            showBestSellerHighlight={false}
          />
        )}
        {normalizedOtherCategories.length > 0 && (
          <section className="space-y-4">
            <h2 id="buscas-algo-mas-especifico" className="text-xl font-semibold text-neutral-900">
              ¿Buscas algo más específico?
            </h2>
            <p className="text-sm text-neutral-600">
              Recorre las categorías sensibles y temáticas creadas para diferentes niveles de experiencia.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {normalizedOtherCategories.map(category => (
                <CategoryCard key={category.slug} category={category} />
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

