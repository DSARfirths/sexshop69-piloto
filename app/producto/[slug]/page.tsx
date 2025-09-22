import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { bySlug, formatAttributeLabel, formatAttributeValue, getProductProperties } from '@/lib/products'
import StickyCTA from '@/components/StickyCTA'
import NSFWGallery from '@/components/NSFWGallery'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import TrustBadges from '@/components/ui/TrustBadges'
import SpecsTable from '@/components/ui/SpecsTable'
import Sections from '@/components/ui/Sections'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = bySlug(params.slug)
  if (!p) return {}
  return {
    title: `${p.name} — SexShop del Perú 69`,
    description: 'Página de producto (piloto ad-safe, mobile-first).'
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = bySlug(params.slug)
  if (!product) return notFound()
  const isNSFW = !!product.nsfw
  const structuredProperties = getProductProperties(product.attributes, product.specs).map(([name, value]) => ({
    '@type': 'PropertyValue',
    name: formatAttributeLabel(name),
    value: formatAttributeValue(value)
  }))
  return (
    <div>
      <Breadcrumbs items={[{ href: '/', label: 'Inicio' }, { href: `/categoria/${product.category}`, label: product.category }, { label: product.name }]} />

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-3">
        <div className="aspect-square rounded-2xl bg-neutral-100 flex items-center justify-center">
          {!isNSFW && (<span className="text-xs text-neutral-500">Imagen demostrativa</span>)}
          {isNSFW && (<NSFWGallery slug={product.slug} count={product.images ?? 0} />)}
        </div>
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            {product.brand && <span className="uppercase tracking-wide">{product.brand}</span>}
            {product.badge && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">{product.badge}</span>}
          </div>
          <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
          <div className="text-brand-primary font-bold mt-2 text-xl">S/ {product.price.toFixed(2)}</div>
          <div className="text-sm text-neutral-500 mt-1">SKU: {product.sku} {isNSFW && (<span className="ml-2 inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-700">Contenido sensible</span>)}</div>

          <div className="mt-4 flex gap-3">
            {/* Este enlace simula la compra y envía los datos a la página de éxito para la conversión */}
            <Link href={`/checkout/success?sku=${product.sku}&value=${product.price}`} className="px-5 py-3 rounded-xl bg-brand-primary text-white hover:opacity-90">
              Comprar ahora (Simulación)
            </Link>
            <a href={`https://wa.me/51924281623?text=Consulta%20${product.sku}`} className="px-5 py-3 rounded-xl border">WhatsApp</a>
          </div>

          <TrustBadges className="mt-4" />

          {product.features && product.features.length > 0 && (
            <ul className="mt-5 list-disc pl-5 text-neutral-700 text-sm space-y-1">
              {product.features.slice(0, 4).map((f, i) => (<li key={i}>{f}</li>))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Sections product={product} />
        </div>
        <aside>
          <SpecsTable attributes={product.attributes} specs={product.specs} />
        </aside>
      </div>

      <StickyCTA
        label={`Comprar S/ ${product.price.toFixed(2)}`}
        href={`/checkout/success?sku=${product.sku}&value=${product.price}`}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', name: product.name, sku: product.sku,
        brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
        offers: { '@type': 'Offer', price: product.price, priceCurrency: 'PEN', availability: 'https://schema.org/InStock' },
        additionalProperty: structuredProperties
      }) }} />
    </div>
  )
}
