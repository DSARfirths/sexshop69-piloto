import products from '@/data/products.json'


export type Product = { slug:string; name:string; price:number; sku:string; category:string }
export function allProducts(): Product[]{ return products as Product[] }
export function byCategory(slug:string): Product[]{ return allProducts().filter(p=>p.category===slug) }
export function bySlug(slug:string): Product|undefined { return allProducts().find(p=>p.slug===slug) }