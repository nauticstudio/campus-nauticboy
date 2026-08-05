import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Sparkles, Trophy, Flame, PlayCircle, ArrowRight, Clock, Package } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser()

  let courses: any[] = []

  if (user) {
    // Fetch published courses
    const { data } = await supabase
      .from('courses')
      .select('id, title, slug, description, software, is_published')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    
    courses = data || []
  }

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
            <span>Nautic Boy Campus</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Bienvenido al Campus Virtual 🎧
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
            Lleva tus producciones al siguiente nivel. Accede a tus contenidos oficiales.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">{courses.length} Cursos</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Disponibles</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Flame className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">0 Módulos</span>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">Completados</p>
          </div>
        </div>

        <div className="glass-card glass-card-hover p-6 rounded-3xl flex items-center gap-5 group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <span className="text-2xl font-black text-slate-900 tracking-tight">0% Progreso</span>
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

        {courses.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">No hay cursos publicados aún</h3>
            <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
              Cuando publiques cursos desde el panel de administración, aparecerán aquí para los estudiantes.
            </p>
            <Link 
              href="/admin/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:bg-cyan-500 transition-all"
            >
              <span>Ir a Gestión de Cursos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map(course => (
              <Link key={course.id} href={`/courses/${course.slug}`} className="group">
                <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col h-full justify-between relative overflow-hidden">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
                        {course.software || 'General'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                        {course.title}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description || 'Sin descripción.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-600">Ver Contenido</span>
                      <ArrowRight className="w-4 h-4 text-cyan-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
