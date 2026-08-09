import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Library, Package, Drum, Plug, FileText, Video, BrainCircuit, Target, ArrowRight, Sparkles
} from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger'

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
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">

      {/* Header Banner */}
      <Reveal>
        <div className="relative overflow-hidden rounded-[var(--radius)] bg-ink-900 text-white shadow-[var(--shadow-hero)] p-8 md:p-12">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-coral-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-ink-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-xs font-bold text-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Biblioteca de Recursos</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-editorial leading-[1.05]">
              La Academia
            </h1>
            <p className="text-ink-200 text-base md:text-lg font-medium leading-relaxed">
              Explora por categoría todas las plantillas, presets, samples y guías exclusivas de la comunidad.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Category Grid */}
      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.map(cat => {
          const Icon = cat.icon
          return (
            <StaggerItem key={cat.slug}>
              <Link href={`/academy/${cat.slug}`} className="group">
                <div className="glass-card glass-card-hover rounded-[var(--radius)] p-6 flex flex-col justify-between h-full">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-coral-100 border border-sand-200 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className="text-[11px] font-extrabold text-ink-500 bg-sand-100 px-2.5 py-1 rounded-full border border-sand-200">
                        {cat.count}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-bold text-xl text-ink-900 transition-colors tracking-tight">
                        {cat.name}
                      </h3>
                      <p className="text-xs font-medium text-ink-500 leading-relaxed line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-sand-200/70 flex items-center justify-between text-xs font-bold text-ink-600 group-hover:text-primary transition-colors">
                    <span>Explorar colección</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </StaggerItem>
          )
        })}
      </StaggerGroup>

    </div>
  )
}
