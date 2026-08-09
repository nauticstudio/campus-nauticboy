import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Trophy, CheckCircle2, Flame, ArrowRight, Award, Package } from 'lucide-react'

export default async function ProgressPage() {
  const supabase = await createClient()

  // Fetch published courses
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('id, title, slug, software')
    .eq('is_published', true)

  const coursesProgress = (dbCourses || []).map(c => ({
    title: c.title,
    slug: c.slug,
    software: c.software || 'General',
    completedModules: 0,
    totalModules: 0,
    percent: 0,
  }))

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[var(--radius)] bg-ink-900 p-8 md:p-12 text-white shadow-[var(--shadow-hero)]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-coral-500/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-coral-500/10 border border-white/15 px-3.5 py-1 text-xs font-bold text-amber-200 backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 animate-pulse" />
            <span>Mi Evolución de Productor</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-editorial text-white">
            Seguimiento de Progreso
          </h1>
          <p className="text-ink-200 text-base md:text-lg font-medium leading-relaxed">
            Revisa tus logros, módulos completados y el estado general de tus programas de estudio.
          </p>
        </div>
      </div>

      {/* Global Progress Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-card glass-card-hover p-6 rounded-[var(--radius)] flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-yellow-500/10 border border-white/15 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="font-display text-2xl font-semibold tracking-editorial text-ink-900 tracking-tight">0 Cursos</span>
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mt-0.5">Completados al 100%</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-[var(--radius)] flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ink-400/15 to-ink-500/10 border border-ink-300/40 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="font-display text-2xl font-semibold tracking-editorial text-ink-900 tracking-tight">0 Módulos</span>
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mt-0.5">Superados</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-[var(--radius)] flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-ink-400/15 to-ink-500/10 border border-ink-300/40 flex items-center justify-center text-ink-700 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="font-display text-2xl font-semibold tracking-editorial text-ink-900 tracking-tight">0% Total</span>
            <p className="text-xs font-semibold text-ink-500 uppercase tracking-wider mt-0.5">Avance Promedio</p>
          </div>
        </div>

      </div>

      {/* Courses Progress Detailed List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-ink-900 tracking-tight">Detalle por Programa</h2>

        {coursesProgress.length === 0 ? (
          <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-100 text-primary flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-ink-900">No hay cursos registrados para dar seguimiento</h3>
            <p className="text-xs font-semibold text-ink-500 max-w-sm mx-auto">
              Cuando publiques cursos y los alumnos se matriculen, se calculará su progreso aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {coursesProgress.map(c => (
              <div key={c.slug} className="glass-card glass-card-hover rounded-[var(--radius)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-md">
                  <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-coral-100 text-coral-700 border border-coral-300">
                    {c.software}
                  </span>
                  <h3 className="text-xl font-extrabold text-ink-900 tracking-tight">
                    {c.title}
                  </h3>
                  <p className="text-xs font-semibold text-ink-500">
                    {c.completedModules} de {c.totalModules} Módulos marcados como listos
                  </p>
                </div>

                {/* Progress bar and link */}
                <div className="flex flex-col md:flex-row items-center gap-6 flex-1 max-w-lg justify-end">
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-ink-600">Completado</span>
                      <span className="text-primary font-extrabold">{c.percent}%</span>
                    </div>
                    <div className="w-full h-3 bg-sand-100 rounded-full overflow-hidden p-0.5 border border-sand-300/60">
                      <div 
                        className="h-full bg-gradient-to-r from-coral-500 to-coral-700 rounded-full transition-all duration-500" 
                        style={{ width: `${c.percent}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={`/courses/${c.slug}`}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-ink-900 text-white font-bold text-xs hover:bg-primary hover:shadow-[0_14px_32px_-8px_rgba(255,98,19,0.5)] transition-all duration-200 group whitespace-nowrap"
                  >
                    <span>Ir al Curso</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
