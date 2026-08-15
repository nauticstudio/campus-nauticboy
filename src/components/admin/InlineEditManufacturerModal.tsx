'use client'

import { useState } from 'react'
import { Pencil, Loader2, Package, Image as ImageIcon } from 'lucide-react'
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
  const [logoUrl, setLogoUrl] = useState(manufacturer.logo_url || '')
  const [imgError, setImgError] = useState(false)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
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
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (isOpen) {
        setLogoUrl(manufacturer.logo_url || '')
        setImgError(false)
      }
    }}>
      <DialogTrigger
        className="absolute top-2 right-2 z-20 w-7 h-7 rounded-lg bg-ink-950/90 border border-ink-700/80 text-ink-300 hover:text-white hover:bg-coral-500 hover:border-coral-500 flex items-center justify-center shadow-md transition-all cursor-pointer group-hover/m-card:border-coral-500/50"
        title={`Editar ${manufacturer.name}`}
        aria-label={`Editar ${manufacturer.name}`}
      >
        <Pencil className="w-3.5 h-3.5" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[420px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleUpdate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-coral-400" />
              Editar Fabricante
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Modifica los datos y el logo del fabricante <strong className="text-ink-200">{manufacturer.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Nombre del Fabricante</label>
              <Input
                name="name"
                defaultValue={manufacturer.name}
                required
                className="rounded-xl mt-1.5 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500"
                placeholder="Ej. Apple, Xfer Records"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">URL del Logo (Icono)</label>
              <Input
                name="logo_url"
                value={logoUrl}
                onChange={(e) => {
                  setLogoUrl(e.target.value)
                  setImgError(false)
                }}
                className="rounded-xl mt-1.5 bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs"
                placeholder="https://ejemplo.com/logo.png"
              />
              
              {/* Preview del logo en tiempo real */}
              <div className="mt-2.5 p-3 rounded-xl bg-ink-900/60 border border-ink-800/80 flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-ink-950 border border-ink-800 flex items-center justify-center overflow-hidden shrink-0">
                  {logoUrl && !imgError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logoUrl}
                      alt="Vista previa del logo"
                      className="w-full h-full object-contain p-1"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <Package className="w-6 h-6 text-ink-600" />
                  )}
                </div>
                <div className="text-[11px] text-ink-400">
                  <div className="font-semibold text-ink-200 flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-coral-400" />
                    Vista previa en vivo
                  </div>
                  <span className="text-[10px] text-ink-400">
                    {imgError ? 'URL de imagen no válida' : logoUrl ? 'Cargando imagen...' : 'Sin logo asignado'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Descripción (Opcional)</label>
              <textarea
                name="description"
                defaultValue={manufacturer.description || ''}
                className="w-full rounded-xl border border-ink-800 bg-ink-900 text-xs p-3 text-ink-100 min-h-[70px] mt-1.5 focus:outline-none focus:border-coral-500"
                placeholder="Breve descripción del fabricante..."
              />
            </div>
          </div>

          <DialogFooter className="mt-6 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-ink-800 hover:bg-ink-900 text-ink-300"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-10 px-5 shadow-lg shadow-coral-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

