'use client'

import { useState } from 'react'
import { Package, Upload, Shield, Plus, FileText, CheckCircle2, Lock, HardDrive } from 'lucide-react'

export default function AdminResourcesPage() {
  const [resources, setResources] = useState([
    {
      id: 'r1',
      title: 'Plantilla Melodic Techno 2026',
      fileName: 'Melodic_Techno_Master_2026.als',
      driveId: '1w7Zr5tfucDoXaXOrsVG55WixmIvChyd9',
      category: 'Plantillas',
      isRestricted: true
    },
    {
      id: 'r2',
      title: 'Preset Pack Serum',
      fileName: 'Synthwave_Serum_Pack.zip',
      driveId: '1w7Zr5tfucDoXaXOrsVG55WixmIvChyd9',
      category: 'Presets',
      isRestricted: false
    }
  ])

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Recursos & Google Drive</h1>
        </div>

        <button 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Upload className="w-4 h-4" />
          <span>Subir Archivo a Drive</span>
        </button>
      </div>

      {/* Google Drive Status Banner */}
      <div className="glass-card rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Almacenamiento Conectado</span>
            <h3 className="text-base font-extrabold text-slate-900">Google Drive API (5TB Activo)</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100/60 px-3 py-1.5 rounded-xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>Tokens de Acceso Válidos</span>
        </div>
      </div>

      {/* Resources List */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Recursos Registrados</h2>
          <span className="text-xs font-semibold text-slate-500">{resources.length} Archivos</span>
        </div>

        <div className="divide-y divide-slate-100">
          {resources.map(res => (
            <div key={res.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{res.title}</h4>
                  <span className="text-xs font-medium text-slate-400 font-mono">{res.fileName}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {res.category}
                </span>

                {res.isRestricted && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Solo Alumnos
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
