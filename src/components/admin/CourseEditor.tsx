'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Eye, EyeOff, Edit3, Trash2, Plus, Loader2, LayoutGrid } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createModuleAction, updateModuleVisibilityAction, updateModulesOrderAction } from '@/app/actions/modules'

type ModuleType = {
  id: string
  title: string
  description: string
  isPublished: boolean
}

function SortableModuleItem({ 
  module, 
  onToggleVisibility 
}: { 
  module: ModuleType
  onToggleVisibility: (id: string) => void 
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative flex items-center justify-between p-4 mb-3 rounded-2xl border transition-all ${
        module.isPublished
          ? 'bg-ink-900/60 border-ink-800'
          : 'bg-ink-950/60 border-dashed border-ink-800/80 opacity-75'
      } ${isDragging ? 'shadow-2xl border-coral-500 ring-2 ring-coral-500/20' : 'hover:border-coral-500/40 hover:shadow-md'}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          {...attributes}
          {...listeners}
          className="p-2 -m-2 cursor-grab active:cursor-grabbing text-ink-500 hover:text-coral-400 transition-colors"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className={`font-bold text-sm ${module.isPublished ? 'text-ink-50' : 'text-ink-300'}`}>
            {module.title}
          </span>
          <span className="text-xs font-medium text-ink-400">
            {module.description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleVisibility(module.id)
          }}
          className={`p-2 rounded-xl transition-colors ${
            module.isPublished
              ? 'text-emerald-400 hover:bg-emerald-950/50'
              : 'text-rose-400 hover:bg-rose-950/50'
          }`}
          title={module.isPublished ? 'Ocultar módulo' : 'Publicar módulo'}
        >
          {module.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <div className="w-px h-6 bg-ink-800 mx-1"></div>

        <button className="p-2 rounded-xl text-ink-400 hover:text-coral-400 hover:bg-ink-800/60 transition-colors">
          <Edit3 className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-xl text-ink-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function CourseEditor({
  courseId,
  initialModules = [],
}: {
  courseId: string
  initialModules?: any[]
}) {
  const [modules, setModules] = useState<ModuleType[]>(initialModules.map(m => ({
    id: m.id,
    title: m.title,
    description: m.description,
    isPublished: m.is_published
  })))
  
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = modules.findIndex((i: any) => i.id === active.id)
      const newIndex = modules.findIndex((i: any) => i.id === over.id)
      
      const newModules = arrayMove(modules, oldIndex, newIndex)
      setModules(newModules)

      const updates = newModules.map((m, index) => ({
        id: m.id,
        course_id: courseId,
        title: m.title,
        description: m.description,
        is_published: m.isPublished,
        sort_order: index
      }))
      
      await updateModulesOrderAction(courseId, updates)
    }
  }

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setIsCreating(true)
    try {
      const result = await createModuleAction(courseId, newTitle, newDescription, modules.length)
      if (!result.success || !result.module) throw new Error(result.error)

      setModules([...modules, {
        id: result.module.id,
        title: result.module.title,
        description: result.module.description,
        isPublished: result.module.is_published
      }])
      setIsAddModuleOpen(false)
      setNewTitle('')
      setNewDescription('')
    } catch (error) {
      console.error('Error adding module:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const toggleVisibility = async (id: string) => {
    const module = modules.find(m => m.id === id)
    if (!module) return

    setModules(modules.map(m => m.id === id ? { ...m, isPublished: !m.isPublished } : m))
    await updateModuleVisibilityAction(courseId, id, !module.isPublished)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold text-ink-50 tracking-quant">Estructura del Curso</h2>
        
        <Dialog open={isAddModuleOpen} onOpenChange={setIsAddModuleOpen}>
          <DialogTrigger className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral-500 text-white font-bold text-xs shadow-md hover:bg-coral-600 transition-all">
            <Plus className="w-3.5 h-3.5" /> Añadir Módulo
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-ink-950 text-ink-100 border border-ink-800 rounded-[var(--radius)] p-6 shadow-2xl">
            <form onSubmit={handleAddModule}>
              <DialogHeader className="space-y-3 mb-6">
                <DialogTitle className="text-xl font-bold text-ink-50 font-display flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-coral-500/15 flex items-center justify-center">
                    <LayoutGrid className="w-4 h-4 text-coral-400" />
                  </div>
                  Crear Nuevo Módulo
                </DialogTitle>
                <DialogDescription className="text-xs font-medium text-ink-400">
                  Añade un módulo para agrupar clases y recursos. Inicia como borrador.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Título del Módulo</label>
                  <Input 
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ej: 1. Introducción..."
                    className="rounded-xl border-ink-800 text-sm font-semibold bg-ink-900 text-ink-100 focus:border-coral-500"
                    required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Breve Descripción</label>
                  <textarea 
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="De qué trata este módulo..."
                    className="w-full rounded-xl border border-ink-800 text-sm font-medium bg-ink-900 text-ink-100 p-3 min-h-[80px] resize-none focus:outline-none focus:border-coral-500 transition-all"
                  />
                </div>
              </div>

              <DialogFooter className="mt-6 border-t border-ink-800/80 pt-6">
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold h-11"
                >
                  {isCreating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creando...</>
                  ) : (
                    'Añadir Módulo'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={modules.map(m => m.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {modules.map((module) => (
              <SortableModuleItem 
                key={module.id} 
                module={module} 
                onToggleVisibility={toggleVisibility}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
