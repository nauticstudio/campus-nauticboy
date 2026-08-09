'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Package, Heart, Menu, Music2, Library, FolderTree, BookOpen, BarChart3, Bell, Shield, LogOut } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { logout } from '@/lib/actions/auth'

interface BottomNavProps {
  isAdmin?: boolean
  userName?: string
  enrolledCourses?: { title: string, slug: string }[]
  hasPlantillas?: boolean
  hasPresets?: boolean
  hasAnnouncements?: boolean
  hasSoftware?: boolean
  hasProgress?: boolean
}

export function BottomNav({ 
  isAdmin = false, 
  userName = 'Alumno',
  enrolledCourses = [],
  hasPlantillas = false,
  hasPresets = false,
  hasAnnouncements = false,
  hasSoftware = false,
  hasProgress = false
}: BottomNavProps) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const NavItem = ({ href, icon: Icon, label, onClick }: { href?: string, icon: any, label: string, onClick?: () => void }) => {
    const isActive = href ? (pathname === href || (pathname.startsWith(href + '/') && href !== '/dashboard')) : false
    
    const content = (
      <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 ${isActive ? 'bg-cyan-500/10 text-primary shadow-inner' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100/50'}`}>
        <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse-subtle' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
        <span className="text-[9px] font-bold mt-1 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto md:opacity-100 md:h-auto transition-all">{label}</span>
      </div>
    )

    if (onClick) {
      return <button onClick={onClick} className="group relative outline-none flex-shrink-0">{content}</button>
    }

    return (
      <Link href={href || '#'} className="group relative outline-none flex-shrink-0">
        {content}
      </Link>
    )
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-auto md:right-auto z-50 flex items-center justify-center">
      <div className="bg-white/85 backdrop-blur-2xl border border-sand-200 shadow-[0_20px_60px_-15px_rgba(11,28,41,0.18)] rounded-3xl p-1.5 flex items-center gap-1 md:gap-2">
        <NavItem href="/dashboard" icon={Home} label="Inicio" />
        <NavItem 
          icon={Search} 
          label="Buscar" 
          onClick={() => document.dispatchEvent(new CustomEvent('open-command-menu'))} 
        />
        <NavItem href="/software" icon={Package} label="Software" />
        <NavItem href="/favorites" icon={Heart} label="Favoritos" />
        
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="group relative outline-none flex-shrink-0">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 text-slate-400 hover:text-slate-700 hover:bg-slate-100/50">
              <Menu className="w-6 h-6" strokeWidth={2} />
              <span className="text-[9px] font-bold mt-1 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto md:opacity-100 md:h-auto transition-all">Menú</span>
            </div>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] md:h-[70vh] md:max-w-md md:mx-auto rounded-t-[2.5rem] md:rounded-3xl md:mb-24 p-6 bg-white/95 backdrop-blur-3xl flex flex-col gap-6 shadow-2xl border-slate-200/50">
            <SheetHeader className="text-left border-b border-slate-100 pb-4">
              <SheetTitle className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ink-700 to-ink-900 p-0.5 shadow-md shadow-cyan-500/20">
                  <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                    <Music2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl tracking-tight">Hola, {userName}</h3>
                  <p className="text-xs font-bold text-primary tracking-wider uppercase mt-0.5">{isAdmin ? 'Administrador' : 'Alumno Pro'}</p>
                </div>
              </SheetTitle>
              <SheetDescription className="sr-only">Menú de navegación adicional</SheetDescription>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8 pb-4">
              
              {enrolledCourses.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Mis Programas</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {enrolledCourses.map(course => (
                      <Link key={course.slug} href={`/courses/${course.slug}`} onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-white text-indigo-500 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <span className="font-extrabold text-slate-700 group-hover:text-indigo-900 transition-colors text-sm">{course.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {(hasPlantillas || hasPresets) && (
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Academia Extras</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {hasPlantillas && (
                      <Link href="/academy/plantillas" onClick={() => setMenuOpen(false)} className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <Library className="w-5 h-5 text-slate-400 group-hover:text-emerald-500" />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Plantillas</span>
                      </Link>
                    )}
                    {hasPresets && (
                      <Link href="/academy/presets" onClick={() => setMenuOpen(false)} className="flex flex-col items-center text-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                          <FolderTree className="w-5 h-5 text-slate-400 group-hover:text-amber-500" />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Presets</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {(hasProgress || hasAnnouncements) && (
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Personal</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {hasProgress && (
                      <Link href="/progress" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-rose-500 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                          <BarChart3 className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-rose-700 text-sm">Mi Progreso</span>
                      </Link>
                    )}
                    {hasAnnouncements && (
                      <Link href="/updates" onClick={() => setMenuOpen(false)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-orange-50 border border-transparent hover:border-orange-100 transition-colors group">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-orange-500 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                          <Bell className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-700 group-hover:text-orange-700 text-sm">Novedades</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}


            </div>

            <div className="pt-4 border-t border-slate-100 mt-auto">
              <form action={logout}>
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-2xl font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 transition-colors group">
                  <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Cerrar sesión
                </button>
              </form>
            </div>

          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
