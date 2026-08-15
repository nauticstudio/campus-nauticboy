import { createClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import { CourseDetailClient } from './CourseDetailClient'
import { notFound } from 'next/navigation'

export default async function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const supabase = await createClient()

  // El layout ya garantiza la sesión. El rol lo da el guard central.
  const { profile } = await requireUser()
  const isAdmin = profile?.role === 'admin'

  const { getAdminViewMode } = await import('@/app/actions/view-mode')
  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  if (!isAdmin) currentViewMode = 'student'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // Fetch course by slug
  const { data: course } = await supabase
    .from('courses')
    .select('id, title, slug, description, software')
    .eq('slug', slug)
    .single()

  if (!course) {
    notFound()
  }

  // Fetch modules for this course
  const { data: dbModules } = await supabase
    .from('modules')
    .select('id, title, description, sort_order, is_published')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })

  const modules = (dbModules || []).map(m => ({
    id: m.id,
    title: m.title,
    description: m.description || '',
    resources: [],
    completed: false,
    is_published: m.is_published
  }))

  return (
    <CourseDetailClient 
      course={course} 
      initialModules={modules} 
      isAdmin={showAdminUI} 
    />
  )
}
