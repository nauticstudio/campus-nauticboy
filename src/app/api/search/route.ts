import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const MIN_Q = 2
const MAX_Q = 64

// Tipado explícito del embed: PostgREST devuelve `categories` como objeto
// (relación many-to-one) y el cliente JS lo infiere como array-ish.
type ResourceRow = {
  id: string
  title: string
  slug: string
  category_id: string
  categories: { slug: string } | null
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() ?? ''

  if (q.length < MIN_Q || q.length > MAX_Q) {
    return NextResponse.json({ courses: [], resources: [], software: [] })
  }

  const supabase = await createClient()
  // Evitamos caracteres especiales de la sintaxis `.or()` de PostgREST que
  // podrían alterar la query (`,` `.` `(` `)`).
  const safe = q.replace(/[,.()"]/g, ' ')
  const searchTerm = `%${safe}%`

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
  const resources = (resourcesRes.data ?? []) as unknown as ResourceRow[]
  const mappedResources = resources.map(r => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    categorySlug: r.categories?.slug ?? 'general'
  }))

  return NextResponse.json({
    courses: coursesRes.data || [],
    resources: mappedResources,
    software: softwareRes.data || []
  })
}
