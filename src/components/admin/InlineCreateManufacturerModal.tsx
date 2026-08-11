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
      <DialogTrigger className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-coral-500/15 text-coral-300 font-bold text-xs hover:bg-coral-500/25 transition-all border border-coral-500/30">
        <Plus className="w-3.5 h-3.5 text-coral-400" />
        Añadir Fabricante
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50">Nuevo Fabricante</DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Añade una nueva marca o desarrollador (ej. Ableton, Xfer).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Nombre</label>
              <Input name="name" required className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. Xfer Records" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Logo URL (Opcional)</label>
              <Input name="logo_url" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="https://..." />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Descripción (Opcional)</label>
              <textarea name="description" className="w-full rounded-xl border border-ink-800 bg-ink-900 text-xs p-3 text-ink-100 min-h-[70px] mt-1 focus:outline-none focus:border-coral-500" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Fabricante'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
