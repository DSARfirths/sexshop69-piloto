'use client'

import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'

const headlineVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const copyVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 }
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand-primary/10 via-white to-brand-accent/10 p-6 sm:p-10 md:p-14">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/textures/hero-texture.svg')] bg-cover opacity-50 mix-blend-overlay" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/15 via-transparent to-brand-accent/30" aria-hidden />
      </div>

      <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={headlineVariants}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-primary/90">Confianza real, placer privado</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight text-neutral-900 sm:text-4xl md:text-[2.9rem] md:leading-[1.05]">
              Tu intimidad es prioridad: experiencias premium con envíos ultra discretos
            </h1>
          </motion.div>
        </div>

        <div className="max-w-md space-y-6 text-neutral-700">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={copyVariants}
            transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          >
            <div className="space-y-6">
              <p className="text-base leading-relaxed md:text-lg">
                Compra desde casa con asesoría segura y pagos protegidos. Cada pedido viaja en embalaje sin marcas y con seguimiento privado para que solo tú sepas lo que llega.
              </p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="rounded-full bg-white/70 px-4 py-2 font-medium text-neutral-900 shadow-sm">Soporte 24/7 confidencial</span>
                <span className="rounded-full bg-white/50 px-4 py-2 font-medium text-neutral-900 shadow-sm">Facturación anónima</span>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="#catalogo"
                  className="inline-flex items-center justify-center rounded-full bg-brand-primary px-6 py-3 text-base font-semibold text-white shadow-lg shadow-brand-primary/30 transition"
                >
                  Explorar catálogo seguro
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
