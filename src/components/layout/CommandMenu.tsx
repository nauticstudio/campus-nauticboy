'use client'

import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useRouter } from 'next/navigation'
import { BookOpen, Package, Library } from 'lucide-react'

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Buscar cursos, recursos o categorías..." />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        
        {/* Placeholder Data for Phase 2 Shell */}
        <CommandGroup heading="Cursos">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/courses/produccion-ableton'))}
          >
            <BookOpen className="mr-2 h-4 w-4 text-cyan-400" />
            <span>Ableton Live Master</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Academia">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/academy/plantillas'))}
          >
            <Library className="mr-2 h-4 w-4 text-emerald-400" />
            <span>Plantillas</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/academy/presets'))}
          >
            <Package className="mr-2 h-4 w-4 text-purple-400" />
            <span>Presets</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
