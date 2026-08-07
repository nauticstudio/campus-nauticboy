'use client'

import { useState } from 'react'
import { Pencil, Loader2 } from 'lucide-react'
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
import { updateSoftwareProductAction } from '@/app/actions/software'

export function InlineEditSoftwareModal({
  product,
  manufacturers,
}: {
  product: any
  manufacturers: any[]
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateSoftwareProductAction(formData)
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
      <DialogTrigger className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/50 hover:bg-slate-900 text-white transition-all shadow-sm border border-white/10 backdrop-blur-md absolute top-4 right-4 z-50 group">
        <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 rounded-3xl p-6 border-slate-200">
        <form onSubmit={handleUpdateProduct}>
          <input type="hidden" name="id" value={product.id} />

          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-black">Editar Producto: {product.name}</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Modifica los detalles del producto. Los cambios se reflejarán instantáneamente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Fabricante</label>
              <select name="manufacturer_id" defaultValue={product.manufacturer_id} required className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1">
                {manufacturers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre del Producto</label>
              <Input name="name" defaultValue={product.name} required className="rounded-xl mt-1" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Lema / Subtítulo</label>
              <Input name="tagline" defaultValue={product.tagline || ''} className="rounded-xl mt-1" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
              <textarea name="description" defaultValue={product.description || ''} className="w-full rounded-xl border border-slate-200 text-xs p-3 min-h-[70px] mt-1" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">URL de Portada</label>
              <Input name="cover_image_url" defaultValue={product.cover_image_url || ''} className="rounded-xl mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Versión</label>
                <Input name="version" defaultValue={product.version || '1.0'} className="rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Compatibilidad</label>
                <Input name="compatibility" defaultValue={product.compatibility || ''} className="rounded-xl mt-1" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Formatos (separados por coma)</label>
              <Input name="formats" defaultValue={product.formats?.join(', ')} className="rounded-xl mt-1" placeholder="Ej. VST3, AU, AAX, .amxd" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
