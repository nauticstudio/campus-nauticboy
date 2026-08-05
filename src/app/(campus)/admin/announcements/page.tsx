'use client'

import { useState } from 'react'
import { Megaphone, Plus, Shield, Trash2 } from 'lucide-react'

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([
    { id: '1', title: 'Nuevo Módulo Lanzado: Mastering', type: 'new_resource', date: '2026-08-04' },
    { id: '2', title: 'Librería Afro House Drums', type: 'new_resource', date: '2026-08-03' }
  ])

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Novedades & Anuncios</h1>
        </div>

        <button 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:bg-cyan-500 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Publicar Anuncio</span>
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map(ann => (
          <div key={ann.id} className="glass-card glass-card-hover rounded-3xl p-6 flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-900 text-base">{ann.title}</h3>
              <span className="text-xs font-medium text-slate-400">Publicado el {ann.date}</span>
            </div>
            <button className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
