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
      <DialogTrigger className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-black text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition-all active:scale-95">
        <Plus className="w-4 h-4" /> Añadir Instalador
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[550px] bg-white text-slate-900 rounded-3xl p-6 border-slate-200">
        <form onSubmit={handleCreateItem}>
          <input type="hidden" name="product_id" value={productId} />

          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-black">Añadir Instalador Principal</DialogTitle>
            <DialogDescription className="text-xs font-medium text-slate-500">
              Sube el enlace de descarga para el instalador de Windows o macOS.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Sistema Operativo</label>
                <select name="item_type" required className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1" defaultValue="installer_win">
                  <option value="installer_win">Instalador Windows</option>
                  <option value="installer_mac">Instalador macOS</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Título del Archivo</label>
                <Input name="title" required className="rounded-xl mt-1" placeholder="Ej. Instalador v1.2" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-orange-500 uppercase flex items-center gap-1">
                Link de Google Drive
              </label>
              <Input name="download_url" required className="rounded-xl mt-1 border-orange-200 focus:border-orange-500 bg-orange-50/30" placeholder="https://drive.google.com/..." />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Tamaño</label>
                <Input name="file_size" className="rounded-xl mt-1" placeholder="Ej. 1.5 GB" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Versión del Instalador</label>
                <Input name="version" className="rounded-xl mt-1" placeholder="Ej. 1.0.1" />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Instalador'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
