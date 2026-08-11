'use client'

import { useState } from 'react'
import { Pencil, Loader2, KeyRound, Layers, Cpu, ShieldCheck, Tag } from 'lucide-react'
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
      if (res.redirectUrl && res.redirectUrl !== window.location.pathname) {
        window.location.assign(res.redirectUrl)
      } else {
        window.location.reload()
      }
    } else {
      alert(res.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink-950/80 hover:bg-coral-500 text-ink-200 hover:text-white transition-all shadow-md border border-ink-700 backdrop-blur-md absolute top-4 right-4 z-50 group">
        <Pencil className="w-4 h-4 group-hover:scale-110 transition-transform" />
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[620px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl backdrop-blur-xl">
        <form onSubmit={handleUpdateProduct}>
          <input type="hidden" name="id" value={product.id} />

          <DialogHeader className="space-y-1.5 mb-5">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-coral-400" />
              Editar Producto: {product.name}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Modifica las especificaciones, formatos y contraseña de descompresión del producto.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 text-left">
            {/* Fila 1: Fabricante + Nombre */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Tag className="w-3 h-3 text-coral-400" /> Fabricante *
                </label>
                <select name="manufacturer_id" defaultValue={product.manufacturer_id} required className="w-full rounded-xl border border-ink-800 p-2.5 text-xs font-semibold bg-ink-900 text-ink-100 focus:outline-none focus:border-coral-500 transition-colors">
                  {manufacturers.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  Nombre del Producto *
                </label>
                <Input name="name" defaultValue={product.name} required className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500" />
              </div>
            </div>

            {/* Fila 2: Subtítulo */}
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1 block">Lema / Subtítulo</label>
              <Input name="tagline" defaultValue={product.tagline || ''} className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500" placeholder="Ej. Virtual Analog Synthesizer" />
            </div>

            {/* Fila 3: Descripción */}
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1 block">Descripción</label>
              <textarea name="description" defaultValue={product.description || ''} className="w-full rounded-xl border border-ink-800 bg-ink-900 text-xs p-3 text-ink-100 min-h-[65px] focus:outline-none focus:border-coral-500 transition-colors" placeholder="Detalles o características del software..." />
            </div>

            {/* Fila 4: Portada */}
            <div>
              <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1 block">URL de Portada</label>
              <Input name="cover_image_url" defaultValue={product.cover_image_url || ''} className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500" placeholder="https://..." />
            </div>

            {/* Fila 5: Versión + Formatos (Grid compacto 2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1 block">Versión</label>
                <Input name="version" defaultValue={product.version || '1.0'} className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <Layers className="w-3 h-3 text-coral-400" /> Formatos
                </label>
                <Input name="formats" defaultValue={product.formats?.join(', ')} className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs" placeholder="Ej. VST3, AU, AAX" />
              </div>
            </div>

            {/* Fila 6: Compatibilidad + Contraseña ZIP/RAR (Grid 2 cols) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-widest mb-1 block">Compatibilidad</label>
                <Input name="compatibility" defaultValue={product.compatibility || ''} className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 focus:border-coral-500" placeholder="Win 10+ / macOS 12+" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1 mb-1">
                  <KeyRound className="w-3 h-3 text-amber-400" /> Contraseña de Descompresión
                </label>
                <Input name="archive_password" defaultValue={product.archive_password || ''} className="rounded-xl bg-ink-900 border-amber-500/40 text-amber-200 focus:border-amber-400 font-mono text-xs placeholder:text-ink-600" placeholder="Ej. 1234 o www.4download.net" />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" disabled={loading} className="w-full bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-11 shadow-lg shadow-coral-500/20">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Producto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
