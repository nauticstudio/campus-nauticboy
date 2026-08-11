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
      <DialogTrigger className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink-900 text-coral-400 font-bold text-xs hover:bg-ink-800 transition-all border border-ink-800 shadow-sm">
        <Plus className="w-3.5 h-3.5" />
        Añadir Archivo
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreateItem}>
          <input type="hidden" name="product_id" value={productId} />

          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50">Añadir Archivo al Producto</DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Registra un instalador, expansión o plugin para este producto.
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
                  <option value="factory_content">Factory Library Base</option>
                  <option value="skin">Skin / Apariencia</option>
                  <option value="preset_pack">Presets Sueltos</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Título del Archivo</label>
                <Input name="title" required className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. Instalador v1.2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-coral-400 uppercase flex items-center gap-1">
                <LinkIcon className="w-3 h-3" /> Link de Google Drive
              </label>
              <Input name="download_url" required className="rounded-xl mt-1 font-mono text-xs bg-ink-900 border-ink-800 text-ink-100" placeholder="https://drive.google.com/..." />
            </div>

            <div className={`grid ${itemType.startsWith('installer') ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Tamaño</label>
                <Input name="file_size" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. 1.5 GB" />
              </div>
              {!itemType.startsWith('installer') && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase">Presets (#)</label>
                    <Input name="preset_count" type="number" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase">Tag / Género</label>
                    <Input name="genre_tag" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. EDM" />
                  </div>
                </>
              )}
            </div>

            {!itemType.startsWith('installer') && (
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Portada Imagen</label>
                <Input name="cover_image_url" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Descripción</label>
              <Input name="description" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Archivo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
