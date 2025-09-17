import Link from 'next/link'

interface Props { params: { slug: string } }
const demoProducts: Record<string, {slug: string, name: string, price: number}[]> = {
  bienestar: [
    { slug: 'gel-agua-125', name: 'Gel base agua 125ml', price: 39.9 },
    { slug: 'gel-silicona-50', name: 'Gel silicona 50ml', price: 59.9 },
    { slug: 'preservativo-12', name: 'Preservativos x12', price: 24.9 },
  ],
  lenceria: [
    { slug: 'lenceria-negra-satin', name: 'Lencería satín negra', price: 99.9 },
    { slug: 'lenceria-roja-encaje', name: 'Lencería encaje roja', price: 119.9 },
  ],
  kits: [
    { slug: 'kit-relax', name: 'Kit relax pareja', price: 129.9 },
    { slug: 'kit-aniversario', name: 'Kit aniversario', price: 179.9 },
  ]
}
export default function CategoryPage({ params }: Props) {
  const items = demoProducts[params.slug as keyof typeof demoProducts] ?? []
  return (
    <main>
      <h1 className="text-2xl font-semibold capitalize">{params.slug}</h1>
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        {items.map(p => (
          <Link key={p.slug} href={`/producto/${p.slug}`} className="block border rounded-2xl p-4 hover:shadow-md">
            <div className="aspect-[4/3] rounded-xl bg-neutral-100 overflow-hidden">
            </div>
            <div className="mt-3 font-medium">{p.name}</div>
            <div className="text-brand-primary font-semibold">S/ {p.price.toFixed(2)}</div>
          </Link>
        ))}
      </div>
    </main>
  )
}
