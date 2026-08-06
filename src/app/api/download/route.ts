import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('id')

  if (!itemId) {
    return NextResponse.json({ error: 'ID de archivo requerido' }, { status: 400 })
  }

  // 1. Check user authentication
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirect to login if unauthenticated
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. Fetch protected download URL via Admin Client
  const adminSupabase = await createAdminClient()
  const { data: item, error } = await adminSupabase
    .from('software_items')
    .select('download_url')
    .eq('id', itemId)
    .single()

  if (error || !item || !item.download_url) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
  }

  // 3. Securely redirect to the actual file location (Google Drive)
  return NextResponse.redirect(item.download_url)
}
