'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Music2, Search } from 'lucide-react'
import { UserAvatarMenu } from './UserAvatarMenu'
import { ViewModeSwitcher } from './ViewModeSwitcher'

const CRUMB_LABELS: Record<string, string> = {
  dashboard: 'Inicio',
  academy: 'Academia',
  courses: 'Cursos',
  software: 'Software',
  favorites: 'Favoritos',
  progress: 'Progreso',
  updates: 'Novedades',
  admin: 'Admin',
  users: 'Usuarios',
  announcements: 'Anuncios',
  categories: 'Categorías',
  settings: 'Configuración',
  profile: 'Perfil',
}

function getBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  if (segments.length === 0) return []
  const crumbs = segments.slice(0, 2).map((seg, i) => ({
    label: CRUMB_LABELS[seg] ?? seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
    href: '/' + segments.slice(0, i + 1).join('/'),
  }))
  return crumbs
}

interface TopBarProps {
  userName: string
  userEmail: string
  isAdmin: boolean
  currentViewMode?: 'admin' | 'student'
}

export function TopBar({ userName, userEmail, isAdmin, currentViewMode = 'student' }: TopBarProps) {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  const homeHref = isAdmin && currentViewMode === 'admin' ? '/dashboard' : '/academy'

  return (
    <header className="sticky top-0 z-40 hidden lg:flex h-16 items-center gap-4 border-b border-ink-800/80 bg-ink-950/80 backdrop-blur-xl px-6 xl:px-10">
      {/* Marca / Logo */}
      <Link href={homeHref} className="flex items-center gap-2.5 shrink-0 group" aria-label="Nautic Campus - Inicio">
        <span className="w-8 h-8 rounded-xl bg-coral-500 text-white flex items-center justify-center shadow-[0_4px_16px_rgba(255,98,19,0.4)] group-hover:scale-105 transition-transform">
          <Music2 className="w-4 h-4" />
        </span>
        <span className="font-display font-bold text-ink-50 tracking-tight text-lg">
          Nautic <span className="text-coral-500 italic">Campus</span>
        </span>
      </Link>

      {/* Breadcrumbs de navegación */}
      {crumbs.length > 0 && (
        <nav aria-label="Navegación del campus" className="hidden xl:flex items-center gap-1 text-xs font-semibold ml-4">
          <Link href={homeHref} className="text-ink-400 hover:text-ink-200 transition-colors">Inicio</Link>
          {crumbs.filter(c => c.href !== '/dashboard').map((c, i, arr) => (
            <span key={c.href + i} className="flex items-center gap-1">
              <ChevronRight className="w-3.5 h-3.5 text-ink-600" />
              <Link
                href={c.href}
                className={i === arr.length - 1 ? 'text-coral-400 font-bold' : 'text-ink-400 hover:text-ink-200 transition-colors'}
              >
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      )}

      <div className="flex-1" />

      {/* Lupa / Cmd+K Search trigger */}
      <button
        onClick={() => document.dispatchEvent(new CustomEvent('open-command-menu'))}
        className="flex items-center gap-2.5 h-9 px-4 rounded-full border border-ink-800 bg-ink-900/60 text-ink-300 text-xs font-semibold hover:border-coral-500/50 hover:text-ink-100 hover:bg-ink-900 transition-all min-w-[200px]"
        aria-label="Buscar en el campus"
      >
        <Search className="w-3.5 h-3.5 text-coral-400" />
        <span className="flex-1 text-left">Buscar material…</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded-md border border-ink-700 bg-ink-800 px-1.5 py-0.5 text-[10px] font-mono text-ink-300">
          ⌘K
        </kbd>
      </button>

      {/* Switcher Admin integrado en TopBar (desktop) */}
      {isAdmin && (
        <div className="shrink-0">
          <ViewModeSwitcher initialMode={currentViewMode} />
        </div>
      )}

      {/* Avatar + menú de usuario */}
      <UserAvatarMenu userName={userName} userEmail={userEmail} isAdmin={isAdmin} />
    </header>
  )
}
