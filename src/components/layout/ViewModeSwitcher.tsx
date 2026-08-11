'use client'

import { useState } from 'react'
import { Eye, Shield, User } from 'lucide-react'
import { setAdminViewMode } from '@/app/actions/view-mode'

export function ViewModeSwitcher({ initialMode }: { initialMode: 'admin' | 'student' }) {
  const [mode, setMode] = useState<'admin' | 'student'>(initialMode)
  const [isPending, setIsPending] = useState(false)

  const handleToggle = async (newMode: 'admin' | 'student') => {
    if (isPending || newMode === mode) return
    setIsPending(true)
    await setAdminViewMode(newMode)
    setMode(newMode)
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-1 p-1 rounded-full bg-ink-900/90 border border-ink-800/80 shadow-[0_4px_16px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div className="hidden sm:flex items-center gap-1.5 pl-2.5 pr-1 text-[10px] font-mono font-bold text-ink-400 uppercase tracking-wider">
        <Eye className="w-3 h-3 text-coral-400" />
        <span>Modo</span>
      </div>

      <button
        onClick={() => handleToggle('admin')}
        disabled={isPending}
        aria-pressed={mode === 'admin'}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
          mode === 'admin'
            ? 'bg-coral-500 text-white shadow-[0_2px_10px_rgba(255,98,19,0.4)]'
            : 'text-ink-300 hover:text-white hover:bg-ink-800/50'
        }`}
      >
        <Shield className="w-3.5 h-3.5" />
        Admin
      </button>

      <button
        onClick={() => handleToggle('student')}
        disabled={isPending}
        aria-pressed={mode === 'student'}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
          mode === 'student'
            ? 'bg-ink-700 text-white shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
            : 'text-ink-300 hover:text-white hover:bg-ink-800/50'
        }`}
      >
        <User className="w-3.5 h-3.5" />
        Alumno
      </button>
    </div>
  )
}
