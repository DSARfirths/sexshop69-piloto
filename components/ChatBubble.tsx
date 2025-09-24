'use client'
import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { bySlug, byCategory, type Product } from '@/lib/products'
import {
  closeChatAssistant,
  getChatAssistantState,
  subscribeToChatAssistant,
  toggleChatAssistant,
} from '@/lib/chat-assistant'

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
      { label: `Llévate ${ctx.product.name} ahora`, href: `/api/checkout?s=${ctx.product.sku}` },
      { label: 'Explorar sensaciones similares', href: `/categoria/${ctx.product.category}` },
      { label: 'Conversa con una asesora por WhatsApp', href: `https://wa.me/51924281623?text=Consulta%20${ctx.product.sku}` },
    ]
  }
  if (ctx.pageType === 'category' && ctx.category) {
    const top = byCategory(ctx.category).slice(0, 3)
    const topHref = top.length ? `/producto/${top[0].slug}` : `/categoria/${ctx.category}`
    return [
      { label: 'Favoritos más deseados de esta categoría', href: topHref },
      { label: 'Ver toda la colección', href: `/categoria/${ctx.category}` },
      { label: 'Pedir una recomendación discreta', href: 'https://wa.me/51924281623?text=Quiero%20recomendaciones' },
    ]
  }
  return [
    { label: 'Colección Romance Nocturno', href: '/categoria/vibradores' },
    { label: 'Ritual de bienestar sensorial', href: '/categoria/bienestar' },
    { label: 'Arma tu kit deluxe', href: '/categoria/kits' },
  ]
}

export function ChatBubble() {
  const pathname = usePathname()
  const [open, setOpen] = useState(() => getChatAssistantState())

  useEffect(() => {
    return subscribeToChatAssistant(setOpen)
  }, [])

  const ctx = useMemo(() => getCtx(pathname), [pathname])
  const suggestions = useMemo(() => buildSuggestions(ctx), [ctx])

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-3">
      {open && (
        <div className="pointer-events-auto w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-fuchsia-500/40 bg-neutral-950/85 p-5 text-neutral-100 shadow-[0_28px_80px_-20px_rgba(255,0,140,0.6)] backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-100">
              <MessageCircle className="h-5 w-5" aria-hidden />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Asesora virtual SexShop69</p>
              <p className="mt-1 text-xs leading-relaxed text-neutral-200">
                Estoy aquí para inspirarte con recomendaciones cuidadosas y sugerentes. Elige una propuesta o cuéntame qué te gustaría explorar.
              </p>
            </div>
            <button
              type="button"
              onClick={closeChatAssistant}
              className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 text-neutral-200 transition hover:border-fuchsia-400/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
              aria-label="Cerrar asistente"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {suggestions.map((s, i) => (
              <li key={i}>
                <a
                  className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:border-fuchsia-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
                  href={s.href}
                >
                  <span className="text-left text-neutral-100">{s.label}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-fuchsia-200/80">Ir</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-[0.7rem] text-neutral-400">
            Respuestas confidenciales, siempre con respeto mutuo.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={toggleChatAssistant}
        aria-expanded={open}
        className="pointer-events-auto inline-flex items-center gap-3 rounded-2xl border border-fuchsia-400/40 bg-neutral-950/90 px-4 py-3 text-left text-fuchsia-100 shadow-xl transition hover:border-fuchsia-300 hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/80"
      >
        <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-fuchsia-500/25 text-fuchsia-100">
          <MessageCircle className="h-4 w-4" aria-hidden />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-fuchsia-200/90">
            ¿Necesitas ayuda? Chatea conmigo
          </span>
          <span className="text-sm font-semibold text-white">Descubre tu placer ideal</span>
        </span>
      </button>
    </div>
  )
}
