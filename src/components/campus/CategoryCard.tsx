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
 * Card de categoría — Library sobria (WORKFLOW).
 * Superficie sólida, hairline, hover = leve lift + borde coral. Firma única coral.
 * Se conserva el campo accent_color de la DB pero v3 usa SIEMPRE coral como firma.
 */
export function CategoryCard({ data }: { data: CategoryCardData }) {
  const hasCover = Boolean(data.cover_image_url)
  const chip = 'bg-coral-500/12 text-coral-300 border-coral-500/25'

  return (
    <Link href={`/academy/${data.slug}`} className="group block h-full focus-visible:outline-none">
      <div className="relative overflow-hidden rounded-[var(--radius)] h-full flex flex-col
        bg-[var(--surface)] border border-[var(--border)] shadow-[0_2px_12px_rgba(3,7,18,0.65)]
        transition-all duration-200
        group-hover:border-coral-500/40 group-hover:shadow-[0_8px_28px_rgba(3,7,18,0.75),0_2px_8px_rgba(3,7,18,0.5)]
        group-hover:-translate-y-0.5 group-focus-visible:outline-2 group-focus-visible:outline-coral-500">
        {/* Cover — sin overlays recargados, solo degradado suave de legibilidad */}
        {hasCover ? (
          <div className="relative h-36 w-full overflow-hidden">
            <Image
              src={data.cover_image_url!}
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
              style={getCoverStyle(data.cover_image_url)}
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/40 to-transparent" />
            <span className={`absolute top-3 right-3 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-ink-950/70 ${chip}`}>
              {data.count}
            </span>
          </div>
        ) : (
          /* Sin cover: franja superior mínima en gris tenue, SIN blobs ni grid */
          <div className="h-1 w-full bg-gradient-to-r from-ink-500/30 via-ink-500/10 to-transparent" />
        )}

        {/* Body */}
        <div className="relative p-5 md:p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <SmartIcon
                iconUrl={data.icon_url}
                lucideName={data.icon ?? 'cpu'}
                label={data.name}
                className={hasCover ? 'w-11 h-11' : 'w-12 h-12'}
              />
              <h3 className="font-display text-lg md:text-xl font-semibold text-ink-50 tracking-quant transition-colors line-clamp-2">
                {data.name}
              </h3>
            </div>

            <p className="text-xs text-ink-300 leading-relaxed line-clamp-2">
              {data.description}
            </p>
          </div>

          {/* Footer CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            {!hasCover && (
              <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border ${chip}`}>
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
