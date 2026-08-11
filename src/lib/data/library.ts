import 'server-only'

import { createClient } from '@/lib/supabase/server'
import {
  ALL_FILTER,
  FAVORITES_FILTER,
  type LibraryFilter,
  type LibraryItem,
} from './library-shared'

// Los tipos y constantes compartidos con componentes cliente viven en
// `library-shared.ts` (este módulo es server-only por las lecturas Supabase).
export { FAVORITES_FILTER }
export type { LibraryFilter, LibraryItem }

/**
 * Capa de datos de la Biblioteca.
 *
 * Unifica, SOLO para presentación, los dos catálogos reales del campus:
 *   - `resources`         (Academia: plantillas, presets, samples, plugins, pdfs…)
 *   - `software_products` (Hub de software con manufacturadores)
 *
 * No modifica el modelo de datos: normaliza a un `LibraryItem` de vista y
 * marca `kind`/`favoritable` para rutar y para saber qué puede marcarse ♡
 * (la tabla `favorites` solo referencia `resources`).
 *
 * Toda lectura usa el cliente de sesión → la RLS decide qué ve cada usuario
 * (is_published, is_restricted, user_can_access_resource). El student preview
 * funciona gratis porque el guard ya cambia el cliente.
 */

const CATEGORY_LABELS: Record<string, string> = {
  plantillas: 'Templates',
  presets: 'Presets',
  samples: 'Samples',
  plugins: 'Plugins',
  pdfs: 'PDFs',
  videos: 'Vídeos',
  cheatsheets: 'Cheatsheets',
  desafios: 'Desafíos',
  daws: 'DAWs',
}

function humanFileSize(bytes: number | null): string | null {
  if (!bytes || bytes <= 0) return null
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  return `${(bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

export async function getLibraryResources(): Promise<{
  items: LibraryItem[]
  filters: LibraryFilter[]
}> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [resourcesRes, softwareRes, favoritesRes] = await Promise.all([
    supabase
      .from('resources')
      .select(
        'id, title, slug, description, file_extension, version, file_size, is_featured, category_id, categories(name, slug), created_at'
      )
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    supabase
      .from('software_products')
      .select('id, name, slug, description, version, formats, is_featured, manufacturer:software_manufacturers(slug), created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false }),
    user
      ? supabase.from('favorites').select('resource_id').eq('user_id', user.id)
      : Promise.resolve({ data: [] as { resource_id: string }[] }),
  ])

  const favIds = new Set((favoritesRes.data ?? []).map((f) => f.resource_id))

  const items: LibraryItem[] = []

  // Filtros derivados de los datos — solo tipos con contenido real.
  const counts: Record<string, number> = {}
  const labels: Record<string, string> = {}

  for (const r of resourcesRes.data ?? []) {
    const cat = (Array.isArray(r.categories) ? r.categories[0] : r.categories) as
      | { name: string; slug: string }
      | null
    const type = cat?.slug ?? 'general'
    const label = cat?.name ?? CATEGORY_LABELS[type] ?? 'Material'

    counts[type] = (counts[type] ?? 0) + 1
    labels[type] = label

    items.push({
      id: r.id,
      title: r.title,
      description: r.description,
      kind: 'resource',
      type,
      typeLabel: label,
      format: r.file_extension ? r.file_extension.toUpperCase() : null,
      version: r.version ?? null,
      size: humanFileSize(r.file_size),
      href: `/academy/${type}#recurso-${r.slug}`,
      downloadId: r.id,
      favoritable: true,
      isFavorite: favIds.has(r.id),
      isFeatured: r.is_featured ?? false,
      createdAt: r.created_at,
    })
  }

  let softwareCount = 0
  for (const p of softwareRes.data ?? []) {
    softwareCount += 1
    const manufacturer = (Array.isArray(p.manufacturer) ? p.manufacturer[0] : p.manufacturer) as
      | { slug: string }
      | null

    items.push({
      id: p.id,
      title: p.name,
      description: p.description,
      kind: 'software',
      type: 'software',
      typeLabel: 'Software',
      format: p.formats && p.formats.length > 0 ? p.formats.join(' / ').toUpperCase() : null,
      version: p.version ?? null,
      size: null,
      href: manufacturer ? `/software/${manufacturer.slug}/${p.slug}` : `/software/${p.slug}`,
      downloadId: null,
      favoritable: false, // favorites solo referencia `resources`
      isFavorite: false,
      isFeatured: p.is_featured ?? false,
      createdAt: p.created_at,
    })
  }

  const filters: LibraryFilter[] = [
    { ...ALL_FILTER, count: items.length },
    ...Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([slug, count]) => ({ slug, label: labels[slug], count })),
  ]
  if (softwareCount > 0) {
    filters.push({ slug: 'software', label: 'Software', count: softwareCount })
  }

  return { items, filters }
}

/** Favoritos del usuario actual (solo `resources`). */
export async function getFavoriteItems(): Promise<LibraryItem[]> {
  const { items } = await getLibraryResources()
  return items.filter((i) => i.favoritable && i.isFavorite)
}
