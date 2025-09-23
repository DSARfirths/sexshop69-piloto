'use client'
import { useEffect, useMemo, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { bySlug, byCategory, type Product } from '@/lib/products'

type PageContext = {
  pageType: 'home' | 'category' | 'product' | 'other'
  category?: string
  product?: Pick<Product, 'sku' | 'name' | 'category' | 'slug' | 'regularPrice' | 'salePrice'>
}

function getCtx(pathname: string): PageContext {
  if (pathname.startsWith('/producto/')) {
    const slug = pathname.split('/').pop()!
    const p = bySlug(slug)
    if (!p) return { pageType: 'product' }
    const { sku, name, category, slug: productSlug, regularPrice, salePrice } = p
    return {
      pageType: 'product',
      category,
      product: { sku, name, category, slug: productSlug, regularPrice, salePrice }
    }
  }
  if (pathname.startsWith('/categoria/')) {
    const category = pathname.split('/').pop()!
    return { pageType: 'category', category }
  }
  return { pageType: pathname === '/' ? 'home' : 'other' }
}

function buildSuggestions(ctx: PageContext) {
  if (ctx.pageType === 'product' && ctx.product) {
    return [
      { label: `Comprar ${ctx.product.name}`, href: `/api/checkout?s=${ctx.product.sku}` },
      { label: 'Ver productos relacionados', href: `/categoria/${ctx.product.category}` },
      { label: 'Consultar por WhatsApp', href: `https://wa.me/51924281623?text=Consulta%20${ctx.product.sku}` },
    ]
  }
  if (ctx.pageType === 'category' && ctx.category) {
    const top = byCategory(ctx.category).slice(0, 3)
    const topHref = top.length ? `/producto/${top[0].slug}` : `/categoria/${ctx.category}`
    return [
      { label: 'Top de esta categoría', href: topHref },
      { label: 'Ver todos', href: `/categoria/${ctx.category}` },
    ]
  }
  return [
    { label: 'Explorar Bienestar íntimo', href: '/categoria/bienestar' },
    { label: 'Ofertas en Kits', href: '/categoria/kits' },
  ]
}

export function ChatBubble() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    if (typeof window !== 'undefined') {
      window.addEventListener('sexshop:chat-open', handleOpen)
      window.addEventListener('sexshop:chat-close', handleClose)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('sexshop:chat-open', handleOpen)
        window.removeEventListener('sexshop:chat-close', handleClose)
      }
    }
  }, [])

  const ctx = useMemo(() => getCtx(pathname), [pathname])
  const suggestions = useMemo(() => buildSuggestions(ctx), [ctx])

  return (
    <div className="fixed right-4 bottom-4 z-[70]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-fuchsia-400/40 bg-fuchsia-500/90 text-white shadow-xl transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/80"
          aria-label="Abrir asistente"
        >
          <MessageCircle />
        </button>
      )}
      {open && (
        <div className="w-[320px] rounded-2xl border border-fuchsia-500/30 bg-neutral-950/95 p-4 text-neutral-100 shadow-[0_24px_60px_-15px_rgba(255,0,140,0.6)] backdrop-blur">
          <div className="text-sm font-semibold text-white">Asistente SexShop69</div>
          <p className="mt-1 text-xs text-neutral-300">
            Experta sugerente (modo seguro). No muestra imágenes; sugiere enlaces al producto/checkout.
          </p>
          <ul className="mt-3 space-y-2">
            {suggestions.map((s, i) => (
              <li key={i}>
                <a
                  className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:border-fuchsia-400/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
                  href={s.href}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-fuchsia-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
