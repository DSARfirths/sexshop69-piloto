import products from '@/data/products.json'

export type Specs = Record<string,string|number|boolean>
export type Product = {
  slug:string; name:string; price:number; sku:string; category:string; nsfw?: boolean; images?: number;
  brand?: string; badge?: 'nuevo'|'top'|'promo';
  features?: string[];
  using?: string[];
  care?: string[];
  specs?: Specs;
  related?: string[];
}
export function allProducts(): Product[]{ return products as Product[] }
export function byCategory(slug:string): Product[]{ return allProducts().filter(p=>p.category===slug) }
export function bySlug(slug:string): Product|undefined { return allProducts().find(p=>p.slug===slug) }
