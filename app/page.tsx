import { PackageCheck, ShieldCheck, LockKeyhole } from 'lucide-react'
import Hero from '@/components/Hero'
import { allProducts, getBestSellers, getNewArrivals, getOffers } from '@/lib/products'
import CategoryCarousel, { CategoryCard } from '@/components/home/CategoryCarousel'
import BestSellers from '@/components/home/BestSellers'
import TrustBadgesStrip from '@/components/home/TrustBadgesStrip'
import HeroCarousel from '@/components/home/HeroCarousel'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import InspirationalBanner from '@/components/home/InspirationalBanner'
import categoriesData from '@/data/categories.json'

type AvailableProduct = ReturnType<typeof allProducts>[number]

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

const PREMIUM_PRODUCT_SLUGS = [
  'ultimate-fantasy-dolls-mandy-copia',
  'bathmate-hydromax7-x30-britanico-original',
  'xtreme-x30-britanico-original'
] as const

const HIGHLIGHTED_CATEGORY_LIMIT = 8

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

  const carouselSource = featured.length > 0 ? featured : availableCategories
  const highlightedCategories = carouselSource.slice(0, HIGHLIGHTED_CATEGORY_LIMIT)
  const hasMoreCategories = availableCategories.length > highlightedCategories.length

  const premiumProducts = PREMIUM_PRODUCT_SLUGS.map(slug =>
    products.find(product => product.slug === slug)
  ).filter((product): product is AvailableProduct => Boolean(product))

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
      <div className="mt-8 lg:hidden">
        <HeroCarousel className="bg-white/70" />
      </div>
      <div className="mt-10 space-y-12">
        <TrustBadgesStrip badges={TRUST_BADGES} />
        <section className="space-y-6" id="catalogo">
          <CategoryCarousel
            title="Explora por categoría"
            subtitle="Mobile-first con desliz lateral — arrastra para descubrir más."
            headingId="explora-por-categoria"
            categories={highlightedCategories}
          />
          {hasMoreCategories && (
            <div className="flex justify-end">
              <Link
                href="/categorias"
                className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-5 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                Ver más categorías
              </Link>
            </div>
          )}
        </section>
        <FeaturedProducts products={premiumProducts} headingId="productos-destacados" />
        <InspirationalBanner
          eyebrow="Editorial 69"
          title="Sensualidad consciente"
          description="Eleva tus rituales íntimos con materiales hipoalergénicos, cosmética vegana y guías diseñadas por terapeutas certificados."
          image="/hero/juguetes-anales-premium.svg"
          imageAlt="Ilustración de juguetes premium en tonos metálicos"
          ctaHref="/colecciones/wellness"
          ctaLabel="Explorar rituales"
        />
        <BestSellers
          products={bestSellers}
          headingId="mas-vendidos"
          layout="carousel"
          maxVisible={6}
        />
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
            layout="carousel"
            maxVisible={6}
          />
        )}
        <InspirationalBanner
          align="right"
          eyebrow="Historias reales"
          title="Parejas que experimentan"
          description="Descubre testimonios curados y sesiones guiadas para sincronizar ritmos, explorar comunicación íntima y potenciar el deseo mutuo."
          image="/hero/parejas-curiosas-neon.svg"
          imageAlt="Ilustración futurista de pareja conectada"
          ctaHref="/blog/parejas"
          ctaLabel="Leer historias"
        />
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
            layout="carousel"
            maxVisible={6}
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

