import Link from 'next/link'
import { BookOpen, Sparkles, Trophy, Flame, PlayCircle, ArrowRight, Library, Heart, Clock } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-8 md:p-12 text-white shadow-xl shadow-slate-900/10 group">
        
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-20 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-bold text-cyan-400 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Nautic Boy Academy Pro</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Bienvenido al Campus Virtual 🎧
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
            Lleva tus producciones al siguiente nivel. Continúa donde lo dejaste en tus programas de estudio.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link 
              href="/courses/produccion-ableton"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group/btn"
            >
              <PlayCircle className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
              <span>Continuar Curso Actual</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">3 Cursos</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Inscriptos</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">4 Módulos</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Completados</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">65% Progreso</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Promedio General</p>
          </div>
        </div>

      </div>

      {/* Main Section: Mis Cursos */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Mis Programas en Curso</h2>
            <p className="text-sm font-medium text-slate-500 mt-1">Accede a tus lecciones y material descargable</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Ableton Live Card */}
          <Link href="/courses/produccion-ableton" className="group">
            <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col h-full justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                    Ableton Live 12
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>8 Módulos</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                    Ableton Live Masterclass
                  </h3>
                  <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                    Aprende producción profesional desde cero, mezcla avanzada y diseño sonoro.
                  </p>
                </div>
              </div>

              {/* Progress Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Progreso del Curso</span>
                  <span className="text-cyan-600 font-extrabold">65%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500" 
                    style={{ width: '65%' }}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Mezcla & Master Card */}
          <Link href="/courses/mezcla-mastering" className="group">
            <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col h-full justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                    Mezcla & Mastering
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>6 Módulos</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">
                    Mezcla Pros & Mastering
                  </h3>
                  <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                    Ecualización dinámica, compresión multibanda y volumen competitivo para plataformas.
                  </p>
                </div>
              </div>

              {/* Progress Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Progreso del Curso</span>
                  <span className="text-indigo-600 font-extrabold">30%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500" 
                    style={{ width: '30%' }}
                  />
                </div>
              </div>
            </div>
          </Link>

          {/* Sound Design Card */}
          <Link href="/courses/sound-design-synth" className="group">
            <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col h-full justify-between relative overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Sintetizadores
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>5 Módulos</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-amber-600 transition-colors tracking-tight">
                    Diseño Sonoro en Serum
                  </h3>
                  <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                    Crea tus propios leads, plucks, basses y pads con síntesis wavetable.
                  </p>
                </div>
              </div>

              {/* Progress Footer */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-600">Progreso del Curso</span>
                  <span className="text-amber-600 font-extrabold">100%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500" 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          </Link>

        </div>
      </div>

    </div>
  )
}
