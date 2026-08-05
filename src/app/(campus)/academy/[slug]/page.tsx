'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Download, 
  Heart, 
  Search, 
  Layers
} from 'lucide-react'

interface ResourceItem {
  id: string
  title: string
  description: string
  software: string
  level: string
  fileSize: string
  fileName: string
  isFavorite: boolean
  isRestricted: boolean
}

export default function CategoryResourcesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)

  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 'res-1',
      title: 'Plantilla Melodic Techno & Afro House 2026',
      description: 'Proyecto completo estructurado en Ableton Live 12 con grupos de instrumentos, procesamiento de voces y mastering.',
      software: 'Ableton Live 12',
      level: 'Avanzado',
      fileSize: '185 MB',
      fileName: 'Melodic_Techno_Master_2026.als',
      isFavorite: true,
      isRestricted: false
    },
    {
      id: 'res-2',
      title: 'Preset Pack Serum — Synthwave & Cyberpunk',
      description: '35 Presets diseñados con síntesis analógica virtual: Leads retro, Basslines gordos y Plucks brillantes.',
      software: 'Serum',
      level: 'Intermedio',
      fileSize: '14.2 MB',
      fileName: 'Synthwave_Serum_Pack.zip',
      isFavorite: false,
      isRestricted: false
    },
    {
      id: 'res-3',
      title: 'Mastering Chain Preset (Stock Plugins)',
      description: 'Cadena de procesamiento nativa para Ableton Live lista para llevar tus tracks a -9 LUFS sin distorsión.',
      software: 'Ableton Live 12',
      level: 'Principiante',
      fileSize: '4.8 MB',
      fileName: 'Mastering_Chain_Pro.adg',
      isFavorite: true,
      isRestricted: true
    }
  ])

  const toggleFavorite = (id: string) => {
    setResources(prev =>
      prev.map(r => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r))
    )
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Back Button */}
      <div>
        <Link 
          href="/academy"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver a la Academia</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest flex items-center gap-1.5 mb-1">
            <Layers className="w-3.5 h-3.5" /> Colección de Recursos
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight capitalize">
            Recursos en {slug}
          </h1>
        </div>

        {/* Quick Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input 
            type="text" 
            placeholder="Filtrar recursos..." 
            className="w-full bg-white border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(res => (
          <div key={res.id} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden group">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {res.software}
                </span>
                
                {/* Favorite Heart Button */}
                <button
                  type="button"
                  onClick={() => toggleFavorite(res.id)}
                  className={`p-2 rounded-xl border transition-all duration-200 ${
                    res.isFavorite 
                      ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-2xs' 
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                  }`}
                  title={res.isFavorite ? "Quitar de favoritos" : "Guardar en favoritos"}
                >
                  <Heart className={`w-4 h-4 ${res.isFavorite ? 'fill-rose-500 animate-pulse-subtle' : ''}`} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                  {res.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">
                  {res.description}
                </p>
              </div>
            </div>

            {/* Footer with File Info & Download Button */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tamaño</span>
                <span className="text-xs font-extrabold text-slate-700">{res.fileSize}</span>
              </div>

              <a
                href={`/api/download/${res.id}`}
                download={res.fileName}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all duration-200 group/btn"
              >
                <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                <span>Descargar</span>
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
