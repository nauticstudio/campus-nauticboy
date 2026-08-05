'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  Download, 
  FileText, 
  Play, 
  Music, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  ShieldCheck
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  type: 'video' | 'template' | 'pdf' | 'preset'
  fileSize: string
}

interface Module {
  id: string
  title: string
  description: string
  resources: Resource[]
  completed: boolean
}

export default function CourseDetailPage() {
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'm1',
      title: 'Módulo 1: Fundamentos de Ableton Live 12',
      description: 'Navegación por la interfaz, vista Session vs Arrangement, configuración de audio y MIDI.',
      completed: true,
      resources: [
        { id: 'r1', title: 'Video: Interfaz y Flujo de Trabajo', type: 'video', fileSize: '145 MB' },
        { id: 'r2', title: 'Plantilla de Inicio Rápido (ALS)', type: 'template', fileSize: '12 MB' },
        { id: 'r3', title: 'Guía de Atajos de Teclado (PDF)', type: 'pdf', fileSize: '2.4 MB' }
      ]
    },
    {
      id: 'm2',
      title: 'Módulo 2: Diseño Sonoro & Síntesis Wavetable',
      description: 'Creación de parches de sintetizador desde cero utilizando Serum y Wavetable de Ableton.',
      completed: true,
      resources: [
        { id: 'r4', title: 'Video: Creación de Basslines Potentes', type: 'video', fileSize: '210 MB' },
        { id: 'r5', title: 'Pack de 15 Presets de Serum', type: 'preset', fileSize: '5.8 MB' }
      ]
    },
    {
      id: 'm3',
      title: 'Módulo 3: Mezcla Pro & Ecualización Dinámica',
      description: 'Limpieza de frecuencias, tratamiento de drums, compresión paralela y espacio en 3D.',
      completed: false,
      resources: [
        { id: 'r6', title: 'Video: EQ Dinámica en Voces y Percusiones', type: 'video', fileSize: '320 MB' },
        { id: 'r7', title: 'Stems de Mezcla de Práctica (WAV)', type: 'template', fileSize: '480 MB' }
      ]
    },
    {
      id: 'm4',
      title: 'Módulo 4: Mastering y Estándares de Plataformas',
      description: 'Loudness objetivo (-14 LUFS vs -9 LUFS), limitación transparente y exportación final.',
      completed: false,
      resources: [
        { id: 'r8', title: 'Video: Cadena de Mastering Profesional', type: 'video', fileSize: '185 MB' },
        { id: 'r9', title: 'Rack de Mastering para Ableton Live', type: 'template', fileSize: '8.4 MB' }
      ]
    }
  ])

  const [expandedModule, setExpandedModule] = useState<string | null>('m3')

  const toggleModuleCompletion = (id: string) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m))
    )
  }

  const completedCount = modules.filter(m => m.completed).length
  const progressPercent = Math.round((completedCount / modules.length) * 100)

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">
      
      {/* Back Button */}
      <div>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Dashboard</span>
        </Link>
      </div>

      {/* Course Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-8 md:p-12 text-white shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Ableton Live 12
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Acceso Concedido
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Ableton Live Masterclass
            </h1>
            <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
              Domina la producción musical profesional de extremo a extremo: composición, síntesis sonoras avanzadas, mezcla quirúrgica y mastering para plataformas.
            </p>
          </div>

          {/* Course Overall Progress */}
          <div className="pt-4 border-t border-slate-700/60 max-w-md space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Progreso del Curso ({completedCount} de {modules.length} Módulos)
              </span>
              <span className="text-cyan-400 font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Módulos de Aprendizaje</h2>
          <span className="text-xs font-semibold text-slate-500">{modules.length} Módulos en total</span>
        </div>

        <div className="space-y-4">
          {modules.map((m, index) => {
            const isExpanded = expandedModule === m.id

            return (
              <div 
                key={m.id}
                className={`glass-card rounded-3xl transition-all duration-300 border ${
                  m.completed ? 'border-emerald-200/80 bg-emerald-50/20' : 'border-slate-200/80'
                }`}
              >
                {/* Module Header Bar */}
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer select-none group"
                  onClick={() => setExpandedModule(isExpanded ? null : m.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Checkbox Toggle */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleModuleCompletion(m.id)
                      }}
                      className="text-slate-400 hover:text-emerald-500 transition-colors p-1 group/btn"
                      title={m.completed ? "Marcar como pendiente" : "Marcar como completado"}
                    >
                      {m.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-pulse-subtle" />
                      ) : (
                        <Circle className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Módulo {index + 1}
                        </span>
                        {m.completed && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Completado
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                        {m.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500 hidden sm:inline">
                      {m.resources.length} Recursos
                    </span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-cyan-600' : ''}`} />
                  </div>
                </div>

                {/* Expanded Content: Description & Resources */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {m.description}
                    </p>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Recursos y Lecciones
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {m.resources.map(res => (
                          <div 
                            key={res.id}
                            className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-slate-200/70 hover:border-cyan-400/60 hover:shadow-md hover:shadow-cyan-500/5 transition-all duration-200 group/res"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover/res:scale-110 group-hover/res:rotate-6 transition-all duration-300">
                                {res.type === 'video' && <Play className="w-4 h-4 fill-cyan-600" />}
                                {res.type === 'template' && <Music className="w-4 h-4" />}
                                {res.type === 'pdf' && <FileText className="w-4 h-4" />}
                                {res.type === 'preset' && <Sparkles className="w-4 h-4" />}
                              </div>
                              <div>
                                <h5 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover/res:text-cyan-600 transition-colors">
                                  {res.title}
                                </h5>
                                <span className="text-[10px] font-semibold text-slate-400">
                                  {res.fileSize}
                                </span>
                              </div>
                            </div>

                            <button 
                              className="p-2 rounded-xl text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                              title="Descargar desde Google Drive"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

              </div>
            )
          })}
        </div>

      </div>

    </div>
  )
}
