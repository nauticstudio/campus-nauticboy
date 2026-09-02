'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CourseEditor } from '@/components/admin/CourseEditor'
import { 
  BookOpen, 
  ChevronDown, 
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
  const [expandedModule, setExpandedModule] = useState<string | null>(initialModules[0]?.id || null)
  const [isEditMode, setIsEditMode] = useState(false)

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
                className={`inline-flex min-h-9 items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-[background-color,border-color,color,box-shadow] border ${
                  isEditMode
                    ? 'bg-coral-500 text-primary-foreground border-coral-500 shadow-[var(--shadow-lift)]'
                    : 'bg-ink-900 text-ink-200 border-ink-800 hover:text-ink-50 hover:bg-ink-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                <span>{isEditMode ? 'Finalizar Edición' : 'Editar Curso & Módulos'}</span>
              </button>
            )}
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-50 tracking-editorial leading-tight">
            {course.title}
          </h1>

          <p className="text-muted-foreground text-sm md:text-base font-medium leading-relaxed">
            {course.description || 'Sin descripción disponible.'}
          </p>
        </div>

        {!isAdmin && initialModules.length > 0 && (
          <p className="border-t border-[var(--border)] pt-5 text-sm font-medium text-ink-300">
            El seguimiento de avance se habilitará cuando los módulos registren progreso en tu cuenta.
          </p>
        )}
      </div>

      {/* Main Content: Edit Mode OR View Mode */}
      {isEditMode ? (
        <CourseEditor courseId={course.id} initialModules={initialModules} />
      ) : initialModules.length === 0 ? (
        <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-500/10 text-coral-300 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-ink-50">Este curso no tiene módulos aún</h3>
          <p className="text-xs font-semibold text-ink-300 max-w-sm mx-auto">
            {isAdmin
              ? 'Activa la edición del curso para agregar y ordenar módulos.'
              : 'El contenido de este curso estará disponible próximamente.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-ink-50 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Contenido del Programa
          </h2>

          <div className="space-y-4">
            {initialModules.map((module) => {
              const isExpanded = expandedModule === module.id
              return (
                <div 
                  key={module.id} 
                  className="glass-card rounded-[var(--radius)] overflow-hidden border border-[var(--border)]"
                >
                  {/* Module Header */}
                  <button
                    type="button"
                    onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                    aria-expanded={isExpanded}
                    aria-controls={`${module.id}-resources`}
                    className="w-full min-h-16 p-6 flex items-center justify-between gap-4 text-left hover:bg-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-coral-400 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-coral-500/10 text-coral-300" aria-hidden>
                        <BookOpen className="size-5" />
                      </div>

                      <div>
                        <h3 className="font-extrabold text-lg text-ink-50 tracking-tight">{module.title}</h3>
                        <p className="text-xs font-medium text-ink-300 mt-0.5 line-clamp-1">{module.description}</p>
                      </div>
                    </div>

                    <ChevronDown aria-hidden className={`w-5 h-5 text-ink-300 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-coral-300' : ''}`} />
                  </button>

                  {/* Module Resources List */}
                  {isExpanded && (
                    <div id={`${module.id}-resources`} className="px-6 pb-6 pt-2 border-t border-[var(--border)] space-y-3">
                      {module.resources.map(res => (
                        <div key={res.id} className="p-4 rounded-2xl bg-[var(--surface-elevated)] border border-[var(--border)] flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-coral-500/10 text-coral-300 flex items-center justify-center">
                              {res.type === 'video' && <Play className="w-4 h-4 fill-primary" />}
                              {res.type === 'template' && <Music className="w-4 h-4" />}
                              {res.type === 'pdf' && <FileText className="w-4 h-4" />}
                            </div>
                            <div>
                              <h4 className="font-bold text-xs text-ink-50">{res.title}</h4>
                              <span className="text-[10px] font-semibold text-ink-300 uppercase tracking-wider">{res.fileSize}</span>
                            </div>
                          </div>

                          <span className="text-xs font-semibold text-ink-300">Recurso asociado</span>
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
