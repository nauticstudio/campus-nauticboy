import { createClient, createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/layout/BottomNav'
import { CommandMenu } from '@/components/layout/CommandMenu'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Use admin client to bypass RLS infinite recursion bug in profiles table
  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  const userName = profile?.full_name || user.email?.split('@')[0] || 'Alumno'

  // Fetch View Mode (Admin only setting, defaults to 'admin' if they are an admin)
  const { getAdminViewMode } = await import('@/app/actions/view-mode')
  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  
  // Si no es admin, SIEMPRE el viewMode es student
  if (!isAdmin) currentViewMode = 'student'

  // El booleano que determina si debemos MOSTRAR las interfaces de admin
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // Fetch enrolled courses for the sidebar
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('courses!inner(title, slug)')
    .eq('user_id', user.id)
    .eq('courses.is_published', true)

  const enrolledCourses = enrollments
    ?.map(e => e.courses)
    .filter(Boolean) as unknown as { title: string, slug: string }[] | undefined

  // Import ViewModeSwitcher dynamically if we are an admin
  const { ViewModeSwitcher } = await import('@/components/layout/ViewModeSwitcher')

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
    isAdmin: showAdminUI,
    userName: userName,
    enrolledCourses: enrolledCourses || [],
    hasPlantillas: (plantillasRes.count || 0) > 0,
    hasPresets: (presetsRes.count || 0) > 0,
    hasAnnouncements: (announcementsRes.count || 0) > 0,
    hasSoftware: (softwareRes.count || 0) > 0,
    hasProgress: (enrolledCourses?.length || 0) > 0
  }

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900 relative overflow-x-hidden">
      
      {/* Premium Light Ambient Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none z-0 animate-pulse-subtle" />
      <div className="fixed top-1/3 -right-40 w-[30rem] h-[30rem] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Admin View Mode Switcher (Global Floating Toggle) */}
      {isAdmin && currentViewMode && (
        <ViewModeSwitcher initialMode={currentViewMode} />
      )}

      {/* Floating Bottom Nav */}
      <BottomNav {...sidebarProps} />

      <div className="flex flex-col flex-1 min-w-0 z-10 w-full">
        {/* Main Content Area */}
        <main className="flex-1 w-full relative pb-28 md:pb-32">
          {children}
        </main>
      </div>

      {/* Global Cmd+K Menu */}
      <CommandMenu />
    </div>
  )
}
