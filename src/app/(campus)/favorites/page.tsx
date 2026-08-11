import { Heart } from 'lucide-react'
import { getFavoriteItems } from '@/lib/data/library'
import { ResourceCard } from '@/components/library/ResourceCard'
import { EmptyState } from '@/components/library/EmptyState'

export const dynamic = 'force-dynamic'

export default async function FavoritesPage() {
  const items = await getFavoriteItems()

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto mb-20">
      <header className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-quant text-ink-50">
          Favoritos
        </h1>
        <p className="mt-1 text-sm font-medium text-ink-400">
          Recursos que has guardado con ♡ para acceder rápidamente.
        </p>
      </header>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="h-10 w-10" />}
          title="Todavía no tienes recursos favoritos"
          description="Marca recursos con ♡ para encontrarlos rápidamente."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ResourceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

