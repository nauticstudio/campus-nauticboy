import { Skeleton } from '@/components/ui/skeleton'

export default function CampusLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 p-6 md:p-10 lg:p-12" aria-busy="true" aria-label="Cargando contenido">
      <div className="glass-card space-y-5 rounded-[var(--radius)] p-8 md:p-10">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-3/4 max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  )
}
