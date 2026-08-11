import { requireUser } from '@/server/auth/guards'
import { ProfileFormClient } from './ProfileFormClient'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const { user, profile } = await requireUser()

  return (
    <ProfileFormClient
      initialFullName={profile?.full_name ?? ''}
      initialEmail={user.email ?? ''}
      role={profile?.role ?? 'student'}
    />
  )
}
