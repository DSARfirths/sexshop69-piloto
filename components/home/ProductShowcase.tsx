'use client'

import { useMemo } from 'react'

import ProductCard from '@/components/ProductCard'
import type { Product } from '@/lib/products'

type ProductShowcaseProps = {
  products: Product[]
  headingId?: string
  title?: string
  description?: string
}

export function ProductShowcase({
  products,
  headingId,
  title = 'Destacados del momento',
  description = 'Una seleccion diversa de experiencias para distintos gustos y rituales. Explora texturas, intensidades y placeres pensados para compartir o disfrutar a solas.'
}: ProductShowcaseProps) {
  const visibleProducts = useMemo(() => products.slice(0, 12), [products])
  if (visibleProducts.length === 0) return null

  return (
    <section className="space-y-8" aria-labelledby={headingId}>
      <div className="space-y-2">
        <h2 id={headingId} className="font-heading text-3xl font-semibold text-neutral-900 sm:text-4xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm text-neutral-600 sm:text-base">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {visibleProducts.map(product => (
          <ProductCard key={product.slug} p={product} />
        ))}
      </div>
    </section>
  )
}
