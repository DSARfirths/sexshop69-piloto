// ========== app/categoria/[slug]/page.tsx (listado + buscador simple) ==========
import ProductCard from '@/components/ProductCard'
import { byCategory } from '@/lib/products'
import SearchClient from './search-client'


export default function CategoryPage({ params }: { params: { slug:string } }){
const items = byCategory(params.slug)
return (
<div>
<h1 className="text-2xl font-semibold capitalize">{params.slug}</h1>
<SearchClient />
<div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4">
{items.map(p => (<ProductCard key={p.slug} p={p} />))}
</div>
</div>
)
}