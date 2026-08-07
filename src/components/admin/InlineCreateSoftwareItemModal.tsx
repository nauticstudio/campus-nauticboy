'use client'

import { useState } from 'react'
import { Plus, Loader2, Link as LinkIcon } from 'lucide-react'
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
import { createSoftwareItemAction } from '@/app/actions/software'

export function InlineCreateSoftwareItemModal({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [itemType, setItemType] = useState('expansion')

  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createSoftwareItemAction(formData)
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
      <DialogTrigger className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-[10px] uppercase hover:bg-slate-200 transition-colors">
        <Plus className="w-3.5 h-3.5" />
        Añadir Archivo
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] bg-white text-slate-900 rounded-3xl p-6 border-slate-200">
        <form onSubmit={handleCreateItem}>
          <input type="hidden" name="software_id" value={productId} />

          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-black">Añadir Archivo al Producto</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Registra un instalador, expansión o plugin para este producto.
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
                <Input name="title" required className="rounded-xl mt-1" placeholder="Ej. Instalador v1.2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-cyan-600 uppercase flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Link de Google Drive
              </label>
              <Input name="download_url" required className="rounded-xl mt-1 font-mono text-xs border-cyan-300" placeholder="https://drive.google.com/..." />
            </div>

            <div className={`grid ${itemType.startsWith('installer') ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Tamaño</label>
                <Input name="file_size" className="rounded-xl mt-1" placeholder="Ej. 1.5 GB" />
              </div>
              {!itemType.startsWith('installer') && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Presets (#)</label>
                    <Input name="preset_count" type="number" className="rounded-xl mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Tag / Género</label>
                    <Input name="genre_tag" className="rounded-xl mt-1" placeholder="Ej. EDM" />
                  </div>
                </>
              )}
            </div>

            {!itemType.startsWith('installer') && (
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Portada Imagen</label>
                <Input name="cover_image_url" className="rounded-xl mt-1" />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
              <Input name="description" className="rounded-xl mt-1" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Archivo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
