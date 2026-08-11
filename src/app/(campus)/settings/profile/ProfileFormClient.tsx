'use client'

import { useState } from 'react'
import { User, Mail, KeyRound, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { updateProfileNameAction, updateEmailAction, requestPasswordReset } from '@/lib/actions/auth'

interface ProfileFormClientProps {
  initialFullName: string
  initialEmail: string
  role: string
}

export function ProfileFormClient({
  initialFullName,
  initialEmail,
  role,
}: ProfileFormClientProps) {
  const [fullName, setFullName] = useState(initialFullName)
  const [email, setEmail] = useState(initialEmail)

  const [nameLoading, setNameLoading] = useState(false)
  const [nameMsg, setNameMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [emailLoading, setEmailLoading] = useState(false)
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [pwdLoading, setPwdLoading] = useState(false)
  const [pwdMsg, setPwdMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const initialLetter = (fullName || email || 'A').charAt(0).toUpperCase()

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setNameLoading(true)
    setNameMsg(null)

    const res = await updateProfileNameAction(fullName)
    setNameLoading(false)

    if (res.error) {
      setNameMsg({ type: 'error', text: res.error })
    } else {
      setNameMsg({ type: 'success', text: 'Nombre actualizado correctamente.' })
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    setEmailMsg(null)

    const res = await updateEmailAction(email)
    setEmailLoading(false)

    if (res.error) {
      setEmailMsg({ type: 'error', text: res.error })
    } else {
      setEmailMsg({
        type: 'success',
        text: res.message || 'Se ha enviado un enlace de confirmación a tu nuevo correo.',
      })
    }
  }

  const handleResetPassword = async () => {
    setPwdLoading(true)
    setPwdMsg(null)

    const formData = new FormData()
    formData.append('email', initialEmail)

    const res = await requestPasswordReset(formData)
    setPwdLoading(false)

    if (res.error) {
      setPwdMsg({ type: 'error', text: res.error })
    } else if (res.success) {
      setPwdMsg({ type: 'success', text: res.success })
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Targeta Resumen de Avatar / Datos */}
      <div className="glass-card rounded-2xl p-6 flex items-center gap-5 border border-ink-800/80 bg-ink-950/60">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-coral-500 to-coral-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-coral-500/20 shrink-0">
          {initialLetter}
        </div>
        <div className="space-y-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink-50 truncate">{fullName || 'Sin nombre'}</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-coral-500/15 text-coral-300 border border-coral-500/30">
              {role === 'admin' ? 'Administrador' : 'Alumno'}
            </span>
          </div>
          <p className="text-xs font-medium text-ink-400 truncate">{initialEmail}</p>
        </div>
      </div>

      {/* Formulario 1: Nombre de Perfil */}
      <form onSubmit={handleUpdateName} className="glass-card rounded-2xl p-6 border border-ink-800/80 bg-ink-950/60 space-y-4">
        <div className="flex items-center gap-2 text-ink-100">
          <User className="w-4 h-4 text-coral-400" />
          <h3 className="text-sm font-bold">Información Personal</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink-400 uppercase tracking-wider block">
            Nombre Completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Tu nombre completo"
            className="w-full bg-ink-900/80 border border-ink-700/60 rounded-xl px-4 py-2.5 text-xs font-semibold text-ink-50 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500/60 transition-all"
          />
        </div>

        {nameMsg && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
            nameMsg.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
          }`}>
            {nameMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{nameMsg.text}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={nameLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 active:scale-95 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-coral-500/20"
          >
            {nameLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Guardar Nombre</span>
          </button>
        </div>
      </form>

      {/* Formulario 2: Correo Electrónico */}
      <form onSubmit={handleUpdateEmail} className="glass-card rounded-2xl p-6 border border-ink-800/80 bg-ink-950/60 space-y-4">
        <div className="flex items-center gap-2 text-ink-100">
          <Mail className="w-4 h-4 text-coral-400" />
          <h3 className="text-sm font-bold">Correo Electrónico</h3>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink-400 uppercase tracking-wider block">
            Dirección de Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu.correo@ejemplo.com"
            className="w-full bg-ink-900/80 border border-ink-700/60 rounded-xl px-4 py-2.5 text-xs font-semibold text-ink-50 placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-coral-500/40 focus:border-coral-500/60 transition-all"
          />
          <p className="text-[11px] text-ink-500">
            Si cambias tu correo, te enviaremos un enlace de confirmación a la nueva dirección.
          </p>
        </div>

        {emailMsg && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
            emailMsg.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
          }`}>
            {emailMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{emailMsg.text}</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={emailLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-800 hover:bg-ink-700 active:scale-95 text-ink-100 text-xs font-bold transition-all disabled:opacity-50 border border-ink-700/60"
          >
            {emailLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Actualizar Correo</span>
          </button>
        </div>
      </form>

      {/* Formulario 3: Contraseña / Seguridad */}
      <div className="glass-card rounded-2xl p-6 border border-ink-800/80 bg-ink-950/60 space-y-4">
        <div className="flex items-center gap-2 text-ink-100">
          <KeyRound className="w-4 h-4 text-coral-400" />
          <h3 className="text-sm font-bold">Seguridad y Acceso</h3>
        </div>

        <p className="text-xs text-ink-400 leading-relaxed">
          ¿Deseas cambiar tu contraseña de acceso? Te enviaremos un enlace seguro a tu correo electrónico para definir una nueva clave.
        </p>

        {pwdMsg && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-semibold ${
            pwdMsg.type === 'success' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
          }`}>
            {pwdMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{pwdMsg.text}</span>
          </div>
        )}

        <div className="pt-2">
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={pwdLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ink-800 hover:bg-ink-700 active:scale-95 text-ink-100 text-xs font-bold transition-all disabled:opacity-50 border border-ink-700/60"
          >
            {pwdLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Solicitar Cambio de Contraseña</span>
          </button>
        </div>
      </div>
    </div>
  )
}
