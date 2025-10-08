import { NextResponse } from 'next/server'

import { getAllProducts } from '@/lib/products.server'

export const runtime = 'nodejs'

export async function GET() {
  const products = await getAllProducts()
  return NextResponse.json(products, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=300'
    }
  })
}
