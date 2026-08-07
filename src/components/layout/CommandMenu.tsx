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
import { BookOpen, Package, Library, Loader2, Cpu } from 'lucide-react'

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  return debouncedValue
}

export function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 300)
  
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{
    courses: any[];
    resources: any[];
    software: any[];
  }>({ courses: [], resources: [], software: [] })

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

  // Fetch results when debounced search changes
  useEffect(() => {
    if (!debouncedSearch || debouncedSearch.length < 2) {
      setResults({ courses: [], resources: [], software: [] })
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearch)}`)
        const data = await res.json()
        setResults(data)
      } catch (error) {
        console.error('Error searching:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [debouncedSearch])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  const hasResults = results.courses.length > 0 || results.resources.length > 0 || results.software.length > 0

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput 
        placeholder="Buscar cursos, recursos o software..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-slate-500 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando...
            </div>
          ) : searchQuery.length > 1 ? (
            "No se encontraron resultados para tu búsqueda."
          ) : (
            "Empieza a escribir para buscar contenido en el campus."
          )}
        </CommandEmpty>
        
        {loading && hasResults && (
          <div className="absolute top-12 right-4 text-cyan-500">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}

        {results.courses.length > 0 && (
          <CommandGroup heading="Cursos">
            {results.courses.map(course => (
              <CommandItem
                key={course.id}
                onSelect={() => runCommand(() => router.push(`/courses/${course.slug}`))}
              >
                <BookOpen className="mr-2 h-4 w-4 text-cyan-400" />
                <div className="flex flex-col">
                  <span>{course.title}</span>
                  {course.description && <span className="text-[10px] text-slate-500 line-clamp-1">{course.description}</span>}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        
        {results.courses.length > 0 && (results.resources.length > 0 || results.software.length > 0) && (
          <CommandSeparator />
        )}
        
        {results.resources.length > 0 && (
          <CommandGroup heading="Academia & Recursos">
            {results.resources.map(resource => (
              <CommandItem
                key={resource.id}
                onSelect={() => runCommand(() => router.push(`/academy/${resource.categorySlug}/${resource.slug}`))}
              >
                <Library className="mr-2 h-4 w-4 text-emerald-400" />
                <div className="flex flex-col">
                  <span>{resource.title}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{resource.categorySlug}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {results.resources.length > 0 && results.software.length > 0 && (
          <CommandSeparator />
        )}

        {results.software.length > 0 && (
          <CommandGroup heading="Software & Plugins">
            {results.software.map(soft => (
              <CommandItem
                key={soft.id}
                onSelect={() => runCommand(() => router.push(`/software/${soft.slug}`))}
              >
                <Cpu className="mr-2 h-4 w-4 text-purple-400" />
                <div className="flex flex-col">
                  <span>{soft.name}</span>
                  {soft.description && <span className="text-[10px] text-slate-500 line-clamp-1">{soft.description}</span>}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

      </CommandList>
    </CommandDialog>
  )
}
