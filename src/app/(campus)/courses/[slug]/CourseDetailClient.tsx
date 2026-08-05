'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminQuickToolbar } from '@/components/admin/AdminQuickToolbar'
import { CourseEditor } from '@/components/admin/CourseEditor'
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  Download, 
  FileText, 
  Play, 
  Music, 
  Sparkles, 
  ArrowLeft,
  Package
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
  is_published: boolean
}

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  software: string | null
}

export function CourseDetailClient({ 
  course, 
  initialModules, 
  isAdmin 
}: { 
  course: Course
  initialModules: Module[]
  isAdmin: boolean 
}) {
  const [modules, setModules] = useState<Module[]>(initialModules)
  const [expandedModule, setExpandedModule] = useState<string | null>(initialModules[0]?.id || null)
  const [isEditMode, setIsEditMode] = useState(false)

  const toggleModuleCompletion = (id: string) => {
    setModules(prev =>
      prev.map(m => (m.id === id ? { ...m, completed: !m.completed } : m))
    )
  }

  const completedCount = modules.filter(m => m.completed).length
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">
      
      {/* Back Button */}
      <div>
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Hero Course Banner */}
      <div className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden space-y-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-100 text-cyan-800 border border-cyan-200">
              {course.software || 'General'}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {course.title}
          </h1>

          <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed">
            {course.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Progress Card */}
        {modules.length > 0 && (
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 max-w-md">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-slate-700">Tu Progreso General</span>
                <span className="text-cyan-600">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200/60">
              {completedCount} de {modules.length} Módulos Completados
            </div>
          </div>
        )}
      </div>

      {/* Admin Floating Toolbar */}
      {isAdmin && (
        <AdminQuickToolbar 
          isEditMode={isEditMode} 
          onToggleEditMode={() => setIsEditMode(!isEditMode)} 
        />
      )}

      {/* Main Content: Edit Mode OR View Mode */}
      {isEditMode ? (
        <CourseEditor courseId={course.id} initialModules={modules} />
      ) : modules.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">Este curso no tiene módulos aún</h3>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
            Activa el &quot;Modo Edición&quot; desde la barra flotante inferior para agregar y ordenar módulos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-cyan-600" />
            Contenido del Programa
          </h2>

          <div className="space-y-4">
            {modules.map((module) => {
              const isExpanded = expandedModule === module.id
              return (
                <div 
                  key={module.id} 
                  className={`glass-card rounded-3xl overflow-hidden transition-all duration-200 border ${
                    module.completed ? 'border-emerald-200/60 bg-emerald-50/10' : 'border-slate-200/80'
                  }`}
                >
                  {/* Module Header */}
                  <div 
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleModuleCompletion(module.id)
                        }}
                        className="text-slate-400 hover:text-emerald-600 transition-colors"
                      >
                        {module.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-6 h-6 text-slate-300" />
                        )}
                      </button>

                      <div>
                        <h3 className="font-extrabold text-lg text-slate-900 tracking-tight">{module.title}</h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5 line-clamp-1">{module.description}</p>
                      </div>
                    </div>

                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-cyan-600' : ''}`} />
                  </div>

                  {/* Module Resources List */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-3">
                      {module.resources.map(res => (
                        <div key={res.id} className="p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-between gap-4 hover:border-cyan-200 transition-colors shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                              {res.type === 'video' && <Play className="w-4 h-4 fill-cyan-600" />}
                              {res.type === 'template' && <Music className="w-4 h-4" />}
                              {res.type === 'pdf' && <FileText className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-slate-900">{res.title}</h4>
                              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{res.fileSize}</span>
                            </div>
                          </div>

                          <button className="p-2 rounded-xl bg-slate-50 text-slate-600 hover:bg-cyan-50 hover:text-cyan-600 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}
