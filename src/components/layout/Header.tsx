'use client'

import { useState } from 'react'
import { Menu, Music2 } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'

export function Header({ isAdmin = false, userName = 'Alumno' }: { isAdmin?: boolean, userName?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl md:hidden shadow-2xs">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-600 p-0.5 shadow-sm shadow-cyan-500/20">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
            <Music2 className="w-4 h-4 text-cyan-600" />
          </div>
        </div>
        <span className="font-extrabold text-slate-900 tracking-tight text-sm">Nautic Campus</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2 -mr-2 text-slate-600 hover:text-slate-900 transition-colors">
          <Menu className="w-5 h-5" />
          <span className="sr-only">Toggle Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0 bg-white border-r-slate-200">
          <SheetTitle className="sr-only">Navegación del Campus</SheetTitle>
          <SheetDescription className="sr-only">Menú principal de navegación para móviles</SheetDescription>
          <div className="h-full flex [&>aside]:w-full [&>aside]:flex [&>aside]:h-full [&>aside]:border-none">
             <Sidebar isAdmin={isAdmin} userName={userName} />
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
