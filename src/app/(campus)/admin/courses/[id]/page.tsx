import { createClient, createAdminClient } from '@/lib/supabase/server'
import { CourseEditor } from '@/components/admin/CourseEditor'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function AdminCourseEditorPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const supabase = await createClient()

  // Verify auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify admin role using admin client (bypassing RLS infinite recursion)
  const adminSupabase = await createAdminClient()
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch course using admin client
  const { data: course, error } = await adminSupabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !course) {
    console.error('Error fetching course in [id]/page.tsx:', error, 'Course:', course, 'ID:', id)
    return notFound()
  }

  // Fetch modules using admin client
  const { data: modules } = await adminSupabase
    .from('modules')
    .select('*')
    .eq('course_id', id)
    .order('sort_order', { ascending: true })

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-8">
      <Link href="/admin/courses" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver a Cursos
      </Link>
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{course.title}</h1>
        <p className="text-sm font-semibold text-slate-500 mt-1">Editor de Módulos y Clases</p>
      </div>

      <div className="glass-card rounded-3xl p-6 lg:p-8">
        <CourseEditor courseId={course.id} initialModules={modules || []} />
      </div>
    </div>
  )
}
