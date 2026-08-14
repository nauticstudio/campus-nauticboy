'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Trash2,
  Loader2,
  FolderDown,
  User,
  Calendar,
  Sparkles,
  Link2,
  FileCode2,
  HelpCircle,
} from 'lucide-react'
import type { ClassMaterial, ClassMaterialFile, StudentOption } from '@/lib/data/class-materials'
import { createClassMaterialAction, updateClassMaterialAction } from '@/app/actions/class-materials'
import { toast } from 'sonner'

interface ClassMaterialModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  materialToEdit?: ClassMaterial | null
  students: StudentOption[]
  onSuccess?: () => void
}

const COMMON_FILE_TYPES = [
  'Proyecto Ableton Live (.als / .zip)',
  'Proyecto FL Studio (.flp / .zip)',
  'Stems de Audio (ZIP)',
  'Serum / Vital Presets',
  'Master / Mix WAV',
  'Documento / Notas PDF',
]

export function ClassMaterialModal({
  open,
  onOpenChange,
  materialToEdit,
  students,
  onSuccess,
}: ClassMaterialModalProps) {
  const isEditing = Boolean(materialToEdit)

  const [studentId, setStudentId] = useState<string>('')
  const [title, setTitle] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [isPublished, setIsPublished] = useState<boolean>(true)
  const [files, setFiles] = useState<ClassMaterialFile[]>([
    {
      id: `file_${Date.now()}_1`,
      title: '',
      url: '',
      file_type: 'Proyecto Ableton Live (.als / .zip)',
      file_size: '',
      note: '',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Populate form on edit or reset on create
  useEffect(() => {
    if (materialToEdit) {
      setStudentId(materialToEdit.student_id)
      setTitle(materialToEdit.title)
      setDescription(materialToEdit.description || '')
      setSessionDate(materialToEdit.session_date)
      setIsPublished(materialToEdit.is_published)
      setFiles(
        materialToEdit.files.length > 0
          ? materialToEdit.files
          : [
              {
                id: `file_${Date.now()}_1`,
                title: '',
                url: '',
                file_type: 'Proyecto Ableton Live (.als / .zip)',
                file_size: '',
                note: '',
              },
            ]
      )
    } else {
      setStudentId(students[0]?.id || '')
      setTitle('')
      setDescription('')
      setSessionDate(new Date().toISOString().split('T')[0])
      setIsPublished(true)
      setFiles([
        {
          id: `file_${Date.now()}_1`,
          title: '',
          url: '',
          file_type: 'Proyecto Ableton Live (.als / .zip)',
          file_size: '',
          note: '',
        },
      ])
    }
    setErrorMsg(null)
  }, [materialToEdit, students, open])

  const addFileRow = () => {
    setFiles((prev) => [
      ...prev,
      {
        id: `file_${Date.now()}_${prev.length + 1}`,
        title: '',
        url: '',
        file_type: 'Stems de Audio (ZIP)',
        file_size: '',
        note: '',
      },
    ])
  }

  const removeFileRow = (id: string) => {
    if (files.length <= 1) {
      toast.error('Debe haber al menos un archivo en la entrega.')
      return
    }
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFileField = (id: string, field: keyof ClassMaterialFile, value: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!studentId) {
      setErrorMsg('Debes seleccionar un alumno destinatario.')
      return
    }

    if (!title.trim()) {
      setErrorMsg('El título de la clase es obligatorio.')
      return
    }

    // Validate files
    for (let i = 0; i < files.length; i++) {
      const f = files[i]
      if (!f.title.trim()) {
        setErrorMsg(`Indica el nombre del archivo #${i + 1}.`)
        return
      }
      if (!f.url.trim()) {
        setErrorMsg(`Indica el enlace de descarga o Google Drive para el archivo "${f.title || `#${i + 1}`}".`)
        return
      }
    }

    setLoading(true)

    try {
      const payload = {
        student_id: studentId,
        title: title.trim(),
        description: description.trim() || null,
        session_date: sessionDate,
        files: files.map((f) => ({
          id: f.id,
          title: f.title.trim(),
          url: f.url.trim(),
          file_type: f.file_type?.trim() || undefined,
          file_size: f.file_size?.trim() || undefined,
          note: f.note?.trim() || undefined,
        })),
        is_published: isPublished,
      }

      let res
      if (isEditing && materialToEdit) {
        res = await updateClassMaterialAction(materialToEdit.id, payload)
      } else {
        res = await createClassMaterialAction(payload)
      }

      setLoading(false)

      if (res.success) {
        toast.success(
          isEditing
            ? 'Material de clase actualizado correctamente.'
            : 'Material de clase publicado y asignado al alumno.'
        )
        onOpenChange(false)
        if (onSuccess) onSuccess()
      } else {
        setErrorMsg(res.error || 'Ocurrió un error al procesar el material.')
      }
    } catch (err: unknown) {
      setLoading(false)
      const message = err instanceof Error ? err.message : 'Error inesperado al guardar.'
      setErrorMsg(message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-ink-950 text-ink-100 border border-ink-800 rounded-[var(--radius)] p-6 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <DialogHeader className="space-y-2 border-b border-ink-800/80 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-coral-400 uppercase tracking-widest">
              <FolderDown className="w-4 h-4" />
              <span>{isEditing ? 'Editar Material de Clase' : 'Alojar Nuevo Material de Clase'}</span>
            </div>
            <DialogTitle className="font-display text-2xl font-bold text-ink-50 tracking-quant">
              {isEditing ? 'Modificar Material' : 'Subir Proyecto / Devolución de Clase'}
            </DialogTitle>
            <DialogDescription className="text-xs text-ink-300">
              Asigna los enlaces de Google Drive y notas del proyecto trabajado para que el alumno pueda descargarlo en su campus.
            </DialogDescription>
          </DialogHeader>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-4">
            
            {/* Student & Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Student Selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-coral-400" />
                  <span>Alumno Destinatario *</span>
                </label>
                <select
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="w-full bg-ink-900 border border-ink-800 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-ink-100 focus:outline-none focus:border-coral-500"
                >
                  <option value="" disabled>Selecciona un alumno...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.full_name || s.email} {s.full_name ? `(${s.email})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-coral-400" />
                  <span>Fecha de la Clase *</span>
                </label>
                <Input
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  required
                  className="bg-ink-900 border-ink-800 text-ink-100 rounded-xl text-xs font-mono"
                />
              </div>

            </div>

            {/* Session Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-400" />
                <span>Título de la Clase / Proyecto *</span>
              </label>
              <Input
                placeholder="Ej: Clase de Producción — Track Colaborativo (Mix & Master)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-ink-900 border-ink-800 text-ink-100 rounded-xl text-sm font-semibold placeholder:text-ink-500"
              />
            </div>

            {/* Teacher Notes / Description */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1.5">
                <span>Notas de la Sesión & Feedback (Opcional)</span>
              </label>
              <Textarea
                placeholder="Ej: Revisamos la estructura del drop, ecualizamos el sub y afinamos los drums. Continúa trabajando en el segundo verso para la próxima clase."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="bg-ink-900 border-ink-800 text-ink-100 rounded-xl text-xs leading-relaxed placeholder:text-ink-500 resize-none"
              />
            </div>

            {/* Multi-Files Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-coral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <FolderDown className="w-4 h-4" />
                  <span>Archivos de la Entrega (Google Drive / Enlaces)</span>
                </label>
                <Button
                  type="button"
                  onClick={addFileRow}
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 rounded-lg border-ink-700 bg-ink-900 text-coral-400 hover:bg-ink-800 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir otro archivo</span>
                </Button>
              </div>

              {/* Repeater items */}
              <div className="space-y-3">
                {files.map((file, idx) => (
                  <div
                    key={file.id}
                    className="p-4 rounded-xl bg-ink-900/80 border border-ink-800 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-ink-800/60 pb-2">
                      <span className="text-xs font-bold text-ink-300 flex items-center gap-1.5">
                        <FileCode2 className="w-3.5 h-3.5 text-coral-400" />
                        <span>Archivo #{idx + 1}</span>
                      </span>

                      {files.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFileRow(file.id)}
                          className="p-1 rounded-lg text-ink-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                          title="Eliminar este archivo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* File Name & Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ink-400 uppercase">
                          Nombre del Archivo *
                        </label>
                        <Input
                          placeholder="Ej: Proyecto Ableton Live 12 (v2 Revisado)"
                          value={file.title}
                          onChange={(e) => updateFileField(file.id, 'title', e.target.value)}
                          required
                          className="bg-ink-950 border-ink-800 text-xs text-ink-100 rounded-lg h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ink-400 uppercase">
                          Tipo / Formato
                        </label>
                        <Input
                          list={`common_types_${file.id}`}
                          placeholder="Ej: Proyecto ALS, Stems ZIP..."
                          value={file.file_type || ''}
                          onChange={(e) => updateFileField(file.id, 'file_type', e.target.value)}
                          className="bg-ink-950 border-ink-800 text-xs text-ink-100 rounded-lg h-9"
                        />
                        <datalist id={`common_types_${file.id}`}>
                          {COMMON_FILE_TYPES.map((t) => (
                            <option key={t} value={t} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    {/* URL & Size */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-ink-400 uppercase flex items-center gap-1">
                          <Link2 className="w-3 h-3 text-coral-400" />
                          <span>Enlace de Google Drive / Descarga *</span>
                        </label>
                        <Input
                          placeholder="https://drive.google.com/file/d/... o enlace directo"
                          value={file.url}
                          onChange={(e) => updateFileField(file.id, 'url', e.target.value)}
                          required
                          className="bg-ink-950 border-ink-800 text-xs text-ink-100 font-mono rounded-lg h-9"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ink-400 uppercase">
                          Tamaño (Opcional)
                        </label>
                        <Input
                          placeholder="Ej: 450 MB"
                          value={file.file_size || ''}
                          onChange={(e) => updateFileField(file.id, 'file_size', e.target.value)}
                          className="bg-ink-950 border-ink-800 text-xs text-ink-100 rounded-lg h-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Publication switch */}
            <div className="pt-2 flex items-center justify-between p-3.5 rounded-xl bg-ink-900/60 border border-ink-800">
              <div>
                <span className="text-xs font-bold text-ink-100 block">Visibilidad para el alumno</span>
                <span className="text-[11px] text-ink-400">
                  {isPublished
                    ? 'El material será visible inmediatamente en el campus del alumno.'
                    : 'Guardar como borrador privado (solo visible para ti).'
                  }
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-ink-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-coral-500" />
              </label>
            </div>

          </div>

          <DialogFooter className="border-t border-ink-800/80 pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-ink-800 text-ink-300 hover:bg-ink-900"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl px-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Guardando...
                </>
              ) : isEditing ? (
                'Guardar Cambios'
              ) : (
                'Alojar y Asignar Material'
              )}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  )
}
