'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Layers,
  Package
} from 'lucide-react'
import { CategoryEditButton } from '@/components/admin/CategoryModal'
import { InlineCreateResourceModal } from '@/components/admin/InlineCreateResourceModal'
import { InlineEditResourceModal } from '@/components/admin/InlineEditResourceModal'
import { formatFileSize } from '@/lib/utils'
import { getCoverStyle } from '@/lib/utils/cover-style'

export interface ResourceItem {
  id: string
  title: string
  description: string | null
  software: string | null
  file_name: string
  file_size: number | null
  is_restricted: boolean
  is_published: boolean
  version?: string | null
  thumbnail_url?: string | null
  tags?: string[] | null
  storage_path?: string | null
  storage_provider?: string | null
}

export function CategoryResourcesClient({
  slug,
  initialResources,
  isAdmin,
  softwareSlot,
  categoryMeta,
}: {
  slug: string
  initialResources: ResourceItem[]
  isAdmin: boolean
  /** Catálogo de software embebido (solo categoría Plugins). */
  softwareSlot?: React.ReactNode
  categoryMeta?: {
    id: string
    slug: string
    name: string
    icon: string | null
    icon_url: string | null
    cover_image_url: string | null
    accent_color: 'coral' | 'violet' | 'cyan' | 'emerald' | 'rose'
    blurb: string | null
    description: string | null
  }
}) {
  const [resources] = useState<ResourceItem[]>(initialResources)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'macos' | 'windows'>('all')

  const hasMacResources = resources.some(r => r.tags?.includes('macos'))
  const hasWinResources = resources.some(r => r.tags?.includes('windows'))
  const showPlatformFilter = hasMacResources || hasWinResources

  const filteredResources = resources
    .filter(r => isAdmin || r.is_published)
    .filter(r => {
      const matchSearch =
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.software && r.software.toLowerCase().includes(searchTerm.toLowerCase()))
      if (!matchSearch) return false

      if (selectedPlatform === 'all') return true
      if (selectedPlatform === 'macos') return r.tags?.includes('macos')
      if (selectedPlatform === 'windows') return r.tags?.includes('windows')
      return true
    })

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <div>
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-400 hover:text-coral-400 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a la Academia</span>
        </Link>
      </div>

      {/* Header Banner — con portada si existe */}
      {categoryMeta ? (
        <div className="relative overflow-hidden rounded-[var(--radius)] bg-ink-950 border border-ink-700/40 shadow-[var(--shadow-hero)]">
          {categoryMeta.cover_image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={categoryMeta.cover_image_url}
                alt={categoryMeta.name}
                style={getCoverStyle(categoryMeta.cover_image_url)}
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/55 to-ink-950/25" />
            </>
          ) : (
            <div className="absolute top-0 right-0 -mr-24 -mt-24 w-72 h-72 bg-ink-500/10 blur-[80px] rounded-full pointer-events-none" />
          )}

          <div className="relative z-10 p-7 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-coral-300 uppercase tracking-widest flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> {softwareSlot ? 'Colección Principal' : 'Colección de Recursos'}
              </span>
              <div className="flex items-center gap-3">
                <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-50 tracking-quant capitalize">
                  {categoryMeta.name}
                </h1>
                {isAdmin && (
                  <div className="bg-ink-950/50 backdrop-blur rounded-xl border border-ink-800/50">
                    <CategoryEditButton category={categoryMeta} />
                  </div>
                )}
              </div>
              {softwareSlot && (
                <p className="text-sm text-ink-300 max-w-2xl mb-2">
                  Explora el catálogo completo de sintetizadores, efectos y plugins organizados por fabricante y producto.
                </p>
              )}
              {categoryMeta.blurb && (
                <p className="text-sm text-ink-300 max-w-xl">{categoryMeta.blurb}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isAdmin && !softwareSlot && categoryMeta && (
                <InlineCreateResourceModal
                  categoryId={categoryMeta.id}
                  categoryName={categoryMeta.name}
                />
              )}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Filtrar recursos..."
                  className="w-full bg-ink-900/60 backdrop-blur border border-ink-700/50 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-coral-500/30 focus:border-coral-500/50 transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-ink-700/40">
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 mb-1">
              <Layers className="w-3.5 h-3.5" /> Colección de Recursos
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-50 tracking-quant capitalize">
              Recursos En {slug}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Filtrar recursos..."
                className="w-full bg-ink-900/60 border border-ink-700/50 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-ink-50 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-coral-500/30 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Platform Filter Tabs (macOS / Windows / Todos) */}
      {!softwareSlot && showPlatformFilter && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedPlatform('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedPlatform === 'all'
                ? 'bg-coral-500 text-white shadow-md shadow-coral-500/20'
                : 'bg-ink-950/70 border border-ink-800 text-ink-300 hover:text-white hover:bg-ink-900'
            }`}
          >
            Todos
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('macos')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedPlatform === 'macos'
                ? 'bg-coral-500 text-white shadow-md shadow-coral-500/20'
                : 'bg-ink-950/70 border border-ink-800 text-ink-300 hover:text-white hover:bg-ink-900'
            }`}
          >
            <span> macOS</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('windows')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedPlatform === 'windows'
                ? 'bg-coral-500 text-white shadow-md shadow-coral-500/20'
                : 'bg-ink-950/70 border border-ink-800 text-ink-300 hover:text-white hover:bg-ink-900'
            }`}
          >
            <span>🪟 Windows</span>
          </button>
        </div>
      )}

      {softwareSlot && (
        <section aria-label="Catálogo de plugins">{softwareSlot}</section>
      )}

      {/* Resource Cards */}
      {filteredResources.length === 0 ? (
        !softwareSlot && (
          <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-coral-500/15 text-coral-400 flex items-center justify-center mx-auto">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-display text-lg font-semibold text-ink-50">No hay recursos disponibles</h3>
            <p className="text-xs font-semibold text-ink-400 max-w-sm mx-auto">
              Aún no has agregado recursos en la categoría <span className="font-bold text-coral-400 capitalize">{categoryMeta?.name || slug}</span>.
            </p>
            {isAdmin && categoryMeta && (
              <div className="pt-2">
                <InlineCreateResourceModal
                  categoryId={categoryMeta.id}
                  categoryName={categoryMeta.name}
                />
              </div>
            )}
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className={`glass-card glass-card-hover rounded-[var(--radius)] aspect-square overflow-hidden flex flex-col justify-between p-5 relative group border border-ink-800/80 bg-ink-950/75 hover:bg-ink-900/90 hover:border-coral-500/40 transition-all ${
                !res.is_published ? 'opacity-70 grayscale-[30%]' : ''
              }`}
            >
              {/* Top Row: Tags & Admin Action */}
              <div className="flex items-center justify-between gap-2 z-10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-coral-500/15 text-coral-300 border border-coral-500/30">
                    {res.software || 'General'}
                  </span>
                  {res.tags?.includes('macos') && !res.tags?.includes('windows') && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ink-900/90 text-ink-200 border border-ink-700/60 font-mono">
                       macOS
                    </span>
                  )}
                  {res.tags?.includes('windows') && !res.tags?.includes('macos') && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 font-mono">
                      🪟 WIN
                    </span>
                  )}
                  {res.tags?.includes('macos') && res.tags?.includes('windows') && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ink-900/90 text-ink-300 border border-ink-800 font-mono">
                       • 🪟
                    </span>
                  )}
                  {res.version && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-ink-900 text-ink-400 border border-ink-800 font-mono">
                      v{res.version}
                    </span>
                  )}
                </div>

                {isAdmin && (
                  <div className="bg-ink-900/80 backdrop-blur rounded-xl border border-ink-800 shrink-0">
                    <InlineEditResourceModal resource={res} />
                  </div>
                )}
              </div>

              {/* Center: Square Icon & Info */}
              <div className="flex flex-col items-center justify-center text-center my-auto py-1">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-ink-900/90 border border-ink-800/80 p-2.5 shadow-inner flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                  {res.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={res.thumbnail_url}
                      alt={res.title}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  ) : (
                    <Package className="w-8 h-8 text-coral-400" />
                  )}
                </div>

                <h3 className="font-bold text-base sm:text-lg text-ink-50 group-hover:text-coral-400 transition-colors tracking-tight font-display text-center truncate w-full mt-2.5">
                  {res.title}
                </h3>
                <p className="text-[11px] text-ink-400 text-center line-clamp-1 max-w-[90%] mx-auto mt-0.5">
                  {res.description || 'Sin descripción.'}
                </p>
              </div>

              {/* Bottom Row: File Info & Download Button */}
              <div className="pt-3 border-t border-ink-800/70 flex items-center justify-between gap-2 z-10">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-medium text-ink-300 truncate block font-mono">
                    {res.file_size ? formatFileSize(res.file_size) : res.file_name}
                  </span>
                </div>

                <a
                  href={`/api/download/${res.id}`}
                  download={res.file_name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral-500 text-white font-bold text-xs shadow-md shadow-coral-500/20 hover:bg-coral-600 hover:scale-105 active:scale-95 transition-all group/btn shrink-0"
                >
                  <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                  <span>Descargar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}


