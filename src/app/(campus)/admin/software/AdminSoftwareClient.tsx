'use client'

import { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Package, 
  Download, 
  Layers, 
  Building2, 
  Cpu, 
  Loader2, 
  Link as LinkIcon,
  ShieldCheck,
  CheckCircle2,
  HardDrive
} from 'lucide-react'
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
import { 
  createManufacturerAction, 
  createSoftwareProductAction, 
  createSoftwareItemAction,
  deleteSoftwareProductAction,
  deleteSoftwareItemAction
} from '@/app/actions/software'

export function AdminSoftwareClient({
  manufacturers,
  products,
}: {
  manufacturers: any[]
  products: any[]
}) {
  const [isManufacturerOpen, setIsManufacturerOpen] = useState(false)
  const [isProductOpen, setIsProductOpen] = useState(false)
  const [isItemOpen, setIsItemOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')

  // Submit Handler for Manufacturer
  const handleCreateManufacturer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createManufacturerAction(formData)
    setLoading(false)
    if (res.success) {
      setIsManufacturerOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  // Submit Handler for Product
  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createSoftwareProductAction(formData)
    setLoading(false)
    if (res.success) {
      setIsProductOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  // Submit Handler for Item / Expansion
  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await createSoftwareItemAction(formData)
    setLoading(false)
    if (res.success) {
      setIsItemOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que deseas eliminar el producto ${name} y todo su contenido?`)) return
    await deleteSoftwareProductAction(id)
    window.location.reload()
  }

  const handleDeleteItem = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar ${title}?`)) return
    await deleteSoftwareItemAction(id)
    window.location.reload()
  }

  return (
    <div className="space-y-8">
      
      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 text-white shadow-xl">
        <div>
          <h2 className="text-xl font-black tracking-tight">Panel de Control de Software</h2>
          <p className="text-xs text-slate-400 mt-1">Añade marcas, sintetizadores y expansiones de Google Drive fácilmente.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Modal 1: Manufacturer */}
          <Dialog open={isManufacturerOpen} onOpenChange={setIsManufacturerOpen}>
            <DialogTrigger render={<button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all" />}>
              <Building2 className="w-4 h-4 text-cyan-400" /> + Fabricante
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 rounded-3xl p-6">
              <form onSubmit={handleCreateManufacturer}>
                <DialogHeader className="space-y-2 mb-4">
                  <DialogTitle className="text-xl font-black">Nuevo Fabricante</DialogTitle>
                  <DialogDescription className="text-xs font-medium text-slate-500">Ejemplo: reFX, Native Instruments, FabFilter.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre del Fabricante</label>
                    <Input name="name" placeholder="Ej: reFX" required className="rounded-xl mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">URL del Logo (Opcional)</label>
                    <Input name="logo_url" placeholder="https://..." className="rounded-xl mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción Breve</label>
                    <Input name="description" placeholder="Creadores de sintetizadores..." className="rounded-xl mt-1" />
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear Fabricante'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal 2: Product */}
          <Dialog open={isProductOpen} onOpenChange={setIsProductOpen}>
            <DialogTrigger render={<button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all" />}>
              <Cpu className="w-4 h-4 text-cyan-400" /> + Nuevo Producto / Plugin
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 rounded-3xl p-6">
              <form onSubmit={handleCreateProduct}>
                <DialogHeader className="space-y-2 mb-4">
                  <DialogTitle className="text-xl font-black">Crear Nuevo Producto / Sintetizador</DialogTitle>
                  <DialogDescription className="text-xs font-medium text-slate-500">Crea la página principal para un software (ej: Nexus 5, Kontakt 7).</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Fabricante</label>
                    <select name="manufacturer_id" required className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1">
                      <option value="">Seleccionar Fabricante...</option>
                      {manufacturers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre del Producto</label>
                    <Input name="name" placeholder="Ej: Nexus 5" required className="rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Lema / Subtítulo</label>
                    <Input name="tagline" placeholder="Ej: El sintetizador ROMpler definitivo" className="rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción Completa</label>
                    <textarea name="description" placeholder="De qué trata este software..." className="w-full rounded-xl border border-slate-200 text-xs p-3 min-h-[70px] mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">URL de Portada (Imagen)</label>
                    <Input name="cover_image_url" placeholder="https://..." className="rounded-xl mt-1" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Versión</label>
                      <Input name="version" defaultValue="1.0" className="rounded-xl mt-1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Compatibilidad</label>
                      <Input name="compatibility" defaultValue="Win 10/11 | macOS 12+" className="rounded-xl mt-1" />
                    </div>
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Producto'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Modal 3: Item / Expansion */}
          <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
            <DialogTrigger render={<button className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20" />}>
              <Plus className="w-4 h-4" /> + Añadir Contenido / Expansión
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-white text-slate-900 rounded-3xl p-6">
              <form onSubmit={handleCreateItem}>
                <DialogHeader className="space-y-2 mb-4">
                  <DialogTitle className="text-xl font-black">Añadir Archivo o Expansión</DialogTitle>
                  <DialogDescription className="text-xs font-medium text-slate-500">Vincula un instalador, librería base o expansión pegando tu link de Google Drive.</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Producto Destino</label>
                    <select 
                      name="product_id" 
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      required 
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1"
                    >
                      <option value="">Seleccionar Producto...</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.manufacturer?.name} - {p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Tipo de Archivo</label>
                      <select name="item_type" required className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1">
                        <option value="expansion">Expansión / Banco</option>
                        <option value="installer_win">Instalador Windows</option>
                        <option value="installer_mac">Instalador macOS</option>
                        <option value="factory_content">Factory Library Base</option>
                        <option value="skin">Skin / Apariencia</option>
                        <option value="presets">Presets Sueltos</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Título del Archivo / Expansión</label>
                      <Input name="title" placeholder="Ej: Hard Techno Vol. 1" required className="rounded-xl mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-cyan-600 uppercase flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> Link de Google Drive (Descarga Directa)
                    </label>
                    <Input name="download_url" placeholder="https://drive.google.com/..." required className="rounded-xl mt-1 font-mono text-xs border-cyan-300" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Tamaño (MB/GB)</label>
                      <Input name="file_size" placeholder="Ej: 1.2 GB" className="rounded-xl mt-1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Presets (#)</label>
                      <Input name="preset_count" type="number" placeholder="Ej: 150" className="rounded-xl mt-1" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Tag / Género</label>
                      <Input name="genre_tag" placeholder="Ej: Techno" className="rounded-xl mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Imagen de Portada (Para Expansiones)</label>
                    <Input name="cover_image_url" placeholder="https://..." className="rounded-xl mt-1" />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción Breve</label>
                    <Input name="description" placeholder="De qué trata esta expansión..." className="rounded-xl mt-1" />
                  </div>
                </div>

                <DialogFooter className="mt-6">
                  <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Añadir al Ecosistema'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Catalog Display */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-slate-900">Productos Registrados ({products.length})</h3>

        {products.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-700">No hay productos creados</h4>
            <p className="text-xs text-slate-500">Usa los botones superiores para añadir tu primer fabricante y producto.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {products.map(p => (
              <div key={p.id} className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.cover_image_url && (
                      <img src={p.cover_image_url} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-cyan-600 tracking-wider">{p.manufacturer?.name}</span>
                      <h4 className="text-xl font-black text-slate-900">{p.name}</h4>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteProduct(p.id, p.name)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar Producto
                  </button>
                </div>

                {/* Items List */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Archivos y Expansiones Vinculadas ({p.software_items?.length || 0})</h5>
                  
                  {(!p.software_items || p.software_items.length === 0) ? (
                    <p className="text-xs italic text-slate-400">Sin archivos vinculados aún.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {p.software_items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-2">
                            <Download className="w-3.5 h-3.5 text-cyan-600" />
                            <div>
                              <p className="text-xs font-bold text-slate-800">{item.title}</p>
                              <span className="text-[10px] font-medium text-slate-400">{item.item_type} • {item.file_size || 'N/A'}</span>
                            </div>
                          </div>

                          <button 
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
