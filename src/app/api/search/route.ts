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

type SoftwareRow = {
  id: string
  name: string
  slug: string
  description: string | null
  manufacturer: { slug: string } | { slug: string }[] | null
}

function relationItem<T>(relation: T | T[] | null): T | null {
  return Array.isArray(relation) ? relation[0] ?? null : relation
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
      .select('id, name, slug, description, manufacturer:software_manufacturers(slug)')
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
    categorySlug: r.categories?.slug ?? null,
    href: r.categories?.slug ? `/academy/${r.categories.slug}` : '/academy',
  }))

  const software = (softwareRes.data ?? []) as unknown as SoftwareRow[]
  const mappedSoftware = software.map(item => {
    const manufacturer = relationItem(item.manufacturer)

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      href: manufacturer ? `/software/${manufacturer.slug}/${item.slug}` : '/academy',
    }
  })

  return NextResponse.json({
    courses: (coursesRes.data ?? []).map(course => ({
      ...course,
      href: `/courses/${course.slug}`,
    })),
    resources: mappedResources,
    software: mappedSoftware,
  })
}
