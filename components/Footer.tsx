import Link from 'next/link'
export default function Footer(){
  return (
    <footer className="border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-neutral-600 flex flex-col md:flex-row gap-2 md:gap-6">
        <div className="flex-1">© {new Date().getFullYear()} SexShop del Perú 69</div>
        <nav className="flex gap-4">
          <Link href="/legal/privacidad">Privacidad</Link>
          <Link href="/legal/terminos">Términos</Link>
          <Link href="/legal/devoluciones">Devoluciones</Link>
        </nav>
      </div>
    </footer>
  )
}
