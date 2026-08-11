/**
 * Utilidades para parsing y aplicación de encuadre/zoom en URLs de portadas.
 * Formato del hash: #pos=X,Y,ZOOM (ej. #pos=50,20,1.2)
 */

export interface CoverPos {
  x: number // 0-100
  y: number // 0-100
  zoom: number // 1.0 - 2.5
}

export const DEFAULT_COVER_POS: CoverPos = { x: 50, y: 50, zoom: 1 }

export function parseCoverUrl(rawUrl: string | null | undefined): { baseUrl: string; pos: CoverPos } {
  if (!rawUrl) return { baseUrl: '', pos: { ...DEFAULT_COVER_POS } }

  const hashIndex = rawUrl.indexOf('#pos=')
  if (hashIndex === -1) {
    return { baseUrl: rawUrl, pos: { ...DEFAULT_COVER_POS } }
  }

  const baseUrl = rawUrl.substring(0, hashIndex)
  const posString = rawUrl.substring(hashIndex + 5)
  const parts = posString.split(',').map(n => Number.parseFloat(n))

  const x = !Number.isNaN(parts[0]) ? Math.max(0, Math.min(100, parts[0])) : 50
  const y = !Number.isNaN(parts[1]) ? Math.max(0, Math.min(100, parts[1])) : 50
  const zoom = !Number.isNaN(parts[2]) ? Math.max(1, Math.min(3, parts[2])) : 1

  return {
    baseUrl,
    pos: { x, y, zoom }
  }
}

export function buildCoverUrl(baseUrl: string, pos: CoverPos): string {
  if (!baseUrl) return ''
  // Si los valores son por defecto, no agregar hash
  if (pos.x === 50 && pos.y === 50 && pos.zoom === 1) {
    return baseUrl
  }
  const cleanBase = baseUrl.split('#pos=')[0]
  return `${cleanBase}#pos=${Math.round(pos.x)},${Math.round(pos.y)},${Number(pos.zoom.toFixed(2))}`
}

export function getCoverStyle(url: string | null | undefined): React.CSSProperties {
  const { pos } = parseCoverUrl(url)
  return {
    objectPosition: `${pos.x}% ${pos.y}%`,
    transform: pos.zoom !== 1 ? `scale(${pos.zoom})` : undefined,
    transformOrigin: `${pos.x}% ${pos.y}%`,
  }
}
