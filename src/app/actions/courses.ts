'use server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase URL or Service Role Key")
}

// Instantiate with service role to bypass RLS recursion error
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function createCourseAction(data: {
  title: string
  description: string
  software?: string
  slug: string
}) {
  try {
    const { data: newCourse, error } = await supabase
      .from('courses')
      .insert({
        title: data.title,
        description: data.description,
        software: data.software || null,
        slug: data.slug,
        is_published: false // Courses start as drafts
      })
      .select()
      .single()

    if (error) {
      console.error('Error in createCourseAction:', error)
      return { success: false, error: error.message }
    }

    return { success: true, course: newCourse }
  } catch (error: any) {
    console.error('Exception in createCourseAction:', error)
    return { success: false, error: error.message || 'Error desconocido' }
  }
}
