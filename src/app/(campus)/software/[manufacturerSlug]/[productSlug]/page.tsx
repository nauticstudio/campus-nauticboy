import { getProductEcosystem } from '@/lib/data/software'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, ShieldCheck, Cpu, HardDrive, Layers, CheckCircle2, FolderArchive, Apple, AppWindow, KeyRound } from 'lucide-react'
import { createAdminClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import { getAdminViewMode } from '@/app/actions/view-mode'
import { InlineEditSoftwareModal } from '@/components/admin/InlineEditSoftwareModal'
import { InlineEditSoftwareItemModal } from '@/components/admin/InlineEditSoftwareItemModal'
import { InlineCreateSoftwareItemModal } from '@/components/admin/InlineCreateSoftwareItemModal'
import { InlineCreateInstallerModal } from '@/components/admin/InlineCreateInstallerModal'

export const dynamic = 'force-dynamic'

function AppleLogo({ className }: { className?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <svg className={className} viewBox="0 0 170 170" fill="currentColor">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.91-14.42-6.11-3.37-2.73-7.24-7.39-11.61-13.98-6.19-9.35-10.94-19.78-14.24-31.29-3.3-11.51-4.95-22.61-4.95-33.32 0-14.2 3.65-25.59 10.95-34.17 7.3-8.58 16.48-12.91 27.54-12.98 4.79 0 10.05 1.15 15.77 3.46 5.72 2.31 9.77 3.46 12.15 3.46 1.96 0 6.13-1.25 12.51-3.75 6.38-2.5 11.96-3.62 16.74-3.36 10.74.87 19.5 5.09 26.28 12.66-9.61 5.83-14.35 14.33-14.22 25.49.13 8.78 3.51 16.1 10.14 21.97 6.63 5.87 14.61 8.91 23.94 9.13-1.84 5.92-4.14 11.9-6.89 17.94zM119.22 31.32c0-7.79 2.82-15.02 8.46-21.69 5.64-6.67 12.71-10.7 21.21-12.09.22 1.25.33 2.45.33 3.61 0 7.42-2.79 14.63-8.38 21.62-5.59 7-12.7 11.13-21.32 12.39-.33-1.3-.3-2.65.0-4.04z" />
      </svg>
      <span className="font-display font-medium text-[13px] tracking-tight normal-case leading-none">Mac</span>
    </span>
  )
}

function WindowsLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="currentColor">
      <rect x="0" y="0" width="41" height="41" />
      <rect x="47" y="0" width="41" height="41" />
      <rect x="0" y="47" width="41" height="41" />
      <rect x="47" y="47" width="41" height="41" />
    </svg>
  )
}

export default async function SoftwareProductPage({
  params
}: {
  params: Promise<{ manufacturerSlug: string; productSlug: string }>
}) {
  const { manufacturerSlug, productSlug } = await params
  const ecosystem = await getProductEcosystem(manufacturerSlug, productSlug)

  if (!ecosystem) {
    return notFound()
  }

  const { product, manufacturer, grouped } = ecosystem

  const { profile } = await requireUser()
  const isAdmin = profile?.role === 'admin'

  const { getAdminViewMode } = await import('@/app/actions/view-mode')
  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  if (!isAdmin) currentViewMode = 'student'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  let allManufacturers: any[] = []
  if (showAdminUI) {
    const adminSupabase = await createAdminClient()
    const { data: m } = await adminSupabase.from('software_manufacturers').select('*').order('name')
    allManufacturers = m || []
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-10">
      
      {/* Navigation Breadcrumb */}
      <Link
        href="/academy/plugins"
        className="inline-flex items-center gap-2 text-xs font-bold text-ink-400 hover:text-coral-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Plugins
      </Link>

      {/* Product Hero Banner */}
      <div className="relative rounded-[var(--radius)] overflow-hidden bg-ink-950 text-white shadow-[var(--shadow-hero)] border border-ink-800/80">
        {showAdminUI && <InlineEditSoftwareModal product={product} manufacturers={allManufacturers} />}
        {/* Background Ambient Glow */}
        {product.cover_image_url && (
          <div 
            className="absolute inset-0 opacity-30 bg-cover bg-center blur-3xl scale-125"
            style={{ backgroundImage: `url(${product.cover_image_url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-ink-900/60 z-10" />

        <div className="relative z-20 p-8 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-coral-500/20 text-coral-300 text-xs font-bold tracking-wider uppercase border border-coral-500/30">
                {manufacturer.name}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verificado por Nautic Campus
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl font-bold tracking-quant text-ink-50">
              {product.name}
            </h1>

            {product.tagline && (
              <p className="text-sm font-semibold text-coral-300">
                {product.tagline}
              </p>
            )}

            <p className="text-xs md:text-sm font-medium text-ink-200 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Specs */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-400 pt-2 border-t border-ink-800/80">
              <span className="flex items-center gap-1.5 text-ink-100">
                <CheckCircle2 className="w-4 h-4 text-coral-400" /> Versión: <strong>{product.version}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-ink-100">
                <HardDrive className="w-4 h-4 text-coral-400" /> {product.compatibility}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                {product.formats?.map((fmt: string) => (
                  <span key={fmt} className="px-2 py-0.5 rounded bg-ink-800 border border-ink-700 text-[10px] font-mono font-bold text-ink-200">
                    {fmt}
                  </span>
                ))}
              </div>
              {product.archive_password && (
                <>
                  <span>•</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold shadow-sm">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Clave ZIP: <strong className="text-amber-200 select-all font-mono">{product.archive_password}</strong></span>
                  </div>
                </>
              )}
            </div>

            {/* Quick Installers Actions */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              {grouped.installersWin.map((win) => (
                <div key={win.id} className="relative group/installer flex items-center gap-2">
                  <a 
                    href={`/api/download?id=${win.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2.5 ${showAdminUI ? 'pl-5 pr-7' : 'px-5'} py-3.5 rounded-2xl bg-[#0078D4]/10 text-sky-200 font-bold text-xs uppercase tracking-wider hover:bg-[#0078D4]/25 border border-[#0078D4]/40 transition-all active:scale-95 shadow-[0_0_15px_rgba(0,120,212,0.2)]`}
                    title={`Descargar Windows (${win.file_size || 'ZIP'})`}
                  >
                    <Download className="w-4 h-4 shrink-0 text-sky-400" />
                    <span className="inline-flex items-center justify-center bg-[#0078D4]/25 text-sky-200 px-1.5 py-0.5 rounded border border-[#0078D4]/40 shadow-[0_0_8px_rgba(0,120,212,0.3)]">
                      <WindowsLogo className="w-3.5 h-3.5 text-sky-300" />
                    </span>
                    <span>({win.file_size || 'ZIP'})</span>
                  </a>
                  {showAdminUI && <InlineEditSoftwareItemModal item={win} />}
                </div>
              ))}

              {grouped.installersMac.map((mac) => (
                <div key={mac.id} className="relative group/installer flex items-center gap-2">
                  <a 
                    href={`/api/download?id=${mac.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2.5 ${showAdminUI ? 'pl-5 pr-7' : 'px-5'} py-3.5 rounded-2xl bg-white/5 text-zinc-100 font-bold text-xs uppercase tracking-wider hover:bg-white/10 border border-white/20 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.08)]`}
                    title={`Descargar macOS (${mac.file_size || 'PKG'})`}
                  >
                    <Download className="w-4 h-4 shrink-0 text-zinc-100" />
                    <span className="inline-flex items-center gap-1 bg-white/10 text-white px-1.5 py-0.5 rounded border border-white/20 shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                      <AppleLogo className="w-3.5 h-3.5 text-white" />
                    </span>
                    <span>({mac.file_size || 'PKG'})</span>
                  </a>
                  {showAdminUI && <InlineEditSoftwareItemModal item={mac} />}
                </div>
              ))}

              {grouped.installersAmxd.map((amxd) => (
                <div key={amxd.id} className="relative group/installer flex items-center gap-2">
                  <a 
                    href={`/api/download?id=${amxd.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2.5 ${showAdminUI ? 'pl-5 pr-7' : 'px-5'} py-3.5 rounded-2xl bg-emerald-950/40 text-emerald-300 font-bold text-xs uppercase tracking-wider hover:bg-emerald-900/60 border border-emerald-500/40 transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.15)]`}
                    title={`Descargar Max for Live AMXD (${amxd.file_size || 'AMXD'})`}
                  >
                    <Download className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="font-mono text-[11px] font-extrabold tracking-widest bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-400/30 font-mono shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                      M4L
                    </span>
                    <span>({amxd.file_size || 'AMXD'})</span>
                  </a>
                  {showAdminUI && <InlineEditSoftwareItemModal item={amxd} />}
                </div>
              ))}

              {showAdminUI && <InlineCreateInstallerModal productId={product.id} />}
            </div>
          </div>

          {product.cover_image_url && (
            <div className="w-full lg:w-96 h-64 rounded-[var(--radius)] overflow-hidden border border-ink-800 shadow-2xl flex-shrink-0">
              <img 
                src={product.cover_image_url} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Factory Content Section */}
      {grouped.factoryContent.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-ink-50 tracking-tight flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-coral-400" /> Biblioteca Base / Factory Content
              </h2>
              {showAdminUI && <InlineCreateSoftwareItemModal productId={product.id} />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.factoryContent.map((fc) => (
              <div 
                key={fc.id}
                className="relative rounded-2xl p-6 flex items-center justify-between gap-4 border border-ink-800 bg-ink-900/60"
              >
                {showAdminUI && <InlineEditSoftwareItemModal item={fc} />}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coral-500/15 text-coral-400 text-[10px] font-bold uppercase">
                    Core Content
                  </div>
                  <h3 className="font-bold text-ink-50 text-base">{fc.title}</h3>
                  <p className="text-xs font-medium text-ink-300">{fc.description}</p>
                  <span className="text-[11px] font-mono text-ink-400 block pt-1">
                    Tamaño: {fc.file_size}
                  </span>
                </div>

                <a 
                  href={`/api/download?id=${fc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-coral-500 text-white font-bold text-xs hover:bg-coral-600 transition-all flex-shrink-0"
                >
                  <Download className="w-4 h-4" /> Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plugins & Devices Section */}
      {grouped.pluginDevices && grouped.pluginDevices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-ink-50 tracking-tight flex items-center gap-2">
                <Cpu className="w-5 h-5 text-coral-400" /> Plugins & Dispositivos
              </h2>
              {showAdminUI && <InlineCreateSoftwareItemModal productId={product.id} />}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.pluginDevices.map((plugin) => (
              <div 
                key={plugin.id}
                className="relative rounded-2xl p-6 flex items-center justify-between gap-4 border border-ink-800 bg-ink-900/60"
              >
                {showAdminUI && <InlineEditSoftwareItemModal item={plugin} />}
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coral-500/15 text-coral-400 text-[10px] font-bold uppercase">
                    Plugin / Device
                  </div>
                  <h3 className="font-bold text-ink-50 text-base">{plugin.title}</h3>
                  {plugin.description && (
                    <p className="text-xs font-medium text-ink-300">{plugin.description}</p>
                  )}
                  <span className="text-[11px] font-mono text-ink-400 block pt-1">
                    Tamaño: {plugin.file_size || 'N/A'}
                  </span>
                </div>

                <a 
                  href={`/api/download?id=${plugin.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-coral-500 text-white font-bold text-xs hover:bg-coral-600 transition-all flex-shrink-0"
                >
                  <Download className="w-4 h-4" /> Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expansions Ecosystem Grid */}
      {grouped.expansions.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink-800/80 pb-4">
            <div>
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-ink-50 tracking-tight flex items-center gap-2 font-display">
                  <Layers className="w-6 h-6 text-coral-400" /> Expansiones & Bancos de Presets
                </h2>
                {showAdminUI && <InlineCreateSoftwareItemModal productId={product.id} />}
              </div>
              <p className="text-xs font-medium text-ink-400 mt-1">
                Colección completa de expansiones oficiales para {product.name}.
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-coral-300 bg-coral-500/15 px-3 py-1.5 rounded-full border border-coral-500/30 self-start sm:self-auto">
              {grouped.expansions.length} Expansiones
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped.expansions.map((exp) => (
              <div 
                key={exp.id}
                className="relative rounded-[var(--radius)] p-5 flex flex-col justify-between border border-ink-800/80 bg-ink-900/60 hover:bg-ink-900 hover:border-coral-500/50 transition-all duration-200 group"
              >
                {showAdminUI && <InlineEditSoftwareItemModal item={exp} />}
                <div className="space-y-4">
                  {/* Expansion Cover */}
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-ink-950 border border-ink-800">
                    {exp.cover_image_url ? (
                      <img 
                        src={exp.cover_image_url} 
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderArchive className="w-12 h-12 text-ink-700" />
                      </div>
                    )}

                    {exp.genre_tag && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-ink-950/90 backdrop-blur-md text-[10px] font-bold text-coral-300 uppercase tracking-wider border border-ink-800">
                        {exp.genre_tag}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-ink-50 group-hover:text-coral-400 transition-colors font-display">
                      {exp.title}
                    </h3>
                    {exp.description && (
                      <p className="text-xs font-medium text-ink-300 mt-1 line-clamp-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-ink-800/80 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono font-bold text-ink-400">
                    {exp.preset_count > 0 && <span>{exp.preset_count} Presets</span>}
                    {exp.preset_count > 0 && exp.file_size && <span> • </span>}
                    {exp.file_size && <span>{exp.file_size}</span>}
                  </div>

                  <a 
                    href={`/api/download?id=${exp.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-coral-500 text-white font-bold text-xs hover:bg-coral-600 transition-all shadow-[0_4px_16px_rgba(255,98,19,0.3)] active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
