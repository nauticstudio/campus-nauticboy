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
import { updateManufacturerAction } from '@/app/actions/software'
import type { SoftwareManufacturer } from '@/lib/data/software'

export function InlineEditManufacturerModal({ manufacturer }: { manufacturer: SoftwareManufacturer }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('id', manufacturer.id)
    const res = await updateManufacturerAction(formData)
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
      <DialogTrigger
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-ink-900 border border-ink-800 text-ink-400 flex items-center justify-center hover:bg-coral-500 hover:text-white hover:border-coral-500 transition-all opacity-0 group-hover:opacity-100"
        onClick={(e) => e.preventDefault()}
        aria-label="Editar fabricante"
      >
        <Pencil className="w-3.5 h-3.5" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[400px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50">Editar Fabricante</DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Modifica los datos del fabricante {manufacturer.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Nombre</label>
              <Input name="name" defaultValue={manufacturer.name} required className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. Xfer Records" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Logo URL (Opcional)</label>
              <Input name="logo_url" defaultValue={manufacturer.logo_url || ''} className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="https://..." />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase">Descripción (Opcional)</label>
              <textarea name="description" defaultValue={manufacturer.description || ''} className="w-full rounded-xl border border-ink-800 bg-ink-900 text-xs p-3 text-ink-100 min-h-[70px] mt-1 focus:outline-none focus:border-coral-500" />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Cambios'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
