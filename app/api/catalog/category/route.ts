import { NextResponse } from 'next/server'

import { getProductsByCategory } from '@/lib/products.server'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const limitParam = searchParams.get('limit')

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 })
  }

  const limit = limitParam ? Math.max(1, Number(limitParam)) : 3
  const products = await getProductsByCategory(slug)
  return NextResponse.json(products.slice(0, limit), {
    headers: {
      'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=120'
    }
  })
}
