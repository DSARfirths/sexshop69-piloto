import Link from 'next/link'
export default function Footer(){
  return (
    <footer className="mt-8 border-t border-neutral-200 bg-neutral-50 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-3 py-6 text-sm text-neutral-600 sm:px-4 md:flex-row md:gap-6">
        <div className="flex-1">© {new Date().getFullYear()} SexShop del Perú 69</div>
        <nav className="flex gap-4 text-neutral-700">
          <Link className="transition hover:text-neutral-900" href="/legal/privacidad">Privacidad</Link>
          <Link className="transition hover:text-neutral-900" href="/legal/terminos">Términos</Link>
          <Link className="transition hover:text-neutral-900" href="/legal/devoluciones">Devoluciones</Link>
        </nav>
      </div>
    </footer>
  )
}
