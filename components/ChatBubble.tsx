'use client'
import { useMemo, useState } from 'react'
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

  const ctx = useMemo(() => getCtx(pathname), [pathname])
  const suggestions = useMemo(() => buildSuggestions(ctx), [ctx])

  return (
    <div className="fixed right-4 bottom-4 z-[70]">
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-brand-accent text-white flex items-center justify-center"
          aria-label="Abrir asistente"
        >
          <MessageCircle />
        </button>
      )}
      {open && (
        <div className="w-[320px] rounded-2xl shadow-2xl bg-white border p-3">
          <div className="text-sm font-semibold">Asistente SexShop69</div>
          <p className="text-xs text-neutral-600 mt-1">
            Experta sugerente (modo seguro). No muestra imágenes; sugiere enlaces al producto/checkout.
          </p>
          <ul className="mt-3 space-y-2">
            {suggestions.map((s, i) => (
              <li key={i}>
                <a className="block text-sm px-3 py-2 rounded-xl border hover:bg-neutral-50" href={s.href}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-3">
            <button onClick={() => setOpen(false)} className="text-xs opacity-70">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}
