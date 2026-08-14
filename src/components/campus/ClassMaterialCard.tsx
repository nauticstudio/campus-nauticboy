'use client'

import { useState } from 'react'
import {
  Calendar,
  Download,
  ExternalLink,
  FileArchive,
  FileAudio,
  FileCode2,
  FileText,
  Sliders,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  FolderDown,
  User,
  Sparkles
} from 'lucide-react'
import { NauticCard } from '@/components/ui/nautic-card'
import { formatDate } from '@/lib/date'
import type { ClassMaterial, ClassMaterialFile } from '@/lib/data/class-materials'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ClassMaterialCardProps {
  material: ClassMaterial
  isAdmin?: boolean
  onEdit?: (material: ClassMaterial) => void
  onDelete?: (materialId: string) => void
  onTogglePublish?: (materialId: string, currentPublished: boolean) => void
}

function getFileIcon(type?: string, title?: string) {
  const query = `${type || ''} ${title || ''}`.toLowerCase()
  if (query.includes('als') || query.includes('ableton') || query.includes('flp') || query.includes('project') || query.includes('proyecto')) {
    return FileCode2
  }
  if (query.includes('zip') || query.includes('rar') || query.includes('stems') || query.includes('pack')) {
    return FileArchive
  }
  if (query.includes('wav') || query.includes('mp3') || query.includes('audio') || query.includes('mix') || query.includes('master')) {
    return FileAudio
  }
  if (query.includes('preset') || query.includes('serum') || query.includes('vital') || query.includes('synth')) {
    return Sliders
  }
  return FileText
}

export function ClassMaterialCard({
  material,
  isAdmin = false,
  onEdit,
  onDelete,
  onTogglePublish,
}: ClassMaterialCardProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyUrlToClipboard = (file: ClassMaterialFile) => {
    navigator.clipboard.writeText(file.url)
    setCopiedId(file.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <NauticCard elevated className="relative overflow-hidden p-6 md:p-8 space-y-6 border border-ink-800/80 transition-all duration-200 hover:border-ink-700">
      
      {/* Top Header / Meta */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2">
          
          {/* Badges / Meta row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-coral-500/10 border border-coral-500/25 text-coral-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(material.session_date)}</span>
            </span>

            {isAdmin && material.student && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-ink-800/80 border border-ink-700/80 text-ink-200">
                <User className="w-3.5 h-3.5 text-coral-400" />
                <span>{material.student.full_name || material.student.email}</span>
              </span>
            )}

            {isAdmin && (
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border ${
                  material.is_published
                    ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}
              >
                {material.is_published ? (
                  <>
                    <Eye className="w-3 h-3" /> Publicado
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3 h-3" /> Borrador
                  </>
                )}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-display text-xl md:text-2xl font-bold text-ink-50 tracking-quant">
            {material.title}
          </h3>
        </div>

        {/* Admin Menu */}
        {isAdmin && (
          <div className="shrink-0 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label="Opciones del material"
                className="p-2 rounded-xl text-ink-400 hover:text-ink-100 hover:bg-ink-800/80 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-coral-500"
              >
                <MoreVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="min-w-48 rounded-xl border-ink-800 bg-ink-950/95 backdrop-blur-2xl text-ink-100 p-1.5 shadow-2xl"
              >
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(material)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer hover:bg-ink-900 focus:bg-ink-900"
                  >
                    <Pencil className="w-4 h-4 text-coral-400" />
                    <span>Editar Material</span>
                  </DropdownMenuItem>
                )}

                {onTogglePublish && (
                  <DropdownMenuItem
                    onClick={() => onTogglePublish(material.id, material.is_published)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg cursor-pointer hover:bg-ink-900 focus:bg-ink-900"
                  >
                    {material.is_published ? (
                      <>
                        <EyeOff className="w-4 h-4 text-amber-400" />
                        <span>Pasar a Borrador</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 text-emerald-400" />
                        <span>Publicar</span>
                      </>
                    )}
                  </DropdownMenuItem>
                )}

                {onDelete && (
                  <>
                    <DropdownMenuSeparator className="bg-ink-800/80" />
                    <DropdownMenuItem
                      onClick={() => onDelete(material.id)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 rounded-lg cursor-pointer hover:bg-rose-950/40 focus:bg-rose-950/40"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Eliminar Material</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Description / Notes if present */}
      {material.description && (
        <div className="p-4 rounded-xl bg-ink-950/60 border border-ink-800/60 space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-coral-400 uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Notas de la sesión y feedback</span>
          </div>
          <p className="text-xs md:text-sm font-normal text-ink-200 leading-relaxed whitespace-pre-line">
            {material.description}
          </p>
        </div>
      )}

      {/* Files List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-ink-400 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <FolderDown className="w-3.5 h-3.5 text-coral-400" />
            <span>Archivos listos para descargar ({material.files.length})</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {material.files.map((file) => {
            const Icon = getFileIcon(file.file_type, file.title)
            return (
              <div
                key={file.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 p-3.5 md:p-4 rounded-xl bg-ink-950/80 border border-ink-800/80 hover:border-coral-500/40 transition-all duration-200"
              >
                {/* Left: Icon & details */}
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-ink-900 border border-ink-800 flex items-center justify-center text-coral-400 shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-semibold text-sm text-ink-50 group-hover:text-white transition-colors truncate">
                      {file.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-ink-400 font-mono">
                      {file.file_type && (
                        <span className="px-2 py-0.5 rounded-md bg-ink-900 border border-ink-800 text-ink-300 font-sans">
                          {file.file_type}
                        </span>
                      )}
                      {file.file_size && (
                        <span className="text-ink-400 font-semibold">{file.file_size}</span>
                      )}
                      {file.note && (
                        <span className="text-ink-300 font-sans italic truncate max-w-xs">
                          {file.note}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Download Actions */}
                <div className="flex items-center gap-2 shrink-0 sm:self-center">
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-md shadow-coral-500/10 active:scale-95 transition-all duration-200"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

    </NauticCard>
  )
}
