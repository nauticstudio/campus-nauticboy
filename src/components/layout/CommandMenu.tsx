'use client'

import { useEffect, useState, useCallback } from 'react'
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
import {
  BookOpen, Library, Loader2, Cpu, Clock,
  GraduationCap, Settings, Home, FolderDown
} from 'lucide-react'

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

// Recientes en localStorage — la plataforma se siente como software profesional
const RECENTS_KEY = 'nautic:recents'
type Recent = { id: string; title: string; kind: 'course' | 'resource' | 'software'; href: string }

function readRecents(): Recent[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(RECENTS_KEY) ?? '[]') } catch { return [] }
}
function pushRecent(item: Recent) {
  if (typeof window === 'undefined') return
  try {
    const list = [item, ...readRecents().filter(r => r.href !== item.href)].slice(0, 6)
    localStorage.setItem(RECENTS_KEY, JSON.stringify(list))
  } catch { /* noop */ }
}

const QUICK_LINKS = [
  { title: 'Inicio',            href: '/dashboard',     icon: Home,           kind: 'nav' },
  { title: 'Academia',          href: '/academy',       icon: GraduationCap,  kind: 'nav' },
  { title: 'Material de Clase', href: '/my-materials',  icon: FolderDown,     kind: 'nav' },
  { title: 'Ajustes',           href: '/settings',      icon: Settings,       kind: 'nav' },
] as const

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
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])

  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    const openMenu = () => setOpen(true)

    document.addEventListener('keydown', down)
    document.addEventListener('open-command-menu', openMenu)
    
    return () => {
      document.removeEventListener('keydown', down)
      document.removeEventListener('open-command-menu', openMenu as EventListener)
    }
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

  // Recientes: leídos frescos en cada APERTURA vía event handler (no en un
  // effect). localStorage tiene guardia de window → SSR seguro.
  const [recents, setRecents] = useState<Recent[]>([])

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      // Leer recientes al abrir: siempre frescos, sin setState en effects.
      setRecents(readRecents())
      if (categories.length === 0) {
        fetch('/api/categories')
          .then(r => r.json())
          .then(d => setCategories(d.categories ?? []))
          .catch(() => { /* categorías opcionales: la UI no se rompe sin ellas */ })
      }
    }
  }, [categories.length])

  const runCommand = useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  const goAndRemember = useCallback((item: Recent) => {
    pushRecent(item)
    setOpen(false)
    router.push(item.href)
  }, [router])

  const hasResults = results.courses.length > 0 || results.resources.length > 0 || results.software.length > 0
  const isSearching = searchQuery.length > 1

  return (
    <CommandDialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Buscar en NAUTIC"
      description="Busca cursos, recursos, software o salta a una sección."
      className="sm:max-w-xl border-[var(--border)] bg-ink-950/90 backdrop-blur-xl backdrop-saturate-150 shadow-[var(--shadow-pop)]"
    >
      <CommandInput
        placeholder="Buscar cursos, recursos o software…"
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {/* vacío controlado: solo si estás buscando y no hay resultados o hay loader.
            Sin query se muestran Recientes / Ir a / Categorías. */}
        <CommandEmpty>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-ink-400 gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Buscando…
            </div>
          ) : (
            'Sin resultados para tu búsqueda.'
          )}
        </CommandEmpty>

        {loading && hasResults && (
          <div className="absolute top-12 right-4 text-primary">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        )}

        {/* Estado SIN búsqueda: Recientes + Quick Links → sensación de software profesional */}
        {!isSearching && (
          <>
            {recents.length > 0 && (
              <CommandGroup heading="Recientes">
                {recents.map(r => (
                  <CommandItem key={r.href} onSelect={() => goAndRemember(r)}>
                    <Clock className="mr-2 h-4 w-4 text-ink-400" />
                    <div className="flex flex-col">
                      <span>{r.title}</span>
                      <span className="text-[10px] text-ink-400 uppercase tracking-wide">{r.kind}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {recents.length > 0 && <CommandSeparator />}
            <CommandGroup heading="Ir a">
              {QUICK_LINKS.map(q => (
                <CommandItem key={q.href} onSelect={() => runCommand(() => router.push(q.href))}>
                  <q.icon className="mr-2 h-4 w-4 text-coral-300" />
                  <span>{q.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            {categories.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Categorías">
                  {categories.map(c => (
                    <CommandItem key={c.id} onSelect={() => runCommand(() => router.push(`/academy/${c.slug}`))}>
                      <Library className="mr-2 h-4 w-4 text-coral-300" />
                      <span>{c.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </>
        )}

        {/* Resultados de búsqueda */}
        {results.courses.length > 0 && (
          <CommandGroup heading="Cursos">
            {results.courses.map(course => (
              <CommandItem
                key={course.id}
                onSelect={() => goAndRemember({ id: course.id, title: course.title, kind: 'course', href: `/courses/${course.slug}` })}
              >
                <BookOpen className="mr-2 h-4 w-4 text-coral-300" />
                <div className="flex flex-col">
                  <span>{course.title}</span>
                  {course.description && <span className="text-[10px] text-ink-400 line-clamp-1">{course.description}</span>}
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
                onSelect={() => goAndRemember({ id: resource.id, title: resource.title, kind: 'resource', href: `/academy/${resource.categorySlug}/${resource.slug}` })}
              >
                <Library className="mr-2 h-4 w-4 text-ink-300" />
                <div className="flex flex-col">
                  <span>{resource.title}</span>
                  <span className="text-[10px] text-ink-400 uppercase">{resource.categorySlug}</span>
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
                onSelect={() => goAndRemember({ id: soft.id, title: soft.name, kind: 'software', href: `/software/${soft.slug}` })}
              >
                <Cpu className="mr-2 h-4 w-4 text-ink-300" />
                <div className="flex flex-col">
                  <span>{soft.name}</span>
                  {soft.description && <span className="text-[10px] text-ink-400 line-clamp-1">{soft.description}</span>}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

      </CommandList>
    </CommandDialog>
  )
}
