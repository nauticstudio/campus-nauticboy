'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Search,
  Heart,
  Menu,
  Music2,
  BookOpen,
  BarChart3,
  Bell,
  Shield,
  LogOut,
  Users,
  Sliders,
  FolderDown,
  Package,
  AudioLines,
  Folder,
  FolderTree,
  Waves,
  FileText,
  Play,
  Sparkles,
  Flame,
  type LucideIcon,
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

export interface PublishedCategoryNav {
  id: string
  name: string
  slug: string
  icon?: string | null
  icon_url?: string | null
}

interface BottomNavProps {
  isAdmin?: boolean
  currentViewMode?: 'admin' | 'student'
  userName?: string
  enrolledCourses?: { title: string; slug: string }[]
  publishedCategories?: PublishedCategoryNav[]
  hasAnnouncements?: boolean
  hasProgress?: boolean
  hasClassMaterials?: boolean
}

const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  plugins: Package,
  daws: AudioLines,
  'audio-lines': AudioLines,
  plantillas: Folder,
  templates: Folder,
  presets: FolderTree,
  samples: Waves,
  waves: Waves,
  pdfs: FileText,
  videos: Play,
  cheatsheets: Sparkles,
  desafios: Flame,
}

function getCategoryIcon(slug: string, iconName?: string | null): LucideIcon {
  if (iconName && CATEGORY_ICON_MAP[iconName.toLowerCase()]) return CATEGORY_ICON_MAP[iconName.toLowerCase()]
  if (slug && CATEGORY_ICON_MAP[slug.toLowerCase()]) return CATEGORY_ICON_MAP[slug.toLowerCase()]
  return Package
}

interface BottomNavItemProps {
  pathname: string
  href?: string
  icon: LucideIcon
  label: string
  onClick?: () => void
}

function BottomNavItem({ pathname, href, icon: Icon, label, onClick }: BottomNavItemProps) {
  const isActive = href
    ? pathname === href || pathname.startsWith(`${href}/`)
    : false

  const className = `relative inline-flex min-h-11 items-center gap-1.5 rounded-full px-2.5 text-xs transition-[background-color,border-color,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 sm:px-3 ${
    isActive
      ? 'border border-coral-500/30 bg-coral-500/15 font-bold text-coral-300'
      : 'border border-transparent font-medium text-ink-200 hover:bg-ink-800 hover:text-ink-50'
  }`

  const content = (
    <>
      <Icon className="size-4 shrink-0" strokeWidth={isActive ? 2.3 : 1.8} />
      <span>{label}</span>
    </>
  )

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className} aria-label={label}>
        {content}
      </button>
    )
  }

  return (
    <Link href={href ?? '/academy'} className={className} aria-current={isActive ? 'page' : undefined}>
      {content}
    </Link>
  )
}

export function BottomNav({
  isAdmin = false,
  currentViewMode = 'student',
  userName = 'Alumno',
  enrolledCourses = [],
  publishedCategories = [],
  hasAnnouncements = false,
  hasProgress = false,
  hasClassMaterials = false,
}: BottomNavProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-[calc(100%-1rem)] max-w-max -translate-x-1/2">
      <nav aria-label="Navegación principal" className="flex items-center justify-center gap-0.5 rounded-full border border-ink-800 bg-ink-950 p-1.5 shadow-[var(--shadow-pop)]">
        {isAdmin && currentViewMode === 'admin' && (
          <BottomNavItem pathname={pathname} href="/dashboard" icon={Home} label="Inicio" />
        )}
        <BottomNavItem pathname={pathname} href="/academy" icon={BookOpen} label="Academia" />
        <BottomNavItem
          pathname={pathname}
          icon={Search}
          label="Buscar"
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-menu'))}
        />

        <BottomNavItem pathname={pathname} href="/favorites" icon={Heart} label="Favoritos" />

        <div className="h-6 w-[1px] bg-ink-800/80 mx-1 shrink-0" />

        {/* Menú Drawer Adicional */}
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-transparent px-2.5 text-xs font-medium text-ink-200 transition-[background-color,border-color,color] duration-200 hover:bg-ink-800 hover:text-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 sm:px-3">
            <Menu className="size-4 shrink-0" strokeWidth={1.8} />
            <span>Menú</span>
          </SheetTrigger>

          <SheetContent
            side="bottom"
            className="h-[85vh] md:h-[75vh] max-w-lg mx-auto rounded-t-[2.5rem] p-6 bg-ink-950 flex flex-col gap-6 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] border-t border-ink-800/80 text-ink-100"
          >
            <SheetHeader className="text-left border-b border-ink-800/70 pb-4">
              <SheetTitle className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl border border-coral-500/30 bg-coral-500/10 flex items-center justify-center">
                  <Music2 className="w-6 h-6 text-coral-400" />
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
              {/* Sección Admin */}
              {isAdmin && (
                <div className="space-y-3 p-4 rounded-2xl bg-ink-900/60 border border-coral-500/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[11px] font-bold text-coral-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" /> Modo de Vista
                    </h4>
                    <ViewModeSwitcher initialMode={currentViewMode} />
                  </div>
                  
                  <div className="pt-2 grid grid-cols-3 gap-2">
                    <Link
                      href="/admin/users"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-1.5 p-2 rounded-xl bg-ink-800/50 hover:bg-ink-800 text-ink-200 text-xs font-semibold border border-ink-700/50 justify-center"
                    >
                      <Users className="w-3.5 h-3.5 text-coral-400" />
                      <span>Usuarios</span>
                    </Link>
                    <Link
                      href="/admin/categories"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-1.5 p-2 rounded-xl bg-ink-800/50 hover:bg-ink-800 text-ink-200 text-xs font-semibold border border-ink-700/50 justify-center"
                    >
                      <Sliders className="w-3.5 h-3.5 text-coral-400" />
                      <span>Categorías</span>
                    </Link>
                    <Link
                      href="/my-materials"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-1.5 p-2 rounded-xl bg-ink-800/50 hover:bg-ink-800 text-coral-300 text-xs font-semibold border border-coral-500/30 justify-center"
                    >
                      <FolderDown className="w-3.5 h-3.5 text-coral-400" />
                      <span>Materiales</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Categorías de la Academia Publicadas */}
              {publishedCategories.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                    Categorías de la Academia
                  </h4>
                  <div className="grid grid-cols-2 gap-2.5">
                    {publishedCategories.map((cat) => {
                      const Icon = getCategoryIcon(cat.slug, cat.icon)
                      const isCatActive = pathname === `/academy/${cat.slug}`
                      return (
                        <Link
                          key={cat.id}
                          href={`/academy/${cat.slug}`}
                          onClick={() => setMenuOpen(false)}
                          className={`flex items-center gap-3 p-3 rounded-2xl border transition-all group ${
                            isCatActive
                              ? 'bg-coral-500/15 border-coral-500/40 text-coral-300 shadow-sm'
                              : 'bg-ink-900/50 border-ink-800/60 hover:border-coral-500/40 hover:bg-ink-900 text-ink-200'
                          }`}
                        >
                          <div className="w-9 h-9 rounded-xl bg-ink-800 flex items-center justify-center text-coral-400 shrink-0 group-hover:scale-105 transition-transform">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-xs truncate">{cat.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Programas / Cursos */}
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

              {/* Personal */}
              {(hasProgress || hasAnnouncements || hasClassMaterials) && (
                <div className="space-y-3">
                  <h4 className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                    Mi Espacio
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {hasClassMaterials && (
                      <Link
                        href="/my-materials"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-ink-900/50 hover:bg-ink-900 border border-coral-500/20 hover:border-coral-500/40 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ink-800 text-coral-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <FolderDown className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-ink-100 group-hover:text-white transition-colors text-sm">
                            Material de Clase
                          </span>
                          <span className="text-[10px] font-semibold text-coral-400">
                            Proyectos y entregas
                          </span>
                        </div>
                      </Link>
                    )}
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
