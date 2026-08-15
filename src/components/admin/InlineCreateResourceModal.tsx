'use client'

import { useState } from 'react'
import { Plus, Loader2, Link2, FileText, HardDrive, Cpu, Tag, ImageIcon } from 'lucide-react'
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
import { createResourceAction } from '@/app/actions/resources'

export function InlineCreateResourceModal({
  categoryId,
  categoryName,
}: {
  categoryId: string
  categoryName: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [imgError, setImgError] = useState(false)
  const [platform, setPlatform] = useState<'macos' | 'windows' | 'all'>('all')

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('category_id', categoryId)
    formData.append('platform', platform)
    const res = await createResourceAction(formData)
    setLoading(false)
    if (res.success) {
      setOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral-500 text-white font-bold text-xs hover:bg-coral-600 transition-all shadow-[0_4px_16px_rgba(255,98,19,0.35)] active:scale-95 cursor-pointer">
        <Plus className="w-4 h-4" />
        <span>Añadir Recurso</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <Plus className="w-5 h-5 text-coral-400" />
              Nuevo Recurso en {categoryName}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Añade un nuevo material o archivo para que los alumnos lo descarguen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-coral-400" /> Título del Recurso
              </label>
              <Input
                name="title"
                required
                className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500"
                placeholder="Ej. FL Studio 24 / Ableton Live 12 Suite"
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
                <Link2 className="w-3.5 h-3.5 text-coral-400" /> Enlace de Google Drive o Descarga
              </label>
              <Input
                name="download_url"
                required
                type="url"
                className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs"
                placeholder="https://drive.google.com/file/d/..."
              />
              <span className="text-[10px] text-ink-400 mt-0.5 block">
                Pega el link de Drive o URL directa del archivo.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-coral-400" /> Nombre de Archivo
                </label>
                <Input
                  name="file_name"
                  required
                  className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                  placeholder="ej. FL_Studio_v24_macOS.zip"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-coral-400" /> Tamaño (ej. 1.15 GB / 450 MB)
                </label>
                <Input
                  name="file_size"
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
                  defaultValue="1.0"
                  className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 text-xs"
                  placeholder="24.1"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Descripción</label>
              <textarea
                name="description"
                className="w-full rounded-xl border border-ink-800 bg-ink-900 text-xs p-3 text-ink-100 min-h-[65px] mt-1 focus:outline-none focus:border-coral-500"
                placeholder="Breve descripción o notas para el alumno..."
              />
            </div>
          </div>

          <DialogFooter className="mt-5 gap-2">
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
              disabled={loading}
              className="bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-10 px-5 text-xs shadow-lg shadow-coral-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Publicar Recurso'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
