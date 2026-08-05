'use client'

import { SidebarItem } from './SidebarItem'
import { Music2, Search, Home, Library, Heart, BarChart3, Bell, Users, BookOpen, Package, FolderTree, Megaphone, Settings, LogOut, Sparkles, Crown } from 'lucide-react'
import { logout } from '@/lib/actions/auth'

interface SidebarProps {
  isAdmin?: boolean
  userName?: string
}

export function Sidebar({ isAdmin = false, userName = 'Alumno' }: SidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-white/80 backdrop-blur-xl border-r border-slate-200/80 h-screen z-20 sticky top-0 hidden md:flex shadow-[4px_0_24px_-4px_rgba(15,23,42,0.03)]">
      
      {/* Brand Header */}
      <div className="h-18 flex items-center px-6 border-b border-slate-100 gap-3 group cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
            <Music2 className="w-5 h-5 text-cyan-600 group-hover:rotate-12 transition-transform duration-300" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 tracking-tight text-base group-hover:text-cyan-600 transition-colors">Nautic Campus</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-cyan-500 animate-pulse" /> Academy Pro
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3.5 custom-scrollbar space-y-6">
        {/* Core Nav */}
        <nav className="space-y-1">
          <SidebarItem href="/dashboard" icon={Home} title="Inicio" />
          <button 
            className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 hover:translate-x-1 group"
            onClick={() => {
              document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
            }}
          >
            <div className="flex items-center gap-3">
              <Search className="w-4.5 h-4.5 text-slate-400 group-hover:text-cyan-600 group-hover:rotate-12 transition-all duration-300" />
              <span>Buscar</span>
            </div>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 font-mono text-[10px] font-semibold text-slate-500 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </nav>

        {/* Dynamic Sections */}
        <div>
          <h4 className="px-3.5 mb-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Mis Cursos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
          </h4>
          <div className="space-y-1">
            <SidebarItem href="/courses/produccion-ableton" icon={BookOpen} title="Ableton Live Master" />
          </div>
        </div>

        <div>
          <h4 className="px-3.5 mb-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Academia</h4>
          <div className="space-y-1">
            <SidebarItem href="/academy/plantillas" icon={Library} title="Plantillas" />
            <SidebarItem href="/academy/presets" icon={Package} title="Presets" />
          </div>
        </div>

        <div>
          <h4 className="px-3.5 mb-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Personal</h4>
          <div className="space-y-1">
            <SidebarItem href="/favorites" icon={Heart} title="Favoritos" />
            <SidebarItem href="/progress" icon={BarChart3} title="Mi Progreso" />
            <SidebarItem href="/updates" icon={Bell} title="Novedades" />
          </div>
        </div>

        {isAdmin && (
          <div className="pt-2 border-t border-slate-100">
            <h4 className="px-3.5 mb-2.5 text-[11px] font-bold text-cyan-600 uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              Admin Panel
            </h4>
            <div className="space-y-1">
              <SidebarItem href="/admin/users" icon={Users} title="Usuarios" />
              <SidebarItem href="/admin/courses" icon={BookOpen} title="Cursos" />
              <SidebarItem href="/admin/resources" icon={Package} title="Recursos" />
              <SidebarItem href="/admin/categories" icon={FolderTree} title="Categorías" />
              <SidebarItem href="/admin/announcements" icon={Megaphone} title="Anuncios" />
            </div>
          </div>
        )}

      </div>

      {/* User Profile Footer */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-sm ${isAdmin ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-amber-500/40 relative' : 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/30'}`}>
              {isAdmin && <Crown className="w-4 h-4 absolute -top-1.5 -right-1 text-yellow-400 drop-shadow-md rotate-[15deg]" fill="currentColor" />}
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-800 line-clamp-1">{userName}</span>
              <span className={`text-[10px] font-bold ${isAdmin ? 'text-amber-600 tracking-wide' : 'text-cyan-600'}`}>{isAdmin ? 'Fundador & Admin' : 'Alumno Pro'}</span>
            </div>
          </div>
          <button 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Ajustes"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
        
        <form action={logout}>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 transition-all duration-200 border border-rose-200/50 shadow-2xs group"
          >
            <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Cerrar sesión
          </button>
        </form>
      </div>

    </aside>
  )
}
