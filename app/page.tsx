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

  return (
    <>
      <Hero />
      <div className="mt-10 space-y-14 sm:mt-16 sm:space-y-16 lg:mt-24 lg:space-y-20">
        <ProductShowcase
          products={featuredProducts}
          headingId="destacados-del-mes"
          title="Destacados del mes"
          description="Doce placeres que elegimos a mano para inspirarte: juguetes premium, rituales sensoriales y esenciales para explorar en pareja o en solitario."
        />
        <AboutSection headingId="sobre-sexshop69" />
      </div>
    </>
  )
}
