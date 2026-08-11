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
      <DialogTrigger className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-ink-900 text-ink-100 font-bold text-xs hover:bg-ink-800 transition-all border border-ink-800 shadow-md">
        <Plus className="w-3.5 h-3.5 text-coral-400" />
        Añadir Software
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreateProduct}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50">Añadir Nuevo Producto</DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Registra un nuevo sintetizador o efecto en la biblioteca.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Fabricante</label>
              <select name="manufacturer_id" required className="w-full rounded-xl border border-ink-800 p-2.5 text-xs font-semibold bg-ink-900 text-ink-100 mt-1 focus:outline-none focus:border-coral-500">
                <option value="">Selecciona un fabricante...</option>
                {manufacturers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Nombre del Producto</label>
              <Input name="name" required className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. Sylenth1" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Lema / Subtítulo</label>
              <Input name="tagline" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. Advanced Virtual Analog Synthesizer" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Descripción</label>
              <textarea name="description" className="w-full rounded-xl border border-ink-800 bg-ink-900 text-xs p-3 text-ink-100 min-h-[70px] mt-1 focus:outline-none focus:border-coral-500" placeholder="Descripción detallada del plugin..." />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">URL de Portada</label>
              <Input name="cover_image_url" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="https://..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Versión</label>
                <Input name="version" defaultValue="1.0" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Compatibilidad</label>
                <Input name="compatibility" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Win 10+ / macOS 11+" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Formatos (separados por coma)</label>
              <Input name="formats" defaultValue="VST3, AU, AAX" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. VST3, AU, AAX, .amxd" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
