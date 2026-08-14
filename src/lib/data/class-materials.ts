import { requireAdmin, requireUser } from '@/server/auth/guards'

export interface ClassMaterialFile {
  id: string
  title: string
  url: string
  file_type?: string // ej: "Ableton Project (.als)", "Stems ZIP", "Serum Presets", "Audio WAV", "Guía PDF"
  file_size?: string // ej: "450 MB", "1.2 GB"
  note?: string
}

export interface ClassMaterial {
  id: string
  student_id: string
  student?: {
    id: string
    full_name: string | null
    email: string
  }
  title: string
  description: string | null
  session_date: string
  files: ClassMaterialFile[]
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface StudentOption {
  id: string
  full_name: string | null
  email: string
}

/**
 * Obtiene los materiales de clase asignados al alumno autenticado.
 * RLS se encarga de que solo pueda leer los suyos donde is_published = true.
 */
export async function getStudentClassMaterials(): Promise<ClassMaterial[]> {
  const { supabase, user } = await requireUser()

  const { data, error } = await supabase
    .from('class_materials')
    .select('id, student_id, title, description, session_date, files, is_published, created_at, updated_at')
    .eq('student_id', user.id)
    .eq('is_published', true)
    .order('session_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getStudentClassMaterials] Error:', error)
    return []
  }

  return (data || []).map((item) => ({
    ...item,
    files: Array.isArray(item.files) ? (item.files as ClassMaterialFile[]) : [],
  }))
}

/**
 * Obtiene todos los materiales de clase para el panel de administración.
 * Permite filtrar opcionalmente por alumno.
 */
export async function getAllClassMaterialsAdmin(filterStudentId?: string): Promise<ClassMaterial[]> {
  const { supabase } = await requireAdmin()

  let query = supabase
    .from('class_materials')
    .select(`
      id,
      student_id,
      title,
      description,
      session_date,
      files,
      is_published,
      created_at,
      updated_at,
      student:profiles!class_materials_student_id_fkey(id, full_name, email)
    `)
    .order('session_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (filterStudentId) {
    query = query.eq('student_id', filterStudentId)
  }

  const { data, error } = await query

  if (error) {
    console.error('[getAllClassMaterialsAdmin] Error:', error)
    return []
  }

  type RawAdminRow = {
    id: string
    student_id: string
    title: string
    description: string | null
    session_date: string
    files: unknown
    is_published: boolean
    created_at: string
    updated_at: string
    student?: {
      id: string
      full_name: string | null
      email: string
    }
  }

  return ((data || []) as unknown as RawAdminRow[]).map((item) => ({
    id: item.id,
    student_id: item.student_id,
    student: item.student,
    title: item.title,
    description: item.description,
    session_date: item.session_date,
    files: Array.isArray(item.files) ? (item.files as ClassMaterialFile[]) : [],
    is_published: item.is_published,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }))
}

/**
 * Lista de alumnos para el dropdown del modal de administración.
 */
export async function getStudentsListAdmin(): Promise<StudentOption[]> {
  const { supabase } = await requireAdmin()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .order('full_name', { ascending: true })

  if (error) {
    console.error('[getStudentsListAdmin] Error:', error)
    return []
  }

  return data || []
}
