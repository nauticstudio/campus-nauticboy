import { createClient } from '@/lib/supabase/server'
import { Shield, Package, ImageOff } from 'lucide-react'
import { CategoryNewButton, CategoryEditButton } from '@/components/admin/CategoryModal'
import { SmartIcon } from '@/components/ui/smart-icon'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, icon, icon_url, cover_image_url, accent_color, blurb')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink-50 tracking-editorial">Categorías de la Academia</h1>
        </div>
        <CategoryNewButton />
      </div>

      {(!categories || categories.length === 0) ? (
        <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-500/15 border border-coral-500/30 flex items-center justify-center mx-auto text-coral-300">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-50">No hay categorías en Supabase</h3>
          <p className="text-xs text-ink-400 max-w-sm mx-auto">
            Crea la primera categoría para organizar plantillas, presets y guías. Podrás ponerle icono personalizado, portada y color.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => (
            <div key={cat.id} className="glass-card glass-card-hover rounded-[var(--radius)] overflow-hidden flex flex-col">
              <div className="relative h-24 bg-ink-900/60 border-b border-ink-700/40 flex items-center justify-center">
                {cat.cover_image_url ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.cover_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                  </>
                ) : (
                  <ImageOff className="w-5 h-5 text-ink-500" />
                )}
                <span className="absolute top-2 right-2 text-[9px] font-extrabold uppercase tracking-widest text-ink-300 bg-ink-950/70 backdrop-blur px-2 py-0.5 rounded-full border border-ink-700/50">
                  {cat.accent_color}
                </span>
              </div>

              <div className="p-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <SmartIcon
                    iconUrl={cat.icon_url}
                    lucideName={cat.icon}
                    label={cat.name}
                    className="w-10 h-10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-ink-50 truncate">{cat.name}</h3>
                    <p className="text-[10px] font-mono text-ink-400 truncate">/{cat.slug}</p>
                    {cat.blurb && <p className="text-[11px] text-ink-400 mt-1 line-clamp-1">{cat.blurb}</p>}
                  </div>
                </div>
                <CategoryEditButton category={cat as any} />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
