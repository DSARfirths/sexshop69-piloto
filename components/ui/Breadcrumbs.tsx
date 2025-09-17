import Link from 'next/link'
export default function Breadcrumbs({items}:{items:{href?:string; label:string}[]}){
  return (
    <nav aria-label="breadcrumb" className="text-sm text-neutral-600">
      <ol className="flex flex-wrap gap-1">
        {items.map((it,i)=> (
          <li key={i} className="flex items-center gap-1">
            {it.href ? <Link href={it.href} className="hover:underline">{it.label}</Link> : <span aria-current="page">{it.label}</span>}
            {i<items.length-1 && <span className="opacity-50">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
