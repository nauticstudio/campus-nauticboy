'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Heart, Library, Search, SearchX } from 'lucide-react'
import type { LibraryFilter, LibraryItem } from '@/lib/data/library-shared'
import { FAVORITES_FILTER } from '@/lib/data/library-shared'
import { ResourceCard } from './ResourceCard'
import { FilterChips } from './FilterChips'
import { EmptyState } from './EmptyState'

/**
 * Navegador de la biblioteca: búsqueda local instantánea + filtros por tipo.
 * La búsqueda global multi-tabla sigue viviendo en el CommandMenu (⌘K);
 * esta barra filtra lo ya cargado y abre el ⌘K para búsqueda profunda.
 */
export function LibraryBrowser({
  items,
  filters,
}: {
  items: LibraryItem[]
  filters: LibraryFilter[]
}) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState('all')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        // Búsqueda inline de la biblioteca; el CommandMenu global sigue vivo.
        e.preventDefault()
        e.stopPropagation()
        inputRef.current?.focus()
      }
    }
    document.addEventListener('keydown', down, true)
    return () => document.removeEventListener('keydown', down, true)
  }, [])

  const filtersWithFavorites = useMemo(() => {
    const favCount = items.filter((i) => i.isFavorite).length
    return favCount > 0
      ? [...filters, { ...FAVORITES_FILTER, count: favCount }]
      : filters
  }, [items, filters])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((i) => {
      if (active === FAVORITES_FILTER.slug && !i.isFavorite) return false
      if (active !== 'all' && active !== FAVORITES_FILTER.slug && i.type !== active) return false
      if (!q) return true
      const haystack = [i.title, i.description, i.typeLabel, i.format, i.version]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [items, query, active])

  const clearFilters = () => {
    setQuery('')
    setActive('all')
  }

  return (
    <div className="space-y-6">
      {/* Búsqueda */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink-400" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar recursos, formatos, versiones…"
          aria-label="Buscar en la biblioteca"
          className="h-12 w-full rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface-input)] pl-11 pr-24 text-sm font-medium text-ink-50 placeholder:text-ink-500 outline-none transition-colors focus:border-[var(--border-focus)]"
        />
        <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] text-ink-400 md:inline-flex">
          ⌘K
        </kbd>
      </div>

      {/* Filtros */}
      <FilterChips filters={filtersWithFavorites} active={active} onChange={setActive} />

      {/* Grid */}
      {items.length === 0 ? (
        <EmptyState
          icon={<Library className="h-10 w-10" />}
          title="Tu biblioteca todavía está vacía"
          description="Los recursos que el equipo vaya publicando aparecerán aquí."
        />
      ) : visible.length === 0 ? (
        active === FAVORITES_FILTER.slug ? (
          <EmptyState
            icon={<Heart className="h-10 w-10" />}
            title="Todavía no tienes recursos favoritos"
            description="Marca recursos con ♡ para encontrarlos rápidamente."
          />
        ) : (
          <EmptyState
            icon={<SearchX className="h-10 w-10" />}
            title="No encontramos recursos para esta búsqueda"
            description="Prueba con otro término o elimina algún filtro."
          >
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-[var(--radius-sm)] border border-[var(--border)] px-4 py-2 text-xs font-bold text-ink-200 transition-colors hover:border-[var(--border-hover)] hover:text-ink-50"
            >
              Limpiar búsqueda y filtros
            </button>
          </EmptyState>
        )
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <ResourceCard key={`${item.kind}-${item.id}`} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
