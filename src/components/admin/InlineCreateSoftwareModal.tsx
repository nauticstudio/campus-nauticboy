'use client'

import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
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
import { createSoftwareProductAction } from '@/app/actions/software'

export function InlineCreateSoftwareModal({ manufacturers }: { manufacturers: any[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createSoftwareProductAction(formData)
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
      <DialogTrigger className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95 border border-slate-700">
        <Plus className="w-4 h-4 text-cyan-400" />
        Añadir Software
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 rounded-3xl p-6 border-slate-200">
        <form onSubmit={handleCreateProduct}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-black">Añadir Nuevo Producto</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Registra un nuevo sintetizador o efecto en la biblioteca.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Fabricante</label>
              <select name="manufacturer_id" required className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1">
                <option value="">Selecciona un fabricante...</option>
                {manufacturers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre del Producto</label>
              <Input name="name" required className="rounded-xl mt-1" placeholder="Ej. Sylenth1" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Lema / Subtítulo</label>
              <Input name="tagline" className="rounded-xl mt-1" placeholder="Ej. Advanced Virtual Analog Synthesizer" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
              <textarea name="description" className="w-full rounded-xl border border-slate-200 text-xs p-3 min-h-[70px] mt-1" placeholder="Descripción detallada del plugin..." />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">URL de Portada</label>
              <Input name="cover_image_url" className="rounded-xl mt-1" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Versión</label>
                <Input name="version" defaultValue="1.0" className="rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Compatibilidad</label>
                <Input name="compatibility" className="rounded-xl mt-1" placeholder="Win 10+ / macOS 11+" />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
