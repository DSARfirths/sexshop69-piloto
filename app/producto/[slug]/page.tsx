// ========== app/producto/[slug]/page.tsx (PDP + CTA sticky móvil) ==========
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { bySlug } from '@/lib/products'
import StickyCTA from '@/components/StickyCTA'


export async function generateMetadata({ params }: any): Promise<Metadata> {
  const p = bySlug(params.slug)
  if (!p) return {}
  return {
    title: `${p.name} — SexShop del Perú 69`,
    description: 'Página de producto (piloto ad-safe, mobile-first).'
  }
}


export default function ProductPage({ params }: any) {
  const product = bySlug(params.slug)
  if (!product) return notFound()
  return (
    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
      <div className="aspect-square rounded-2xl bg-neutral-100" />
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="text-brand-primary font-bold mt-2">S/ {product.price.toFixed(2)}</div>
        <div className="text-sm text-neutral-500 mt-1">SKU: {product.sku}</div>
        <div className="mt-6 flex gap-3">
          <form action="/api/checkout" method="POST">
            <input type="hidden" name="sku" value={product.sku} />
            <button className="px-5 py-3 rounded-xl bg-brand-primary text-white hover:opacity-90">Comprar ahora</button>
          </form>
          <a href={`https://wa.me/51924281623?text=Consulta%20${product.sku}`} className="px-5 py-3 rounded-xl border">Consultar por WhatsApp</a>
        </div>
        <p className="mt-6 text-neutral-700 text-sm">Descripción breve y clínica (piloto). Sin contenido explícito. Mobile-first, CTA sticky en móvil.</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org', '@type': 'Product', name: product.name, sku: product.sku,
            offers: { '@type': 'Offer', price: product.price, priceCurrency: 'PEN', availability: 'https://schema.org/InStock' }
          })
        }} />
      </div>
      {/* CTA sticky visible sólo en móvil */}
      <StickyCTA label={`Comprar S/ ${product.price.toFixed(2)}`} href={`/api/checkout?s=${product.sku}`} />
    </div>
  )
}