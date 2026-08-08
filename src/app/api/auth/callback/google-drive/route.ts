import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { requireAdmin, AuthError } from '@/server/auth/guards'
import { DRIVE_OAUTH_STATE_COOKIE } from '@/lib/google-drive/oauth'

function htmlResponse(title: string, body: string, status = 200) {
  return new NextResponse(
    `<!doctype html>
<html lang="es">
  <head><meta charset="utf-8"><title>${title}</title></head>
  <body style="font-family: ui-monospace, SFMono-Regular, Menlo, monospace; padding: 2rem; max-width: 640px; margin: 0 auto; line-height: 1.5;">
    <h2>${title}</h2>
    ${body}
  </body>
</html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

/**
 * Callback del OAuth de Google Drive.
 *
 * - Requiere sesión de administrador.
 * - Valida el `state` contra la cookie httpOnly creada al iniciar el flujo.
 * - NUNCA imprime el refresh_token en la respuesta: eso quedaría en el
 *   historial del navegador, logs y proxies. Para obtenerlo, ejecuta en
 *   local `npm run setup:drive`.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const expectedState = cookieStore.get(DRIVE_OAUTH_STATE_COOKIE)?.value

  // Invalidamos la cookie de state en cualquier caso.
  cookieStore.delete(DRIVE_OAUTH_STATE_COOKIE)

  try {
    await requireAdmin()
  } catch (error) {
    if (error instanceof AuthError) {
      return htmlResponse('Acceso denegado', `<p>${error.message}</p>`, error.code === 'UNAUTHENTICATED' ? 401 : 403)
    }
    throw error
  }

  if (!code) {
    return htmlResponse('Falta el código de autorización', '<p>Google no ha devuelto ningún <code>code</code>.</p>', 400)
  }

  if (!state || !expectedState || state !== expectedState) {
    return htmlResponse(
      'Estado OAuth no válido',
      '<p>El parámetro <code>state</code> no coincide con la sesión que inició el flujo. Posible intento de CSRF o cookie expirada. Vuelve a intentarlo desde <code>/api/auth/google-drive</code>.</p>',
      400
    )
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI

  if (!clientId || !clientSecret || !redirectUri) {
    return htmlResponse('Configuración incompleta', '<p>Faltan credenciales de Google Drive en el entorno del servidor.</p>', 500)
  }

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    code,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })

    if (!tokenResponse.ok) {
      const errorBody = await tokenResponse.text()
      console.error('[google-drive-callback] Error intercambiando code:', errorBody)
      return htmlResponse('No se pudo completar la autorización', '<p>Google ha rechazado el intercambio del código. Revisa los logs del servidor.</p>', 400)
    }

    // No leemos ni mostramos `refresh_token` aquí a propósito. El token se
    // gestiona exclusivamente fuera de banda con `npm run setup:drive`.
    return htmlResponse(
      'Autorización completada',
      `<p>Google Drive está correctamente autorizado para esta aplicación.</p>
       <p><strong>Importante:</strong> el <code>refresh_token</code> no se muestra en el navegador por seguridad.
       Si necesitas generar uno nuevo o rotarlo, ejecuta en tu máquina:</p>
       <pre style="background:#f4f4f4; padding:1rem; border-radius:8px;">npm run setup:drive</pre>
       <p>Si el token actual pudo verse alguna vez en el navegador, revócalo en
       <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>
       antes de generar el nuevo.</p>`
    )
  } catch (error) {
    console.error('[google-drive-callback] Excepción intercambiando code:', error)
    return htmlResponse('Error interno', '<p>Ha ocurrido un error inesperado. Revisa los logs del servidor.</p>', 500)
  }
}
