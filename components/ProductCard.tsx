import Link from 'next/link'

export default function ProductCard({ p }: { p: { slug: string; name: string; price: number } }) {
  return (
    <Link href={`/producto/${p.slug}`} className="block border rounded-2xl p-4 hover:shadow-md transition">
      <div className="aspect-[4/3] rounded-xl bg-neutral-100 overflow-hidden" aria-hidden />
      <div className="mt-3 font-medium line-clamp-2">{p.name}</div>
      <div className="text-brand-primary font-semibold">S/ {p.price.toFixed(2)}</div>
    </Link>
  )
}
