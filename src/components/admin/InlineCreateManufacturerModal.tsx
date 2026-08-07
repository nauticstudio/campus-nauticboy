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
import { createManufacturerAction } from '@/app/actions/software'

export function InlineCreateManufacturerModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createManufacturerAction(formData)
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
      <DialogTrigger className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-50 text-cyan-700 font-bold text-xs hover:bg-cyan-100 transition-colors border border-cyan-200">
        <Plus className="w-4 h-4 text-cyan-600" />
        Añadir Fabricante
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px] bg-white text-slate-900 rounded-3xl p-6 border-slate-200">
        <form onSubmit={handleCreate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-black">Nuevo Fabricante</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Añade una nueva marca o desarrollador (ej. Ableton, Xfer).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre</label>
              <Input name="name" required className="rounded-xl mt-1" placeholder="Ej. Xfer Records" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Logo URL (Opcional)</label>
              <Input name="logo_url" className="rounded-xl mt-1" placeholder="https://..." />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción (Opcional)</label>
              <textarea name="description" className="w-full rounded-xl border border-slate-200 text-xs p-3 min-h-[70px] mt-1" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Fabricante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
