'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

import type { Product } from '@/lib/products'
import {
  closeChatAssistant,
  getChatAssistantState,
  subscribeToChatAssistant,
  toggleChatAssistant
} from '@/lib/chat-assistant'

type ProductSummary = Pick<Product, 'sku' | 'name' | 'category' | 'slug' | 'regularPrice' | 'salePrice'>

type PageContext =
  | { pageType: 'home' | 'other' }
  | { pageType: 'product'; product?: ProductSummary | null }
  | { pageType: 'category'; category: string; topProducts: ProductSummary[] }

type Suggestion = { label: string; href: string }

function buildSuggestions(ctx: PageContext): Suggestion[] {
  if (ctx.pageType === 'product' && ctx.product) {
    return [
      {
        label: `Llévate ${ctx.product.name} ahora`,
        href: `/api/checkout?s=${encodeURIComponent(ctx.product.sku ?? ctx.product.slug)}`
      },
      { label: 'Explorar sensaciones similares', href: `/categoria/${ctx.product.category}` },
      {
        label: 'Conversa con una asesora por WhatsApp',
        href: `https://wa.me/51924281623?text=Consulta%20${encodeURIComponent(
          ctx.product.sku ?? ctx.product.slug
        )}`
      }
    ]
  }

  if (ctx.pageType === 'category') {
    const topHref =
      ctx.topProducts.length > 0 ? `/producto/${ctx.topProducts[0].slug}` : `/categoria/${ctx.category}`
    return [
      { label: 'Favoritos más deseados de esta categoría', href: topHref },
      { label: 'Ver toda la colección', href: `/categoria/${ctx.category}` },
      {
        label: 'Pedir una recomendación discreta',
        href: 'https://wa.me/51924281623?text=Quiero%20recomendaciones'
      }
    ]
  }

  return [
    { label: 'Colección Romance Nocturno', href: '/categoria/vibradores' },
    { label: 'Ritual de bienestar sensorial', href: '/categoria/bienestar' },
    { label: 'Arma tu kit deluxe', href: '/categoria/kits' }
  ]
}

function buildNotifications(ctx: PageContext): string[] {
  if (ctx.pageType === 'product' && ctx.product) {
    return [
      `${ctx.product.name} está listo para enviarse.`,
      'Pregúntame por sensaciones similares para ti.',
      '¿Quieres que te ayude a armar un pack perfecto?'
    ]
  }

  if (ctx.pageType === 'category') {
    const readableCategory = ctx.category.replace(/-/g, ' ')
    return [
      `Descubre los favoritos de ${readableCategory}.`,
      '¿Buscas algo discreto? Te puedo guiar.',
      'Explora combinaciones irresistibles conmigo.'
    ]
  }

  return [
    'Te muestro lo más deseado del momento.',
    'Pídeme ideas para sorprender esta noche.',
    'Estoy lista para sugerirte algo único.'
  ]
}

async function fetchProductSummary(slug: string, signal: AbortSignal): Promise<ProductSummary | null> {
  try {
    const response = await fetch(`/api/catalog/product?slug=${encodeURIComponent(slug)}`, { signal })
    if (!response.ok) return null
    const product = (await response.json()) as ProductSummary
    return product
  } catch {
    return null
  }
}

async function fetchCategoryTop(
  slug: string,
  signal: AbortSignal,
  limit = 3
): Promise<ProductSummary[]> {
  try {
    const response = await fetch(
      `/api/catalog/category?slug=${encodeURIComponent(slug)}&limit=${limit}`,
      { signal }
    )
    if (!response.ok) return []
    const products = (await response.json()) as ProductSummary[]
    return products
  } catch {
    return []
  }
}

export function ChatBubble() {
  const pathname = usePathname()
  const [open, setOpen] = useState(() => getChatAssistantState())
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null)
  const [notificationVisible, setNotificationVisible] = useState(false)
  const [productSummary, setProductSummary] = useState<ProductSummary | null>(null)
  const [categoryProducts, setCategoryProducts] = useState<ProductSummary[]>([])
  const facetController = useRef<AbortController | null>(null)

  useEffect(() => {
    return subscribeToChatAssistant(setOpen)
  }, [])

  useEffect(() => {
    if (facetController.current) {
      facetController.current.abort()
    }
    const controller = new AbortController()
    facetController.current = controller

    const slug = pathname.split('/').pop() ?? ''

    if (pathname.startsWith('/producto/') && slug) {
      fetchProductSummary(slug, controller.signal).then(data => {
        if (!controller.signal.aborted) {
          setProductSummary(data)
          setCategoryProducts([])
        }
      })
      return () => controller.abort()
    }

    if (pathname.startsWith('/categoria/') && slug) {
      fetchCategoryTop(slug, controller.signal).then(data => {
        if (!controller.signal.aborted) {
          setCategoryProducts(data)
          setProductSummary(null)
        }
      })
      return () => controller.abort()
    }

    setProductSummary(null)
    setCategoryProducts([])
    return () => controller.abort()
  }, [pathname])

  const ctx: PageContext = useMemo(() => {
    if (pathname.startsWith('/producto/')) {
      return { pageType: 'product', product: productSummary }
    }
    if (pathname.startsWith('/categoria/')) {
      const category = pathname.split('/').pop() ?? ''
      return { pageType: 'category', category, topProducts: categoryProducts }
    }
    return { pageType: pathname === '/' ? 'home' : 'other' }
  }, [pathname, productSummary, categoryProducts])

  const suggestions = useMemo(() => buildSuggestions(ctx), [ctx])
  const notifications = useMemo(() => buildNotifications(ctx), [ctx])

  useEffect(() => {
    facetController.current = null
  }, [productSummary, categoryProducts])

  useEffect(() => {
    if (!notifications.length || open) {
      setNotificationVisible(false)
      return
    }

    let index = 0
    let hideTimeout: ReturnType<typeof setTimeout> | undefined

    const showNotification = () => {
      setNotificationMessage(notifications[index])
      setNotificationVisible(true)
      hideTimeout = setTimeout(() => {
        setNotificationVisible(false)
      }, 4000)
      index = (index + 1) % notifications.length
    }

    const initialTimeout = setTimeout(showNotification, 2000)
    const cycleInterval = setInterval(showNotification, 10000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(cycleInterval)
      if (hideTimeout) clearTimeout(hideTimeout)
    }
  }, [notifications, open])

  return (
    <div className="chat-bubble pointer-events-none fixed right-4 bottom-4 z-[70] flex flex-col items-end gap-3">
      <div className="relative flex flex-col items-end gap-3">
        {notificationMessage && (
          <div
            className={`pointer-events-none absolute right-full mr-3 top-1/2 flex min-w-[12rem] -translate-y-1/2 transform rounded-2xl border border-fuchsia-400/40 bg-neutral-950/95 px-4 py-3 text-sm text-fuchsia-100 shadow-[0_18px_45px_-20px_rgba(255,0,140,0.7)] transition-all duration-700 ${
              notificationVisible ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'
            }`}
            aria-live="polite"
            role="status"
          >
            {notificationMessage}
          </div>
        )}

        {open && (
          <div className="pointer-events-auto hidden w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-fuchsia-500/40 bg-neutral-950/85 p-5 text-neutral-100 shadow-[0_28px_80px_-20px_rgba(255,0,140,0.6)] backdrop-blur-xl md:block">
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
                    className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3  text-sm transition hover:border-fuchsia-400/50 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-300/70"
                    href={s.href}
                  >
                    <span className="text-left text-neutral-100">{s.label}</span>
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-fuchsia-200/80">
                      Ir
                    </span>
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
          aria-label={open ? 'Cerrar asistente virtual' : 'Abrir asistente virtual'}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-fuchsia-400/40 bg-neutral-950/90 text-fuchsia-100 shadow-xl transition hover:border-fuchsia-300 hover:bg-neutral-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-200/80 md:h-auto md:w-auto md:gap-3 md:rounded-2xl md:px-4 md:py-3"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-fuchsia-500/25 text-fuchsia-100">
            <MessageCircle className="h-4 w-4" aria-hidden />
          </span>
          <span className="sr-only md:not-sr-only md:flex md:flex-col md:leading-tight">
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-fuchsia-200/90">
              ¿Necesitas ayuda? Chatea conmigo
            </span>
            <span className="text-sm font-semibold text-white">Descubre tu placer ideal</span>
          </span>
        </button>
      </div>
    </div>
  )
}
