'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, Shield, User, Users } from 'lucide-react'
import { setAdminViewMode } from '@/app/actions/view-mode'

export function ViewModeSwitcher({ initialMode }: { initialMode: 'admin' | 'student' }) {
  const [mode, setMode] = useState<'admin' | 'student'>(initialMode)
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    if (isPending) return
    setIsPending(true)
    const newMode = mode === 'admin' ? 'student' : 'admin'
    
    await setAdminViewMode(newMode)
    setMode(newMode)
    
    // Hard refresh to re-evaluate server components (like the sidebar)
    window.location.reload()
  }

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] flex items-center p-1.5 rounded-full bg-slate-900 border border-slate-700 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-105">
      <div className="px-3 py-1 flex items-center gap-2 border-r border-slate-700">
        <Eye className="w-4 h-4 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline-block">Vista:</span>
      </div>

      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all ${
          mode === 'admin' 
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
            : 'bg-transparent text-slate-400 hover:text-slate-200'
        }`}
      >
        <Shield className="w-4 h-4" />
        Admin
      </button>

      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black transition-all ${
          mode === 'student' 
            ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' 
            : 'bg-transparent text-slate-400 hover:text-slate-200'
        }`}
      >
        <User className="w-4 h-4" />
        Alumno
      </button>

      <div className="pl-3 py-1 ml-1 flex items-center border-l border-slate-700">
        <Link 
          href="/admin/users"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-xs font-bold"
        >
          <Users className="w-4 h-4" />
          <span className="hidden sm:inline-block">Usuarios</span>
        </Link>
      </div>
    </div>
  )
}
