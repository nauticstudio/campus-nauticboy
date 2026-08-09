import { createClient } from '@/lib/supabase/server'
import { FolderTree, Plus, Shield, Edit3, Trash2, Package } from 'lucide-react'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, icon')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink-900 tracking-editorial">Categorías de la Academia</h1>
        </div>

        <button 
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary/95 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {(!categories || categories.length === 0) ? (
        <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-100 text-primary flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-900">No hay categorías en Supabase</h3>
          <p className="text-xs font-semibold text-ink-500 max-w-sm mx-auto">
            Crea la primera categoría para organizar las plantillas y presets de tu academia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map(cat => (
            <div key={cat.id} className="glass-card glass-card-hover rounded-[var(--radius)] p-6 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-ink-900 text-base">{cat.name}</h3>
                <span className="text-xs font-semibold text-ink-400 font-mono">/{cat.slug}</span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-xl text-ink-400 hover:text-primary hover:bg-sand-100 transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl text-ink-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
