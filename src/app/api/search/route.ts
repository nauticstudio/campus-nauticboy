import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q || q.length < 2) {
    return NextResponse.json({ courses: [], resources: [], software: [] })
  }

  const supabase = await createClient()
  const searchTerm = `%${q}%`

  // Perform parallel fuzzy searches across different tables
  const [coursesRes, resourcesRes, softwareRes] = await Promise.all([
    supabase
      .from('courses')
      .select('id, title, slug, description')
      .eq('is_published', true)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(5),
      
    supabase
      .from('resources')
      .select('id, title, slug, category_id, categories(slug)')
      .eq('is_published', true)
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(5),
      
    supabase
      .from('software_products')
      .select('id, name, slug, description')
      .eq('is_published', true)
      .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(5)
  ])

  // Map resources to include their category slug for routing
  const mappedResources = (resourcesRes.data || []).map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    // @ts-ignore
    categorySlug: r.categories?.slug || 'general'
  }))

  return NextResponse.json({
    courses: coursesRes.data || [],
    resources: mappedResources,
    software: softwareRes.data || []
  })
}
