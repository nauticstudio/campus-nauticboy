'use client'

import { useState } from 'react'
import Link from 'next/link'
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
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-500 hover:text-primary transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Volver al Inicio</span>
        </Link>
      </div>

      {/* Hero Course Banner */}
      <div className="glass-card rounded-[var(--radius)] p-8 md:p-10 relative overflow-hidden space-y-6">
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-coral-100 text-coral-700 border border-coral-200">
              {course.software || 'General'}
            </span>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsEditMode(!isEditMode)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all border ${
                  isEditMode
                    ? 'bg-coral-500 text-white border-coral-500 shadow-md shadow-coral-500/20'
                    : 'bg-ink-900/40 text-ink-300 border-ink-800 hover:text-white hover:bg-ink-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                <span>{isEditMode ? 'Finalizar Edición' : 'Editar Curso & Módulos'}</span>
              </button>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tracking-editorial leading-tight">
            {course.title}
          </h1>

          <p className="text-ink-500 text-sm md:text-base font-medium leading-relaxed">
            {course.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {/* Progress Card */}
        {modules.length > 0 && (
          <div className="pt-6 border-t border-sand-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 max-w-md">
              <div className="flex justify-between text-xs font-extrabold">
                <span className="text-ink-700">Tu Progreso General</span>
                <span className="text-primary">{progressPercent}%</span>
              </div>
              <div className="w-full h-3 bg-sand-100 rounded-full overflow-hidden p-0.5 border border-sand-300/60">
                <div 
                  className="h-full bg-gradient-to-r from-coral-500 to-coral-700 rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="text-xs font-bold text-ink-500 bg-sand-100 px-4 py-2 rounded-2xl border border-sand-300/60">
              {completedCount} de {modules.length} Módulos Completados
            </div>
          </div>
        )}
      </div>

      {/* Main Content: Edit Mode OR View Mode */}
      {isEditMode ? (
        <CourseEditor courseId={course.id} initialModules={modules} />
      ) : modules.length === 0 ? (
        <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-100 text-primary flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-ink-900">Este curso no tiene módulos aún</h3>
          <p className="text-xs font-semibold text-ink-500 max-w-sm mx-auto">
            Haz clic en &quot;Editar Curso &amp; Módulos&quot; para agregar y ordenar módulos.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-ink-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Contenido del Programa
          </h2>

          <div className="space-y-4">
            {modules.map((module) => {
              const isExpanded = expandedModule === module.id
              return (
                <div 
                  key={module.id} 
                  className={`glass-card rounded-[var(--radius)] overflow-hidden transition-all duration-200 border ${
                    module.completed ? 'border-emerald-200/60 bg-emerald-50/10' : 'border-sand-300/80'
                  }`}
                >
                  {/* Module Header */}
                  <div 
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    className="p-6 flex items-center justify-between gap-4 cursor-pointer hover:bg-sand-100/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleModuleCompletion(module.id)
                        }}
                        className="text-ink-400 hover:text-emerald-600 transition-colors"
                      >
                        {module.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                        ) : (
                          <Circle className="w-6 h-6 text-ink-300" />
                        )}
                      </button>

                      <div>
                        <h3 className="font-extrabold text-lg text-ink-900 tracking-tight">{module.title}</h3>
                        <p className="text-xs font-medium text-ink-500 mt-0.5 line-clamp-1">{module.description}</p>
                      </div>
                    </div>

                    <ChevronDown className={`w-5 h-5 text-ink-400 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                  </div>

                  {/* Module Resources List */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-sand-200 space-y-3">
                      {module.resources.map(res => (
                        <div key={res.id} className="p-4 rounded-2xl bg-white border border-sand-200 flex items-center justify-between gap-4 hover:border-coral-200 transition-colors shadow-2xs">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-coral-100 text-primary flex items-center justify-center">
                              {res.type === 'video' && <Play className="w-4 h-4 fill-primary" />}
                              {res.type === 'template' && <Music className="w-4 h-4" />}
                              {res.type === 'pdf' && <FileText className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-ink-900">{res.title}</h4>
                              <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">{res.fileSize}</span>
                            </div>
                          </div>

                          <button className="p-2 rounded-xl bg-sand-100 text-ink-600 hover:bg-coral-100 hover:text-primary transition-colors">
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
