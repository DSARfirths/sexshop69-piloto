import { PackageCheck, ShieldCheck, LockKeyhole } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
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
  return (
    <>
      <Hero />
      <div className="mt-12 space-y-16 lg:space-y-20">
        <section className="relative overflow-hidden rounded-[3rem] border border-night-border/70 bg-night-radial px-6 py-12 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -left-28 bottom-[-5rem] hidden h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl sm:block" aria-hidden />
          <div className="pointer-events-none absolute -right-40 top-[-3rem] hidden h-[360px] w-[360px] rotate-[10deg] lg:block" aria-hidden>
            <Image
              src="/landing/vibrador-fondo-negro.webp"
              alt=""
              fill
              className="object-cover object-center opacity-70 mix-blend-screen"
              sizes="360px"
              priority
            />
          </div>
          <div className="relative z-10 space-y-10">
            <TrustBadgesStrip badges={TRUST_BADGES} />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="space-y-6" id="catalogo">
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
                      className="inline-flex items-center rounded-full border border-fuchsia-500/60 bg-black/60 px-5 py-2 text-sm font-semibold text-white shadow-neon-sm transition hover:-translate-y-0.5 hover:shadow-neon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                    >
                      Ver más categorías
                    </Link>
                  </div>
                )}
              </div>
              <HeroCarousel className="h-full border border-night-border/60 bg-black/40 px-4 py-6 shadow-neon-sm backdrop-blur" />
            </div>
          </div>
        </section>

        <div className="relative overflow-hidden rounded-[3rem] border border-night-border/60 bg-gradient-to-br from-[#09000a] via-[#230017] to-[#340126] px-6 py-12 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute inset-y-0 right-[-8%] hidden w-[45%] lg:block" aria-hidden>
            <Image
              src="/landing/chica-con-vibrador.webp"
              alt=""
              fill
              className="object-cover object-center opacity-70 mix-blend-screen"
              sizes="(min-width: 1024px) 40vw, 60vw"
            />
          </div>
          <div className="pointer-events-none absolute -left-32 top-[-8rem] hidden h-80 w-80 rounded-full bg-fuchsia-500/30 blur-3xl sm:block" aria-hidden />
          <div className="relative z-10">
            <FeaturedProducts products={premiumProducts} headingId="productos-destacados" />
          </div>
        </div>

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

        <div className="relative overflow-hidden rounded-[3rem] border border-night-border/60 bg-[#120015]/90 px-6 py-12 sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute inset-y-0 right-[-12%] hidden w-[42%] lg:block" aria-hidden>
            <Image
              src="/landing/arnes-funda.webp"
              alt=""
              fill
              className="object-cover object-center opacity-60 mix-blend-screen"
              sizes="(min-width: 1024px) 35vw, 60vw"
            />
          </div>
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
          <div className="relative overflow-hidden rounded-[3rem] border border-night-border/60 bg-gradient-to-br from-[#150015] via-[#2f0124] to-[#420234] px-6 py-12 sm:px-10 lg:px-16">
            <div className="pointer-events-none absolute inset-y-0 left-[-12%] hidden w-[40%] lg:block" aria-hidden>
              <Image
                src="/landing/consolador-fondo-negro-y-balnco-contraste.webp"
                alt=""
                fill
                className="object-cover object-center opacity-70 mix-blend-screen"
                sizes="(min-width: 1024px) 36vw, 60vw"
              />
            </div>
            <div className="pointer-events-none absolute -right-24 bottom-[-6rem] hidden h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl sm:block" aria-hidden />
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
          <section className="relative overflow-hidden rounded-[3rem] border border-night-border/60 bg-gradient-to-br from-[#08000c] via-[#1f0020] to-[#2f0230] px-6 py-12 sm:px-10 lg:px-16">
            <div className="pointer-events-none absolute inset-y-0 right-[-10%] hidden w-[40%] lg:block" aria-hidden>
              <Image
                src="/landing/vibrador-fondo-negro.webp"
                alt=""
                fill
                className="object-cover object-center opacity-65 mix-blend-screen"
                sizes="(min-width: 1024px) 34vw, 60vw"
              />
            </div>
            <div className="relative z-10 space-y-6">
              <h2 id="buscas-algo-mas-especifico" className="text-xl font-semibold text-white lg:text-2xl">
                ¿Buscas algo más específico?
              </h2>
              <p className="max-w-2xl text-sm text-night-muted">
                Recorre las categorías sensibles y temáticas creadas para diferentes niveles de experiencia.
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {normalizedOtherCategories.map(category => (
                  <CategoryCard key={category.slug} category={category} />
                ))}
              </div>
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

