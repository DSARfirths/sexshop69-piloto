'use client'
import { useState, useMemo } from 'react'
import { byCategory } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import { useParams } from 'next/navigation'

export default function SearchClient(){
  const { slug } = useParams<{slug:string}>()
  const [q,setQ]=useState('')
  const data = useMemo(()=> byCategory(slug).filter(p => p.name.toLowerCase().includes(q.toLowerCase())) ,[slug,q])
  return (
    <div className="mt-3">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar en la categoría" aria-label="Buscar"
        className="w-full md:w-1/2 border rounded-xl px-4 py-2" />
      {q && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-4">
          {data.map(p => (<ProductCard key={p.slug} p={p} />))}
          {data.length===0 && (<p className="text-sm text-neutral-500">Sin resultados</p>)}
        </div>
      )}
    </div>
  )
}
