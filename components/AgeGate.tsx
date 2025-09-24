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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-white/80 p-6 backdrop-blur-xl">
      <div className="max-w-md rounded-2xl border border-neutral-200 bg-white p-6 text-center text-neutral-900 shadow-xl">
        <h2 className="text-xl font-semibold text-neutral-900">Contenido para mayores de 18 años</h2>
        <p className="mt-2 text-sm text-neutral-600">Al continuar confirma ser mayor de edad.</p>
        <div className="mt-5 flex justify-center gap-3">
          <button
            onClick={() => { document.cookie = 'age_ok=1; path=/; max-age=31536000'; setShow(false) }}
            className="rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-500 px-5 py-2 text-sm font-semibold text-white shadow-neon transition hover:from-fuchsia-400 hover:to-purple-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
          >
            Tengo 18+
          </button>
          <a
            href="https://www.google.com"
            className="rounded-xl border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-700 transition hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
          >
            Salir
          </a>
        </div>
        <p className="mt-4 text-[11px] text-neutral-500">El robot de Google puede rastrear el contenido para evaluación de políticas.</p>
      </div>
    </div>
  )
}
