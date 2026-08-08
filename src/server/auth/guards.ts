import 'server-only'

import { cache } from 'react'
import { redirect } from 'next/navigation'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createAdminClient, createClient } from '@/lib/supabase/server'

/**
 * Capa única de autorización del servidor (Data Access Layer).
 *
 * Toda página, route handler y Server Action que toque datos sensibles debe
 * empezar por `requireUser()` o `requireAdmin()`. La UI NUNCA es una frontera
 * de seguridad: las Server Actions son endpoints HTTP invocables sin pasar por
 * la interfaz.
 */

export type Role = 'admin' | 'student'

export interface Profile {
  id: string
  full_name: string | null
  role: Role
  status: 'active' | 'inactive' | 'banned' | (string & {})
  email?: string
}

export type AuthErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN'

export class AuthError extends Error {
  readonly code: AuthErrorCode

  constructor(code: AuthErrorCode, message: string) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

export interface AuthSuccess {
  ok: true
  user: User
  profile: Profile | null
  supabase: SupabaseClient
}

/** Resultado discriminado para usar en Server Actions (que no pueden hacer redirect limpio). */
export type AuthResult =
  | AuthSuccess
  | { ok: false; code: AuthErrorCode; error: string }

// ---------------------------------------------------------------------------
// Helpers con React.cache: dentro de un mismo request, `getUser()` y el
// lookup del perfil se ejecutan una sola vez aunque layout + página + action
// llamen a estos guards.
// ---------------------------------------------------------------------------

const getUserClient = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
})

const getProfileForUser = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, role, status')
    .eq('id', userId)
    .single()

  return (data as Profile | null) ?? null
})

// ---------------------------------------------------------------------------
// requireUser — para páginas y route handlers (hace redirect a /login si no hay sesión).
// ---------------------------------------------------------------------------
export async function requireUser(): Promise<{
  user: User
  profile: Profile | null
  supabase: SupabaseClient
}> {
  const { supabase, user } = await getUserClient()

  if (!user) {
    redirect('/login')
  }

  const profile = await getProfileForUser(user.id)

  return { user, profile, supabase }
}

// ---------------------------------------------------------------------------
// requireAdmin — devuelve además un cliente con service role PERO solo tras
// verificar el rol. Úsalo únicamente para operaciones administrativas reales;
// para lecturas públicas usa `requireUser()` y deja que RLS haga su trabajo.
// ---------------------------------------------------------------------------
export async function requireAdmin(): Promise<{
  user: User
  profile: Profile
  supabase: SupabaseClient // client de sesión (RLS)
  admin: SupabaseClient // client service-role (solo para mutations admin)
}> {
  const { supabase, user } = await getUserClient()

  if (!user) {
    throw new AuthError('UNAUTHENTICATED', 'Debes iniciar sesión.')
  }

  const profile = await getProfileForUser(user.id)

  if (!profile || profile.role !== 'admin') {
    throw new AuthError('FORBIDDEN', 'No tienes permisos de administrador.')
  }

  const admin = await createAdminClient()

  return { user, profile, supabase, admin }
}

// ---------------------------------------------------------------------------
// Variantes "seguras" para Server Actions: no redirigen ni lanzan, devuelven
// un resultado que la action puede mapear a `{ error }` para el cliente.
// ---------------------------------------------------------------------------
export async function checkUser(): Promise<AuthResult> {
  const { supabase, user } = await getUserClient()

  if (!user) {
    return { ok: false, code: 'UNAUTHENTICATED', error: 'Debes iniciar sesión.' }
  }

  const profile = await getProfileForUser(user.id)
  return { ok: true, user, profile, supabase }
}

export async function checkAdmin(): Promise<
  | { ok: true; user: User; profile: Profile; supabase: SupabaseClient; admin: SupabaseClient }
  | { ok: false; code: AuthErrorCode; error: string }
> {
  const base = await checkUser()

  if (!base.ok) return base

  if (!base.profile || base.profile.role !== 'admin') {
    return { ok: false, code: 'FORBIDDEN', error: 'No tienes permisos de administrador.' }
  }

  const admin = await createAdminClient()
  return {
    ok: true as const,
    user: base.user,
    profile: base.profile,
    supabase: base.supabase,
    admin,
  }
}

/** Helper para traducir un AuthError en la salida estándar de una Server Action. */
export function authErrorToResponse(error: unknown): { success: false; error: string } | null {
  if (error instanceof AuthError) {
    return { success: false, error: error.message }
  }
  return null
}
