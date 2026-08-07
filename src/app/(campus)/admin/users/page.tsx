import { createAdminClient } from '@/lib/supabase/server'
import { AdminUsersClient } from './AdminUsersClient'

export default async function AdminUsersPage() {
  const supabase = await createAdminClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, full_name, role, status, created_at')
    .order('created_at', { ascending: false })

  return <AdminUsersClient initialUsers={users || []} />
}
