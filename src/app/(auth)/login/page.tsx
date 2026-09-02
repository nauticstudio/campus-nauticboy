'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { login } from '@/lib/actions/auth'
import { Music2, Mail, Loader2, ArrowRight, Waves, Sparkles } from 'lucide-react'

/** El callback de auth redirige aquí con ?error=codigo cuando el enlace falla. */
function authErrorMessage(code: string | null): string | null {
  if (!code) return null
  if (code === 'link-invalid') {
    return 'El enlace de acceso no es válido o ya fue usado. Solicita uno nuevo.'
  }
  return 'No se pudo completar el acceso. Intenta nuevamente.'
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackError = authErrorMessage(searchParams.get('error'))
  const [error, setError] = useState<string | null>(callbackError)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
    } else if (result?.success) {
      setSuccess(result.success)
    }
    setLoading(false)
  }

  return (
    <div className="w-full space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-[1.4rem] border border-coral-500/30 bg-coral-500/10">
          <Music2 className="w-8 h-8 text-coral-300" />
        </div>
        <div className="space-y-1.5">
          <h1 className="font-display text-4xl font-semibold tracking-editorial text-ink-50">
            Nautic <span className="italic text-primary">Campus</span>
          </h1>
          <p className="text-sm font-medium text-ink-300">
            Tu estudio de producción musical en la nube
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius)] p-7 sm:p-9 shadow-[var(--shadow-lift)] space-y-6">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-coral-500/10 text-coral-300 flex items-center justify-center shrink-0">
            <Waves className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-ink-50">Acceso con enlace mágico</h2>
            <p className="text-xs font-medium text-ink-300 mt-1 leading-relaxed">
              Sin contraseñas. Te enviamos un enlace de un solo uso a tu correo.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-semibold leading-relaxed" role="alert">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs font-semibold leading-relaxed" role="status">
              {success}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="email" className="text-[11px] font-bold text-ink-200 tracking-wider uppercase">
              Correo electrónico
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="alumno@ejemplo.com"
                className="w-full h-11 pl-10 pr-4 bg-[var(--surface-input)] border border-[var(--border)] rounded-xl text-base sm:text-sm font-medium text-ink-50 placeholder-ink-400 focus:outline-none focus:ring-3 focus:ring-primary/30 focus:border-primary transition-[border-color,box-shadow]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!success}
            className="w-full h-11 mt-1 bg-primary text-primary-foreground font-bold rounded-xl text-sm transition-[background-color,box-shadow,transform] duration-200 flex items-center justify-center gap-2 shadow-[var(--shadow-lift)] hover:shadow-[var(--shadow-pop)] hover:bg-primary/95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Enviando enlace…</span>
              </>
            ) : success ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>¡Enlace enviado! Revisa tu correo</span>
              </>
            ) : (
              <>
                <span>Enviarme enlace de acceso</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-xs font-medium text-ink-300">
        Plataforma exclusiva para alumnos de Nautic Boy Academy.
      </p>
    </div>
  )
}
