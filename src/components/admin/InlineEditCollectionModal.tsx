'use client'

import { useState } from 'react'
import { Edit2, Loader2, Trash2, ImageIcon, Folder, FileText } from 'lucide-react'
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
import { updateCollectionAction, deleteCollectionAction } from '@/app/actions/collections'
import type { CollectionCardData } from '@/components/campus/CollectionCard'

export function InlineEditCollectionModal({
  collection,
  categorySlug,
}: {
  collection: CollectionCardData
  categorySlug: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState(collection.thumbnail_url || '')
  const [imgError, setImgError] = useState(false)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('id', collection.id)

    const res = await updateCollectionAction(formData)
    setLoading(false)
    if (res.success) {
      setOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la colección "${collection.name}"? Los recursos que contiene no se borrarán, quedarán disponibles en la categoría.`)) {
      return
    }
    setDeleteLoading(true)
    const res = await deleteCollectionAction(collection.id)
    setDeleteLoading(false)
    if (res.success) {
      setOpen(false)
      window.location.href = `/academy/${categorySlug}`
    } else {
      alert(res.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        onClick={(e) => e.stopPropagation()}
        className="p-1.5 text-ink-400 hover:text-coral-400 hover:bg-ink-800/80 rounded-lg transition-colors cursor-pointer"
        title="Editar colección"
      >
        <Edit2 className="w-3.5 h-3.5" />
      </DialogTrigger>

      <DialogContent 
        onClick={(e) => e.stopPropagation()}
        className="sm:max-w-[480px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl"
      >
        <form onSubmit={handleUpdate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <Edit2 className="w-5 h-5 text-coral-400" />
              Editar Colección
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Modifica los detalles de la colección o elimínala si ya no la necesitas.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-coral-400" /> Nombre de la Colección
              </label>
              <Input
                name="name"
                defaultValue={collection.name}
                required
                className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-sm font-semibold"
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
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Descripción</label>
              <textarea
                name="description"
                defaultValue={collection.description || ''}
                className="w-full rounded-xl border border-ink-800 bg-ink-950 text-xs p-2.5 text-ink-100 min-h-[60px] mt-1 focus:outline-none focus:border-coral-500"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={deleteLoading}
              onClick={handleDelete}
              className="rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 h-10 text-xs"
            >
              {deleteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1" />}
              Eliminar
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
                disabled={loading}
                className="bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-10 px-5 text-xs shadow-lg shadow-coral-500/20"
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
