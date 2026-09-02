'use client'

import { Button } from '@/components/ui/button'

export default function CampusError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl items-center p-6 md:p-10">
      <section className="glass-card w-full rounded-[var(--radius)] p-8 text-center md:p-10" aria-labelledby="campus-error-title">
        <p className="text-xs font-bold uppercase tracking-wider text-coral-300">Contenido no disponible</p>
        <h1 id="campus-error-title" className="mt-3 font-display text-3xl font-semibold tracking-editorial text-ink-50">
          No pudimos cargar esta sección
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-300">
          Reintenta la carga. Si el problema continúa, vuelve a la Academia desde el menú.
        </p>
        <Button className="mt-6" onClick={reset}>Reintentar</Button>
      </section>
    </div>
  )
}
