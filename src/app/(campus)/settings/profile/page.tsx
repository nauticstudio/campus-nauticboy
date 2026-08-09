import { requireUser } from '@/server/auth/guards'
import { ProfileEditClient } from '@/components/features/settings/ProfileEditClient'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Trash2, ShieldAlert } from 'lucide-react'
import { redirect } from 'next/navigation'

interface ProfilePageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function ProfilePage({ searchParams: _searchParams }: ProfilePageProps) {
  const { user, profile, supabase } = await requireUser()

  if (!user || !profile) {
    redirect('/login')
  }

  const isAdmin = profile.role === 'admin'

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-5xl mx-auto" data-component="settings-profile">
      {/* Encabezado */}
      <div className="space-y-2">
        <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-editorial text-ink-900">
          Ajustes de <span className="italic text-primary">Perfil</span>
        </h1>
        <p className="text-sm md:text-base font-medium text-ink-500 max-w-xl">
          Gestiona tu identidad pública y tus credenciales de acceso al campus.
        </p>
      </div>

      {/* Formulario editable */}
      <ProfileEditClient
        initialName={profile.full_name ?? ''}
        currentEmail={user.email ?? ''}
        role={profile.role}
        isAdmin={isAdmin}
      />

      {/* Danger Zone */}
      <Card className="border-red-200/70 bg-red-50/40 shadow-none">
        <CardHeader className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base text-red-900">Zona de peligro</CardTitle>
              <CardDescription className="text-red-700/80 font-medium">
                Acciones irreversibles sobre tu cuenta.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <div className="px-5 md:px-6 pb-5 md:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-200/70 bg-white">
            <div className="space-y-1">
              <p className="text-sm font-bold text-ink-900">Eliminar cuenta</p>
              <p className="text-xs font-medium text-ink-500 max-w-md leading-relaxed">
                Se borrará tu cuenta, tu progreso y tus favoritos de forma permanente.
              </p>
            </div>
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-red-300 text-red-700 text-sm font-bold bg-white opacity-60 cursor-not-allowed shrink-0"
              aria-disabled="true"
            >
              <ShieldAlert className="w-4 h-4" />
              Deshabilitado temporalmente
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}
