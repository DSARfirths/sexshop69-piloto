'use client'
import { useEffect, useState } from 'react'
export function AgeGate() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const ok = document.cookie.includes('age_ok=1')
    if (!ok) setShow(true)
  }, [])
  if (!show) return null
  return (
    <div className="fixed inset-0 z-[60] bg-white/70 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="bg-white p-6 rounded-2xl max-w-md text-center shadow-lg">
        <h2 className="text-xl font-semibold">Contenido para mayores de 18 años</h2>
        <p className="text-sm text-neutral-600 mt-2">Al continuar confirma ser mayor de edad.</p>
        <div className="mt-4 flex justify-center gap-3">
          <button onClick={() => { document.cookie = 'age_ok=1; path=/; max-age=31536000'; setShow(false) }}
                  className="px-4 py-2 rounded-xl bg-brand-primary text-white">Tengo 18+</button>
          <a href="https://www.google.com" className="px-4 py-2 rounded-xl border">Salir</a>
        </div>
        <p className="text-[11px] mt-3 text-neutral-500">El robot de Google puede rastrear el contenido para evaluación de políticas.</p>
      </div>
    </div>
  )
}
