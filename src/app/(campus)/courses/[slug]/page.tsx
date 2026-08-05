import { createClient, createAdminClient } from '@/lib/supabase/server'
import { CourseDetailClient } from './CourseDetailClient'
import { notFound } from 'next/navigation'

export default async function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Get user profile role
  const { data: { user } } = await supabase.auth.getUser()
  const adminSupabase = await createAdminClient()
  const { data: profile } = user ? await adminSupabase.from('profiles').select('role').eq('id', user.id).single() : { data: null }
  const isAdmin = profile?.role === 'admin'

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
    .select('id, title, description, sort_order')
    .eq('course_id', course.id)
    .order('sort_order', { ascending: true })

  const modules = (dbModules || []).map(m => ({
    id: m.id,
    title: m.title,
    description: m.description || '',
    resources: [],
    completed: false
  }))

  return (
    <CourseDetailClient 
      course={course} 
      initialModules={modules} 
      isAdmin={isAdmin} 
    />
  )
}
