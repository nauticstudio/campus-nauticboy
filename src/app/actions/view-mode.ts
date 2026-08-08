'use server'

import { cookies } from 'next/headers'
import { isProduction } from '@/lib/supabase/server'

const VIEW_MODE_COOKIE = 'admin_view_mode'

export async function setAdminViewMode(mode: 'admin' | 'student') {
  // Esta cookie solo guarda una preferencia visual, nunca concede permisos:
  // la autorización real se hace en cada page/action a través de los guards.
  // Aun así la endurecemos para que no pueda leerla JS ni viajar por HTTP.
  const cookieStore = await cookies()
  cookieStore.set(VIEW_MODE_COOKIE, mode, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 60 * 60 * 24 * 30, // 30 días
  })
}

export async function getAdminViewMode() {
  const cookieStore = await cookies()
  return cookieStore.get(VIEW_MODE_COOKIE)?.value as 'admin' | 'student' | undefined
}
