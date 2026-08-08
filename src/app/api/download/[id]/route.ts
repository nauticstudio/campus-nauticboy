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

  try {
    // 4. Obtain short-lived Google Drive Access Token
    const accessToken = await getAccessToken()

    // 5. Download stream from Google Drive API v3
    // alt=media downloads the file content
    const driveUrl = `https://www.googleapis.com/drive/v3/files/${resource.storage_path}?alt=media`
    
    const driveResponse = await fetch(driveUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!driveResponse.ok) {
      console.error('Google Drive fetch failed:', await driveResponse.text())
      return NextResponse.json({ error: 'Failed to fetch file from storage' }, { status: 502 })
    }

    // 6. Return streamed response with proper attachment headers
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

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ error: 'Internal Server Error during download' }, { status: 500 })
  }
}
