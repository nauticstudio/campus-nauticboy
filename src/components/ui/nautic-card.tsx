import * as React from 'react'
import { cn } from '@/lib/utils'

export type NauticCardProps = React.HTMLAttributes<HTMLDivElement> & {
  /** superficie elevada (capa 2) */
  elevated?: boolean
}

/**
 * Card base NAUTIC v3 — superficie sólida, hairline fina, sombra de luz.
 * NO glassmorphism, NO glow, NO blur. La elevación viene del fondo, no del vidrio.
 */
export const NauticCard = React.forwardRef<HTMLDivElement, NauticCardProps>(
  ({ className, elevated = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        elevated ? 'bg-[var(--surface-elevated)]' : 'bg-[var(--surface)]',
        'border border-[var(--border)] rounded-[var(--radius)] shadow-[0_2px_12px_rgba(3,7,18,0.65)]',
        'transition-colors duration-200',
        className,
      )}
      {...props}
    />
  ),
)
NauticCard.displayName = 'NauticCard'

/**
 * Card interactiva con hover: leve lift + borde que respira. NO salta, NO brillan.
 */
export const NauticCardHover = React.forwardRef<HTMLDivElement, NauticCardProps>(
  ({ className, ...props }, ref) => (
    <NauticCard
      ref={ref}
      className={cn(
        'hover:border-[var(--border-hover)] hover:shadow-[0_8px_28px_rgba(3,7,18,0.75),0_2px_8px_rgba(3,7,18,0.5)]',
        'hover:-translate-y-0.5 transition-all duration-200',
        className,
      )}
      {...props}
    />
  ),
)
NauticCardHover.displayName = 'NauticCardHover'
