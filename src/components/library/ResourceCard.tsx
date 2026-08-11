'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Download, Heart } from 'lucide-react'
import { toggleFavoriteAction } from '@/app/actions/favorites'
import type { LibraryItem } from '@/lib/data/library-shared'
import { cn } from '@/lib/utils'

/**
 * Card compacta de recurso — contenido primero, metadata escaneable.
 * Nautic v3: superficie sólida, hairline, un solo acento coral.
 */
export function ResourceCard({ item }: { item: LibraryItem }) {
  const [fav, setFav] = useState(item.isFavorite)
  const [isPending, startTransition] = useTransition()

  const onToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = !fav
    setFav(next) // optimista
    startTransition(async () => {
      const result = await toggleFavoriteAction(item.id)
      if (!result.success) setFav(!next) // revertir si falla
    })
  }

  return (
    <div className="group relative flex h-full flex-col rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-pop)]">
      {/* Tipo + favorito */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="rounded-full border border-coral-500/30 bg-coral-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-coral-300">
          {item.typeLabel}
        </span>
        {item.favoritable && (
          <button
            type="button"
            onClick={onToggleFavorite}
            disabled={isPending}
            aria-pressed={fav}
            aria-label={fav ? 'Quitar de favoritos' : 'Guardar en favoritos'}
            className={cn(
              'rounded-full p-1.5 transition-colors',
              fav ? 'text-coral-400' : 'text-ink-500 hover:text-coral-300'
            )}
          >
            <Heart className={cn('h-4 w-4', fav && 'fill-current')} />
          </button>
        )}
      </div>

      {/* Título + descripción */}
      <Link href={item.href} className="outline-none focus-visible:underline">
        <h3 className="font-display text-base font-semibold leading-snug tracking-tight text-ink-50 transition-colors group-hover:text-coral-300">
          {item.title}
        </h3>
      </Link>
      {item.description && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-400">
          {item.description}
        </p>
      )}

      {/* Metadata */}
      <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold text-ink-500">
        {item.format && <span className="uppercase">{item.format}</span>}
        {item.format && item.version && <span aria-hidden>·</span>}
        {item.version && <span>v{item.version}</span>}
        {(item.format || item.version) && item.size && <span aria-hidden>·</span>}
        {item.size && <span>{item.size}</span>}
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
        <Link
          href={item.href}
          className="inline-flex items-center gap-1 text-xs font-bold text-ink-300 transition-colors hover:text-coral-300"
        >
          Ver recurso
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        {item.downloadId && (
          <a
            href={`/api/download/${item.downloadId}`}
            download
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-[0_10px_24px_-8px_rgba(255,98,19,0.5)] transition-all hover:bg-primary/95 active:scale-95"
          >
            <Download className="h-3.5 w-3.5" />
            Descargar
          </a>
        )}
      </div>
    </div>
  )
}
