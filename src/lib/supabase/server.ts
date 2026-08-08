import 'server-only'

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Única fuente de verdad para saber si estamos en producción.
 * Usa VERCEL_ENV en Vercel y NODE_ENV como fallback en cualquier otro entorno.
 */
export const isProduction =
  process.env.VERCEL_ENV === 'production' ||
  (process.env.VERCEL_ENV === undefined && process.env.NODE_ENV === 'production')

/**
 * Cliente Supabase con la sesión del usuario (RLS activo).
 * Para lecturas normales de la aplicación.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          // En un Server Component de solo lectura `cookies().set()` lanza:
          // lo capturamos porque la sesión ya ha sido refrescada por el
          // middleware. Comentar el catch vacío para depurar problemas de sesión.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // No estamos en un contexto donde se puedan escribir cookies.
          }
        },
      },
    }
  )
}

/**
 * ⚠️  CLIENTE ADMINISTRATIVO — bypass completo de RLS.
 *
 * NO lo uses para lecturas normales ni para construir UI. Resérvalo para
 * operaciones administrativas después de pasar por `requireAdmin()` /
 * `checkAdmin()` (src/server/auth/guards.ts). Usarlo en una lectura pública
 * expone datos privados y elimina la defensa en profundidad de la base de datos.
 */
export async function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        // Este cliente no usa cookies: cualquier request lo compartiría todo.
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}
