import Link from 'next/link'
export default function Footer(){
  return (
    <footer className="mt-8 border-t border-night-border bg-night-surface backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-night-subtle md:flex-row md:gap-6">
        <div className="flex-1">© {new Date().getFullYear()} SexShop del Perú 69</div>
        <nav className="flex gap-4 text-night-foreground/80">
          <Link className="transition hover:text-white" href="/legal/privacidad">Privacidad</Link>
          <Link className="transition hover:text-white" href="/legal/terminos">Términos</Link>
          <Link className="transition hover:text-white" href="/legal/devoluciones">Devoluciones</Link>
        </nav>
      </div>
    </footer>
  )
}
