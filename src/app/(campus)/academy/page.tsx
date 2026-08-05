import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { 
  Library, 
  Package, 
  Drum, 
  Plug, 
  FileText, 
  Video, 
  BrainCircuit, 
  Target, 
  ArrowRight, 
  Sparkles
} from 'lucide-react'

const ICON_MAP: Record<string, any> = {
  'layout-template': Library,
  'sliders': Package,
  'drum': Drum,
  'plug': Plug,
  'file-text': FileText,
  'video': Video,
  'brain-circuit': BrainCircuit,
  'target': Target
}

export default async function AcademyPage() {
  const supabase = await createClient()

  // Fetch categories from DB
  const { data: dbCategories } = await supabase
    .from('categories')
    .select('id, name, slug, description, icon')
    .order('sort_order', { ascending: true })

  // Fetch count of published resources for each category
  const { data: dbResources } = await supabase
    .from('resources')
    .select('category_id')
    .eq('is_published', true)

  const resourceCounts: Record<string, number> = {}
  dbResources?.forEach(r => {
    if (r.category_id) {
      resourceCounts[r.category_id] = (resourceCounts[r.category_id] || 0) + 1
    }
  })

  const categories = (dbCategories || []).map(cat => ({
    name: cat.name,
    slug: cat.slug,
    description: cat.description || 'Explora recursos de esta categoría.',
    icon: ICON_MAP[cat.icon] || Library,
    count: `${resourceCounts[cat.id] || 0} Recursos`,
  }))

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-8 md:p-12 text-white shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-3.5 py-1 text-xs font-bold text-sky-400 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Biblioteca de Recursos Ilimitados</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            La Academia 📚
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
            Explora por categoría todas las plantillas, presets, samples y guías exclusivas de la comunidad.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(cat => {
          const Icon = cat.icon
          return (
            <Link key={cat.slug} href={`/academy/${cat.slug}`} className="group">
              <div className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden group-hover:border-cyan-400/60">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-50 border border-slate-200/60 flex items-center justify-center text-cyan-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
                      {cat.count}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-cyan-600">
                  <span>Explorar colección</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
