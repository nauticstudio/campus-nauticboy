import { NextResponse } from 'next/server'
import { checkUser } from '@/server/auth/guards'
import { getAccessToken } from '@/lib/google-drive/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 1. Autenticación centralizada: sin sesión no hay descarga.
  const auth = await checkUser()
  if (!auth.ok) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { supabase, user } = auth

  // 2. El recurso lo lee la sesión del usuario: RLS decide si puede verlo.
  const { data: resource, error: dbError } = await supabase
    .from('resources')
    .select('*')
    .eq('id', id)
    .single()

  if (dbError || !resource) {
    return NextResponse.json({ error: 'Resource not found' }, { status: 404 })
  }

  // 3. Control de acceso a recursos restringidos (defensa en profundidad:
  //    RLS ya filtra, aquí lo comprobamos explícitamente solo si está marcado).
  if (resource.is_restricted) {
    const { data: hasAccess } = await supabase.rpc('user_can_access_resource', {
      p_user_id: user.id,
      p_resource_id: resource.id
    })

    if (!hasAccess) {
      return NextResponse.json({ error: 'Access denied to this restricted resource' }, { status: 403 })
    }
  }

  // 4. Si el storage_path ya es una URL completa (Google Drive, Mega, Mediafire, etc.), redirigir directamente
  if (resource.storage_path && (resource.storage_path.startsWith('http://') || resource.storage_path.startsWith('https://'))) {
    return NextResponse.redirect(resource.storage_path, 302)
  }

  // 5. Si es un ID de Google Drive, intentar descargar stream o redirigir
  if (resource.storage_path) {
    try {
      const accessToken = await getAccessToken()
      const driveUrl = `https://www.googleapis.com/drive/v3/files/${resource.storage_path}?alt=media`
      
      const driveResponse = await fetch(driveUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })

      if (driveResponse.ok) {
        const headers = new Headers()
        headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(resource.file_name)}"`)
        headers.set('Content-Type', driveResponse.headers.get('Content-Type') || 'application/octet-stream')
        
        if (resource.file_size) {
          headers.set('Content-Length', resource.file_size.toString())
        }

        return new NextResponse(driveResponse.body, {
          status: 200,
          headers
        })
      }
    } catch (error) {
      console.warn('[Download] Fallback to direct Drive link:', error)
    }

    // Fallback: Redirección directa al archivo de Google Drive
    return NextResponse.redirect(`https://drive.google.com/file/d/${resource.storage_path}/view`, 302)
  }

  return NextResponse.json({ error: 'Recurso sin enlace de descarga válido.' }, { status: 400 })
}
