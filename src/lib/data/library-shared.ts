/** Vista unificada de un recurso de la biblioteca (solo presentación). */
export type LibraryItem = {
  id: string
  title: string
  description: string | null
  kind: 'resource' | 'software'
  type: string
  typeLabel: string
  format: string | null
  version: string | null
  size: string | null
  href: string
  downloadId: string | null
  favoritable: boolean
  isFavorite: boolean
  isFeatured: boolean
  createdAt: string
}

export type LibraryFilter = {
  slug: string
  label: string
  count: number
}

export const ALL_FILTER: LibraryFilter = { slug: 'all', label: 'Todos', count: 0 }
export const FAVORITES_FILTER: LibraryFilter = { slug: 'favorites', label: 'Favoritos', count: 0 }
