import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { requireAdmin } from '@/server/auth/guards'
import { AuthError } from '@/server/auth/guards'
import { isProduction } from '@/lib/supabase/server'
import { DRIVE_OAUTH_STATE_COOKIE } from '@/lib/google-drive/oauth'

/**
 * Inicia el flujo OAuth de Google Drive. Solo un administrador autenticado
 * puede lanzarlo, y genera un `state` aleatorio que debe validarse en el
 * callback. El refresh token resultante se entrega mediante el script local
 * `npm run setup:drive`, nunca en el navegador.
 */
export async function GET() {
  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.code === 'UNAUTHENTICATED' ? 401 : 403 })
    }
    throw error
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Falta configuración de Google Drive en servidor.' },
      { status: 500 }
    )
  }

  // Allowlist por entorno: evita abrir el flujo OAuth contra URLs no confiadas.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const ALLOWED_URIS = new Set([
    'http://localhost:3000/api/auth/callback/google-drive',
    `${siteUrl}/api/auth/callback/google-drive`,
  ])
  if (!ALLOWED_URIS.has(redirectUri)) {
    console.error('[google-drive] redirect_uri no permitido:', redirectUri)
    return NextResponse.json(
      { error: 'redirect_uri no está en la allowlist del servidor.' },
      { status: 500 }
    )
  }

  const state = crypto.randomUUID()

  const cookieStore = await cookies()
  cookieStore.set(DRIVE_OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 10 * 60, // 10 minutos: tiempo de sobra para completar el consent.
    path: '/api/auth',
  })

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('state', state)
  // Mínimo scope necesario: solo los ficheros que la app crea/abre.
  authUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/drive.file')
  // Necesario para obtener un refresh_token.
  authUrl.searchParams.append('access_type', 'offline')
  authUrl.searchParams.append('prompt', 'consent')

  return NextResponse.redirect(authUrl.toString())
}
