import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * La sección "Software" ya no existe como destino de navegación: todo el
 * catálogo (fabricantes + productos) vive dentro de la categoría Plugins de
 * la Academia. Esta ruta solo redirige para no romper enlaces antiguos.
 * Las páginas `/software/[manufacturerSlug]/[productSlug]` se conservan.
 */
export default function SoftwareHubRedirect() {
  redirect('/academy/plugins')
}

