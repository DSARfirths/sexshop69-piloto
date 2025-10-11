import Link from 'next/link'

type AboutSectionProps = {
  headingId?: string
}

export default function AboutSection({ headingId }: AboutSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className="relative isolate overflow-hidden rounded-[2.5rem] bg-neutral-950 px-6 py-16 text-white sm:px-10 lg:px-16 xl:px-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.55),_transparent_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(30,17,45,0.92)_0%,rgba(17,24,39,0.88)_45%,rgba(76,29,149,0.65)_100%)] mix-blend-soft-light" />
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -left-32 top-16 h-72 w-72 rounded-full bg-fuchsia-500/30 blur-3xl" />
        <div className="absolute -right-20 bottom-10 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-fuchsia-200">
            Sensualidad consciente
          </p>
          <h2 id={headingId} className="font-heading text-3xl font-semibold sm:text-4xl lg:text-5xl">
            Bienvenido a la casa del placer latino
          </h2>
          <p className="text-base leading-relaxed text-fuchsia-50/90 sm:text-lg">
            Somos consultores de intimidad que cuidan cada detalle: curamos colecciones inclusivas,
            probamos texturas seguras y acompañamos a parejas y exploradores solo con productos
            certificados. Creemos en rituales sensuales, consentidos y libres de tabú.
          </p>
        </div>
        <div className="space-y-4 text-sm text-fuchsia-100/90 lg:max-w-sm">
          <p>
            Te invitamos a conocer la historia detrás de Sexshop69, nuestras raíces peruanas, el
            manifiesto de bienestar íntimo y las experiencias que diseñamos junto a terapeutas y
            educadores sexuales.
          </p>
          <Link
            href="/nuestra-historia"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-200"
          >
            Nuestra historia
          </Link>
        </div>
      </div>
    </section>
  )
}
