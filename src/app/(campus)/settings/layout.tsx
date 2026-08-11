import React from 'react'
import Link from 'next/link'
import { User, ShieldCheck } from 'lucide-react'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-5xl mx-auto space-y-8">
      {/* Settings Header */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold text-coral-400 uppercase tracking-widest flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Cuenta de Alumno
        </span>
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-50 tracking-tight">
          Configuración
        </h1>
        <p className="text-xs font-medium text-ink-400 max-w-xl">
          Gestiona la información de tu cuenta, tu nombre de perfil y tus credenciales de acceso al campus.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-ink-800/80 pb-3">
        <Link
          href="/settings/profile"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-900 border border-coral-500/30 text-coral-300 font-bold text-xs shadow-sm transition-all"
        >
          <User className="w-4 h-4 text-coral-400" />
          <span>Mi Perfil</span>
        </Link>
      </div>

      {/* Main Settings Content */}
      <main className="pt-2">{children}</main>
    </div>
  )
}
