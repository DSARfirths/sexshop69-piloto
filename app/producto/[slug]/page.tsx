import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductSchema } from '@/lib/schemas'
import { z } from 'zod'

const db: Record<string, any> = {
  'gel-agua-125': { name: 'Gel base agua 125ml', price: 39.9, sku: 'GA125', category: 'bienestar' },
  'gel-silicona-50': { name: 'Gel silicona 50ml', price: 59.9, sku: 'GS050', category: 'bienestar' },
  'preservativo-12': { name: 'Preservativos x12', price: 24.9, sku: 'PRES12', category: 'bienestar' },
  'lenceria-negra-satin': { name: 'Lencería satín negra', price: 99.9, sku: 'LENNS', category: 'lenceria' },
  'lenceria-roja-encaje': { name: 'Lencería encaje roja', price: 119.9, sku: 'LERE', category: 'lenceria' },
  'kit-relax': { name: 'Kit relax pareja', price: 129.9, sku: 'KRELAX', category: 'kits' },
  'kit-aniversario': { name: 'Kit aniversario', price: 179.9, sku: 'KANIV', category: 'kits' },
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const p = db[params.slug]
  if (!p) return {}
  return {
    title: `${p.name} — SexShop del Perú 69`,
    description: 'Página de producto (piloto ad-safe).'
  }
}

export default function ProductPage({ params }: any) {
  const product = db[params.slug]
  if (!product) return notFound()
  const parsed = ProductSchema.parse(product) as z.infer<typeof ProductSchema>
  return (
    <main className="grid md:grid-cols-2 gap-8">
      <div className="aspect-square rounded-2xl bg-neutral-100" />
      <div>
        <h1 className="text-2xl font-semibold">{parsed.name}</h1>
        <div className="text-brand-primary font-bold mt-2">S/ {parsed.price.toFixed(2)}</div>
        <div className="text-sm text-neutral-500 mt-1">SKU: {parsed.sku}</div>
        <div className="mt-6 flex gap-3">
          <form action="/api/checkout" method="POST">
            <input type="hidden" name="sku" value={parsed.sku} />
            <button className="px-5 py-3 rounded-xl bg-brand-primary text-white hover:opacity-90">Comprar ahora</button>
          </form>
          <a href={`https://wa.me/51924281623?text=Consulta%20${parsed.sku}`} className="px-5 py-3 rounded-xl border">Consultar por WhatsApp</a>
        </div>
        <p className="mt-6 text-neutral-700 text-sm">Descripción breve y clínica (piloto). Sin contenido explícito.</p>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Product', name: parsed.name, sku: parsed.sku,
          offers: { '@type': 'Offer', price: parsed.price, priceCurrency: 'PEN', availability: 'https://schema.org/InStock' }
        })}} />
      </div>
    </main>
  )
}
