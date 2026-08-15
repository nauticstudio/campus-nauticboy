'use server'

import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/server/auth/guards'

export async function updateUserRoleAction(userId: string, newRole: 'admin' | 'student') {
  const auth = await checkAdmin()
  if (!auth.ok) return { success: false, error: auth.error }

  const { admin } = auth

  const { error } = await admin
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: 'Error al cambiar el rol del usuario.' }
  }

  revalidatePath('/admin/users')
  return { success: true, message: `Rol cambiado a ${newRole === 'admin' ? 'Administrador' : 'Alumno'}` }
}

export async function updateUserStatusAction(userId: string, newStatus: 'active' | 'suspended') {
  const auth = await checkAdmin()
  if (!auth.ok) return { success: false, error: auth.error }

  const { admin } = auth

  const { error } = await admin
    .from('profiles')
    .update({ status: newStatus })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user status:', error)
    return { success: false, error: 'Error al cambiar el estado del usuario.' }
  }

  revalidatePath('/admin/users')
  return { success: true, message: `Usuario ${newStatus === 'active' ? 'activado' : 'suspendido'}` }
}
