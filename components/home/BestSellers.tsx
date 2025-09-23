'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, type Variants } from 'framer-motion'
import type { Product } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

type BestSellersProps = {
  products: Product[]
  headingId?: string
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

export default function BestSellers({ products, headingId }: BestSellersProps) {
  if (!products.length) return null

  return (
    <section className="space-y-6">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 id={headingId} className="text-2xl font-semibold text-neutral-900">
              Más vendidos
            </h2>
            <p className="text-sm text-neutral-600">Selección curada por preferencia de la comunidad y disponibilidad inmediata.</p>
          </div>
          <Link
            href="/categoria/bienestar"
            role="button"
            className="group inline-flex items-center gap-2 self-start text-sm font-semibold text-brand-primary transition-colors hover:text-brand-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          >
            Descubrir más
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </motion.div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, index) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.05, duration: 0.4, ease: 'easeOut' }}
          >
            <ProductCard p={product} highlightBadge={product.bestSeller ? 'Best Seller' : undefined} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
