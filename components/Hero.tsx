// ========== components/Hero.tsx (igual que v1, mobile-first) ==========
'use client'
import { motion } from 'framer-motion'
export default function Hero() {
  return (
    <section className="rounded-2xl bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 p-6 md:p-8 mb-6 md:mb-8">
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}
        className="text-2xl md:text-3xl font-semibold">Bienvenido — Piloto seguro</motion.h1>
      <p className="mt-2 text-neutral-600 text-sm md:text-base">Mobile‑first, contenido apto para Ads. Imágenes sensibles fuera de indexación.</p>
    </section>
  )
}