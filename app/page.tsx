import Hero from '@/components/Hero'
import { type Product } from '@/lib/products'
import { getAllProducts } from '@/lib/products.server'
import { ProductShowcase } from '@/components/home/ProductShowcase'
import AboutSection from '@/components/home/AboutSection'
import { LANDING_FEATURED_SLUGS } from '@/data/landing-featured.config'

export default async function Page() {
  const products = await getAllProducts()

  const productBySlug = new Map(products.map(product => [product.slug, product]))

  const curatedProducts: Product[] = []
  LANDING_FEATURED_SLUGS.forEach(slug => {
    const product = productBySlug.get(slug)
    if (product) {
      curatedProducts.push(product)
    }
  })

  const fallbackPool = products.filter(product => !curatedProducts.includes(product))
  const maxShowcaseSize = 12
  const needed = Math.max(maxShowcaseSize - curatedProducts.length, 0)
  const fallbackProducts = needed > 0 ? fallbackPool.slice(0, needed) : []
  const featuredProducts = [...curatedProducts, ...fallbackProducts]

  const fullBleedClass = 'relative left-1/2 right-1/2 w-screen -translate-x-1/2'

  return (
    <>
      <div className={fullBleedClass}>
        <Hero />
      </div>
      <div className={`${fullBleedClass} bg-gradient-to-b from-white via-white to-neutral-50`}>
        <div className="mx-auto w-full max-w-[1400px] px-6 py-16 sm:px-10 sm:py-20 lg:px-12 lg:py-24">
          <ProductShowcase
            products={featuredProducts}
            headingId="destacados-del-mes"
            title="Destacados del mes"
            description="Doce placeres que elegimos a mano para inspirarte: juguetes premium, rituales sensoriales y esenciales para explorar en pareja o en solitario."
          />
        </div>
      </div>
      <div className={fullBleedClass}>
        <AboutSection headingId="sobre-sexshop69" />
      </div>
    </>
  )
}
