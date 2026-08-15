'use client'

import { useState } from 'react'
import { Pencil, Loader2, Link2, FileText, Cpu, Trash2, ImageIcon, Sparkles } from 'lucide-react'
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
import { updateUnifiedResourceAction, deleteUnifiedResourceAction } from '@/app/actions/resources'
import { formatFileSize } from '@/lib/utils'
import { AppleLogo, WindowsLogo } from '@/components/icons/PlatformLogos'

export interface ResourceVariant {
  id: string
  title: string
  description: string | null
  software: string | null
  file_name: string
  file_size: number | null
  version?: string | null
  storage_path?: string | null
  storage_provider?: string | null
  thumbnail_url?: string | null
  tags?: string[] | null
  category_id?: string
}

export function InlineEditResourceModal({
  group,
}: {
  group: {
    title: string
    software: string | null
    thumbnail_url: string | null
    description: string | null
    category_id: string
    macResource?: ResourceVariant | null
    winResource?: ResourceVariant | null
  }
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState(group.thumbnail_url || '')
  const [imgError, setImgError] = useState(false)

  // macOS State
  const initialMacLink = group.macResource?.storage_path
    ? group.macResource.storage_path.startsWith('http')
      ? group.macResource.storage_path
      : `https://drive.google.com/file/d/${group.macResource.storage_path}/view`
    : ''
  const [macDownloadUrl, setMacDownloadUrl] = useState(initialMacLink)
  const [macDelete, setMacDelete] = useState(false)

  // Windows State
  const initialWinLink = group.winResource?.storage_path
    ? group.winResource.storage_path.startsWith('http')
      ? group.winResource.storage_path
      : `https://drive.google.com/file/d/${group.winResource.storage_path}/view`
    : ''
  const [winDownloadUrl, setWinDownloadUrl] = useState(initialWinLink)
  const [winDelete, setWinDelete] = useState(false)

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    formData.append('category_id', group.category_id)

    if (group.macResource?.id) formData.append('mac_id', group.macResource.id)
    formData.set('mac_download_url', macDownloadUrl)
    if (macDelete) formData.append('mac_delete', 'true')

    if (group.winResource?.id) formData.append('win_id', group.winResource.id)
    formData.set('win_download_url', winDownloadUrl)
    if (winDelete) formData.append('win_delete', 'true')

    const res = await updateUnifiedResourceAction(formData)
    setLoading(false)
    if (res.success) {
      setOpen(false)
      window.location.reload()
    } else {
      alert(res.error)
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm(`¿Eliminar permanentemente "${group.title}" y todos sus instaladores? Esta acción no se puede deshacer.`)) {
      return
    }
    setDeleting(true)
    const idsToDelete: string[] = []
    if (group.macResource?.id) idsToDelete.push(group.macResource.id)
    if (group.winResource?.id) idsToDelete.push(group.winResource.id)

    const res = await deleteUnifiedResourceAction(idsToDelete)
    setDeleting(false)
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
        className="p-2 rounded-xl text-ink-400 hover:text-white hover:bg-ink-800 transition-colors border border-transparent hover:border-ink-700 cursor-pointer"
        title={`Editar ${group.title}`}
        aria-label={`Editar ${group.title}`}
      >
        <Pencil className="w-3.5 h-3.5" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] bg-ink-950 text-ink-100 rounded-[var(--radius)] p-6 border border-ink-800 shadow-2xl">
        <form onSubmit={handleUpdate}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="text-xl font-bold font-display text-ink-50 flex items-center gap-2">
              <Pencil className="w-5 h-5 text-coral-400" />
              Editar Recurso Unificado
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Actualiza datos generales o gestiona las descargas para macOS y Windows.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {/* General Info */}
            <div className="p-3.5 rounded-2xl bg-ink-900/60 border border-ink-800 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-coral-400" /> Título del Recurso
                </label>
                <Input
                  name="title"
                  defaultValue={group.title}
                  required
                  className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-sm font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-coral-400" /> Software / DAW
                  </label>
                  <Input
                    name="software"
                    defaultValue={group.software || ''}
                    className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs"
                    placeholder="Ej. FL Studio"
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
                  defaultValue={group.description || ''}
                  className="w-full rounded-xl border border-ink-800 bg-ink-950 text-xs p-2.5 text-ink-100 min-h-[50px] mt-1 focus:outline-none focus:border-coral-500"
                />
              </div>
            </div>

            {/* Title Section for Platforms */}
            <div className="flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span className="text-[11px] font-bold text-ink-200 uppercase tracking-wider">Versiones por Sistema Operativo</span>
            </div>

            {/* macOS Section */}
            <div className={`p-4 rounded-2xl border transition-all ${
              macDelete 
                ? 'bg-rose-950/20 border-rose-900/40 opacity-60' 
                : 'bg-ink-900/80 border-ink-700/60'
            } space-y-3`}>
              <div className="flex items-center justify-between pb-1 border-b border-ink-800">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-white/10 text-white border border-white/20">
                    <AppleLogo className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-white tracking-wide">
                    Versión Apple macOS
                  </span>
                  {group.macResource && (
                    <span className="text-[10px] font-mono font-bold text-coral-400 bg-coral-500/10 px-1.5 py-0.5 rounded border border-coral-500/20">
                      v{group.macResource.version || '1.0'}
                    </span>
                  )}
                </div>

                {group.macResource && (
                  <button
                    type="button"
                    onClick={() => setMacDelete(!macDelete)}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer underline"
                  >
                    {macDelete ? 'Deshacer eliminación' : 'Eliminar versión Mac'}
                  </button>
                )}
              </div>

              {!macDelete && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-coral-400" /> Enlace de Descarga macOS (Drive / Directo)
                    </label>
                    <Input
                      name="mac_download_url"
                      value={macDownloadUrl}
                      onChange={(e) => setMacDownloadUrl(e.target.value)}
                      type="url"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 font-mono text-xs"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Versión</label>
                      <Input
                        name="mac_version"
                        defaultValue={group.macResource?.version || '26.1.4.5356'}
                        className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Tamaño</label>
                      <Input
                        name="mac_file_size"
                        defaultValue={group.macResource?.file_size ? formatFileSize(group.macResource.file_size) : ''}
                        placeholder="1.15 GB"
                        className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Archivo</label>
                      <Input
                        name="mac_file_name"
                        defaultValue={group.macResource?.file_name || ''}
                        placeholder="FL_Studio_macOS.dmg"
                        className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-coral-500 text-xs font-mono"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Windows Section */}
            <div className={`p-4 rounded-2xl border transition-all ${
              winDelete 
                ? 'bg-rose-950/20 border-rose-900/40 opacity-60' 
                : 'bg-cyan-950/20 border-cyan-500/30'
            } space-y-3`}>
              <div className="flex items-center justify-between pb-1 border-b border-cyan-500/20">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    <WindowsLogo className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-bold text-cyan-200 tracking-wide">
                    Versión Microsoft Windows
                  </span>
                  {group.winResource && (
                    <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                      v{group.winResource.version || '1.0'}
                    </span>
                  )}
                </div>

                {group.winResource && (
                  <button
                    type="button"
                    onClick={() => setWinDelete(!winDelete)}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer underline"
                  >
                    {winDelete ? 'Deshacer eliminación' : 'Eliminar versión Windows'}
                  </button>
                )}
              </div>

              {!winDelete && (
                <>
                  <div>
                    <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider flex items-center gap-1">
                      <Link2 className="w-3 h-3 text-cyan-400" /> Enlace de Descarga Windows (Drive / Directo)
                    </label>
                    <Input
                      name="win_download_url"
                      value={winDownloadUrl}
                      onChange={(e) => setWinDownloadUrl(e.target.value)}
                      type="url"
                      className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 font-mono text-xs"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Versión</label>
                      <Input
                        name="win_version"
                        defaultValue={group.winResource?.version || '26.1.4.5589'}
                        className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Tamaño</label>
                      <Input
                        name="win_file_size"
                        defaultValue={group.winResource?.file_size ? formatFileSize(group.winResource.file_size) : ''}
                        placeholder="1.04 GB"
                        className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-ink-300 uppercase tracking-wider">Archivo</label>
                      <Input
                        name="win_file_name"
                        defaultValue={group.winResource?.file_name || ''}
                        placeholder="FL_Studio_WIN.zip"
                        className="rounded-xl mt-1 bg-ink-950 border-ink-800 text-ink-100 focus:border-cyan-500 text-xs font-mono"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <DialogFooter className="mt-5 flex items-center justify-between sm:justify-between w-full gap-2">
            <Button
              type="button"
              variant="ghost"
              disabled={deleting || loading}
              onClick={handleDeleteAll}
              className="rounded-xl border border-rose-900/40 bg-rose-950/20 text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-800 text-xs font-semibold h-10 px-3 flex items-center gap-1.5 cursor-pointer"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Eliminar DAW</span>
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-ink-800 hover:bg-ink-900 text-ink-300 h-10 text-xs cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || deleting}
                className="bg-coral-500 hover:bg-coral-600 text-white font-bold rounded-xl h-10 px-5 text-xs shadow-lg shadow-coral-500/20 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
