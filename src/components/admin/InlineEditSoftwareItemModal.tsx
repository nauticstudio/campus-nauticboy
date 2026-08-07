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
  
  // Local state to manage the type changes for conditional fields
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
      <DialogTrigger className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100/50 hover:bg-white text-slate-400 hover:text-cyan-600 transition-all shadow-sm border border-slate-200 absolute top-2 right-2 z-50 group">
        <Pencil className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] bg-white text-slate-900 rounded-3xl p-6 border-slate-200">
        <form onSubmit={handleUpdateItem}>
          <input type="hidden" name="id" value={item.id} />

          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-black">Editar Archivo: {item.title}</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Modifica el enlace de Google Drive o los detalles del archivo.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Tipo de Archivo</label>
                <select 
                  name="item_type" 
                  value={itemType} 
                  onChange={(e) => setItemType(e.target.value)}
                  required 
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1"
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
                <label className="text-[10px] font-bold text-slate-600 uppercase">Título del Archivo</label>
                <Input name="title" defaultValue={item.title} required className="rounded-xl mt-1" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-cyan-600 uppercase flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Link de Google Drive
              </label>
              <Input name="download_url" defaultValue={item.download_url} required className="rounded-xl mt-1 font-mono text-xs border-cyan-300" />
            </div>

            <div className={`grid ${itemType?.startsWith('installer') ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Tamaño</label>
                <Input name="file_size" defaultValue={item.file_size || ''} className="rounded-xl mt-1" />
              </div>
              {!itemType?.startsWith('installer') && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Presets (#)</label>
                    <Input name="preset_count" type="number" defaultValue={item.preset_count || ''} className="rounded-xl mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Tag / Género</label>
                    <Input name="genre_tag" defaultValue={item.genre_tag || ''} className="rounded-xl mt-1" />
                  </div>
                </>
              )}
            </div>

            {!itemType?.startsWith('installer') && (
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Portada Imagen</label>
                <Input name="cover_image_url" defaultValue={item.cover_image_url || ''} className="rounded-xl mt-1" />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
              <Input name="description" defaultValue={item.description || ''} className="rounded-xl mt-1" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Archivo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
