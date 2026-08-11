'use client'

import type { LibraryFilter } from '@/lib/data/library-shared'
import { cn } from '@/lib/utils'

/**
 * Chips de filtro derivados de los datos — nunca se muestran tipos vacíos.
 */
export function FilterChips({
  filters,
  active,
  onChange,
}: {
  filters: LibraryFilter[]
  active: string
  onChange: (slug: string) => void
}) {
  return (
    <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-wrap md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map((f) => {
        const isActive = f.slug === active
        return (
          <button
            key={f.slug}
            type="button"
            onClick={() => onChange(f.slug)}
            aria-pressed={isActive}
            className={cn(
              'shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors',
              isActive
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-[var(--border)] bg-[var(--surface)] text-ink-300 hover:border-[var(--border-hover)] hover:text-ink-100'
            )}
          >
            {f.label}
            <span className={cn('ml-1.5 text-[10px] font-semibold', isActive ? 'text-primary-foreground/75' : 'text-ink-500')}>
              {f.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
