'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, Shield, User, Users } from 'lucide-react'
import { setAdminViewMode } from '@/app/actions/view-mode'

export function ViewModeSwitcher({ initialMode }: { initialMode: 'admin' | 'student' }) {
  const [mode, setMode] = useState<'admin' | 'student'>(initialMode)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async (newMode: 'admin' | 'student') => {
    if (isPending || newMode === mode) return
    setIsPending(true)
    await setAdminViewMode(newMode)
    setMode(newMode)
    // Hard refresh para re-evaluar server components (sidebar, listados)
    window.location.reload()
  }

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-1 p-1 rounded-full bg-ink-900/95 border border-ink-700 shadow-[0_12px_40px_-8px_rgba(11,28,41,0.5)] backdrop-blur-xl">
      <div className="hidden sm:flex items-center gap-1.5 pl-3 pr-1 text-[10px] font-bold text-ink-400 uppercase tracking-widest">
        <Eye className="w-3.5 h-3.5" /> Vista
      </div>

      <button
        onClick={() => handleToggle('admin')}
        disabled={isPending}
        aria-pressed={mode === 'admin'}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          mode === 'admin'
            ? 'bg-primary text-white shadow-[0_4px_14px_-2px_rgba(255,98,19,0.55)]'
            : 'text-ink-300 hover:text-white'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        Admin
      </button>

      <button
        onClick={() => handleToggle('student')}
        disabled={isPending}
        aria-pressed={mode === 'student'}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          mode === 'student'
            ? 'bg-ink-100 text-ink-900'
            : 'text-ink-300 hover:text-white'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        Alumno
      </button>

      <Link
        href="/admin/users"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-ink-300 hover:bg-ink-800 hover:text-white transition-colors"
        aria-label="Gestionar usuarios"
      >
        <Users className="w-3.5 h-3.5" />
        <span className="hidden md:inline-block">Usuarios</span>
      </Link>
    </div>
  )
}
