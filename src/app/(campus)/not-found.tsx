import Link from 'next/link'
import { ArrowLeft, SearchX } from 'lucide-react'

export default function CampusNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl items-center p-6 md:p-10">
      <section className="glass-card w-full rounded-[var(--radius)] p-8 text-center md:p-10" aria-labelledby="not-found-title">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-coral-500/10 text-coral-300">
          <SearchX className="size-6" aria-hidden />
        </div>
        <h1 id="not-found-title" className="mt-5 font-display text-3xl font-semibold tracking-editorial text-ink-50">
          No encontramos este contenido
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-300">
          Es posible que el recurso se haya movido o ya no esté disponible para tu cuenta.
        </p>
        <Link
          href="/academy"
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Volver a la Academia
        </Link>
      </section>
    </div>
  )
}
