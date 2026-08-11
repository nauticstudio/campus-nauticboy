'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Search,
  Package,
  Heart,
  Menu,
  Music2,
  Library,
  FolderTree,
  BookOpen,
  BarChart3,
  Bell,
  Shield,
  LogOut,
  Users,
  Sliders,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { logout } from '@/lib/actions/auth'
import { ViewModeSwitcher } from './ViewModeSwitcher'

interface BottomNavProps {
  isAdmin?: boolean
  currentViewMode?: 'admin' | 'student'
  userName?: string
  enrolledCourses?: { title: string; slug: string }[]
  hasPlantillas?: boolean
  hasPresets?: boolean
  hasAnnouncements?: boolean
  hasSoftware?: boolean
  hasProgress?: boolean
}

export function BottomNav({
  isAdmin = false,
  currentViewMode = 'student',
  userName = 'Alumno',
  enrolledCourses = [],
  hasPlantillas = false,
  hasPresets = false,
  hasAnnouncements = false,
  hasSoftware = false,
  hasProgress = false,
}: BottomNavProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const NavItem = ({
    href,
    icon: Icon,
    label,
    onClick,
  }: {
    href?: string
    icon: any
    label: string
    onClick?: () => void
  }) => {
    const isActive = href
      ? pathname === href || (pathname.startsWith(href + '/') && href !== '/dashboard')
      : false

    const content = (
      <div
        className={`relative flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 ${
          isActive
            ? 'bg-coral-500/15 text-coral-400 font-bold shadow-[0_0_12px_rgba(255,98,19,0.15)] border border-coral-500/30'
            : 'text-ink-300 hover:text-ink-100 hover:bg-ink-800/60 font-medium'
        }`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-coral-400' : ''}`} strokeWidth={isActive ? 2.3 : 1.8} />
        <span className="text-xs tracking-tight">{label}</span>
        {isActive && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-coral-500 shadow-[0_0_6px_#ff6213]" />
        )}
      </div>
    )

    if (onClick) {
      return (
        <button onClick={onClick} className="outline-none flex-shrink-0 group">
          {content}
        </button>
      )
    }

    return (
      <Link href={href || '#'} className="outline-none flex-shrink-0 group">
        {content}
      </Link>
    )
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] w-auto">
      <nav className="bg-ink-950/85 backdrop-blur-2xl border border-ink-800/80 shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_25px_rgba(255,98,19,0.06)] rounded-full p-1.5 flex items-center gap-1 sm:gap-1.5 overflow-x-auto custom-scrollbar">
        {/* Links principales */}
        <NavItem href={isAdmin && currentViewMode === 'admin' ? '/dashboard' : '/academy'} icon={Home} label="Inicio" />
        <NavItem
          icon={Search}
          label="Buscar"
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-menu'))}
        />
        <NavItem href="/academy/plugins" icon={Package} label="Plugins" />
        <NavItem href="/favorites" icon={Heart} label="Favoritos" />

        <div className="h-6 w-[1px] bg-ink-800/80 mx-1 shrink-0" />

        {/* Menú Drawer Adicional */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="outline-none flex-shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-200 text-ink-300 hover:text-white hover:bg-ink-800/60 font-medium">
              <Menu className="w-4 h-4 shrink-0" strokeWidth={1.8} />
              <span className="text-xs tracking-tight">Menú</span>
            </div>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[85vh] md:h-[75vh] max-w-lg mx-auto rounded-t-[2.5rem] p-6 bg-ink-950/95 backdrop-blur-3xl flex flex-col gap-6 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] border-t border-ink-800/80 text-ink-100"
          >
            <SheetHeader className="text-left border-b border-ink-800/70 pb-4">
              <SheetTitle className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-coral-600 to-coral-400 p-0.5 shadow-lg shadow-coral-500/20">
                  <div className="w-full h-full bg-ink-950 rounded-[14px] flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-coral-500" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink-50 text-xl tracking-tight">
                    Hola, {userName}
                  </h3>
                  <p className="text-xs font-semibold text-coral-400 tracking-wider uppercase mt-0.5 flex items-center gap-1.5">
                    {isAdmin ? (
                      <>
                        <Shield className="w-3.5 h-3.5" /> Administrador Fundador
                      </>
                    ) : (
                      'Alumno Pro'
                    )}
                  </p>
                </div>
              </SheetTitle>
              <SheetDescription className="sr-only">Menú de navegación adicional</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6 pb-4">
              {/* Sección Admin (panel compacto para mobile/drawer) */}
              {isAdmin && (
                <div className="space-y-3 p-4 rounded-2xl bg-ink-900/60 border border-coral-500/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold text-coral-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Modo de Vista
                    </h4>
                    <ViewModeSwitcher initialMode={currentViewMode} />
                  </div>
                  
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <Link
                      href="/admin/users"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-ink-800/50 hover:bg-ink-800 text-ink-200 text-xs font-semibold border border-ink-700/50"
                    >
                      <Users className="w-4 h-4 text-coral-400" />
                      <span>Usuarios</span>
                    </Link>
                    <Link
                      href="/admin/categories"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-ink-800/50 hover:bg-ink-800 text-ink-200 text-xs font-semibold border border-ink-700/50"
                    >
                      <Sliders className="w-4 h-4 text-coral-400" />
                      <span>Categorías</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Programas */}
              {enrolledCourses.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                    Mis Cursos
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {enrolledCourses.map((course) => (
                      <Link
                        key={course.slug}
                        href={`/courses/${course.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-ink-900/50 hover:bg-ink-900 border border-ink-800/60 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ink-800 text-coral-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-ink-100 group-hover:text-white transition-colors text-sm">
                          {course.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Extras de Academia */}
              {(hasPlantillas || hasPresets) && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                    Recursos & Extras
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {hasPlantillas && (
                      <Link
                        href="/academy/plantillas"
                        onClick={() => setMenuOpen(false)}
                        className="flex flex-col items-center text-center gap-2 p-3.5 rounded-2xl bg-ink-900/50 border border-ink-800/60 hover:border-coral-500/40 hover:bg-ink-900 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center text-coral-400">
                          <Library className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-ink-200 text-xs">Plantillas</span>
                      </Link>
                    )}
                    {hasPresets && (
                      <Link
                        href="/academy/presets"
                        onClick={() => setMenuOpen(false)}
                        className="flex flex-col items-center text-center gap-2 p-3.5 rounded-2xl bg-ink-900/50 border border-ink-800/60 hover:border-coral-500/40 hover:bg-ink-900 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ink-800 flex items-center justify-center text-coral-400">
                          <FolderTree className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-ink-200 text-xs">Presets</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Personal */}
              {(hasProgress || hasAnnouncements) && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                    Mi Espacio
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {hasProgress && (
                      <Link
                        href="/progress"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-ink-900/50 hover:bg-ink-900 border border-ink-800/60 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ink-800 text-coral-400 flex items-center justify-center">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-ink-100 text-sm">Mi Progreso</span>
                      </Link>
                    )}
                    {hasAnnouncements && (
                      <Link
                        href="/updates"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-ink-900/50 hover:bg-ink-900 border border-ink-800/60 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ink-800 text-coral-400 flex items-center justify-center">
                          <Bell className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-ink-100 text-sm">Novedades</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-ink-800/70 mt-auto">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-rose-400 bg-rose-950/30 border border-rose-900/40 hover:bg-rose-950/60 transition-colors group text-sm"
                >
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Cerrar sesión
                </button>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}
