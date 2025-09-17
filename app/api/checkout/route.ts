import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const sku = String(form.get('sku') ?? 'SKU')
  return NextResponse.redirect(new URL(`/checkout/success?sku=${sku}`, req.url))
}
export async function GET(req: NextRequest) {
  const sku = new URL(req.url).searchParams.get('s') ?? 'SKU'
  return NextResponse.redirect(new URL(`/checkout/success?sku=${sku}`, req.url))
}
