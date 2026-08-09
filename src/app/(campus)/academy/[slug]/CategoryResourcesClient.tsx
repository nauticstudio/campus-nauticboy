'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Download, 
  Search, 
  Layers,
  Eye,
  EyeOff,
  Package
} from 'lucide-react'
import { AdminQuickToolbar } from '@/components/admin/AdminQuickToolbar'
import { setResourcePublishedAction } from '@/app/actions/resources'

export interface ResourceItem {
  id: string
  title: string
  description: string | null
  software: string | null
  file_name: string
  file_size: number | null
  is_restricted: boolean
  is_published: boolean
}

export function CategoryResourcesClient({ 
  slug, 
  initialResources,
  isAdmin 
}: { 
  slug: string
  initialResources: ResourceItem[]
  isAdmin: boolean 
}) {
  const [resources, setResources] = useState<ResourceItem[]>(initialResources)
  const [isEditMode, setIsEditMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const toggleResourceVisibility = async (id: string, currentStatus: boolean) => {
    // Optimista: la UI responde al instante y revertimos si la acción falla.
    setResources(prev =>
      prev.map(r => (r.id === id ? { ...r, is_published: !currentStatus } : r))
    )

    const result = await setResourcePublishedAction(id, !currentStatus)
    if (!result.success) {
      setResources(prev =>
        prev.map(r => (r.id === id ? { ...r, is_published: currentStatus } : r))
      )
      console.error(result.error)
      return
    }

    router.refresh()
  }

  const filteredResources = resources
    .filter(r => isEditMode || r.is_published)
    .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <div>
        <Link 
          href="/academy"
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a la Academia</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-sand-300/80">
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5" /> Colección de Recursos
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tracking-editorial capitalize">
            Recursos En {slug}
          </h1>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-3.5" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Filtrar recursos..." 
            className="w-full bg-white border border-sand-300 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
          />
        </div>
      </div>

      {isAdmin && (
        <AdminQuickToolbar 
          isEditMode={isEditMode} 
          onToggleEditMode={() => setIsEditMode(!isEditMode)} 
        />
      )}

      {/* Resource Cards */}
      {filteredResources.length === 0 ? (
        <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-100 text-primary flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-900">No hay recursos disponibles</h3>
          <p className="text-xs font-semibold text-ink-500 max-w-sm mx-auto">
            Aún no has agregado recursos en la categoría <span className="font-bold text-primary capitalize">{slug}</span> de la base de datos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(res => (
            <div key={res.id} className={`glass-card glass-card-hover rounded-[var(--radius)] p-6 flex flex-col justify-between h-full relative overflow-hidden group ${!res.is_published ? 'opacity-70 grayscale-[30%]' : ''}`}>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-coral-100 text-coral-700 border border-coral-300">
                    {res.software || 'General'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {isEditMode && (
                      <button
                        type="button"
                        onClick={() => toggleResourceVisibility(res.id, res.is_published)}
                        className={`p-2 rounded-xl border transition-all duration-200 ${
                          res.is_published 
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-600 shadow-2xs hover:bg-emerald-100' 
                            : 'bg-rose-50 border-rose-200 text-rose-500 shadow-2xs hover:bg-rose-100'
                        }`}
                        title={res.is_published ? "Ocultar recurso" : "Publicar recurso"}
                      >
                        {res.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-xl text-ink-900 group-hover:text-primary transition-colors tracking-tight">
                    {res.title}
                  </h3>
                  <p className="text-xs font-medium text-ink-500 leading-relaxed line-clamp-3">
                    {res.description || 'Sin descripción.'}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-ink-400 uppercase tracking-wider block">Archivo</span>
                  <span className="text-xs font-extrabold text-ink-700 truncate max-w-[120px] block">{res.file_name}</span>
                </div>

                <a
                  href={`/api/download/${res.id}`}
                  download={res.file_name}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-700 text-white font-bold text-xs shadow-md shadow-[0_14px_32px_-8px_rgba(255,98,19,0.45)] hover:shadow-[0_18px_40px_-8px_rgba(255,98,19,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 group/btn"
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
