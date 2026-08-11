import type { ReactNode } from 'react'

/**
 * Estados vacíos de la biblioteca — sin hero, sin métricas ficticias.
 */
export function EmptyState({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--radius)] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-16 text-center">
      <div className="text-ink-500">{icon}</div>
      <h3 className="font-display text-lg font-semibold text-ink-100">{title}</h3>
      <p className="max-w-sm text-sm font-medium leading-relaxed text-ink-500">{description}</p>
      {children && <div className="mt-2">{children}</div>}
    </div>
  )
}
