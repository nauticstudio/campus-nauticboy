import { createClient } from '@/lib/supabase/server'
import { AdminCoursesClient } from './AdminCoursesClient'

export default async function AdminCoursesPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title, slug, software, is_published')
    .order('sort_order', { ascending: true })

  return <AdminCoursesClient initialCourses={courses || []} />
}
