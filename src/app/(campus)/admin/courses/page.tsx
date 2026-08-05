'use client'

import { useState } from 'react'
import { BookOpen, Plus, Shield, Edit3, Trash2, Layers, Move } from 'lucide-react'

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([
    {
      id: 'c1',
      title: 'Ableton Live Masterclass',
      slug: 'produccion-ableton',
      software: 'Ableton Live 12',
      modulesCount: 4,
      isPublished: true
    },
    {
      id: 'c2',
      title: 'Mezcla Pros & Mastering',
      slug: 'mezcla-mastering',
      software: 'Plugins & DAWs',
      modulesCount: 6,
      isPublished: true
    },
    {
      id: 'c3',
      title: 'Diseño Sonoro en Serum',
      slug: 'sound-design-synth',
      software: 'Serum',
      modulesCount: 5,
      isPublished: true
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Gestión de Cursos & Módulos</h1>
        </div>

        <button 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-xs shadow-md shadow-cyan-600/20 hover:bg-cyan-500 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Curso</span>
        </button>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(course => (
          <div key={course.id} className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between space-y-6 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200">
                  {course.software}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Publicado
                </span>
              </div>

              <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                {course.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-600" />
                {course.modulesCount} Módulos configurados
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Editar Módulos
              </button>
              <button className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
