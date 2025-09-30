import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { allProducts, bySlug, formatAttributeLabel, formatAttributeValue, getProductProperties } from '@/lib/products'
import StickyCTA from '@/components/StickyCTA'
import ProductGallery from '@/components/product/ProductGallery'
import Breadcrumbs from '@/components/ui/Breadcrumbs'
import TrustBadges from '@/components/ui/TrustBadges'
import SpecsTable from '@/components/ui/SpecsTable'
import Sections from '@/components/ui/Sections'

export const runtime = 'nodejs'

export function generateStaticParams() {
  return allProducts().map(product => ({ slug: product.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = bySlug(params.slug)
  if (!p) return {}
  const title = `${p.name} — SexShop del Perú 69`
  const description = 'Página de producto (piloto ad-safe, mobile-first).'
  const canonical = `/producto/${p.slug}`
  const imageCount = p.imageFilenames.length
  const imageUrls = Array.from({ length: imageCount }, (_, index) => `/products/${p.slug}/${index + 1}.webp`)
  const hasValidImages = imageUrls.length > 0
  const openGraphImages = imageUrls.length > 0
    ? imageUrls.slice(0, 4).map((url, index) => ({ url, alt: `${p.name} — vista ${index + 1}` }))
    : undefined

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
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
  const imageCount = product.imageFilenames.length
  const imageUrls = Array.from({ length: imageCount }, (_, index) => `/products/${product.slug}/${index + 1}.webp`)
  const isNSFW = !!product.nsfw
  const structuredProperties = getProductProperties(product.attributes, product.specs).map(([name, value]) => ({
    '@type': 'PropertyValue',
    name: formatAttributeLabel(name),
    value: formatAttributeValue(value)
  }))
  const salePrice = typeof product.salePrice === 'number' ? product.salePrice : null
  const hasSalePrice = salePrice !== null && salePrice > 0 && salePrice < product.regularPrice
  const activePrice = hasSalePrice ? salePrice : product.regularPrice
  const discountPercentage = hasSalePrice
    ? Math.round(((product.regularPrice - salePrice) / product.regularPrice) * 100)
    : 0
  const discountLabel = discountPercentage > 0 ? `${discountPercentage}%` : null
  const discountBadge = discountLabel ? `${discountLabel} DSCTO` : null
  const checkoutHref = `/checkout/success?sku=${product.sku}&value=${activePrice}`
  const displayPrice = activePrice.toFixed(2)
  const regularPrice = product.regularPrice.toFixed(2)
  const whatsappMessage = encodeURIComponent(`Consulta ${product.sku} - S/ ${displayPrice}`)
  const whatsappHref = `https://wa.me/51924281623?text=${whatsappMessage}`

  const bulletPoints = [
    { label: 'Marca', value: formatAttributeValue(product.attributes?.brand) },
    { label: 'Material', value: formatAttributeValue(product.attributes?.material) },
    {
      label: 'Dimensiones',
      value: [product.attributes?.longitud, product.attributes?.diametro]
        .map(formatAttributeValue)
        .filter(Boolean)
        .join(' · ')
    },
    { label: 'Peso', value: formatAttributeValue(product.attributes?.peso) },
    { label: 'País de origen', value: formatAttributeValue(product.attributes?.countryOfOrigin) },
    { label: 'Garantía', value: formatAttributeValue(product.attributes?.garantia) }
  ].filter(point => point.value && point.value !== 'undefined')

  return (
    <div className="rounded-3xl bg-white p-4 text-neutral-900 shadow-sm sm:p-6 md:p-8">
      <Breadcrumbs items={[{ href: '/', label: 'Inicio' }, { href: `/categoria/${product.category}`, label: product.category }, { label: product.name }]} />

      <div className="mt-4 grid gap-6 md:mt-6 md:grid-cols-2 md:gap-8">
        <ProductGallery
          slug={product.slug}
          name={product.name}
          imageCount={imageCount}
          imageFilenames={product.imageFilenames}
          nsfw={isNSFW}
        />
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            {product.brand && <span className="uppercase tracking-wide">{product.brand}</span>}
            {product.badge && (
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700">{product.badge}</span>
            )}
            {discountBadge && (
              <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-600 font-semibold uppercase tracking-wide">
                {discountBadge}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-semibold mt-1">{product.name}</h1>
          <div className="mt-2 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-baseline gap-2 text-brand-pink">
                <span className="text-3xl font-bold md:text-4xl">S/ {displayPrice}</span>
                {hasSalePrice && (
                  <span className="text-lg font-semibold text-neutral-400 line-through">S/ {regularPrice}</span>
                )}
              </div>
              {hasSalePrice && discountLabel && (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-600">
                  -{discountLabel}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-brand-pink">
              <span className="inline-flex items-center rounded-full bg-brand-pink/10 px-3 py-1">Envío 100% discreto</span>
              <span className="inline-flex items-center rounded-full bg-brand-pink/10 px-3 py-1">Empaque sin logos</span>
            </div>
          </div>
          <div className="text-sm text-neutral-500 mt-1">
            SKU: {product.sku} {isNSFW && (<span className="ml-2 inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-700">Contenido sensible</span>)}
          </div>

          {bulletPoints.length > 0 && (
            <ul className="mt-4 space-y-2 rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              {bulletPoints.map(point => (
                <li key={point.label} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-pink/60" aria-hidden />
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
              className="btn-primary group inline-flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-6 py-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <span className="text-base font-semibold">Comprar ahora</span>
              <span className="text-xs text-white/80">Checkout seguro y discreto</span>
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border border-brand-pink/20 bg-white px-6 py-4 text-center text-brand-pink shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-pink/40 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-pink"
            >
              <span className="text-base font-semibold">WhatsApp 24/7</span>
              <span className="text-xs text-brand-pink/80">Resolvemos tus dudas en minutos</span>
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
        price={activePrice}
        regularPrice={product.regularPrice}
        checkoutHref={checkoutHref}
        whatsappHref={whatsappHref}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'Product', name: product.name, sku: product.sku,
        brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
        image: imageUrls.length > 0 ? imageUrls : undefined,
        offers: { '@type': 'Offer', price: activePrice, priceCurrency: 'PEN', availability: 'https://schema.org/InStock' },
        additionalProperty: structuredProperties
      }) }} />
    </div>
  )
}
