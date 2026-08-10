'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Image as ImageIcon, Edit3 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { upsertCategoryAction, deleteCategoryAction } from '@/app/actions/categories'

export type CategoryRow = {
  id: string
  name: string
  slug: string
  icon: string | null
  icon_url: string | null
  cover_image_url: string | null
  accent_color: 'coral' | 'violet' | 'cyan' | 'emerald' | 'rose'
  blurb: string | null
}

const ACCENTS: CategoryRow['accent_color'][] = ['coral', 'violet', 'cyan', 'emerald', 'rose']

function isValidHttpUrl(url: string): boolean {
  if (!url) return false
  try { const u = new URL(url); return u.protocol === 'https:' || u.protocol === 'http:' }
  catch { return false }
}

export function CategoryModal({
  open, onClose, category,
}: {
  open: boolean
  onClose: () => void
  /** undefined → nueva categoría */
  category?: CategoryRow
}) {
  const router = useRouter()
  const isEdit = !!category
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState(category?.cover_image_url ?? '')

  useEffect(() => {
    setError(null)
    setPreviewUrl(category?.cover_image_url ?? '')
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const res = await upsertCategoryAction(formData)
    setLoading(false)
    if ('error' in res) setError(res.error)
    else { router.refresh(); onClose() }
  }

  const handleDelete = async () => {
    if (!category) return
    if (!confirm(`¿Eliminar "${category.name}"? Los recursos ligados quedan huérfanos.`)) return
    setDeleting(true)
    const res = await deleteCategoryAction(category.id)
    setDeleting(false)
    if ('error' in res) setError(res.error)
    else { router.refresh(); onClose() }
  }

  const showPreview = useMemo(() => isValidHttpUrl(previewUrl), [previewUrl])

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-[560px] glass-card text-ink-50 rounded-[var(--radius)] p-6 border-ink-700/50 backdrop-blur-xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="space-y-2 mb-4">
            <DialogTitle className="font-display text-2xl font-semibold text-ink-50 tracking-editorial">
              {isEdit ? 'Editar categoría' : 'Nueva categoría'}
            </DialogTitle>
            <DialogDescription className="text-xs font-medium text-ink-400">
              Personaliza icono, portada y color. Acepta URLs de Supabase Storage,
              Drive público (<code className="bg-ink-800 px-1 rounded text-coral-300">?export=view&id=…</code>) o CDN.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[62vh] overflow-y-auto pr-1 custom-scrollbar">
            {isEdit && <input type="hidden" name="id" value={category.id} />}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Nombre *</label>
                <Input name="name" required defaultValue={category?.name ?? ''}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50"
                  placeholder="Ej. Sintetizadores" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Slug *</label>
                <Input name="slug" required defaultValue={category?.slug ?? ''}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-xs"
                  placeholder="sintetizadores" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Blurb</label>
              <Input name="blurb" defaultValue={category?.blurb ?? ''}
                className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50"
                placeholder="Subtexto descriptivo en la portada" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Icono Lucide</label>
                <Input name="icon" defaultValue={category?.icon ?? 'cpu'}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-xs"
                  placeholder="cpu | waves | music4 …" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Icono URL (override)</label>
                <Input name="icon_url" type="url" defaultValue={category?.icon_url ?? ''}
                  className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-[11px]"
                  placeholder="https://cdn.example.com/icon.svg" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Portada URL
              </label>
              <Input
                name="cover_image_url"
                type="url"
                value={previewUrl}
                onChange={(e) => setPreviewUrl(e.target.value)}
                className="rounded-xl mt-1 bg-ink-800/70 border-ink-700 text-ink-50 font-mono text-[11px]"
                placeholder="https://cdn.example.com/portada.jpg" />
            </div>

            {showPreview && (
              <div className="relative h-40 rounded-xl overflow-hidden border border-ink-700/50">
                <Image
                  src={previewUrl}
                  alt="preview"
                  fill
                  sizes="480px"
                  unoptimized
                  className="object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.15' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/25 to-transparent" />
                <div className="absolute bottom-2 left-3 text-[10px] font-bold text-ink-300 uppercase tracking-widest">
                  Vista previa
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">Color de acento</label>
              <div className="grid grid-cols-5 gap-2 mt-2">
                {ACCENTS.map(acc => (
                  <label key={acc} className="cursor-pointer">
                    <input type="radio" name="accent_color" value={acc}
                      defaultChecked={(category?.accent_color ?? 'coral') === acc}
                      className="peer sr-only" />
                    <span className={`block h-10 rounded-lg border-2 border-transparent peer-checked:border-cyan-50 peer-checked:shadow-[0_0_14px_rgba(255,138,76,0.55)] transition-all uppercase text-[9px] font-bold tracking-wider grid place-items-center text-ink-950
                      ${acc === 'coral' ? 'bg-coral-500' : ''}
                      ${acc === 'violet' ? 'bg-violet-500' : ''}
                      ${acc === 'cyan' ? 'bg-cyan-400' : ''}
                      ${acc === 'emerald' ? 'bg-emerald-400' : ''}
                      ${acc === 'rose' ? 'bg-rose-400' : ''}
                    `}>
                      {acc.slice(0,3)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="text-xs font-semibold bg-destructive/15 border border-destructive/40 text-red-200 rounded-lg px-3 py-2">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="mt-6 flex items-center justify-between">
            <div>
              {isEdit && (
                <Button type="button" onClick={handleDelete}
                  disabled={deleting || loading}
                  className="text-xs font-bold text-red-300 hover:text-red-200 hover:bg-destructive/10 bg-transparent border border-red-900/50 rounded-xl">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Eliminar'}
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" onClick={onClose} variant="ghost"
                className="text-xs font-bold text-ink-300 hover:text-ink-50 hover:bg-ink-800 rounded-xl">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}
                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-[0_0_20px_-6px_rgba(255,98,19,0.5)]">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isEdit ? 'Guardar' : 'Crear categoría')}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}




/** Botón "Nueva categoría" para el header del admin page */
export function CategoryNewButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white font-bold text-xs shadow-[0_0_20px_-4px_rgba(255,98,19,0.5)] hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        <span>Nueva Categoría</span>
      </button>
      <CategoryModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}

/** Botón "Editar" que abre el modal con la categoría cargada */
export function CategoryEditButton({ category }: { category: CategoryRow }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Editar ${category.name}`}
        className="p-2 rounded-xl text-ink-400 hover:text-coral-300 hover:bg-ink-800/60 transition-colors"
      >
        <Edit3 className="w-4 h-4" />
      </button>
      <CategoryModal open={open} onClose={() => setOpen(false)} category={category} />
    </>
  )
}
