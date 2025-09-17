// ========== app/page.tsx (home usando Hero y cards) ==========
import Link from 'next/link'
import Hero from '@/components/Hero'


const categories = [
  { slug: 'bienestar', name: 'Bienestar íntimo' },
  { slug: 'lenceria', name: 'Lencería' },
  { slug: 'kits', name: 'Kits de regalo' },
]
export default function Page() {
  return (
    <>
      <Hero />
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map(c => (
          <Link key={c.slug} href={`/categoria/${c.slug}`} className="block p-5 md:p-6 rounded-2xl border hover:shadow-md transition">
            <div className="text-base md:text-lg font-medium">{c.name}</div>
            <div className="text-sm text-neutral-600 mt-1">Explorar</div>
          </Link>
        ))}
      </section>
    </>
  )
}