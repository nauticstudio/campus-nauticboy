'use client'

import { useState } from 'react'
import { Plus, Loader2, Link2, FileText, HardDrive, Cpu, Tag, ImageIcon, Sparkles } from 'lucide-react'
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
import { createUnifiedResourceAction } from '@/app/actions/resources'
import { AppleLogo, WindowsLogo } from '@/components/icons/PlatformLogos'

export function InlineCreateResourceModal({
  categoryId,
  categoryName,
}: {
  categoryId: string
  categoryName: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [imgError, setImgError] = useState(false)
  const [activeTab, setActiveTab] = useState<'both' | 'macos' | 'windows'>('both')

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('category_id', categoryId)
    const res = await createUnifiedResourceAction(formData)
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
      <DialogTrigger className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral-500 text-white font-bold text-xs hover:bg-coral-600 transition-all shadow-[0_4px_16px_rgba(255,98,19,0.35)] active:scale-95 cursor-pointer">
        <Plus className="w-4 h-4" />
        <span>Añadir Recurso</span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleCreate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <Plus className="w-5 h-5 text-coral-400" />
              Nuevo Recurso en {categoryName}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Carga el DAW o material una sola vez con soporte para macOS, Windows o ambos.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {/* General Info Card */}
            <div className="p-3.5 rounded-2xl bg-ink-900/60 border border-ink-800 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-coral-400" /> Título del Recurso
                </label>
                <Input
                  name="title"
                  required
                  className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-sm font-semibold"
                  placeholder="Ej. FL Studio 26 / Ableton Live 12 Suite"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-coral-400" /> Software / DAW
                  </label>
                  <Input
                    name="software"
                    className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs"
                    placeholder="Ej. FL Studio / Ableton"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-coral-400" /> Icono / Portada (URL)
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-9 h-9 rounded-xl bg-ink-950 border border-ink-800 flex items-center justify-center overflow-hidden shrink-0 relative">
                      {thumbnailUrl && !imgError ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbnailUrl}
                          alt="Preview"
                          className="w-full h-full object-contain p-1"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-ink-600" />
                      )}
                    </div>
                    <Input
                      name="thumbnail_url"
                      value={thumbnailUrl}
                      onChange={(e) => {
                        setThumbnailUrl(e.target.value)
                        setImgError(false)
                      }}
                      className="rounded-xl bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-[11px]"
                      placeholder="https://iili.io/..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Descripción</label>
                <textarea
                  name="description"
                  className="w-full rounded-xl border border-ink-800 bg-ink-950 text-xs p-2.5 text-ink-100 min-h-[50px] mt-1 focus:outline-none focus:border-coral-500"
                  placeholder="Breve descripción o notas para el alumno..."
                />
              </div>
            </div>

            {/* Platform Selector Tabs */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold text-ink-200 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-400" /> Instaladores Disponibles
              </span>
              <div className="flex items-center gap-1 bg-ink-900/90 p-1 rounded-xl border border-ink-800 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab('both')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'both' ? 'bg-coral-500 text-white font-bold' : 'text-ink-400 hover:text-white'
                  }`}
                >
                  Ambos
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('macos')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'macos' ? 'bg-coral-500 text-white font-bold' : 'text-ink-400 hover:text-white'
                  }`}
                >
                  <AppleLogo className="w-3 h-3" />
                  <span>Mac</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('windows')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    activeTab === 'windows' ? 'bg-coral-500 text-white font-bold' : 'text-ink-400 hover:text-white'
                  }`}
                >
                  <WindowsLogo className="w-3 h-3" />
                  <span>Win</span>
                </button>
              </div>
            </div>

            {/* macOS Installer Section */}
            {(activeTab === 'both' || activeTab === 'macos') && (
              <div className="p-4 rounded-2xl bg-ink-900/80 border border-ink-700/60 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between pb-1 border-b border-ink-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-white/10 text-white border border-white/20">
                      <AppleLogo className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-white tracking-wide">
                      Versión Apple macOS
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">
                    {activeTab === 'both' ? 'Opcional si solo hay Windows' : 'Plataforma macOS'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-coral-400" /> Enlace de Google Drive / Descarga macOS
                  </label>
                  <Input
                    name="mac_download_url"
                    type="url"
                    className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Versión Mac</label>
                    <Input
                      name="mac_version"
                      defaultValue="26.1.4.5356"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Tamaño (ej. 1.15 GB)</label>
                    <Input
                      name="mac_file_size"
                      placeholder="1.15 GB"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Archivo</label>
                    <Input
                      name="mac_file_name"
                      placeholder="FL_Studio_macOS.dmg"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Windows Installer Section */}
            {(activeTab === 'both' || activeTab === 'windows') && (
              <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                      <WindowsLogo className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-xs font-bold text-cyan-200 tracking-wide">
                      Versión Microsoft Windows
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-cyan-400/70 uppercase tracking-wider">
                    {activeTab === 'both' ? 'Opcional si solo hay Mac' : 'Plataforma Windows'}
                  </span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                    <Link2 className="w-3 h-3 text-cyan-400" /> Enlace de Google Drive / Descarga Windows
                  </label>
                  <Input
                    name="win_download_url"
                    type="url"
                    className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 font-mono text-xs"
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Versión Win</label>
                    <Input
                      name="win_version"
                      defaultValue="26.1.4.5589"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Tamaño (ej. 1.04 GB)</label>
                    <Input
                      name="win_file_size"
                      placeholder="1.04 GB"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Archivo</label>
                    <Input
                      name="win_file_name"
                      placeholder="FL_Studio_WIN.zip"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-5 gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-ink-800 hover:bg-ink-900 text-ink-300 h-10 text-xs"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-10 px-5 text-xs shadow-lg shadow-coral-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Publicar Recurso'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
