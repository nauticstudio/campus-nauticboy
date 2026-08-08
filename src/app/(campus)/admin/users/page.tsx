import { requireAdmin } from '@/server/auth/guards'
import { AdminUsersClient } from './AdminUsersClient'

export default async function AdminUsersPage() {
  // La página de gestión de usuarios solo existe para administradores:
  // la barrera de seguridad está en el servidor, no en la UI.
  const { supabase } = await requireAdmin()

  // La lectura va con la sesión del usuario: RLS permite ver todos los
  // perfiles únicamente a administradores (migración 00001).
  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, status, created_at')
    .order('created_at', { ascending: false })

  return <AdminUsersClient initialUsers={users || []} />
}
