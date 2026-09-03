/**
 * Utilidades para detección y formateo automático de Volúmenes y Versiones
 * en recursos y packs de sonido (Samples, Presets, etc.)
 */

/**
 * Detecta si un texto (título, nombre de archivo o campo version)
 * contiene una indicación de Volumen o Parte.
 * 
 * Soporta variantes como:
 * - "Volumen 1", "Volumen.1", "Volumen 02", "Volumen01"
 * - "Volume 1", "Volume.1", "Volume-1", "Volume_1", "Volume 03"
 * - "Vol. 1", "Vol.1", "Vol 1", "Vol-1", "Vol_1", "Vol1", "Vol. 02"
 * - "Parte 1", "Part 1", "Part. 1", "Pt. 1", "Pt 1"
 * - " V1", " V2", " V3" (solo si es número entero, sin decimales como v1.0)
 * - Enteros directos (ej. "1", "2", "3")
 * 
 * Retorna el número entero (ej. 1, 2, 3) o null si no se detecta.
 */
export function extractVolumeNumber(text?: string | null): number | null {
  if (!text) return null
  const cleaned = text.trim()
  if (!cleaned) return null

  // 1. Si el texto es directamente un número entero (ej. version="1" o "2")
  if (/^\d+$/.test(cleaned)) {
    const num = parseInt(cleaned, 10)
    if (num > 0 && num < 1000) return num
  }

  // 2. Patrón principal para Vol, Volume, Volumen, Parte, Part, Pt
  // Matches: Vol.1, Vol 1, Vol-1, Vol_1, Vol1, Volume 1, Volume.1, Volumen 1, Part 1, Pt. 1
  const volRegex = /(?:vol(?:umen?|ume)?|parte?|pt)\.?\s*#?[-_.]?\s*([0-9]+)/i
  const match = cleaned.match(volRegex)
  if (match && match[1]) {
    const num = parseInt(match[1], 10)
    if (!isNaN(num) && num > 0) return num
  }

  // 3. Patrón para " V1", " V2", " V3" (evitando v1.0 o v2.4.1)
  const vRegex = /(?:^|\s|[_\-(])v([0-9]{1,2})(?!\.[0-9])/i
  const vMatch = cleaned.match(vRegex)
  if (vMatch && vMatch[1]) {
    const num = parseInt(vMatch[1], 10)
    if (!isNaN(num) && num > 0) return num
  }

  return null
}

export interface ResourceBadgeInfo {
  isVolume: boolean
  label: string | null
  volumeNumber?: number
}

/**
 * Determina qué badge mostrar en la tarjeta del recurso.
 * Prioriza detectar volumen en el título, nombre de archivo o campo version.
 * Si se detecta volumen -> "VOL. X"
 * Si es versión de software -> "v1.2", "v24.1", etc.
 */
export function getResourceBadgeInfo({
  version,
  title,
  fileName,
  isUniversal = true,
}: {
  version?: string | null
  title?: string | null
  fileName?: string | null
  isUniversal?: boolean
}): ResourceBadgeInfo {
  // 1. Verificar si el campo version ya es un volumen o número
  const versionVol = extractVolumeNumber(version)
  if (versionVol !== null) {
    return { isVolume: true, label: `VOL. ${versionVol}`, volumeNumber: versionVol }
  }

  // 2. Verificar si el título contiene volumen (ej. "Vengeance Effects Vol.1")
  const titleVol = extractVolumeNumber(title)
  if (titleVol !== null) {
    return { isVolume: true, label: `VOL. ${titleVol}`, volumeNumber: titleVol }
  }

  // 3. Verificar si el archivo contiene volumen (ej. "Vengeance_EDM_Vol_2.zip")
  const fileVol = extractVolumeNumber(fileName)
  if (fileVol !== null) {
    return { isVolume: true, label: `VOL. ${fileVol}`, volumeNumber: fileVol }
  }

  // 4. Si no es un volumen, formatear como versión normal de software
  if (version && version.trim()) {
    const v = version.trim()
    // Si en universal el version es exactamente "1.0" pero no se detectó volumen,
    // en packs de samples "v1.0" es ruido innecesario, pero lo mostramos si no es genérico
    const cleanV = v.startsWith('v') || v.startsWith('V') ? v : `v${v}`
    return { isVolume: false, label: cleanV }
  }

  return { isVolume: false, label: null }
}
