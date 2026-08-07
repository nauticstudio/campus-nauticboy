'use client'

import { useState } from 'react'
import { 
  Plus, 
  Trash2, 
  Package, 
  Download, 
  Building2, 
  Cpu, 
  Loader2, 
  Link as LinkIcon,
  Pencil
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
  deleteSoftwareItemAction,
  updateSoftwareProductAction,
  updateSoftwareItemAction,
  updateManufacturerAction,
  deleteManufacturerAction
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
  
  // Edit states
  const [editingManufacturer, setEditingManufacturer] = useState<any>(null)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editingItem, setEditingItem] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [selectedProductId, setSelectedProductId] = useState('')
  const [preselectedManufacturerId, setPreselectedManufacturerId] = useState('')
  const [createItemType, setCreateItemType] = useState('expansion')

  // Submit Handlers
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

  const handleUpdateManufacturer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateManufacturerAction(formData)
    setLoading(false)
    if (res.success) {
      setEditingManufacturer(null)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

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

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateSoftwareProductAction(formData)
    setLoading(false)
    if (res.success) {
      setEditingProduct(null)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

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

  const handleUpdateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await updateSoftwareItemAction(formData)
    setLoading(false)
    if (res.success) {
      setEditingItem(null)
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

  const handleDeleteManufacturer = async (id: string, name: string) => {
    if (!confirm(`¿Seguro que deseas eliminar el fabricante ${name} y TODOS sus productos y expansiones?`)) return
    await deleteManufacturerAction(id)
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
          {/* Modal 1: Create Manufacturer */}
          <button onClick={() => setIsManufacturerOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer">
            <Building2 className="w-4 h-4 text-cyan-400" /> + Fabricante
          </button>
          
          <Dialog open={isManufacturerOpen} onOpenChange={setIsManufacturerOpen}>
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

          {/* Modal 2: Create Product */}
          <button 
            onClick={() => {
              setPreselectedManufacturerId('')
              setIsProductOpen(true)
            }} 
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <Cpu className="w-4 h-4 text-cyan-400" /> + Nuevo Producto / Plugin
          </button>

          <Dialog open={isProductOpen} onOpenChange={setIsProductOpen}>
            <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 rounded-3xl p-6">
              <form onSubmit={handleCreateProduct}>
                <DialogHeader className="space-y-2 mb-4">
                  <DialogTitle className="text-xl font-black">Crear Nuevo Producto / Sintetizador</DialogTitle>
                  <DialogDescription className="text-xs font-medium text-slate-500">Crea la página principal para un software (ej: Nexus 5, Kontakt 7).</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Fabricante</label>
                    <select 
                      name="manufacturer_id" 
                      value={preselectedManufacturerId}
                      onChange={(e) => setPreselectedManufacturerId(e.target.value)}
                      required 
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1"
                    >
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

          {/* Modal 3: Create Item */}
          <button onClick={() => { setCreateItemType('expansion'); setIsItemOpen(true); }} className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-cyan-500/20 cursor-pointer">
            <Plus className="w-4 h-4" /> + Añadir Contenido / Expansión
          </button>

          <Dialog open={isItemOpen} onOpenChange={setIsItemOpen}>
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
                      <select 
                        name="item_type" 
                        value={createItemType}
                        onChange={(e) => setCreateItemType(e.target.value)}
                        required 
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1"
                      >
                        <option value="expansion">Expansión / Banco</option>
                        <option value="plugin_device">Plugin / Dispositivo Max (.amxd, VST)</option>
                        <option value="installer_win">Instalador Windows</option>
                        <option value="installer_mac">Instalador macOS</option>
                        <option value="factory_content">Factory Library Base</option>
                        <option value="skin">Skin / Apariencia</option>
                        <option value="presets">Presets Sueltos</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Título del Archivo / Expansión</label>
                      <Input name="title" placeholder={createItemType.startsWith('installer') ? "Ej: Instalador v1.0" : "Ej: Hard Techno Vol. 1"} required className="rounded-xl mt-1" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-cyan-600 uppercase flex items-center gap-1">
                      <LinkIcon className="w-3 h-3" /> Link de Google Drive (Descarga Directa)
                    </label>
                    <Input name="download_url" placeholder="https://drive.google.com/..." required className="rounded-xl mt-1 font-mono text-xs border-cyan-300" />
                  </div>

                  <div className={`grid ${createItemType.startsWith('installer') ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Tamaño (MB/GB)</label>
                      <Input name="file_size" placeholder="Ej: 1.2 GB" className="rounded-xl mt-1" />
                    </div>
                    {!createItemType.startsWith('installer') && (
                      <>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase">Presets (#)</label>
                          <Input name="preset_count" type="number" placeholder="Ej: 150" className="rounded-xl mt-1" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase">Tag / Género</label>
                          <Input name="genre_tag" placeholder="Ej: Techno" className="rounded-xl mt-1" />
                        </div>
                      </>
                    )}
                  </div>

                  {!createItemType.startsWith('installer') && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Imagen de Portada (Para Expansiones)</label>
                      <Input name="cover_image_url" placeholder="https://..." className="rounded-xl mt-1" />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción Breve</label>
                    <Input name="description" placeholder={createItemType.startsWith('installer') ? "Notas del instalador..." : "De qué trata esta expansión..."} className="rounded-xl mt-1" />
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

      {/* EDIT MANUFACTURER MODAL */}
      {editingManufacturer && (
        <Dialog open={!!editingManufacturer} onOpenChange={(open) => !open && setEditingManufacturer(null)}>
          <DialogContent className="sm:max-w-[425px] bg-white text-slate-900 rounded-3xl p-6">
            <form onSubmit={handleUpdateManufacturer}>
              <input type="hidden" name="id" value={editingManufacturer.id} />
              
              <DialogHeader className="space-y-2 mb-4">
                <DialogTitle className="text-xl font-black">Editar Fabricante: {editingManufacturer.name}</DialogTitle>
                <DialogDescription className="text-xs font-medium text-slate-500">Modifica los detalles de la marca.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre del Fabricante</label>
                  <Input name="name" defaultValue={editingManufacturer.name} required className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">URL del Logo</label>
                  <Input name="logo_url" defaultValue={editingManufacturer.logo_url || ''} className="rounded-xl mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
                  <Input name="description" defaultValue={editingManufacturer.description || ''} className="rounded-xl mt-1" />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Fabricante'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <DialogContent className="sm:max-w-[500px] bg-white text-slate-900 rounded-3xl p-6">
            <form onSubmit={handleUpdateProduct}>
              <input type="hidden" name="id" value={editingProduct.id} />

              <DialogHeader className="space-y-2 mb-4">
                <DialogTitle className="text-xl font-black">Editar Producto: {editingProduct.name}</DialogTitle>
                <DialogDescription className="text-xs font-medium text-slate-500">Modifica los detalles del producto.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Fabricante</label>
                  <select name="manufacturer_id" defaultValue={editingProduct.manufacturer_id} required className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1">
                    {manufacturers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Nombre del Producto</label>
                  <Input name="name" defaultValue={editingProduct.name} required className="rounded-xl mt-1" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Lema / Subtítulo</label>
                  <Input name="tagline" defaultValue={editingProduct.tagline || ''} className="rounded-xl mt-1" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
                  <textarea name="description" defaultValue={editingProduct.description || ''} className="w-full rounded-xl border border-slate-200 text-xs p-3 min-h-[70px] mt-1" />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">URL de Portada</label>
                  <Input name="cover_image_url" defaultValue={editingProduct.cover_image_url || ''} className="rounded-xl mt-1" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Versión</label>
                    <Input name="version" defaultValue={editingProduct.version || '1.0'} className="rounded-xl mt-1" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Compatibilidad</label>
                    <Input name="compatibility" defaultValue={editingProduct.compatibility || ''} className="rounded-xl mt-1" />
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Producto'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* EDIT ITEM MODAL */}
      {editingItem && (
        <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
          <DialogContent className="sm:max-w-[550px] bg-white text-slate-900 rounded-3xl p-6">
            <form onSubmit={handleUpdateItem}>
              <input type="hidden" name="id" value={editingItem.id} />

              <DialogHeader className="space-y-2 mb-4">
                <DialogTitle className="text-xl font-black">Editar Archivo: {editingItem.title}</DialogTitle>
                <DialogDescription className="text-xs font-medium text-slate-500">Modifica el enlace de Google Drive o los detalles.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Tipo de Archivo</label>
                    <select 
                      name="item_type" 
                      value={editingItem.item_type} 
                      onChange={(e) => setEditingItem({...editingItem, item_type: e.target.value})}
                      required 
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold bg-slate-50 mt-1"
                    >
                      <option value="expansion">Expansión / Banco</option>
                      <option value="plugin_device">Plugin / Dispositivo Max (.amxd, VST)</option>
                      <option value="installer_win">Instalador Windows</option>
                      <option value="installer_mac">Instalador macOS</option>
                      <option value="factory_content">Factory Library Base</option>
                      <option value="skin">Skin / Apariencia</option>
                      <option value="presets">Presets Sueltos</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Título del Archivo</label>
                    <Input name="title" defaultValue={editingItem.title} required className="rounded-xl mt-1" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-cyan-600 uppercase flex items-center gap-1">
                    <LinkIcon className="w-3 h-3" /> Link de Google Drive
                  </label>
                  <Input name="download_url" defaultValue={editingItem.download_url} required className="rounded-xl mt-1 font-mono text-xs border-cyan-300" />
                </div>

                <div className={`grid ${editingItem.item_type?.startsWith('installer') ? 'grid-cols-1' : 'grid-cols-3'} gap-3`}>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Tamaño</label>
                    <Input name="file_size" defaultValue={editingItem.file_size || ''} className="rounded-xl mt-1" />
                  </div>
                  {!editingItem.item_type?.startsWith('installer') && (
                    <>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Presets (#)</label>
                        <Input name="preset_count" type="number" defaultValue={editingItem.preset_count || ''} className="rounded-xl mt-1" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Tag / Género</label>
                        <Input name="genre_tag" defaultValue={editingItem.genre_tag || ''} className="rounded-xl mt-1" />
                      </div>
                    </>
                  )}
                </div>

                {!editingItem.item_type?.startsWith('installer') && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Portada Imagen</label>
                    <Input name="cover_image_url" defaultValue={editingItem.cover_image_url || ''} className="rounded-xl mt-1" />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Descripción</label>
                  <Input name="description" defaultValue={editingItem.description || ''} className="rounded-xl mt-1" />
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button type="submit" disabled={loading} className="w-full bg-slate-900 text-white font-bold rounded-xl h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Actualizar Archivo'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Fabricantes Display */}
      <div className="space-y-6">
        <h3 className="text-lg font-black text-slate-900">Fabricantes Registrados ({manufacturers.length})</h3>

        {manufacturers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
            <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-bold text-slate-700">No hay fabricantes creados</h4>
            <p className="text-xs text-slate-500">Usa el botón "+ Fabricante" para añadir tu primera marca de software.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {manufacturers.map(m => (
              <div key={m.id} className="glass-card rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {m.logo_url ? <img src={m.logo_url} alt={m.name} className="w-full h-full object-cover" /> : <Building2 className="w-6 h-6 text-slate-400" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{m.name}</h4>
                    <p className="text-[10px] font-medium text-slate-500 line-clamp-2">{m.description || 'Sin descripción'}</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingManufacturer(m)} className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors cursor-pointer" title="Editar Fabricante">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteManufacturer(m.id, m.name)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer" title="Eliminar Fabricante">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setPreselectedManufacturerId(m.id)
                      setIsProductOpen(true)
                    }} 
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    <Cpu className="w-3 h-3" /> + Producto
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Catalog Display */}
      <div className="space-y-6 pt-4 border-t border-slate-200/60">
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

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingProduct(p)}
                      className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Pencil className="w-4 h-4" /> Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" /> Eliminar
                    </button>
                  </div>
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

                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => setEditingItem(item)}
                              className="text-slate-500 hover:text-cyan-600 p-1 cursor-pointer"
                              title="Editar archivo"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteItem(item.id, item.title)}
                              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Eliminar archivo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
