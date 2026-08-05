'use client'

import { useState } from 'react'
import { ShieldAlert, Settings2, Eye, EyeOff, LayoutTemplate } from 'lucide-react'

export function AdminQuickToolbar({ onToggleEditMode, isEditMode }: { onToggleEditMode: () => void, isEditMode: boolean }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-6 duration-500">
      <div className="glass-card shadow-2xl shadow-cyan-900/20 rounded-full px-2 py-2 flex items-center gap-2 border border-cyan-200/50 bg-white/90 backdrop-blur-xl">
        
        <div className="flex items-center gap-2 pl-3 pr-4 border-r border-slate-200/60">
          <ShieldAlert className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Admin</span>
        </div>

        <button 
          onClick={onToggleEditMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
            isEditMode 
              ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Settings2 className={`w-4 h-4 ${isEditMode ? 'animate-spin-slow' : ''}`} />
          {isEditMode ? 'Edición Activa' : 'Activar Edición'}
        </button>

        {isEditMode && (
          <div className="flex items-center gap-1 pr-2 animate-in fade-in slide-in-from-left-2 duration-300">
            <button className="p-2 rounded-full text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors" title="Vista Previa de Alumno">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors" title="Gestionar Plantillas">
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
