'use client'

import { useState } from 'react'
import { Pencil, Loader2, Link2, FileText, HardDrive, Cpu, Tag, Trash2, ImageIcon } from 'lucide-react'
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
import { updateResourceAction, deleteResourceAction } from '@/app/actions/resources'
import { formatFileSize } from '@/lib/utils'

export function InlineEditResourceModal({
  resource,
}: {
  resource: {
    id: string
    title: string
    description: string | null
    software: string | null
    file_name: string
    file_size: number | null
    version?: string | null
    storage_path?: string
    thumbnail_url?: string | null
    tags?: string[] | null
  }
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState(resource.thumbnail_url || '')
  const [imgError, setImgError] = useState(false)

  const initialPlatform = resource.tags?.includes('macos') && !resource.tags?.includes('windows')
    ? 'macos'
    : resource.tags?.includes('windows') && !resource.tags?.includes('macos')
    ? 'windows'
    : 'all'
  const [platform, setPlatform] = useState<'macos' | 'windows' | 'all'>(initialPlatform)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('id', resource.id)
    formData.append('platform', platform)
    const res = await updateResourceAction(formData)
    setLoading(false)
    if (res.success) {
      setOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el recurso "${resource.title}"? Esta acción no se puede deshacer.`)) {
      return
    }
    setDeleting(true)
    const res = await deleteResourceAction(resource.id)
    setDeleting(false)
    if (res.success) {
      setOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  const humanSize = formatFileSize(resource.file_size)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="p-2 rounded-xl text-ink-400 hover:text-white hover:bg-ink-800 transition-colors border border-transparent hover:border-ink-700 cursor-pointer"
        title={`Editar ${resource.title}`}
        aria-label={`Editar ${resource.title}`}
      >
        <Pencil className="w-3.5 h-3.5" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleUpdate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-coral-400" />
              Editar Recurso
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Modifica los detalles, imagen, plataforma o enlace de descarga de este material.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-coral-400" /> Título del Recurso
              </label>
              <Input
                name="title"
                defaultValue={resource.title}
                required
                className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500"
              />
            </div>

            {/* Plataforma / Sistema Operativo */}
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-coral-400" /> Plataforma / Sistema Operativo
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setPlatform('macos')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    platform === 'macos'
                      ? 'bg-coral-500/20 border-coral-500 text-coral-300 shadow-sm'
                      : 'bg-ink-900 border-ink-800 text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <span> macOS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('windows')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    platform === 'windows'
                      ? 'bg-coral-500/20 border-coral-500 text-coral-300 shadow-sm'
                      : 'bg-ink-900 border-ink-800 text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <span>🪟 Windows</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPlatform('all')}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    platform === 'all'
                      ? 'bg-coral-500/20 border-coral-500 text-coral-300 shadow-sm'
                      : 'bg-ink-900 border-ink-800 text-ink-400 hover:text-ink-200'
                  }`}
                >
                  <span>Ambos / Multi</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-coral-400" /> Icono / Portada / Logo (URL)
              </label>
              <div className="flex items-center gap-3 mt-1">
                <div className="w-12 h-12 rounded-xl bg-ink-900 border border-ink-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                  {thumbnailUrl && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailUrl}
                      alt="Preview"
                      className="w-full h-full object-contain p-1"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-ink-600" />
                  )}
                </div>
                <div className="flex-1">
                  <Input
                    name="thumbnail_url"
                    value={thumbnailUrl}
                    onChange={(e) => {
                      setThumbnailUrl(e.target.value)
                      setImgError(false)
                    }}
                    className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs"
                    placeholder="https://... (PNG, SVG, WebP o imagen del DAW)"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <Link2 className="w-3.5 h-3.5 text-coral-400" /> Enlace de Google Drive / Descarga (Opcional si no cambia)
              </label>
              <Input
                name="download_url"
                type="url"
                className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs"
                placeholder="https://drive.google.com/..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-coral-400" /> Nombre de Archivo
                </label>
                <Input
                  name="file_name"
                  defaultValue={resource.file_name}
                  required
                  className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-coral-400" /> Tamaño (ej. 1.15 GB / 450 MB)
                </label>
                <Input
                  name="file_size"
                  defaultValue={humanSize}
                  className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 text-xs"
                  placeholder="Ej. 1.15 GB"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-coral-400" /> Software / DAW
                </label>
                <Input
                  name="software"
                  defaultValue={resource.software || ''}
                  className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 text-xs"
                  placeholder="Ej. FL Studio"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  Versión
                </label>
                <Input
                  name="version"
                  defaultValue={resource.version || '1.0'}
                  className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Descripción</label>
              <textarea
                name="description"
                defaultValue={resource.description || ''}
                className="w-full rounded-xl border border-ink-800 bg-ink-900 text-xs p-3 text-ink-100 min-h-[65px] mt-1 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          <DialogFooter className="mt-5 flex items-center justify-between sm:justify-between w-full gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={deleting || loading}
              onClick={handleDelete}
              className="rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-800 text-xs font-semibold h-10 px-3 flex items-center gap-1.5"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Eliminar</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-ink-800 hover:bg-ink-900 text-ink-300 h-10 text-xs"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || deleting}
                className="bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-10 px-4 text-xs shadow-lg shadow-coral-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
