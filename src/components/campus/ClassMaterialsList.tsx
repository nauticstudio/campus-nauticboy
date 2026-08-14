'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  FolderDown,
  Search,
  Plus,
  Filter,
  PackageOpen,
  Sparkles,
  Users,
  Calendar
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ClassMaterialCard } from './ClassMaterialCard'
import { ClassMaterialModal } from '@/components/admin/ClassMaterialModal'
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger'
import { Reveal } from '@/components/motion/Reveal'
import { NauticCard } from '@/components/ui/nautic-card'
import type { ClassMaterial, StudentOption } from '@/lib/data/class-materials'
import { deleteClassMaterialAction, togglePublishClassMaterialAction } from '@/app/actions/class-materials'
import { toast } from 'sonner'

interface ClassMaterialsListProps {
  initialMaterials: ClassMaterial[]
  students?: StudentOption[]
  isAdmin?: boolean
  showAdminUI?: boolean
}

export function ClassMaterialsList({
  initialMaterials,
  students = [],
  isAdmin = false,
  showAdminUI = false,
}: ClassMaterialsListProps) {
  const router = useRouter()
  const [materials, setMaterials] = useState<ClassMaterial[]>(initialMaterials)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all')

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<ClassMaterial | null>(null)

  // Keep state in sync if initialMaterials changes
  const handleOpenCreateModal = () => {
    setEditingMaterial(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (material: ClassMaterial) => {
    setEditingMaterial(material)
    setIsModalOpen(true)
  }

  const handleDeleteMaterial = async (id: string) => {
    const confirm = window.confirm('¿Seguro que deseas eliminar este material de clase?')
    if (!confirm) return

    const res = await deleteClassMaterialAction(id)
    if (res.success) {
      toast.success('Material de clase eliminado.')
      setMaterials((prev) => prev.filter((m) => m.id !== id))
      router.refresh()
    } else {
      toast.error(res.error || 'No se pudo eliminar el material.')
    }
  }

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    const nextState = !currentPublished
    const res = await togglePublishClassMaterialAction(id, nextState)
    if (res.success) {
      toast.success(nextState ? 'Material publicado.' : 'Material pasado a borrador.')
      setMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_published: nextState } : m))
      )
      router.refresh()
    } else {
      toast.error(res.error || 'No se pudo cambiar el estado.')
    }
  }

  // Filter materials
  const filteredMaterials = materials.filter((m) => {
    // Filter by student if admin
    if (showAdminUI && selectedStudentFilter !== 'all' && m.student_id !== selectedStudentFilter) {
      return false
    }

    if (!searchTerm.trim()) return true

    const query = searchTerm.toLowerCase()
    const matchTitle = m.title.toLowerCase().includes(query)
    const matchDesc = (m.description || '').toLowerCase().includes(query)
    const matchStudent = (m.student?.full_name || m.student?.email || '').toLowerCase().includes(query)
    const matchFiles = m.files.some((f) => f.title.toLowerCase().includes(query) || (f.file_type || '').toLowerCase().includes(query))

    return matchTitle || matchDesc || matchStudent || matchFiles
  })

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto mb-20">
      
      {/* Hero Banner */}
      <Reveal>
        <div className="relative overflow-hidden rounded-[var(--radius)] bg-ink-950 border border-[var(--border)] shadow-[var(--shadow-hero)] p-8 md:p-12 ambient-glow">
          <div className="absolute top-0 right-0 -mr-28 -mt-28 w-96 h-96 bg-coral-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-coral-500/10 border border-coral-500/30 px-3.5 py-1.5 text-xs font-bold text-coral-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{showAdminUI ? 'Panel de Administración' : 'Sesiones y Devoluciones'}</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-editorial leading-[1.05] text-ink-50">
                Material de Clase
              </h1>
              <p className="text-ink-300 text-sm md:text-base leading-relaxed">
                {showAdminUI
                  ? 'Gestiona y aloja proyectos, revisiones y stems para cada alumno tras cada sesión de producción.'
                  : 'Descarga los proyectos, revisiones, stems y recursos trabajados en tus clases particulares para continuar produciendo.'}
              </p>
            </div>

            {/* Quick Action Button for Admin */}
            {showAdminUI && (
              <div className="shrink-0">
                <Button
                  onClick={handleOpenCreateModal}
                  className="h-12 px-6 rounded-2xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-sm shadow-xl shadow-coral-500/20 active:scale-95 transition-all gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Alojar Nuevo Material</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-ink-950/80 border border-ink-800/80">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por proyecto, nota o archivo..."
            className="w-full bg-ink-900 border border-ink-800 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-ink-100 placeholder:text-ink-500 focus:outline-none focus:border-coral-500"
          />
        </div>

        {/* Student Filter (Admin only) */}
        {showAdminUI && students.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-coral-400 shrink-0" />
            <select
              value={selectedStudentFilter}
              onChange={(e) => setSelectedStudentFilter(e.target.value)}
              className="bg-ink-900 border border-ink-800 rounded-xl px-3 py-2 text-xs font-semibold text-ink-200 focus:outline-none focus:border-coral-500"
            >
              <option value="all">Todos los alumnos ({materials.length})</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name || s.email}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="text-xs font-mono font-bold text-ink-400 shrink-0 text-right">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? 'entrega' : 'entregas'}
        </div>
      </div>

      {/* Materials List */}
      {filteredMaterials.length === 0 ? (
        <NauticCard className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-coral-500/10 border border-coral-500/20 text-coral-400 flex items-center justify-center mx-auto">
            <PackageOpen className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="font-display text-lg font-bold text-ink-50">
              {searchTerm || selectedStudentFilter !== 'all'
                ? 'No se encontraron entregas con ese filtro'
                : 'Aún no hay materiales de clase'}
            </h3>
            <p className="text-xs font-medium text-ink-400 leading-relaxed">
              {showAdminUI
                ? 'Comienza alojando el primer proyecto o material para un alumno haciendo clic en "Alojar Nuevo Material".'
                : 'Cuando realices una clase de producción con Nautic, los proyectos, stems y recursos trabajados aparecerán aquí listos para descargar.'}
            </p>
          </div>

          {showAdminUI && (
            <div className="pt-2">
              <Button
                onClick={handleOpenCreateModal}
                className="bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs rounded-xl"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Alojar Primer Material</span>
              </Button>
            </div>
          )}
        </NauticCard>
      ) : (
        <StaggerGroup className="space-y-6">
          {filteredMaterials.map((material) => (
            <StaggerItem key={material.id}>
              <ClassMaterialCard
                material={material}
                isAdmin={showAdminUI}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteMaterial}
                onTogglePublish={handleTogglePublish}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      )}

      {/* Admin Modal */}
      {showAdminUI && (
        <ClassMaterialModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          materialToEdit={editingMaterial}
          students={students}
          onSuccess={() => {
            router.refresh()
          }}
        />
      )}

    </div>
  )
}
