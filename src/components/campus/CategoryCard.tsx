import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { SmartIcon } from '@/components/ui/smart-icon'
import { getCoverStyle } from '@/lib/utils/cover-style'

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

/**
 * Card de categoría — Immersive Hero Card.
 * Portada completa con degradado cinematográfico progresivo, sin cortes abruptos a la mitad.
 */
export function CategoryCard({ data }: { data: CategoryCardData }) {
  const hasCover = Boolean(data.cover_image_url)
  const chip = 'bg-coral-500/15 text-coral-300 border-coral-500/30'

  return (
    <Link href={`/academy/${data.slug}`} className="group block h-full focus-visible:outline-none">
      <div className="relative overflow-hidden rounded-[var(--radius)] h-full flex flex-col justify-between min-h-[250px] p-6 md:p-7
        bg-ink-950 border border-ink-800/80 shadow-[0_4px_24px_rgba(3,7,18,0.7)]
        transition-all duration-300
        hover:border-coral-500/50 hover:shadow-[0_12px_40px_rgba(3,7,18,0.85),0_0_24px_rgba(255,98,19,0.14)]
        hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-coral-500">
        
        {/* Full-bleed Immersive Cover Background */}
        {hasCover ? (
          <div className="absolute inset-0 z-0 overflow-hidden">
            <Image
              src={data.cover_image_url!}
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              unoptimized
              style={getCoverStyle(data.cover_image_url)}
              className="object-cover opacity-40 transition-all duration-500 group-hover:scale-105 group-hover:opacity-55"
            />
            {/* Smooth multi-stage cinematic gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-ink-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-ink-950/85 via-ink-950/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-52 h-52 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />
        )}

        {/* Top: Icon + Resource Count badge */}
        <div className="relative z-10 flex items-start justify-between gap-3">
          <div className="p-2.5 rounded-2xl bg-ink-900/90 backdrop-blur-md border border-ink-700/60 shadow-lg group-hover:border-coral-500/40 group-hover:scale-105 transition-all duration-300 shrink-0">
            <SmartIcon
              iconUrl={data.icon_url}
              lucideName={data.icon ?? 'cpu'}
              label={data.name}
              className="w-9 h-9"
            />
          </div>

          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border backdrop-blur-md bg-ink-950/80 shadow-md ${chip}`}>
            {data.count}
          </span>
        </div>

        {/* Bottom: Title, Description & Action link */}
        <div className="relative z-10 pt-6 space-y-3">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-ink-50 group-hover:text-coral-400 transition-colors tracking-tight line-clamp-1">
              {data.name}
            </h3>
            <p className="text-xs text-ink-300/90 leading-relaxed line-clamp-2 mt-1.5 font-medium">
              {data.description}
            </p>
          </div>

          {/* Footer Action */}
          <div className="pt-3.5 border-t border-ink-800/70 flex items-center justify-between">
            <span className="text-[11px] font-bold text-ink-300 group-hover:text-coral-300 transition-colors inline-flex items-center gap-1.5">
              <span>Entrar</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-coral-400" />
            </span>
          </div>
        </div>

      </div>
    </Link>
  )
}
