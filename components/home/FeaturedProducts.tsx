'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/lib/products'

const FALLBACK_IMAGE_SRC =
  'data:image/svg+xml;charset=UTF-8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#18181b"/><stop offset="100%" stop-color="#3f3f46"/></linearGradient></defs><rect width="480" height="320" fill="url(#g)"/><text x="50%" y="50%" fill="#d4d4d8" font-family="sans-serif" font-size="24" font-weight="600" text-anchor="middle" dominant-baseline="middle">Destacado premium</text></svg>`
  )

type FeaturedProductsProps = {
  products: Product[]
  headingId?: string
}

const MotionDiv: typeof motion.div = motion.div
const MotionArticle: typeof motion.article = motion.article

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 }
}

export default function FeaturedProducts({ products, headingId }: FeaturedProductsProps) {
  if (products.length === 0) return null

  const columnsClass = products.length === 1 ? 'lg:grid-cols-1' : products.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'

  return (
    <section className="space-y-8" aria-labelledby={headingId}>
      <div className="space-y-2">
        <h2 id={headingId} className="text-3xl font-semibold text-white">
          Productos destacados
        </h2>
        <p className="max-w-2xl text-sm text-night-muted">
          Piezas de lujo seleccionadas para experiencias intensas, con materiales premium, embalaje discreto y soporte experto.
        </p>
      </div>

      <MotionDiv
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`grid grid-cols-1 gap-6 ${columnsClass}`}
      >
        {products.map((product, index) => {
          const filename = product.imageFilenames[0] ?? null
          const imageBasename = filename ? filename.replace(/\..+$/, '') : null
          const imageSrc = imageBasename ? `/products/${product.slug}/${imageBasename}.webp` : FALLBACK_IMAGE_SRC
          const price = (product.salePrice ?? product.regularPrice).toFixed(2)

          return (
            <MotionArticle
              key={product.slug}
              className="group relative overflow-hidden rounded-[2rem] border border-night-border bg-gradient-to-br from-[#3b0a5a]/40 via-night-surface to-[#12002e]/90 text-night-foreground shadow-neon"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.45, ease: 'easeOut' }}
            >
              <div className="relative h-72 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_65%)] opacity-0 transition group-hover:opacity-100" aria-hidden />
                <Image
                  src={imageSrc}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-contain object-center"
                />
              </div>
              <div className="relative space-y-4 p-8">
                <div className="space-y-2">
                  <span className="inline-flex items-center rounded-full bg-fuchsia-500/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white shadow-neon-sm">Premium</span>
                  <h3 className="text-2xl font-semibold text-white">{product.name}</h3>
                  {product.shortDescription && (
                    <p className="text-sm leading-relaxed text-night-muted">{product.shortDescription}</p>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="text-lg font-semibold text-fuchsia-200 drop-shadow-neon">S/ {price}</span>
                  <Link
                    href={`/producto/${product.slug}`}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 px-6 py-2.5 text-sm font-semibold text-white shadow-neon transition hover:from-fuchsia-400 hover:to-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                  >
                    Comprar ahora
                  </Link>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 border border-night-border-strong/60 mix-blend-screen" aria-hidden />
            </MotionArticle>
          )
        })}
      </MotionDiv>
    </section>
  )
}
