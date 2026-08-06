'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createModuleAction(courseId: string, title: string, description: string, sortOrder: number) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const adminSupabase = await createAdminClient()
    
    // Verify admin
    const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('No eres administrador')

    const { data, error } = await adminSupabase
      .from('modules')
      .insert({
        course_id: courseId,
        title,
        description,
        is_published: false,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (error) throw error

    revalidatePath(`/admin/courses/${courseId}`)
    return { success: true, module: data }
  } catch (error: any) {
    console.error('Error in createModuleAction:', error)
    return { success: false, error: error.message }
  }
}

export async function updateModuleVisibilityAction(courseId: string, moduleId: string, isPublished: boolean) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const adminSupabase = await createAdminClient()
    
    // Verify admin
    const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('No eres administrador')

    const { error } = await adminSupabase
      .from('modules')
      .update({ is_published: isPublished })
      .eq('id', moduleId)

    if (error) throw error

    revalidatePath(`/admin/courses/${courseId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error in updateModuleVisibilityAction:', error)
    return { success: false, error: error.message }
  }
}

export async function updateModulesOrderAction(courseId: string, updates: { id: string, sort_order: number, course_id: string, title: string, description: string, is_published: boolean }[]) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No autorizado')

    const adminSupabase = await createAdminClient()
    
    // Verify admin
    const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') throw new Error('No eres administrador')

    const { error } = await adminSupabase
      .from('modules')
      .upsert(updates)

    if (error) throw error

    revalidatePath(`/admin/courses/${courseId}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error in updateModulesOrderAction:', error)
    return { success: false, error: error.message }
  }
}
