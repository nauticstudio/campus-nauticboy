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
import { GripVertical, Eye, EyeOff, Edit3, Trash2, Plus } from 'lucide-react'

// Mock types
type ModuleType = {
  id: string
  title: string
  description: string
  isPublished: boolean
}

// Sortable Item Component
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
          ? 'bg-white border-slate-200/60 shadow-sm'
          : 'bg-slate-50 border-dashed border-slate-300 opacity-75'
      } ${isDragging ? 'shadow-lg border-cyan-300 ring-2 ring-cyan-500/20' : 'hover:border-cyan-300 hover:shadow-md'}`}
    >
      <div className="flex items-center gap-4 flex-1">
        <button
          {...attributes}
          {...listeners}
          className="p-2 -m-2 cursor-grab active:cursor-grabbing text-slate-400 hover:text-cyan-600 transition-colors"
          title="Arrastrar para reordenar"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className={`font-bold text-sm ${module.isPublished ? 'text-slate-900' : 'text-slate-500'}`}>
            {module.title}
          </span>
          <span className="text-xs font-medium text-slate-400">
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
              ? 'text-emerald-600 hover:bg-emerald-50'
              : 'text-rose-500 hover:bg-rose-50'
          }`}
          title={module.isPublished ? 'Ocultar módulo' : 'Publicar módulo'}
        >
          {module.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1"></div>

        <button className="p-2 rounded-xl text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 transition-colors">
          <Edit3 className="w-4 h-4" />
        </button>
        <button className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function CourseEditor() {
  const [modules, setModules] = useState<ModuleType[]>([
    { id: 'm1', title: '1. Introducción al Sonido', description: 'Conceptos básicos de audio digital', isPublished: true },
    { id: 'm2', title: '2. Síntesis Básica', description: 'Osciladores, filtros y envolventes', isPublished: true },
    { id: 'm3', title: '3. Diseño de Baterías', description: 'Creando kicks y snares potentes', isPublished: false },
    { id: 'm4', title: '4. Arreglo y Estructura', description: 'Cómo estructurar un track profesional', isPublished: true },
  ])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setModules((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id)
        const newIndex = items.findIndex((i) => i.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const toggleVisibility = (id: string) => {
    setModules(modules.map(m => 
      m.id === id ? { ...m, isPublished: !m.isPublished } : m
    ))
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Estructura del Curso</h2>
        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md shadow-slate-900/20 hover:bg-slate-800 transition-all">
          <Plus className="w-3.5 h-3.5" /> Añadir Módulo
        </button>
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
