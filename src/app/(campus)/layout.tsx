import { requireUser } from '@/server/auth/guards'
import { BottomNav } from '@/components/layout/BottomNav'
import { CommandMenu } from '@/components/layout/CommandMenu'
import { TopBar } from '@/components/layout/TopBar'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // E3: el guard central es la única puerta de acceso. Devuelve el mismo cliente
  // memoizado que usaremos para las lecturas.
  const { user, profile, supabase } = await requireUser()

  const isAdmin = profile?.role === 'admin'
  const userName = profile?.full_name || user.email?.split('@')[0] || 'Alumno'
  const userEmail = user.email ?? ''

  // Fetch View Mode (Admin only setting, defaults to 'admin' if they are an admin)
  const { getAdminViewMode } = await import('@/app/actions/view-mode')
  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  
  // Si no es admin, SIEMPRE el viewMode es student
  if (!isAdmin) currentViewMode = 'student'

  // El booleano que determina si debemos MOSTRAR las interfaces de admin
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // Dev badge: muestra el estado real del guard para verificar RBAC sin
  // abrir DevTools. Solo se renderiza en desarrollo; nunca en producción.
  const devBadge =
    process.env.NODE_ENV === 'development' ? (
      <div
        className="fixed bottom-28 left-3 z-[70] rounded-md bg-ink-950/85 px-2.5 py-1.5 text-[11px] font-mono text-ink-200 shadow-lg backdrop-blur"
        aria-hidden
      >
        role={<span className="text-emerald-300">{profile?.role ?? 'null'}</span>}{' '}
        · mode=<span className="text-amber-300">{currentViewMode}</span>{' '}
        · adminUI=<span className={showAdminUI ? 'text-emerald-300' : 'text-red-400'}>
          {String(showAdminUI)}
        </span>
      </div>
    ) : null

  // Fetch enrolled courses for the sidebar
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('courses!inner(title, slug)')
    .eq('user_id', user.id)
    .eq('courses.is_published', true)

  const enrolledCourses = enrollments
    ?.map(e => e.courses)
    .filter(Boolean) as unknown as { title: string, slug: string }[] | undefined

  // Fetch Category IDs for Plantillas and Presets
  const { data: categories } = await supabase
    .from('categories')
    .select('id, slug')
    .in('slug', ['plantillas', 'presets'])
    
  const plantillasId = categories?.find(c => c.slug === 'plantillas')?.id
  const presetsId = categories?.find(c => c.slug === 'presets')?.id

  // Fetch Content Availability for Sidebar
  const [
    plantillasRes,
    presetsRes,
    announcementsRes,
    softwareRes
  ] = await Promise.all([
    plantillasId ? supabase.from('resources').select('id', { count: 'exact', head: true }).eq('category_id', plantillasId).eq('is_published', true) : Promise.resolve({ count: 0 }),
    presetsId ? supabase.from('resources').select('id', { count: 'exact', head: true }).eq('category_id', presetsId).eq('is_published', true) : Promise.resolve({ count: 0 }),
    supabase.from('announcements').select('id', { count: 'exact', head: true }),
    supabase.from('software_products').select('id', { count: 'exact', head: true }).eq('is_published', true)
  ])

  const sidebarProps = {
    isAdmin: isAdmin,
    currentViewMode: currentViewMode,
    userName: userName,
    enrolledCourses: enrolledCourses || [],
    hasPlantillas: (plantillasRes.count || 0) > 0,
    hasPresets: (presetsRes.count || 0) > 0,
    hasAnnouncements: (announcementsRes.count || 0) > 0,
    hasSoftware: (softwareRes.count || 0) > 0,
    hasProgress: (enrolledCourses?.length || 0) > 0
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground relative overflow-x-hidden">

      {/* Luz ambiental NAUTIC v3 */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-coral-500/8 rounded-full blur-3xl pointer-events-none z-0 animate-pulse-subtle" />
      <div className="fixed top-1/3 -right-40 w-[30rem] h-[30rem] bg-ink-800/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="grain-overlay fixed inset-0 z-0" />

      {/* Navegación flotante unificada en la parte inferior */}
      <BottomNav {...sidebarProps} />

      <div className="flex flex-col flex-1 min-w-0 z-10 w-full">
        {/* TopBar editorial (desktop) */}
        <TopBar userName={userName} userEmail={userEmail} isAdmin={isAdmin} currentViewMode={currentViewMode} />

        {/* Main Content Area */}
        <main className="flex-1 w-full relative pb-28 md:pb-32">
          {children}
        </main>
      </div>

      {/* Global Cmd+K Menu */}
      <CommandMenu />

      {/* Dev-only RBAC badge */}
      {devBadge}
    </div>
  )
}
