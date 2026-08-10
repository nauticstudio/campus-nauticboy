'use client'

import Image from 'next/image'
import {
  Waves,
  Cpu,
  Download,
  BookOpen,
  GraduationCap,
  FileText,
  Folder,
  Sparkles,
  Package,
  Music4,
  Layers,
  Settings,
  Zap,
  type LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

/** Mapa canónico lucide → nombre. Mantener sincronizado con categorías existentes. */
const LUCIDE_ICONS: Record<string, LucideIcon> = {
  waves: Waves,
  cpu: Cpu,
  download: Download,
  'book-open': BookOpen,
  cap: GraduationCap,
  'file-text': FileText,
  folder: Folder,
  sparkles: Sparkles,
  package: Package,
  music4: Music4,
  layers: Layers,
  settings: Settings,
  zap: Zap,
}

const FALLBACK_ICON = Package

export type SmartIconProps = {
  /** URL externa de imagen (SVG/PNG/WebP) — override de Lucide */
  iconUrl?: string | null
  /** Nombre de icono Lucide como fallback (ej. "cpu", "waves") */
  lucideName?: string | null
  /** Nombre corto como etiqueta accesible cuando se usa imagen */
  label?: string
  /** Clases aplicadas al contenedor (w/h + border-radius, droop, etc.) */
  className?: string
  /** Mostrar halo coral alrededor del icono */
  glow?: boolean
}

/**
 * Componente dual: pinta icon_url externo (si existe y carga) y cae a Lucide
 * icono si no. Las imágenes se sirven sin optimizar desde next/image para aceptar
 * cualquier host remoto (Supabase Storage, Drive CDN, etc.).
 */
export function SmartIcon({
  iconUrl,
  lucideName,
  label,
  className,
  glow = false,
}: SmartIconProps) {
  const [imgError, setImgError] = useState(false)

  const containerClasses = cn(
    'shrink-0 grid place-items-center rounded-xl relative overflow-visible',
    'border border-ink-700/40 bg-ink-800/60 backdrop-blur-sm',
    glow && 'shadow-[0_0_20px_-6px_rgba(255,98,19,0.55)] border-coral-500/30',
    className,
  )

  // 1) URL externa — si falla la carga cae a lucide
  if (iconUrl && !imgError) {
    return (
      <span className={containerClasses} aria-label={label}>
        {/* unoptimized: admite cualquier host remoto */}
        <Image
          src={iconUrl}
          alt={label ?? 'icon'}
          fill
          sizes="64px"
          unoptimized
          onError={() => setImgError(true)}
          className="object-contain"
        />
      </span>
    )
  }

  // 2) Lucide fallback
  const LucideComp = (lucideName && LUCIDE_ICONS[lucideName.toLowerCase()]) || FALLBACK_ICON
  return (
    <span className={containerClasses} aria-label={label}>
      <LucideComp className="w-[55%] h-[55%] text-coral-300" strokeWidth={1.75} />
    </span>
  )
}

/** Lista autorizada de nombres clave para formularios (admin). */
export const LUCIDE_ICON_CHOICES = Object.keys(LUCIDE_ICONS)
