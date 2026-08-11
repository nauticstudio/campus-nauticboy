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
import { createSoftwareItemAction } from '@/app/actions/software'

export function InlineCreateInstallerModal({
  productId,
}: {
  productId: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

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
      <DialogTrigger className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-coral-500/15 text-coral-300 border border-coral-500/30 font-bold text-xs uppercase tracking-wider hover:bg-coral-500/25 transition-all active:scale-95">
        <Plus className="w-4 h-4" /> Añadir Instalador
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreateItem}>
          <input type="hidden" name="product_id" value={productId} />

            <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50">Añadir Instalador Principal</DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Sube el enlace de descarga para el instalador de Windows, macOS o Archivo AMXD.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Sistema Operativo</label>
                <select name="item_type" required className="w-full rounded-xl border border-ink-800 p-2.5 text-xs font-semibold bg-ink-900 text-ink-100 mt-1 focus:outline-none focus:border-coral-500" defaultValue="installer_win">
                  <option value="installer_win">Instalador Windows</option>
                  <option value="installer_mac">Instalador macOS</option>
                  <option value="installer_amxd">Archivo AMXD</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Título del Archivo</label>
                <Input name="title" required className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. Instalador v1.2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-coral-400 uppercase flex items-center gap-1">
                Link de Google Drive
              </label>
              <Input name="download_url" required className="rounded-xl mt-1 border-ink-800 focus:border-coral-500 bg-ink-900 text-ink-100" placeholder="https://drive.google.com/..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Tamaño</label>
                <Input name="file_size" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. 1.5 GB" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase">Versión del Instalador</label>
                <Input name="version" className="rounded-xl mt-1 bg-ink-900 border-ink-800 text-ink-100" placeholder="Ej. 1.0.1" />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Instalador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
