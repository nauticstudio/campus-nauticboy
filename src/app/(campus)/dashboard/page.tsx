import Link from 'next/link'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { 
  BookOpen, Sparkles, Trophy, Flame, PlayCircle, ArrowRight, Clock, 
  Package, Headphones, Users, Cpu, Download, Shield, Heart, Library, 
  MessageCircle, CheckCircle2, Activity, Sliders, Waves, MonitorPlay, Speaker
} from 'lucide-react'
import { getAdminViewMode } from '@/app/actions/view-mode'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Check role & profile
  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase.from('profiles').select('full_name, role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'
  const userName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Alumno'
  
  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // --- ADMIN DATA FETCHING ---
  let adminStats = { users: 0, products: 0, courses: 0, items: 0 }
  if (showAdminUI) {
    const [uRes, pRes, cRes, iRes] = await Promise.all([
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }),
      adminSupabase.from('software_products').select('id', { count: 'exact', head: true }),
      adminSupabase.from('courses').select('id', { count: 'exact', head: true }),
      adminSupabase.from('software_items').select('id', { count: 'exact', head: true }),
    ])
    adminStats = {
      users: uRes.count || 0,
      products: pRes.count || 0,
      courses: cRes.count || 0,
      items: iRes.count || 0
    }
  }

  // --- STUDENT DATA FETCHING ---
  let featuredSoftware: any[] = []
  let stats = { courses: 0, software: 0, favorites: 0 }

  if (!showAdminUI) {
    const [{ count: enrollmentsCount }, { count: softwareCount }, { count: favoritesCount }, { data: featuredData }] = await Promise.all([
      supabase.from('enrollments').select('user_id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('software_products').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('favorites').select('user_id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('software_products').select('id, name, slug, description, cover_image_url').eq('is_published', true).limit(4)
    ])
    
    featuredSoftware = featuredData || []
    stats = {
      courses: enrollmentsCount || 0,
      software: softwareCount || 0,
      favorites: favoritesCount || 0
    }
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-12 max-w-7xl mx-auto mb-20">
      
      {showAdminUI ? (
        /* ================= ADMIN DASHBOARD ================= */
        <div className="space-y-10">
          <div className={`relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r p-8 md:p-12 text-white shadow-xl group from-slate-900 via-cyan-950 to-slate-900 shadow-cyan-900/10`}>
            <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none bg-cyan-500/30`} />
            <div className={`absolute bottom-0 right-1/4 -mb-20 w-60 h-60 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700 pointer-events-none bg-indigo-500/30`} />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-bold text-cyan-400 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                <span>Modo Administrador</span>
              </div>
              <h1 className="flex items-center gap-4 text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
                Panel de Control <Shield className="w-10 h-10 md:w-14 md:h-14 text-cyan-400" />
              </h1>
              <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
                Vista general del rendimiento y contenido de la academia.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{adminStats.users}</span>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Alumnos Registrados</p>
              </div>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{adminStats.courses}</span>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Cursos Creados</p>
              </div>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{adminStats.products}</span>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Sintetizadores</p>
              </div>
            </div>

            <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col gap-2 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                <Download className="w-6 h-6" />
              </div>
              <div className="mt-2">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{adminStats.items}</span>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">Expansiones y Archivos</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/courses" className="glass-card p-6 rounded-3xl border border-indigo-100 hover:border-indigo-300 hover:shadow-lg transition-all group">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" /> Gestionar Cursos
              </h3>
              <p className="text-sm text-slate-500 mt-2">Crea nuevos módulos, sube lecciones y organiza el contenido educativo.</p>
            </Link>
            <Link href="/admin/software" className="glass-card p-6 rounded-3xl border border-cyan-100 hover:border-cyan-300 hover:shadow-lg transition-all group">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-500" /> Gestionar Software
              </h3>
              <p className="text-sm text-slate-500 mt-2">Sube nuevos instaladores, expansiones y librerías conectadas a Google Drive.</p>
            </Link>
          </div>
        </div>
      ) : (
        /* ================= STUDENT DASHBOARD (LAUNCHPAD) ================= */
        <div className="space-y-12">
          
          {/* New Hero Section */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-[#0A0A0A] p-8 md:p-14 text-white shadow-2xl group border border-slate-800">
            {/* Dark Abstract Background with Vector Icons */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              {/* Radial Gradients */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-900/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" />
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Floating Icons Collage */}
              <div className="absolute right-[5%] top-[10%] text-slate-500/30 rotate-12"><Cpu size={140} strokeWidth={1} /></div>
              <div className="absolute right-[25%] top-[5%] text-cyan-500/20 -rotate-12"><Sliders size={90} strokeWidth={1} /></div>
              <div className="absolute right-[-5%] bottom-[5%] text-indigo-500/20 rotate-45"><Waves size={180} strokeWidth={1} /></div>
              <div className="absolute right-[20%] bottom-[25%] text-slate-400/20 -rotate-6"><MonitorPlay size={100} strokeWidth={1} /></div>
              <div className="absolute left-[35%] top-[10%] text-slate-500/10 rotate-12"><Speaker size={110} strokeWidth={1} /></div>
            </div>

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-1.5 text-xs font-bold text-slate-300 backdrop-blur-md uppercase tracking-widest">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Nautic Boy Campus</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-[1.1]">
                Bienvenido, {userName} <span className="inline-block hover:animate-wiggle cursor-default">👋</span>
              </h1>
              
              <div className="space-y-2 mt-4">
                <h3 className="text-lg md:text-xl font-bold text-cyan-400">Tu siguiente paso</h3>
                <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
                  Comienza por explorar la biblioteca de Software & Plugins para preparar tu estudio mientras se publican los primeros cursos oficiales.
                </p>
              </div>

              <div className="pt-6">
                <Link href="/software" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-2xl hover:bg-cyan-50 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] duration-300">
                  Explorar Biblioteca
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <div className="mt-4 text-xs font-semibold text-slate-500 tracking-wider">
                  BIBLIOTECA EN CRECIMIENTO CONTINUO • ACTUALIZACIONES PERMANENTES
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Link href="/software" className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center justify-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-cyan-500/10 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-7 h-7" />
              </div>
              <span className="font-bold text-slate-900 text-sm md:text-base">Software</span>
            </Link>
            <Link href="/favorites" className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center justify-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-7 h-7" />
              </div>
              <span className="font-bold text-slate-900 text-sm md:text-base">Mis Favoritos</span>
            </Link>
            <Link href="/academy/plantillas" className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center justify-center text-center gap-4 group">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Download className="w-7 h-7" />
              </div>
              <span className="font-bold text-slate-900 text-sm md:text-base">Recursos</span>
            </Link>
            <button className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col items-center justify-center text-center gap-4 group opacity-70 hover:opacity-100 cursor-not-allowed">
              <div className="w-14 h-14 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-7 h-7" />
              </div>
              <div className="flex flex-col items-center">
                <span className="font-bold text-slate-900 text-sm md:text-base">Comunidad</span>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1 bg-indigo-50 px-2 py-0.5 rounded-full">Próximamente</span>
              </div>
            </button>
          </div>

          {/* Estadísticas Personales */}
          <div className="glass-card p-6 md:p-8 rounded-[2.5rem]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Tu progreso</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 divide-x divide-slate-100">
              <div className="flex flex-col gap-1 px-2 md:px-4">
                <span className="text-3xl md:text-4xl font-black text-slate-900">{stats.courses}</span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">Cursos</span>
              </div>
              <div className="flex flex-col gap-1 px-4 md:px-8">
                <span className="text-3xl md:text-4xl font-black text-cyan-600">{stats.software}</span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">Software</span>
              </div>
              <div className="flex flex-col gap-1 px-4 md:px-8">
                <span className="text-3xl md:text-4xl font-black text-rose-600">{stats.favorites}</span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">Favoritos</span>
              </div>
              <div className="flex flex-col gap-1 px-4 md:px-8">
                <span className="text-3xl md:text-4xl font-black text-slate-900">0</span>
                <span className="text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">Hrs Vistas</span>
              </div>
            </div>
          </div>

          {/* Roadmap Visual */}
          <div className="space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Tu camino dentro del Campus</h3>
            <div className="glass-card p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
                
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[3px] bg-slate-100 z-0" />

                {/* Step 1 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 group md:w-1/4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div className="md:text-center mt-2">
                    <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest mb-0.5">Paso 1</p>
                    <p className="text-sm font-extrabold text-slate-900">Explora Software</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 group md:w-1/4">
                  <div className="w-12 h-12 rounded-full bg-white border-[3px] border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-indigo-400 group-hover:text-indigo-500 transition-colors shadow-sm">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="md:text-center mt-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5 group-hover:text-indigo-500 transition-colors">Paso 2</p>
                    <p className="text-sm font-extrabold text-slate-500 group-hover:text-slate-900 transition-colors">Descarga Plugins</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 group md:w-1/4">
                  <div className="w-12 h-12 rounded-full bg-white border-[3px] border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-emerald-400 group-hover:text-emerald-500 transition-colors shadow-sm">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div className="md:text-center mt-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5 group-hover:text-emerald-500 transition-colors">Paso 3</p>
                    <p className="text-sm font-extrabold text-slate-500 group-hover:text-slate-900 transition-colors">Comienza el Curso</p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 group md:w-1/4">
                  <div className="w-12 h-12 rounded-full bg-white border-[3px] border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-amber-400 group-hover:text-amber-500 transition-colors shadow-sm">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="md:text-center mt-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5 group-hover:text-amber-500 transition-colors">Paso 4</p>
                    <p className="text-sm font-extrabold text-slate-500 group-hover:text-slate-900 transition-colors">Proyecto Final</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Software Destacado */}
          {featuredSoftware.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Software Destacado</h3>
                <Link href="/software" className="text-sm font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1">
                  Ver todo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredSoftware.map(soft => (
                  <Link key={soft.id} href={`/software/${soft.slug}`} className="group">
                    <div className="glass-card glass-card-hover p-5 rounded-3xl space-y-4 h-full bg-white/50 border border-slate-200/60">
                      {soft.cover_image_url ? (
                        <div className="aspect-[4/3] rounded-2xl bg-slate-100 overflow-hidden relative shadow-inner">
                          <img src={soft.cover_image_url} alt={soft.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                          <Cpu className="w-10 h-10" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-extrabold text-slate-900 truncate">{soft.name}</h4>
                        {soft.description && <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-1">{soft.description}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Grid de Novedades y Roadmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Próximos lanzamientos */}
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Próximos lanzamientos</h3>
              <div className="glass-card p-6 md:p-8 rounded-[2.5rem] space-y-8 bg-white/60">
                
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">En preparación</p>
                      <h4 className="font-extrabold text-slate-900 flex items-center gap-2"><span className="text-xl">🚀</span> Producción Musical</h4>
                    </div>
                    <span className="font-black text-cyan-600">60%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full w-[60%] shadow-[0_0_10px_rgba(6,182,212,0.6)]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Planificado</p>
                      <h4 className="font-extrabold text-slate-900 flex items-center gap-2"><span className="text-xl">🎛</span> Mixing & Mastering</h4>
                    </div>
                    <span className="font-black text-indigo-600">30%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[30%] shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Investigación</p>
                      <h4 className="font-extrabold text-slate-900 flex items-center gap-2"><span className="text-xl">🎹</span> Sound Design</h4>
                    </div>
                    <span className="font-black text-slate-400">10%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-300 rounded-full w-[10%]" />
                  </div>
                </div>

              </div>
            </div>

            {/* Actividad Reciente / Novedades */}
            <div className="space-y-6">
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Últimas Novedades</h3>
              <div className="glass-card p-6 md:p-8 rounded-[2.5rem] space-y-6 bg-white/60">
                
                <div className="flex items-start gap-4">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Biblioteca de Plugins actualizada</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Se han añadido los ecosistemas fundamentales.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Nuevos fabricantes añadidos</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Arturia, FabFilter y Native Instruments ya están disponibles.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1.5 w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Disponible Max4Live</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">La categoría de M4L ha sido habilitada para Ableton.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 opacity-50">
                  <div className="mt-1.5 w-2 h-2 rounded-full border-2 border-slate-300 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">Próximamente nuevos cursos</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Módulos iniciales de producción en desarrollo.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 p-10 md:p-16 text-center text-white shadow-2xl mt-10 border border-slate-800">
            {/* Background pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">¿Listo para empezar?</h2>
              <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
                Explora todo el catálogo de software y prepara tu estudio antes del lanzamiento de los cursos. Un ecosistema profesional organizado a tu disposición.
              </p>
              <div className="pt-6">
                <Link href="/software" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-2xl hover:bg-cyan-50 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)] duration-300">
                  Explorar Software
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
