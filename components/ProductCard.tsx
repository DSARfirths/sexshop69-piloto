import Link from 'next/link'
import type { Product } from '@/lib/products'

const BADGE_LABELS: Record<NonNullable<Product['badge']>, string> = {
  nuevo: 'Nuevo',
  top: 'Top',
  promo: 'Promo'
}

type ProductCardProps = {
  p: Pick<Product, 'slug' | 'name' | 'price' | 'badge'>
  highlightBadge?: string
}

export default function ProductCard({ p, highlightBadge }: ProductCardProps) {
  const displayBadge = highlightBadge ?? (p.badge ? BADGE_LABELS[p.badge] : undefined)

  return (
    <Link href={`/producto/${p.slug}`} className="group block rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-accent/20 opacity-0 transition group-hover:opacity-100" aria-hidden />
        {displayBadge && (
          <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-neutral-900/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-lg">
            {displayBadge}
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <div className="font-medium text-neutral-900 line-clamp-2">{p.name}</div>
        <div className="text-brand-primary font-semibold">S/ {p.price.toFixed(2)}</div>
      </div>
    </Link>
  )
}
