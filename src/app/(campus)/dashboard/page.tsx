import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import {
  BookOpen, Sparkles, PlayCircle, ArrowRight, Users, Cpu, Download,
  Shield, Heart, Package, Sliders, MonitorPlay, Speaker, CheckCircle2, Trophy
} from 'lucide-react'
import { getAdminViewMode } from '@/app/actions/view-mode'
import { getDashboardFeatured, type SoftwareFeatured } from '@/lib/data/software'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger'
import { Card } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

function WaveDivider({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className={`wave-divider ${className}`} aria-hidden>
      <path d="M0,40 C240,90 480,10 720,45 C960,80 1200,15 1440,55 L1440,90 L0,90 Z" fill="currentColor" opacity="0.08" />
      <path d="M0,60 C300,100 640,20 960,55 C1200,85 1330,45 1440,70 L1440,90 L0,90 Z" fill="currentColor" />
    </svg>
  )
}

export default async function DashboardPage() {
  const { user, profile, supabase } = await requireUser()
  const isAdmin = profile?.role === 'admin'
  const userName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Alumno'

  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // --- ADMIN ---
  let adminStats = { users: 0, products: 0, courses: 0, items: 0 }
  if (showAdminUI) {
    const adminSupabase = await createAdminClient()
    const [uRes, pRes, cRes, iRes] = await Promise.all([
      adminSupabase.from('profiles').select('id', { count: 'exact', head: true }),
      adminSupabase.from('software_products').select('id', { count: 'exact', head: true }),
      adminSupabase.from('courses').select('id', { count: 'exact', head: true }),
      adminSupabase.from('software_items').select('id', { count: 'exact', head: true }),
    ])
    adminStats = { users: uRes.count || 0, products: pRes.count || 0, courses: cRes.count || 0, items: iRes.count || 0 }
  }
  // --- STUDENT ---
  let featuredSoftware: SoftwareFeatured[] = []
  let stats = { courses: 0, software: 0, favorites: 0 }
  let continueCourse: { title: string; slug: string } | null = null

  if (!showAdminUI) {
    const [
      { count: enrollmentsCount },
      { count: softwareCount },
      { count: favoritesCount },
      { data: enrollments },
    ] = await Promise.all([
      supabase.from('enrollments').select('user_id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('software_products').select('id', { count: 'exact', head: true }).eq('is_published', true),
      supabase.from('favorites').select('user_id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase
        .from('enrollments')
        .select('courses!inner(title, slug)')
        .eq('user_id', user.id)
        .eq('courses.is_published', true)
        .order('created_at', { ascending: false })
        .limit(1),
    ])

    const { featuredSoftware: featured } = await getDashboardFeatured()
    featuredSoftware = featured
    stats = { courses: enrollmentsCount || 0, software: softwareCount || 0, favorites: favoritesCount || 0 }

    const first = (enrollments?.[0]?.courses ?? null) as { title: string; slug: string } | { title: string; slug: string }[] | null
    if (first && !Array.isArray(first)) continueCourse = { title: first.title, slug: first.slug }
  }

  /* ================= ADMIN DASHBOARD ================= */
  if (showAdminUI) {
    return (
      <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto mb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-[var(--radius)] bg-ink-900 text-white shadow-[var(--shadow-hero)] p-8 md:p-12">
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-ink-500/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modo Administrador</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-editorial flex items-center gap-3">
                Panel de Control <Shield className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </h1>
              <p className="text-ink-300 text-base md:text-lg font-medium leading-relaxed">Vista general del rendimiento y contenido del campus.</p>
            </div>
          </div>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Alumnos Registrados', value: adminStats.users, icon: Users, tone: 'text-primary bg-coral-100' },
            { label: 'Cursos Creados', value: adminStats.courses, icon: BookOpen, tone: 'text-indigo-600 bg-indigo-100' },
            { label: 'Sintetizadores', value: adminStats.products, icon: Cpu, tone: 'text-ink-700 bg-ink-100' },
            { label: 'Expansiones y Archivos', value: adminStats.items, icon: Download, tone: 'text-emerald-600 bg-emerald-100' },
          ].map(({ label, value, icon: Icon, tone }) => (
            <StaggerItem key={label}>
              <Card hover className="p-6 flex flex-col gap-2">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${tone}`}><Icon className="w-6 h-6" /></div>
                <div className="mt-2">
                  <span className="font-display text-4xl font-semibold tracking-editorial text-ink-900">{value}</span>
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mt-1">{label}</p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/admin/courses" className="glass-card glass-card-hover p-6 rounded-[var(--radius)]">
            <h3 className="text-lg font-bold text-ink-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Gestionar Cursos
            </h3>
            <p className="text-sm font-medium text-ink-500 mt-2">Crea módulos, sube lecciones y organiza el contenido educativo.</p>
          </Link>
          <Link href="/admin/software" className="glass-card glass-card-hover p-6 rounded-[var(--radius)]">
            <h3 className="text-lg font-bold text-ink-900 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> Gestionar Software
            </h3>
            <p className="text-sm font-medium text-ink-500 mt-2">Sube instaladores, expansiones y librerías conectadas a Google Drive.</p>
          </Link>
        </div>
      </div>
    )
  }

  /* ================= STUDENT DASHBOARD (LAUNCHPAD) ================= */
  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-14 max-w-6xl mx-auto mb-20">
      {/* Hero Pearl */}
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink-900 text-white shadow-[var(--shadow-hero)]">
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <div className="absolute top-0 right-0 w-[70%] h-[60%] bg-coral-500/30 rounded-full blur-[110px] -translate-y-1/4 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-[55%] h-[65%] bg-ink-400/25 rounded-full blur-[130px] translate-y-1/4 -translate-x-1/4" />
            <div className="absolute right-[8%] top-[12%] text-white/10 rotate-12"><Cpu size={130} strokeWidth={1} /></div>
            <div className="absolute right-[24%] top-[4%] text-primary/25 -rotate-12 animate-float"><Sliders size={80} strokeWidth={1} /></div>
            <div className="absolute right-[-4%] bottom-[6%] text-white/10 rotate-45"><MonitorPlay size={100} strokeWidth={1} /></div>
            <div className="absolute right-[22%] bottom-[22%] text-ink-300/20 -rotate-6"><Speaker size={90} strokeWidth={1} /></div>
          </div>

          <div className="relative z-10 p-8 md:p-12 lg:p-16 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-200 backdrop-blur">
              <Sparkles className="w-4 h-4" />
              <span>Nautic Campus</span>
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold tracking-editorial leading-[1.05]">
              {continueCourse ? 'Continúa donde lo dejaste.' : `Hola, ${userName}.`}
            </h1>

            <p className="text-ink-200 text-base md:text-lg font-medium leading-relaxed max-w-xl">
              {continueCourse
                ? `Tu último programa “${continueCourse.title}” te espera. Un bloque más esta semana basta para mantener el ritmo.`
                : 'Explora el software, aprende a tu ritmo y lleva tu música un paso más allá.'}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {continueCourse ? (
                <Link href={`/courses/${continueCourse.slug}`} className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-white font-bold text-sm shadow-[0_14px_32px_-8px_rgba(255,98,19,0.7)] hover:bg-primary/95 active:scale-[0.98] transition-all">
                  <PlayCircle className="w-5 h-5" /> Reanudar clase
                </Link>
              ) : (
                <Link href="/academy" className="inline-flex items-center gap-2 h-12 px-7 rounded-full bg-primary text-white font-bold text-sm shadow-[0_14px_32px_-8px_rgba(255,98,19,0.7)] hover:bg-primary/95 active:scale-[0.98] transition-all">
                  <PlayCircle className="w-5 h-5" /> Explorar programas
                </Link>
              )}
              <Link href="/software" className="inline-flex items-center gap-2 h-12 px-7 rounded-full border border-white/25 text-white font-bold text-sm hover:bg-white/10 transition-colors">
                <Package className="w-5 h-5" /> Software
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
      {/* Stats */}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Programas cursando', value: stats.courses, icon: BookOpen },
          { label: 'Software disponible', value: stats.software, icon: Cpu },
          { label: 'Favoritos', value: stats.favorites, icon: Heart },
        ].map(({ label, value, icon: Icon }) => (
          <StaggerItem key={label}>
            <Card className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-coral-100 text-primary flex items-center justify-center"><Icon className="w-6 h-6" /></div>
              <div>
                <span className="font-display text-4xl font-semibold tracking-editorial text-ink-900">{value}</span>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGroup>

      {/* Destacados */}
      {featuredSoftware.length > 0 && (
        <div className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-editorial text-ink-900">Destacados del estudio</h2>
            <Link href="/software" className="text-sm font-bold text-primary inline-flex items-center gap-1.5 hover:gap-2.5 transition-all">
              Ver todo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredSoftware.slice(0, 3).map((s) => (
              <StaggerItem key={s.slug}>
                <Link href={`/software/${s.slug}`} className="glass-card glass-card-hover rounded-[var(--radius)] p-6 block">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-ink-100 text-ink-700 flex items-center justify-center"><Cpu className="w-6 h-6" /></div>
                    <ArrowRight className="w-5 h-5 text-sand-400 group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-bold text-ink-900 text-base leading-snug">{s.name}</h3>
                  <p className="text-sm font-medium text-ink-500 mt-1.5 line-clamp-2">{s.description}</p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      )}

      {/* Roadmap mini */}
      <div className="space-y-5">
        <h3 className="font-display text-2xl font-semibold tracking-editorial text-ink-900">Tu camino en el campus</h3>
        <Card className="p-8 md:p-10 relative overflow-hidden">
          <div className="hidden md:block absolute top-9 left-[10%] right-[10%] h-[3px] bg-sand-200 z-0 rounded-full" />
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { n: 1, label: 'Explora Software', icon: CheckCircle2, active: true },
              { n: 2, label: 'Descarga Plugins', icon: Download },
              { n: 3, label: 'Comienza el Curso', icon: PlayCircle },
              { n: 4, label: 'Domina tu Sonido', icon: Trophy },
            ].map(({ n, label, icon: Icon, active }) => (
              <div key={n} className="flex flex-col items-center text-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-primary text-white shadow-[0_8px_18px_-4px_rgba(255,98,19,0.5)]' : 'bg-white border-2 border-sand-300 text-ink-300'}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className={`text-[11px] font-bold uppercase tracking-widest mb-0.5 ${active ? 'text-primary' : 'text-ink-400'}`}>Paso {n}</p>
                  <p className={`text-sm font-bold ${active ? 'text-ink-900' : 'text-ink-600'}`}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <WaveDivider className="text-coral-100" />
    </div>
  )
}
