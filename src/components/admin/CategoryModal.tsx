'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Image as ImageIcon, Edit3, Upload, RotateCcw, Trash2, Move, ZoomIn, Eye, EyeOff } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { upsertCategoryAction, deleteCategoryAction } from '@/app/actions/categories'
import { createClient } from '@/lib/supabase/client'
import { parseCoverUrl, buildCoverUrl, DEFAULT_COVER_POS, type CoverPos } from '@/lib/utils/cover-style'

export type CategoryRow = {
  id: string
  name: string
  slug: string
  icon: string | null
  icon_url: string | null
  cover_image_url: string | null
  accent_color: 'coral' | 'violet' | 'cyan' | 'emerald' | 'rose'
  blurb: string | null
  is_published?: boolean
}

const ACCENTS: CategoryRow['accent_color'][] = ['coral', 'violet', 'cyan', 'emerald', 'rose']

function isValidHttpUrl(url: string): boolean {
  if (!url) return false
  if (url.startsWith('data:image/')) return true
  try { const u = new URL(url.split('#pos=')[0]); return u.protocol === 'https:' || u.protocol === 'http:' }
  catch { return false }
}

export function CategoryModal({
  open, onClose, category,
}: {
  open: boolean
  onClose: () => void
  /** undefined → nueva categoría */
  category?: CategoryRow
}) {
  const router = useRouter()
  const isEdit = !!category
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState(category?.cover_image_url ?? '')
  const [isPublished, setIsPublished] = useState(category?.is_published ?? true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const parsedCover = useMemo(() => parseCoverUrl(previewUrl), [previewUrl])
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null)

  const updatePos = (newPos: Partial<CoverPos>) => {
    const currentPos = parsedCover.pos
    const updated = { ...currentPos, ...newPos }
    const newUrl = buildCoverUrl(parsedCover.baseUrl, updated)
    setPreviewUrl(newUrl)
  }

  useEffect(() => {
    setError(null)
    setPreviewUrl(category?.cover_image_url ?? '')
    setIsPublished(category?.is_published ?? true)
  }, [category, open])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError(null)

    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `category-cover-${Date.now()}.${fileExt}`
      const filePath = `categories/${fileName}`

      // Intentar subir a Supabase Storage bucket 'campus-assets'
      const { data, error: uploadError } = await supabase.storage
        .from('campus-assets')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        // Fallback a base64 Data URL si el bucket no está configurado aún en Supabase
        const reader = new FileReader()
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            setPreviewUrl(reader.result)
          }
          setUploadingImage(false)
        }
        reader.readAsDataURL(file)
        return
      }

      const { data: { publicUrl } } = supabase.storage
        .from('campus-assets')
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
    } catch (err: any) {
      console.error('Error al subir imagen:', err)
      setError('No se pudo subir la imagen. Puedes pegar una URL manualmente.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const res = await upsertCategoryAction(formData)
    setLoading(false)
    if ('error' in res) setError(res.error)
    else { router.refresh(); onClose() }
  }

  const handleDelete = async () => {
    if (!category) return
    if (!confirm(`¿Eliminar "${category.name}"? Los recursos ligados quedan huérfanos.`)) return
    setDeleting(true)
    const res = await deleteCategoryAction(category.id)
    setDeleting(false)
    if ('error' in res) setError(res.error)
    else { router.refresh(); onClose() }
  }

  const showPreview = useMemo(() => isValidHttpUrl(previewUrl), [previewUrl])

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-[560px] glass-card text-ink-50 rounded-[var(--radius)] p-6 border-ink-700/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="font-display text-2xl font-semibold text-ink-50 tracking-editorial">
              {isEdit ? 'Editar categoría' : 'Nueva categoría'}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Personaliza icono, portada y color. Sube una imagen desde tu equipo o ingresa una URL.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1 custom-scrollbar">
            {isEdit && <input type="hidden" name="id" value={category.id} />}
            <input type="hidden" name="is_published" value={isPublished ? 'true' : 'false'} />

            {/* Toggle de Estado (Publicada / Oculta) */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-ink-900/80 border border-ink-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${isPublished ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/15 border-amber-500/30 text-amber-400'}`}>
                  {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-ink-50">
                    {isPublished ? 'Categoría Publicada' : 'Categoría Oculta'}
                  </div>
                  <div className="text-[10px] text-ink-400 font-medium">
                    {isPublished ? 'Visible para todos los alumnos' : 'Oculta en la Academia (solo visible para admin)'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPublished(!isPublished)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isPublished ? 'bg-emerald-500' : 'bg-ink-700'}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isPublished ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Nombre *</label>
                <Input name="name" required defaultValue={category?.name ?? ''}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50"
                  placeholder="Ej. Sintetizadores" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Identificador (URL) *</label>
                <Input name="slug" required defaultValue={category?.slug ?? ''}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-xs"
                  placeholder="sintetizadores" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex justify-between">
                <span>Descripción Breve</span>
                <span className="text-[9px] text-ink-400">Opcional</span>
              </label>
              <Input name="blurb" defaultValue={category?.blurb ?? ''}
                className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50"
                placeholder="Texto corto que se mostrará en la tarjeta principal" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex justify-between">
                  <span>Icono Predeterminado</span>
                </label>
                <Input name="icon" defaultValue={category?.icon ?? 'cpu'}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-xs"
                  placeholder="cpu | waves | music4 …" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Icono Personalizado (URL)</label>
                <Input name="icon_url" type="url" defaultValue={category?.icon_url ?? ''}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-[11px]"
                  placeholder="https://cdn.example.com/icon.svg" />
              </div>
            </div>

            {/* Portada con Subida de Archivo + URL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-coral-400" /> Imagen de Portada (Cover)
                </span>
                <span className="text-[9px] text-ink-400 font-medium">URL o archivo local</span>
              </label>

              <div className="flex gap-2 items-center">
                <Input
                  name="cover_image_url"
                  type="text"
                  value={previewUrl}
                  onChange={(e) => setPreviewUrl(e.target.value)}
                  className="rounded-xl bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-[11px] flex-1"
                  placeholder="https://... o sube una imagen" />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <Button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-ink-800 hover:bg-ink-700 border border-ink-700 text-ink-100 text-xs font-semibold px-3 py-2 rounded-xl shrink-0 gap-1.5"
                >
                  {uploadingImage ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-coral-400" />
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5 text-coral-400" />
                      <span>Subir</span>
                    </>
                  )}
                </Button>
              </div>
            </div>

            {showPreview && (
              <div className="space-y-3 pt-1">
                <div 
                  className="relative h-44 rounded-xl overflow-hidden border border-ink-700/80 cursor-grab active:cursor-grabbing select-none group bg-ink-950/80"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                    dragStartRef.current = {
                      startX: e.clientX,
                      startY: e.clientY,
                      initialX: parsedCover.pos.x,
                      initialY: parsedCover.pos.y,
                    }
                  }}
                  onMouseMove={(e) => {
                    if (!isDragging || !dragStartRef.current) return
                    const deltaX = e.clientX - dragStartRef.current.startX
                    const deltaY = e.clientY - dragStartRef.current.startY
                    const newX = Math.max(0, Math.min(100, dragStartRef.current.initialX - deltaX * 0.4))
                    const newY = Math.max(0, Math.min(100, dragStartRef.current.initialY - deltaY * 0.4))
                    updatePos({ x: newX, y: newY })
                  }}
                  onMouseUp={() => { setIsDragging(false); dragStartRef.current = null }}
                  onMouseLeave={() => { setIsDragging(false); dragStartRef.current = null }}
                >
                  <img
                    src={parsedCover.baseUrl}
                    alt="preview"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-75 pointer-events-none"
                    style={{
                      objectPosition: `${parsedCover.pos.x}% ${parsedCover.pos.y}%`,
                      transform: parsedCover.pos.zoom !== 1 ? `scale(${parsedCover.pos.zoom})` : undefined,
                      transformOrigin: `${parsedCover.pos.x}% ${parsedCover.pos.y}%`,
                    }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.15' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent pointer-events-none" />
                  
                  <div className="absolute top-2.5 right-2.5 bg-ink-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-coral-300 border border-coral-500/30 flex items-center gap-1.5 shadow-md">
                    <Move className="w-3 h-3 text-coral-400" /> Arrastra para encuadrar
                  </div>

                  <div className="absolute bottom-2.5 left-3 text-[10px] font-bold text-ink-200 uppercase tracking-widest flex items-center gap-2 pointer-events-none">
                    <span>X: {Math.round(parsedCover.pos.x)}%</span>
                    <span>•</span>
                    <span>Y: {Math.round(parsedCover.pos.y)}%</span>
                    <span>•</span>
                    <span>Zoom: {parsedCover.pos.zoom.toFixed(1)}x</span>
                  </div>
                </div>

                {/* Sliders Control Panel */}
                <div className="p-3.5 rounded-xl bg-ink-900/60 border border-ink-800 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest flex justify-between">
                        <span>Eje Y (Arriba/Abajo)</span>
                        <span className="text-coral-400">{Math.round(parsedCover.pos.y)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={parsedCover.pos.y}
                        onChange={(e) => updatePos({ y: Number.parseFloat(e.target.value) })}
                        className="w-full accent-coral-500 bg-ink-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest flex justify-between">
                        <span>Eje X (Izq/Der)</span>
                        <span className="text-coral-400">{Math.round(parsedCover.pos.x)}%</span>
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={parsedCover.pos.x}
                        onChange={(e) => updatePos({ x: Number.parseFloat(e.target.value) })}
                        className="w-full accent-coral-500 bg-ink-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-ink-400 uppercase tracking-widest flex justify-between">
                        <span className="flex items-center gap-1"><ZoomIn className="w-2.5 h-2.5 text-coral-400" /> Zoom</span>
                        <span className="text-coral-400">{parsedCover.pos.zoom.toFixed(1)}x</span>
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="2.5"
                        step="0.05"
                        value={parsedCover.pos.zoom}
                        onChange={(e) => updatePos({ zoom: Number.parseFloat(e.target.value) })}
                        className="w-full accent-coral-500 bg-ink-800 h-1.5 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-ink-800/60">
                    <button
                      type="button"
                      onClick={() => updatePos({ x: 50, y: 50, zoom: 1 })}
                      className="text-[10px] font-bold text-ink-400 hover:text-ink-100 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" /> Restablecer Encuadre
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewUrl('')}
                      className="text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Quitar Portada
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs font-semibold bg-destructive/15 border border-destructive/40 text-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex items-center justify-between">
            <div>
              {isEdit && (
                <Button type="button" onClick={handleDelete}
                  disabled={deleting || loading}
                  className="text-xs font-bold text-red-300 hover:text-red-200 hover:bg-destructive/10 bg-transparent border border-red-900/50 rounded-xl">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Eliminar'}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={onClose} variant="ghost"
                className="text-xs font-bold text-ink-300 hover:text-ink-50 hover:bg-ink-800 rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-[0_0_20px_-6px_rgba(255,98,19,0.5)]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEdit ? 'Guardar' : 'Crear categoría')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/** Botón "Nueva categoría" para el header del admin page */
export function CategoryNewButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-[0_0_20px_-4px_rgba(255,98,19,0.5)] hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Nueva Categoría</span>
      </button>
      <CategoryModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

/** Botón "Editar" que abre el modal con la categoría cargada */
export function CategoryEditButton({ category }: { category: CategoryRow }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Editar ${category.name}`}
        className="p-2 rounded-xl text-ink-400 hover:text-coral-300 hover:bg-ink-800/60 transition-colors"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <CategoryModal open={open} onClose={() => setOpen(false)} category={category} />
    </>
  )
}
