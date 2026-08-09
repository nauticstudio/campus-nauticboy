'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Music2, Search } from 'lucide-react'
import { UserAvatarMenu } from './UserAvatarMenu'

// Nombre legible del segmento de ruta para el breadcrumb.
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
}

export function TopBar({ userName, userEmail, isAdmin }: TopBarProps) {
  const pathname = usePathname()
  const crumbs = getBreadcrumbs(pathname)

  return (
    <header className="sticky top-0 z-40 hidden lg:flex h-16 items-center gap-4 border-b border-sand-200 bg-sand-50/80 backdrop-blur-xl px-6 xl:px-10">
      {/* Marca */}
      <Link href="/dashboard" className="flex items-center gap-2 shrink-0 group" aria-label="Nautic Campus - Inicio">
        <span className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-[0_6px_14px_-4px_rgba(255,98,19,0.5)] group-hover:scale-105 transition-transform">
          <Music2 className="w-4 h-4" />
        </span>
        <span className="font-display font-semibold text-ink-900 tracking-tight text-lg">
          Nautic <span className="text-primary italic">Campus</span>
        </span>
      </Link>

      {/* Breadcrumb */}
      {crumbs.length > 0 && (
        <nav aria-label="Migas de pan" className="hidden xl:flex items-center gap-1 text-xs font-semibold text-ink-400 ml-2">
          <Link href="/dashboard" className="hover:text-ink-700 transition-colors">Inicio</Link>
          {crumbs.filter(c => c.href !== '/dashboard').map((c, i, arr) => (
            <span key={c.href + i} className="flex items-center gap-1">
              <ChevronRight className="w-3 h-3 text-sand-400" />
              <Link
                href={c.href}
                className={i === arr.length - 1 ? 'text-ink-700' : 'hover:text-ink-700 transition-colors'}
              >
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      )}

      <div className="flex-1" />

      {/* Lupa / Cmd+K */}
      <button
        onClick={() => document.dispatchEvent(new CustomEvent('open-command-menu'))}
        className="flex items-center gap-2.5 h-9 px-3.5 rounded-full border border-sand-300 bg-white text-ink-500 text-xs font-semibold hover:border-coral-300 hover:text-ink-800 hover:shadow-[var(--shadow-card)] transition-all min-w-[180px]"
        aria-label="Buscar en el campus"
      >
        <Search className="w-4 h-4 text-ink-300" />
        <span className="flex-1 text-left">Buscar…</span>
        <kbd className="hidden md:inline-flex items-center gap-0.5 rounded-md border border-sand-200 bg-sand-100 px-1.5 py-0.5 text-[10px] font-mono text-ink-400">
          ⌘K
        </kbd>
      </button>

      {/* Avatar + menú */}
      <UserAvatarMenu userName={userName} userEmail={userEmail} isAdmin={isAdmin} />
    </header>
  )
}
