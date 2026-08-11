import { createClient } from '@/lib/supabase/server'
import { Sparkles } from 'lucide-react'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger'
import { CategoryCard, type CategoryCardData } from '@/components/campus/CategoryCard'

export default async function AcademyPage() {
  const supabase = await createClient()

  const { data: dbCategories } = await supabase
    .from('categories')
    .select('id, name, slug, description, icon, icon_url, cover_image_url, accent_color, blurb')
    .order('sort_order', { ascending: true })

  const [dbResourcesResult, softwareCountsResult] = await Promise.all([
    supabase.from('resources').select('category_id').eq('is_published', true),
    supabase
      .from('software_products')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', true),
  ])
  const dbResources = dbResourcesResult.data
  const softwareCount = softwareCountsResult.count || 0

  const counts: Record<string, number> = {}
  dbResources?.forEach((r: { category_id: string | null }) => {
    if (r.category_id) counts[r.category_id] = (counts[r.category_id] || 0) + 1
  })

  const pluginsCategoryId = dbCategories?.find((c: any) => c.slug === 'plugins')?.id
  if (pluginsCategoryId) {
    counts[pluginsCategoryId] = (counts[pluginsCategoryId] || 0) + softwareCount
  }

  const categories: CategoryCardData[] = (dbCategories || []).map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
    description: cat.blurb?.trim() || cat.description || 'Explora recursos de esta categoría.',
    icon: cat.icon,
    icon_url: cat.icon_url,
    cover_image_url: cat.cover_image_url,
    accent_color: cat.accent_color ?? 'coral',
    count: `${counts[cat.id] || 0} Recursos`,
  }))

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto">

      <Reveal>
        <div className="relative overflow-hidden rounded-[var(--radius)] bg-ink-950 border border-[var(--border)] shadow-[var(--shadow-hero)] p-8 md:p-14 ambient-glow">
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-coral-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 space-y-5 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral-500/10 border border-coral-500/30 px-3.5 py-1.5 text-xs font-bold text-coral-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Biblioteca de Recursos</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-editorial leading-[1.05] text-ink-50">
              La Academia
            </h1>
            <p className="text-ink-300 text-base md:text-lg leading-relaxed">
              Explora por categoría todas las plantillas, presets, samples y guías exclusivas de la comunidad.
            </p>
          </div>
        </div>
      </Reveal>

      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(cat => (
          <StaggerItem key={cat.slug}>
            <CategoryCard data={cat} />
          </StaggerItem>
        ))}
      </StaggerGroup>

    </div>
  )
}
