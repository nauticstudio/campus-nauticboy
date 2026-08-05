import { createClient } from '@/lib/supabase/server'
import { AdminResourcesClient } from './AdminResourcesClient'

export default async function AdminResourcesPage() {
  const supabase = await createClient()

  const { data: resources } = await supabase
    .from('resources')
    .select('id, title, file_name, storage_path, is_restricted, is_published, category_id')
    .order('created_at', { ascending: false })

  return <AdminResourcesClient initialResources={resources || []} />
}
