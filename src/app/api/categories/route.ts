import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/categories — subconjunto de categorías para el CommandMenu (⌘K).
 * Solo lo necesario para linkear rápido: nombre + slug, orden editorial.
 */
export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('sort_order', { ascending: true })
    .limit(6)

  if (error) return NextResponse.json({ categories: [] }, { status: 500 })
  return NextResponse.json({ categories: data ?? [] })
}
