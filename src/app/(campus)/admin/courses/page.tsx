import { createClient } from '@/lib/supabase/server'
import { AdminCoursesClient } from './AdminCoursesClient'

export default async function AdminCoursesPage() {
  const supabase = await createClient()

  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, slug, software, is_published')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching courses in admin:', error)
  }

  return <AdminCoursesClient initialCourses={courses || []} />
}
