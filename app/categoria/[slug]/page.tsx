import CategoryFiltersClient from './category-filters-client'

export default function CategoryPage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold capitalize">{params.slug}</h1>
      <CategoryFiltersClient />
    </div>
  )
}
