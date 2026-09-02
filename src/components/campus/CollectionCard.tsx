'use client'

import Link from 'next/link'
import { Folder, ArrowRight } from 'lucide-react'
import { InlineEditCollectionModal } from '@/components/admin/InlineEditCollectionModal'

export interface CollectionCardData {
  id: string
  name: string
  slug: string
  description?: string | null
  thumbnail_url?: string | null
  count?: number
  is_published?: boolean
}

export function CollectionCard({
  collection,
  categorySlug,
  isAdmin = false,
}: {
  collection: CollectionCardData
  categorySlug: string
  isAdmin?: boolean
}) {
  const resourceCount = collection.count ?? 0
  const countLabel = resourceCount === 1 ? '1 Recurso' : `${resourceCount} Recursos`

  return (
    <div className="relative group">
      <Link
        href={`/academy/${categorySlug}/${collection.slug}`}
        className="block h-full"
      >
        <div
          className={`glass-card glass-card-hover rounded-[var(--radius)] min-h-[260px] overflow-hidden flex flex-col justify-between p-6 relative border border-ink-800/80 bg-ink-950/75 hover:bg-ink-900/90 hover:border-coral-500/40 transition-all duration-300 shadow-sm ${
            !collection.is_published ? 'opacity-70 grayscale-[30%]' : ''
          }`}
        >
          {/* Top Row: Category tag + Count badge */}
          <div className="flex items-center justify-between gap-2 z-10">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-coral-500/15 text-coral-300 border border-coral-500/30 flex items-center gap-1.5">
              <Folder className="w-3 h-3 text-coral-400" />
              <span>COLECCIÓN</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-ink-900/90 text-ink-300 border border-ink-800 shadow-sm">
              {countLabel}
            </span>
          </div>

          {/* Center: Brand Logo / Folder Icon & Title & Description */}
          <div className="flex flex-col items-center justify-center text-center my-auto py-3">
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-ink-900/90 border border-ink-800/80 p-2 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
              {collection.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={collection.thumbnail_url}
                  alt={collection.name}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              ) : (
                <Folder className="w-10 h-10 text-coral-400 stroke-[1.5]" />
              )}
            </div>

            <h3 className="font-bold text-lg sm:text-xl text-ink-50 group-hover:text-coral-400 transition-colors tracking-tight font-display text-center truncate w-full mt-3">
              {collection.name}
            </h3>
            <p className="text-xs text-ink-400 text-center line-clamp-2 max-w-[90%] mx-auto mt-1">
              {collection.description || 'Explora todos los packs y recursos de esta colección.'}
            </p>
          </div>

          {/* Bottom: Enter action */}
          <div className="pt-3 border-t border-ink-800/70 z-10 w-full flex items-center justify-between text-xs font-bold text-coral-400 group-hover:text-coral-300 transition-colors">
            <span>Explorar colección</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Admin edit button floating on top-right */}
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 bg-ink-950/80 backdrop-blur rounded-xl border border-ink-800">
          <InlineEditCollectionModal
            collection={collection}
            categorySlug={categorySlug}
          />
        </div>
      )}
    </div>
  )
}
