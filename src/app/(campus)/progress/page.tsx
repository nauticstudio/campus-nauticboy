import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowRight, ChartNoAxesCombined, Package } from 'lucide-react'

export default async function ProgressPage() {
  const supabase = await createClient()

  // Fetch published courses
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('id, title, slug, software')
    .eq('is_published', true)

  const courses = (dbCourses || []).map(c => ({
    title: c.title,
    slug: c.slug,
    software: c.software || 'General',
  }))

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">
      
      <div className="space-y-6">
        <div className="glass-card rounded-[var(--radius)] p-8 md:p-10">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-coral-500/10 text-coral-300">
            <ChartNoAxesCombined className="size-6" />
          </div>
          <div className="mt-6 max-w-2xl space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-coral-300">Mi aprendizaje</p>
            <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-editorial text-ink-50">
              Seguimiento de progreso
            </h1>
            <p className="text-base font-medium leading-relaxed text-ink-300">
              Tus cursos activos aparecen aquí. El registro de módulos se mostrará cuando el avance pueda guardarse en tu cuenta.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-ink-50 tracking-tight">Programas disponibles</h2>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-ink-300">
            Seguimiento pendiente
          </span>
        </div>

        {courses.length === 0 ? (
          <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-500/10 text-coral-300 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-ink-50">No hay cursos disponibles para seguimiento</h3>
            <p className="text-xs font-semibold text-ink-300 max-w-sm mx-auto">
              Los programas publicados aparecerán aquí cuando estén disponibles.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map(c => (
              <div key={c.slug} className="glass-card rounded-[var(--radius)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-coral-500/10 text-coral-300 border border-coral-500/20">
                    {c.software}
                  </span>
                  <h3 className="text-xl font-extrabold text-ink-50 tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-sm font-medium text-ink-300">
                    Aún no hay módulos registrados como completados.
                  </p>
                </div>

                <Link
                  href={`/courses/${c.slug}`}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] whitespace-nowrap"
                >
                  <span>Abrir curso</span>
                  <ArrowRight className="w-4 h-4" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
