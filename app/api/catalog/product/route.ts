import { NextResponse } from 'next/server'

import { getProductBySlug } from '@/lib/products.server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
  }

  const product = await getProductBySlug(slug)
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  return NextResponse.json(product, {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=120'
    }
  })
}
