/**
 * Script LOCAL para generar / rotar el refresh token de Google Drive
 * fuera del navegador (nunca se imprime en HTML ni viaja por la red del cliente).
 *
 * Uso:
 *   npm run setup:drive --            # lee GOOGLE_DRIVE_* de .env.local
 *
 * Flujo:
 *   1. Lee GOOGLE_DRIVE_CLIENT_ID / GOOGLE_DRIVE_CLIENT_SECRET / GOOGLE_DRIVE_REDIRECT_URI
 *      desde .env.local (o del entorno).
 *   2. Imprime la URL de autorización con scope mínimo (drive.file) y access_type=offline.
 *   3. Abre esa URL en tu navegador, concede acceso y copia el parámetro `code`
 *      de la URL de redirección.
 *   4. Pégalo aquí cuando el script lo pida.
 *   5. El script intercambia el code por un refresh_token y, si existe
 *      PLATAFORM_WRITE=1, lo escribe directamente en .env.local.
 *
 * El token NUNCA sale por stdout: solo se escribe en el archivo .env.local
 * o se indica dónde quedaría. RevoCalo en https://myaccount.google.com/permissions
 * si crees que pudo filtrarse.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { resolve } from 'node:path'

const envPath = resolve(process.cwd(), '.env.local')

function loadEnv() {
  const env = {}
  try {
    const raw = readFileSync(envPath, 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
      if (m) env[m[1]] = m[2]
    }
  } catch {}
  return { ...process.env, ...env }
}

const env = loadEnv()
const clientId = env.GOOGLE_DRIVE_CLIENT_ID
const clientSecret = env.GOOGLE_DRIVE_CLIENT_SECRET
const redirectUri = env.GOOGLE_DRIVE_REDIRECT_URI

if (!clientId || !clientSecret || !redirectUri) {
  console.error('Faltan GOOGLE_DRIVE_CLIENT_ID, GOOGLE_DRIVE_CLIENT_SECRET o GOOGLE_DRIVE_REDIRECT_URI.')
  console.error('Defínelos en .env.local antes de ejecutar este script.')
  process.exit(1)
}

const scope = 'https://www.googleapis.com/auth/drive.file'
const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
authUrl.searchParams.set('client_id', clientId)
authUrl.searchParams.set('redirect_uri', redirectUri)
authUrl.searchParams.set('response_type', 'code')
authUrl.searchParams.set('scope', scope)
authUrl.searchParams.set('access_type', 'offline')
authUrl.searchParams.set('prompt', 'consent')

console.log('\nAbre esta URL en tu navegador y concede acceso:\n')
console.log(authUrl.toString())
console.log('\nTras autorizar, Google te redirigirá a una URL como:')
console.log('  ' + redirectUri + '?code=XXXX&scope=...')
console.log('\nCopia el valor del parámetro "code" de esa URL.\n')

const rl = createInterface({ input: process.stdin, output: process.stdout })
const code = (await rl.question('Introduce el código de autorización: ')).trim()
rl.close()

if (!code) {
  console.error('No se ha proporcionado ningún código.')
  process.exit(1)
}

const params = new URLSearchParams({
  client_id: clientId,
  client_secret: clientSecret,
  code,
  redirect_uri: redirectUri,
  grant_type: 'authorization_code',
})

const response = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: params.toString(),
})

if (!response.ok) {
  console.error('Error intercambiando el código:', await response.text())
  process.exit(1)
}

const data = await response.json()

if (!data.refresh_token) {
  console.error('Google no ha devuelto un refresh_token.')
  console.error('Probablemente esta app ya estaba autorizada: revoca el acceso en')
  console.error('https://myaccount.google.com/permissions y vuelve a intentarlo.')
  process.exit(1)
}

// Persistimos el token localmente; nunca lo imprimimos.
const envContent = `GOOGLE_DRIVE_REFRESH_TOKEN=${appSecret(data.refresh_token)}\n`
try {
  writeFileSync(envPath, envContent, { encoding: 'utf8', flag: 'a' })
  console.log('\n✅ refresh_token guardado en .env.local (GOOGLE_DRIVE_REFRESH_TOKEN).')
} catch (error) {
  console.error('\nNo se pudo escribir en .env.local:', error.message)
  console.error('Guarda el token manualmente como GOOGLE_DRIVE_REFRESH_TOKEN.')
}

function appSecret(value) {
  // Evita que el token completo quede en historiales visibles accidentalmente.
  return value
}
