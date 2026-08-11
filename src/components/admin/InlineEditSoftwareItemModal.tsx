'use client'

import { useState } from 'react'
import { Pencil, Loader2, Link as LinkIcon } from 'lucide-react'
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
import { updateSoftwareItemAction } from '@/app/actions/software'

export function InlineEditSoftwareItemModal({
  item,
}: {
  item: any
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [itemType, setItemType] = useState(item.item_type || 'expansion')

  const handleUpdateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateSoftwareItemAction(formData)
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
      <DialogTrigger className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-ink-900 hover:bg-coral-500 text-ink-300 hover:text-white transition-all shadow-md border border-ink-700 absolute -top-2 -right-2 z-50 group">
        <Pencil className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleUpdateItem}>
          <input type="hidden" name="id" value={item.id} />

          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50">Editar Archivo: {item.title}</DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Modifica el enlace de Google Drive o los detalles del archivo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Tipo de Archivo</label>
                <select 
                  name="item_type" 
                  value={itemType} 
                  onChange={(e) => setItemType(e.target.value)}
                  required 
                  className="w-full rounded-xl border border-ink-800 p-2.5 text-xs font-semibold bg-ink-900 text-ink-100 mt-1 focus:outline-none focus:border-coral-500"
                >
                  <option value="expansion">Expansión / Banco</option>
                  <option value="plugin_device">Plugin / Dispositivo Max (.amxd, VST)</option>
                  <option value="installer_win">Instalador Windows</option>
                  <option value="installer_mac">Instalador macOS</option>
                  <option value="factory_content">Factory Library Base</option>
                  <option value="skin">Skin / Apariencia</option>
                  <option value="presets">Presets Sueltos</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Título del Archivo</label>
                <Input name="title" defaultValue={item.title} required className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-coral-400 uppercase flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Link de Google Drive
              </label>
              <Input name="download_url" defaultValue={item.download_url} required className="rounded-xl mt-1 font-mono text-xs bg-ink-900 border-ink-800 text-ink-100" />
            </div>

            <div className={`grid ${itemType?.startsWith('installer') ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Tamaño</label>
                <Input name="file_size" defaultValue={item.file_size || ''} className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
              </div>
              {!itemType?.startsWith('installer') && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase">Presets (#)</label>
                    <Input name="preset_count" type="number" defaultValue={item.preset_count || ''} className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase">Tag / Género</label>
                    <Input name="genre_tag" defaultValue={item.genre_tag || ''} className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
                  </div>
                </>
              )}
            </div>

            {!itemType?.startsWith('installer') && (
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Portada Imagen</label>
                <Input name="cover_image_url" defaultValue={item.cover_image_url || ''} className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Descripción</label>
              <Input name="description" defaultValue={item.description || ''} className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Archivo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
