import { createClient, createAdminClient } from '@/lib/supabase/server'
import { AdminCoursesClient } from './AdminCoursesClient'
import { redirect } from 'next/navigation'

export default async function AdminCoursesPage() {
  const supabase = await createClient()

  // 1. Verify authenticated user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Verify admin role using admin client (bypassing RLS infinite recursion)
  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // 3. Fetch courses using admin client
  const { data: courses, error } = await adminSupabase
    .from('courses')
    .select('id, title, slug, software, is_published')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching courses in admin:', error)
  }

  return <AdminCoursesClient initialCourses={courses || []} />
}
