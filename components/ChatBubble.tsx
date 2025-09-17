'use client'
import { useMemo, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { usePathname } from 'next/navigation'

type PageContext = {
  pageType: 'home' | 'category' | 'product' | 'other'
  category?: string
  product?: { sku: string, name: string, price: number }
}

function getSuggestions(ctx: PageContext) {
  if (ctx.pageType === 'product' && ctx.product) {
    return [
      { label: `Comprar ${ctx.product.name}`, href: '/api/checkout?s=' + ctx.product.sku },
      { label: 'Ver productos relacionados', href: `/categoria/${ctx.category ?? 'bienestar'}` },
      { label: 'Consultar por WhatsApp', href: `https://wa.me/51924281623?text=Consulta%20${ctx.product.sku}` }
    ]
  }
  if (ctx.pageType === 'category' && ctx.category) {
    return [
      { label: 'Top ventas de esta categoría', href: `/categoria/${ctx.category}` },
      { label: 'Ver recomendados', href: `/categoria/${ctx.category}` },
    ]
  }
  return [
    { label: 'Explorar Bienestar íntimo', href: '/categoria/bienestar' },
    { label: 'Ofertas en Kits', href: '/categoria/kits' }
  ]
}

export function ChatBubble() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ctx: PageContext = useMemo(() => {
    if (pathname.startsWith('/producto/')) {
      const slug = pathname.split('/').pop()!
      const map: any = {
        'gel-agua-125': { sku: 'GA125', name: 'Gel base agua 125ml', price: 39.9, category: 'bienestar' },
        'gel-silicona-50': { sku: 'GS050', name: 'Gel silicona 50ml', price: 59.9, category: 'bienestar' },
        'preservativo-12': { sku: 'PRES12', name: 'Preservativos x12', price: 24.9, category: 'bienestar' },
        'lenceria-negra-satin': { sku: 'LENNS', name: 'Lencería satín negra', price: 99.9, category: 'lenceria' },
        'lenceria-roja-encaje': { sku: 'LERE', name: 'Lencería encaje roja', price: 119.9, category: 'lenceria' },
        'kit-relax': { sku: 'KRELAX', name: 'Kit relax pareja', price: 129.9, category: 'kits' },
        'kit-aniversario': { sku: 'KANIV', name: 'Kit aniversario', price: 179.9, category: 'kits' },
      }
      const p = map[slug]
      return p ? { pageType: 'product', category: p.category, product: p } : { pageType: 'product' }
    }
    if (pathname.startsWith('/categoria/')) {
      const cat = pathname.split('/').pop()!
      return { pageType: 'category', category: cat }
    }
    return { pageType: pathname === '/' ? 'home' : 'other' }
  }, [pathname])

  const suggestions = getSuggestions(ctx)

  return (
    <div className="fixed right-4 bottom-4 z-[70]">
      {!open && (
        <button onClick={() => setOpen(true)} className="h-14 w-14 rounded-full shadow-lg bg-brand-accent text-white flex items-center justify-center">
          <MessageCircle />
        </button>
      )}
      {open && (
        <div className="w-[320px] rounded-2xl shadow-2xl bg-white border p-3">
          <div className="text-sm font-semibold">Asistente SexShop69</div>
          <p className="text-xs text-neutral-600 mt-1">Experta sugerente (modo seguro). No muestra imágenes; sugiere enlaces al producto/checkout.</p>
          <ul className="mt-3 space-y-2">
            {suggestions.map((s, i) => (
              <li key={i}><a className="block text-sm px-3 py-2 rounded-xl border hover:bg-neutral-50" href={s.href}>{s.label}</a></li>
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
