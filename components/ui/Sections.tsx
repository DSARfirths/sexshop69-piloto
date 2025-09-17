'use client'
import type { Product } from '@/lib/products'

function Section({title,children}:{title:string;children:React.ReactNode}){
  return (
    <details className="border rounded-2xl p-4 open:shadow-sm mb-3" open>
      <summary className="cursor-pointer select-none text-base font-semibold">{title}</summary>
      <div className="mt-3 text-sm text-neutral-800">{children}</div>
    </details>
  )
}
export default function Sections({product}:{product:Product}){
  return (
    <div>
      {product.features && product.features.length>0 && (
        <Section title="Características y beneficios">
          <ul className="list-disc pl-5 space-y-1">
            {product.features.map((f,i)=>(<li key={i}>{f}</li>))}
          </ul>
        </Section>
      )}
      {product.using && product.using.length>0 && (
        <Section title="Cómo usar">
          <ol className="list-decimal pl-5 space-y-1">
            {product.using.map((s,i)=>(<li key={i}>{s}</li>))}
          </ol>
        </Section>
      )}
      {product.care && product.care.length>0 && (
        <Section title="Cuidado y limpieza">
          <ul className="list-disc pl-5 space-y-1">
            {product.care.map((c,i)=>(<li key={i}>{c}</li>))}
          </ul>
        </Section>
      )}
      <Section title="Envíos y devoluciones">
        <p>Envío discreto y rápido. Cambios por falla de fábrica en 7 días. Ver políticas completas en la sección legal.</p>
      </Section>
      <Section title="Garantía">
        <p>Garantía limitada de 1 año por defecto de fabricación (gestión con tienda).</p>
      </Section>
    </div>
  )
}
