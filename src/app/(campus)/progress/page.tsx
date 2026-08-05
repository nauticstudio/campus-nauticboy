import Link from 'next/link'
import { Trophy, CheckCircle2, BookOpen, Flame, ArrowRight, Sparkles, Award } from 'lucide-react'

export default function ProgressPage() {
  const coursesProgress = [
    {
      title: 'Ableton Live Masterclass',
      slug: 'produccion-ableton',
      software: 'Ableton Live 12',
      completedModules: 2,
      totalModules: 4,
      percent: 50,
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200'
    },
    {
      title: 'Mezcla Pros & Mastering',
      slug: 'mezcla-mastering',
      software: 'Plugins & DAWs',
      completedModules: 2,
      totalModules: 6,
      percent: 33,
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    {
      title: 'Diseño Sonoro en Serum',
      slug: 'sound-design-synth',
      software: 'Serum',
      completedModules: 5,
      totalModules: 5,
      percent: 100,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    }
  ]

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 md:p-12 text-white shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
            <Trophy className="w-3.5 h-3.5 animate-pulse" />
            <span>Mi Evolución de Productor</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Seguimiento de Progreso 📈
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
            Revisa tus logros, módulos completados y el estado general de tus programas de estudio.
          </p>
        </div>
      </div>

      {/* Global Progress Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-yellow-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">1 Curso</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Completado al 100%</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">9 / 15</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Módulos Superados</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">61% Total</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Avance Promedio</p>
          </div>
        </div>

      </div>

      {/* Courses Progress Detailed List */}
      <div className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Detalle por Programa</h2>

        <div className="space-y-4">
          {coursesProgress.map(c => (
            <div key={c.slug} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-md">
                <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold border ${c.badgeColor}`}>
                  {c.software}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {c.title}
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  {c.completedModules} de {c.totalModules} Módulos marcados como listos
                </p>
              </div>

              {/* Progress bar and link */}
              <div className="flex flex-col md:flex-row items-center gap-6 flex-1 max-w-lg justify-end">
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-600">Completado</span>
                    <span className="text-cyan-600 font-extrabold">{c.percent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500" 
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>

                <Link
                  href={`/courses/${c.slug}`}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-cyan-600 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200 group whitespace-nowrap"
                >
                  <span>Ir al Curso</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  )
}
