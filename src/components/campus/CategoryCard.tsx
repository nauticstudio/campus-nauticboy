import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SmartIcon } from '@/components/ui/smart-icon'

export type CategoryCardData = {
  name: string
  slug: string
  description: string
  icon: string | null
  icon_url: string | null
  cover_image_url: string | null
  accent_color: 'coral' | 'violet' | 'cyan' | 'emerald' | 'rose'
  count: string
}

const ACCENT_CLASSES: Record<CategoryCardData['accent_color'], { glow: string; chip: string; border: string }> = {
  coral:   { glow: 'shadow-[0_0_24px_-6px_rgba(255,98,19,0.55)]',   chip: 'bg-coral-500/15 text-coral-300 border-coral-500/30',    border: 'group-hover:border-coral-500/40' },
  violet:  { glow: 'shadow-[0_0_24px_-6px_rgba(139,92,246,0.55)]',  chip: 'bg-violet-500/15 text-violet-300 border-violet-500/30',  border: 'group-hover:border-violet-500/40' },
  cyan:    { glow: 'shadow-[0_0_24px_-6px_rgba(34,211,238,0.55)]',  chip: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',        border: 'group-hover:border-cyan-500/40' },
  emerald: { glow: 'shadow-[0_0_24px_-6px_rgba(16,185,129,0.55)]',  chip: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', border: 'group-hover:border-emerald-500/40' },
  rose:    { glow: 'shadow-[0_0_24px_-6px_rgba(244,63,94,0.55)]',   chip: 'bg-rose-500/15 text-rose-300 border-rose-500/30',        border: 'group-hover:border-rose-500/40' },
}

/**
 * Card premium de categoría para Academy.
 * - Si `cover_image_url` existe: héroe visual con overlay degrade.
 * - En cualquier caso: SmartIcon (icon_url externo > Lucide) + acento configurable.
 */
export function CategoryCard({ data }: { data: CategoryCardData }) {
  const accent = ACCENT_CLASSES[data.accent_color] ?? ACCENT_CLASSES.coral
  const hasCover = Boolean(data.cover_image_url)

  return (
    <Link href={`/academy/${data.slug}`} className="group block h-full">
      <div className={`relative overflow-hidden rounded-[var(--radius)] glass-card glass-card-hover h-full flex flex-col ${accent.border}`}>
        {/* Cover / hero visual */}
        {hasCover ? (
          <div className="relative h-36 w-full overflow-hidden">
            <Image
              src={data.cover_image_url!}
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-transparent" />
            {/* Grid overlay tenue para mantener coherencia futurista */}
            <div className="absolute inset-0 tech-grid opacity-40" />
            {/* Chip de conteo sobre la portada */}
            <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border backdrop-blur ${accent.chip}`}>
              {data.count}
            </span>
          </div>
        ) : (
          <div className="relative h-16 bg-ink-900/60 border-b border-ink-700/40 tech-grid">
            <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-50 pointer-events-none ${
              data.accent_color === 'violet' ? 'bg-violet-500' :
              data.accent_color === 'cyan'   ? 'bg-cyan-500'   :
              data.accent_color === 'emerald'? 'bg-emerald-500':
              data.accent_color === 'rose'   ? 'bg-rose-500'   :
              'bg-coral-500'
            }`} />
          </div>
        )}

        {/* Body */}
        <div className="relative p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {/* Icon + nombre */}
            <div className="flex items-center gap-3.5">
              <SmartIcon
                iconUrl={data.icon_url}
                lucideName={data.icon ?? 'cpu'}
                label={data.name}
                glow
                className={`${hasCover ? 'w-11 h-11' : 'w-12 h-12'} ${accent.glow}`}
              />
              <h3 className="font-display text-lg md:text-xl font-semibold text-ink-50 tracking-editorial transition-colors line-clamp-2">
                {data.name}
              </h3>
            </div>

            <p className="text-xs text-ink-300 leading-relaxed line-clamp-2">
              {data.description}
            </p>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-ink-700/30">
            {!hasCover && (
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${accent.chip}`}>
                {data.count}
              </span>
            )}
            <span className="text-[11px] font-bold text-ink-300 group-hover:text-coral-300 transition-colors inline-flex items-center gap-1">
              Entrar <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
