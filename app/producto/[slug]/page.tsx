import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  DEFAULT_IMAGE_EXTENSIONS,
  bySlug,
  formatAttributeLabel,
  formatAttributeValue,
  getProductProperties,
  resolveAssetFolder
} from '@/lib/products'
import StickyCTA from '@/components/StickyCTA'
import ProductGallery from '@/components/product/ProductGallery'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import TrustBadges from '@/components/ui/TrustBadges'
import SpecsTable from '@/components/ui/SpecsTable'
import Sections from '@/components/ui/Sections'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = bySlug(params.slug)
  if (!p) return {}
  const title = `${p.name} — SexShop del Perú 69`
  const description = 'Página de producto (piloto ad-safe, mobile-first).'
  const canonical = `/producto/${p.slug}`
  const hasImages = (p.images ?? 0) > 0
  const assetFolder = resolveAssetFolder(p)
  const imageExtensions = p.imageSet ?? DEFAULT_IMAGE_EXTENSIONS
  const availableExtensions = hasImages ? imageExtensions : []
  const hasValidImages = availableExtensions.length > 0
  const openGraphImages = hasValidImages
    ? availableExtensions.map(extension => ({
        url: `/${assetFolder}/${p.slug}/1.${extension}`,
        alt: `${p.name} — vista 1`
      }))
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      type: 'product',
      title,
      description,
      url: canonical,
      siteName: 'SexShop del Perú 69',
      images: openGraphImages
    } as Metadata['openGraph'],
    twitter: {
      card: hasValidImages ? 'summary_large_image' : 'summary',
      title,
      description,
      images: openGraphImages?.map(image => image.url)
    }
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = bySlug(params.slug)
  if (!product) return notFound()
  const assetFolder = resolveAssetFolder(product)
  const imageExtensions = product.imageSet ?? DEFAULT_IMAGE_EXTENSIONS
  const hasImages = (product.images ?? 0) > 0
  const imageUrls = hasImages
    ? imageExtensions.map(extension => `/${assetFolder}/${product.slug}/1.${extension}`)
    : []
  const isNSFW = !!product.nsfw
  const structuredProperties = getProductProperties(product.attributes, product.specs).map(([name, value]) => ({
    '@type': 'PropertyValue',
    name: formatAttributeLabel(name),
    value: formatAttributeValue(value)
  }))
  const checkoutHref = `/checkout/success?sku=${product.sku}&value=${product.price}`
  const whatsappHref = `https://wa.me/51924281623?text=Consulta%20${product.sku}`

  const bulletPoints = [
    { label: 'Material', value: formatAttributeValue(product.attributes?.material) },
    {
      label: 'Dimensiones',
      value: [product.attributes?.longitud, product.attributes?.diametro]
        .map(formatAttributeValue)
        .filter(Boolean)
        .join(' · ')
    },
    { label: 'Peso', value: formatAttributeValue(product.attributes?.peso) },
    { label: 'Garantía', value: formatAttributeValue(product.attributes?.garantia) }
  ].filter(point => point.value && point.value !== 'undefined')

  return (
    <div>
      <Breadcrumbs items={[{ href: '/', label: 'Inicio' }, { href: `/categoria/${product.category}`, label: product.category }, { label: product.name }]} />

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 mt-3">
        <ProductGallery
          slug={product.slug}
          name={product.name}
          imageCount={product.images ?? 0}
          nsfw={isNSFW}
          assetFolder={assetFolder}
          imageExtensions={imageExtensions}
        />
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            {product.brand && <span className="uppercase tracking-wide">{product.brand}</span>}
            {product.badge && <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">{product.badge}</span>}
          </div>
          <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="text-brand-primary font-bold text-xl md:text-2xl">S/ {product.price.toFixed(2)}</div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-primary">
              <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1">Envío 100% discreto</span>
              <span className="inline-flex items-center rounded-full bg-brand-primary/10 px-3 py-1">Empaque sin logos</span>
            </div>
          </div>
          <div className="text-sm text-neutral-500 mt-1">
            SKU: {product.sku} {isNSFW && (<span className="ml-2 inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-700">Contenido sensible</span>)}
          </div>

          {bulletPoints.length > 0 && (
            <ul className="mt-4 space-y-2 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              {bulletPoints.map(point => (
                <li key={point.label} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-primary/60" aria-hidden />
                  <div>
                    <span className="font-semibold text-neutral-900">{point.label}:</span> {point.value}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {/* Este enlace simula la compra y envía los datos a la página de éxito para la conversión */}
            <Link
              href={checkoutHref}
              className="group inline-flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl bg-brand-primary px-6 py-4 text-center text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <span className="text-base font-semibold">Comprar ahora</span>
              <span className="text-xs text-white/80">Checkout seguro y discreto</span>
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-brand-primary/20 bg-white px-6 py-4 text-center text-brand-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-primary/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            >
              <span className="text-base font-semibold">WhatsApp 24/7</span>
              <span className="text-xs text-brand-primary/80">Resolvemos tus dudas en minutos</span>
            </a>
          </div>

          <TrustBadges className="mt-4" />

          {product.features && product.features.length > 0 && (
            <ul className="mt-5 list-disc pl-5 text-neutral-700 text-sm space-y-1">
              {product.features.slice(0, 4).map((f, i) => (<li key={i}>{f}</li>))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Sections product={product} />
        </div>
        <aside>
          <SpecsTable attributes={product.attributes} specs={product.specs} />
        </aside>
      </div>

      <StickyCTA
        price={product.price}
        checkoutHref={checkoutHref}
        whatsappHref={whatsappHref}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', name: product.name, sku: product.sku,
        brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
        image: imageUrls.length > 0 ? imageUrls : undefined,
        offers: { '@type': 'Offer', price: product.price, priceCurrency: 'PEN', availability: 'https://schema.org/InStock' },
        additionalProperty: structuredProperties
      }) }} />
    </div>
  )
}
