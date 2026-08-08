import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Dominios desde los que está permitido servir descargas. Cualquier otra URL
// almacenada en `software_items.download_url` se rechaza: evita que un admin
// despistado (o una fila corrupta) redirija al usuario a un dominio arbitrario.
const ALLOWED_DOWNLOAD_HOSTS = new Set([
  'drive.google.com',
  'docs.google.com',
  'googledrive.com',
  'googleusercontent.com',
])

function isAllowedDownloadUrl(rawUrl: string): boolean {
  try {
    const url = new URL(rawUrl)
    if (url.protocol !== 'https:') return false

    const host = url.hostname.toLowerCase()
    return [...ALLOWED_DOWNLOAD_HOSTS].some(
      allowed => host === allowed || host.endsWith(`.${allowed}`)
    )
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const itemId = searchParams.get('id')

  if (!itemId) {
    return NextResponse.json({ error: 'ID de archivo requerido' }, { status: 400 })
  }

  // 1. Autenticación: usuario con sesión y cuenta activa.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', request.url)
    return NextResponse.redirect(loginUrl)
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.status !== 'active') {
    return new NextResponse('Tu cuenta no está activa.', { status: 403 })
  }

  // 2. Solo servimos items publicados y cuyo producto padre también lo esté.
  //    La lectura usa la sesión del usuario: RLS ya filtra `is_published`,
  //    así que si el item no es visible para él, la query devuelve vacío.
  const { data: item, error } = await supabase
    .from('software_items')
    .select('download_url, is_published, product:software_products!inner(is_published)')
    .eq('id', itemId)
    .eq('is_published', true)
    .eq('software_products.is_published', true)
    .single()

  if (error || !item || !item.download_url) {
    return NextResponse.json({ error: 'Archivo no encontrado' }, { status: 404 })
  }

  if (!isAllowedDownloadUrl(item.download_url)) {
    console.error(`[download] URL no permitida para el item ${itemId}: ${item.download_url}`)
    return NextResponse.json({ error: 'La ubicación de esta descarga no es válida.' }, { status: 502 })
  }

  return NextResponse.redirect(item.download_url)
}
