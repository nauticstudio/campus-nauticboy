'use client'

import { useState } from 'react'
import { FolderPlus, Loader2, ImageIcon, Folder, FileText } from 'lucide-react'
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
import { createCollectionAction } from '@/app/actions/collections'

export function InlineCreateCollectionModal({
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

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('category_id', categoryId)

    const res = await createCollectionAction(formData)
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
      <DialogTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ink-900 hover:bg-ink-850 text-ink-100 border border-ink-700/60 font-bold text-xs hover:border-coral-500/50 transition-all active:scale-95 cursor-pointer shadow-sm">
        <FolderPlus className="w-4 h-4 text-coral-400" />
        <span>Nueva Colección</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <FolderPlus className="w-5 h-5 text-coral-400" />
              Nueva Colección en {categoryName}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Crea una carpeta o sub-categoría para agrupar recursos por marca, fabricante o temática (ej. Vengeance Sound, Cymatics).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-coral-400" /> Nombre de la Colección / Marca
              </label>
              <Input
                name="name"
                required
                className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-sm font-semibold"
                placeholder="Ej. Vengeance Sound"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-coral-400" /> Logo o Portada (URL)
              </label>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-10 h-10 rounded-xl bg-ink-950 border border-ink-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                  {thumbnailUrl && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnailUrl}
                      alt="Preview"
                      className="w-full h-full object-contain p-1"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <Folder className="w-5 h-5 text-ink-600" />
                  )}
                </div>
                <Input
                  name="thumbnail_url"
                  value={thumbnailUrl}
                  onChange={(e) => {
                    setThumbnailUrl(e.target.value)
                    setImgError(false)
                  }}
                  className="rounded-xl bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs"
                  placeholder="https://iili.io/..."
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Descripción (Opcional)</label>
              <textarea
                name="description"
                className="w-full rounded-xl border border-ink-800 bg-ink-950 text-xs p-2.5 text-ink-100 min-h-[60px] mt-1 focus:outline-none focus:border-coral-500"
                placeholder="Librerías completas y paquetes de sonido de Vengeance..."
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
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
                  Creando...
                </>
              ) : (
                'Crear Colección'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
