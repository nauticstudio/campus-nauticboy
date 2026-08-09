'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, Download, Trash2, ArrowRight } from 'lucide-react'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])

  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[var(--radius)] bg-ink-900 p-8 md:p-12 text-white shadow-[var(--shadow-hero)]">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-coral-500/25 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-coral-500/10 border border-white/15 px-3.5 py-1 text-xs font-bold text-amber-200 backdrop-blur-md">
            <Heart className="w-3.5 h-3.5 fill-primary animate-pulse" />
            <span>Colección Personal</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-editorial text-white">
            Mis Favoritos
          </h1>
          <p className="text-ink-200 text-base md:text-lg font-medium leading-relaxed">
            Todos los presets, plantillas y herramientas que has guardado para acceder rápidamente.
          </p>
        </div>
      </div>

      {/* Favorites List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-ink-900 tracking-tight">Recursos Guardados</h2>
          <span className="text-xs font-semibold text-ink-500">{favorites.length} Elementos</span>
        </div>

        {favorites.length === 0 ? (
          <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
            <Heart className="w-12 h-12 text-ink-200 mx-auto" />
            <h3 className="text-lg font-extrabold text-ink-700">No tienes favoritos guardados aún</h3>
            <p className="text-xs font-medium text-ink-500">Explora la academia y presiona el corazón para guardar recursos.</p>
            <Link 
              href="/academy" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md shadow-[0_14px_32px_-8px_rgba(255,98,19,0.5)] hover:bg-primary/95 transition-all"
            >
              <span>Explorar la Academia</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map(item => (
              <div key={item.id} className="glass-card glass-card-hover rounded-[var(--radius)] p-6 flex flex-col justify-between h-full relative group">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-coral-100 text-coral-700 border border-coral-300">
                      {item.software}
                    </span>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 rounded-xl text-ink-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-lg text-ink-900 group-hover:text-primary transition-colors tracking-tight">
                    {item.title}
                  </h3>
                </div>

                <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-ink-500">{item.fileSize}</span>
                  <a
                    href={`/api/download/${item.id}`}
                    download={item.fileName}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-ink-900 text-white font-bold text-xs hover:bg-primary transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
