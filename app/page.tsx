import { PackageCheck, ShieldCheck, LockKeyhole } from 'lucide-react'
import Link from 'next/link'
import Hero from '@/components/Hero'
import { allProducts, getBestSellers, getNewArrivals, getOffers } from '@/lib/products'
import { CategoryCard } from '@/components/home/CategoryCarousel'
import BestSellers from '@/components/home/BestSellers'
import TrustBadgesStrip from '@/components/home/TrustBadgesStrip'
import HeroCarousel from '@/components/home/HeroCarousel'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import InspirationalBanner from '@/components/home/InspirationalBanner'
import categoriesData from '@/data/categories.json'

type AvailableProduct = ReturnType<typeof allProducts>[number]

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
  const premiumProducts = PREMIUM_PRODUCT_SLUGS.map(slug =>
    products.find(product => product.slug === slug)
  ).filter((product): product is AvailableProduct => Boolean(product))

  const normalizedOtherCategories = availableCategories.map(category => ({
    ...category,
    description: category.isSensitive ? 'Contenido sensible (18+)' : 'Explorar con seguridad',
    subtitle: category.isSensitive ? 'Contenido adulto' : 'Bienestar y cuidado'
  }))
  return (
    <>
      <Hero />
      <div className="mt-8 space-y-8 sm:mt-12 sm:space-y-12 lg:space-y-20">
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-neutral-50 to-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="relative z-10 space-y-10">
            <TrustBadgesStrip badges={TRUST_BADGES} />
            <HeroCarousel className="h-full rounded-2xl border border-neutral-200 bg-white px-4 py-6 shadow-sm" />
          </div>
        </section>

        <div className="relative rounded-3xl border border-neutral-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="relative z-10">
            <FeaturedProducts products={premiumProducts} headingId="productos-destacados" />
          </div>
        </div>

        <div className="relative rounded-3xl border border-neutral-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
          <div className="relative z-10 space-y-12">
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
          </div>
        </div>

        {offers.length > 0 && (
          <div className="relative rounded-3xl border border-neutral-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div className="relative z-10">
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
            </div>
          </div>
        )}

        {normalizedOtherCategories.length > 0 && (
          <section
            id="catalogo"
            className="relative rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-10 sm:px-6 lg:px-8"
          >
            <div className="relative z-10 space-y-6">
              <h2 id="buscas-algo-mas-especifico" className="text-xl font-semibold text-neutral-900 lg:text-2xl">
                ¿Buscas algo más específico?
              </h2>
              <p className="max-w-2xl text-sm text-neutral-600">
                Recorre las categorías sensibles y temáticas creadas para diferentes niveles de experiencia.
              </p>
              <div className="relative">
                <div className="overflow-hidden">
                  <div className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {normalizedOtherCategories.map(category => (
                      <div key={category.slug} className="snap-start">
                        <div className="min-w-[220px] max-w-[240px] sm:min-w-[240px] sm:max-w-[260px]">
                          <CategoryCard category={category} />
                        </div>
                      </div>
                    ))}
                    <div className="snap-start">
                      <div className="min-w-[220px] max-w-[240px] sm:min-w-[240px] sm:max-w-[260px]">
                        <Link
                          href="/categorias"
                          className="group flex h-full min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white text-center font-semibold uppercase tracking-[0.08em] text-neutral-500 shadow-sm transition hover:-translate-y-1 hover:text-neutral-800"
                        >
                          Ver todas las categorías
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          <InspirationalBanner
            eyebrow="Editorial 69"
            title="Sensualidad consciente"
            description="Eleva tus rituales íntimos con materiales hipoalergénicos, cosmética vegana y guías diseñadas por terapeutas certificados."
            image="/landing/vibrador-fondo-negro.webp"
            imageAlt="Juguetes íntimos sobre fondo negro con destellos fucsias"
            ctaHref="/colecciones/wellness"
            ctaLabel="Explorar rituales"
            tone="fuchsia"
            imageAspect="portrait"
            imagePriority
          />
          <InspirationalBanner
            align="right"
            eyebrow="Historias reales"
            title="Parejas que experimentan"
            description="Descubre testimonios curados y sesiones guiadas para sincronizar ritmos, explorar comunicación íntima y potenciar el deseo mutuo."
            image="/landing/chico-mirando-anillo.webp"
            imageAlt="Persona admirando un anillo vibrador en tonos morados"
            ctaHref="/blog/parejas"
            ctaLabel="Leer historias"
            tone="night"
            imageAspect="landscape"
          />
        </div>
      </div>
    </>
  )
}
const CATEGORY_FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f4f4f5"/><stop offset="100%" stop-color="#e4e4e7"/></linearGradient></defs><rect width="160" height="160" fill="url(#g)"/><text x="50%" y="50%" fill="#a1a1aa" font-family="sans-serif" font-size="14" font-weight="600" text-anchor="middle" dominant-baseline="middle">Categoría</text></svg>`
  )

