import { createClient } from '@/lib/supabase/server'
import { CourseEditor } from '@/components/admin/CourseEditor'
import { notFound } from 'next/navigation'
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
  if (!user) return notFound()

  // Fetch course
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !course) {
    return notFound()
  }

  // Fetch modules
  const { data: modules } = await supabase
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
