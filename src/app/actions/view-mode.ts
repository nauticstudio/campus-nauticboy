'use server'

import { cookies } from 'next/headers'

export async function setAdminViewMode(mode: 'admin' | 'student') {
  const cookieStore = await cookies()
  cookieStore.set('admin_view_mode', mode, { path: '/' })
}

export async function getAdminViewMode() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_view_mode')?.value as 'admin' | 'student' | undefined
}
