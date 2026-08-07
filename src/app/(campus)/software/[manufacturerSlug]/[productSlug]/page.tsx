import { getProductEcosystem } from '@/lib/data/software'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, ShieldCheck, Cpu, HardDrive, Sparkles, Layers, CheckCircle2, Music2, Info, FolderArchive, Heart } from 'lucide-react'

export const dynamic = 'force-dynamic'

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

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-10">
      
      {/* Navigation Breadcrumb */}
      <Link 
        href="/software" 
        className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-cyan-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Software
      </Link>

      {/* Product Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white shadow-2xl border border-slate-800">
        {/* Background Ambient Glow */}
        {product.cover_image_url && (
          <div 
            className="absolute inset-0 opacity-30 bg-cover bg-center blur-3xl scale-125"
            style={{ backgroundImage: `url(${product.cover_image_url})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-900/60 z-10" />

        <div className="relative z-20 p-8 md:p-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-black tracking-wider uppercase border border-cyan-500/30">
                {manufacturer.name}
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verificado por Nautic Campus
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
              {product.name}
            </h1>

            <p className="text-sm font-semibold text-cyan-400">
              {product.tagline}
            </p>

            <p className="text-xs md:text-sm font-medium text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Specs */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-2 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Versión: <strong>{product.version}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-200">
                <HardDrive className="w-4 h-4 text-cyan-400" /> {product.compatibility}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                {product.formats?.map((fmt) => (
                  <span key={fmt} className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white">
                    {fmt}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Installers Actions */}
            <div className="pt-6 flex flex-wrap items-center gap-4">
              {grouped.installersWin.map((win) => (
                <a 
                  key={win.id}
                  href={`/api/download?id=${win.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  <Download className="w-4 h-4" /> Descargar Windows ({win.file_size || 'ZIP'})
                </a>
              ))}

              {grouped.installersMac.map((mac) => (
                <a 
                  key={mac.id}
                  href={`/api/download?id=${mac.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-slate-800 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4 text-cyan-400" /> Descargar macOS ({mac.file_size || 'PKG'})
                </a>
              ))}
            </div>
          </div>

          {product.cover_image_url && (
            <div className="w-full lg:w-96 h-64 rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex-shrink-0">
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
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-600" /> Biblioteca Base / Factory Content
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.factoryContent.map((fc) => (
              <div 
                key={fc.id}
                className="glass-card rounded-2xl p-6 flex items-center justify-between gap-4 border border-indigo-500/20 bg-indigo-500/5"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 text-[10px] font-extrabold uppercase">
                    Core Content
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{fc.title}</h3>
                  <p className="text-xs font-medium text-slate-500">{fc.description}</p>
                  <span className="text-[11px] font-bold text-slate-400 block pt-1">
                    Tamaño: {fc.file_size}
                  </span>
                </div>

                <a 
                  href={`/api/download?id=${fc.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-indigo-600 transition-all flex-shrink-0"
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
            <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-rose-500" /> Plugins & Dispositivos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {grouped.pluginDevices.map((plugin) => (
              <div 
                key={plugin.id}
                className="glass-card rounded-2xl p-6 flex items-center justify-between gap-4 border border-rose-500/20 bg-rose-500/5"
              >
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-700 text-[10px] font-extrabold uppercase">
                    Plugin / Device
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{plugin.title}</h3>
                  {plugin.description && (
                    <p className="text-xs font-medium text-slate-500">{plugin.description}</p>
                  )}
                  <span className="text-[11px] font-bold text-slate-400 block pt-1">
                    Tamaño: {plugin.file_size || 'N/A'}
                  </span>
                </div>

                <a 
                  href={`/api/download?id=${plugin.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-rose-600 transition-all flex-shrink-0"
                >
                  <Download className="w-4 h-4" /> Descargar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expansions Ecosystem Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-6 h-6 text-cyan-600" /> Expansiones & Bancos de Presets
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              Colección completa de expansiones oficiales para {product.name}.
            </p>
          </div>

          <span className="text-xs font-extrabold text-cyan-700 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20 self-start sm:self-auto">
            {grouped.expansions.length} Expansiones
          </span>
        </div>

        {grouped.expansions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-500">
            No se han registrado expansiones aún para este producto.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {grouped.expansions.map((exp) => (
              <div 
                key={exp.id}
                className="glass-card rounded-3xl p-5 flex flex-col justify-between hover:border-cyan-500/40 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="space-y-4">
                  {/* Expansion Cover */}
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-900">
                    {exp.cover_image_url ? (
                      <img 
                        src={exp.cover_image_url} 
                        alt={exp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderArchive className="w-12 h-12 text-slate-700" />
                      </div>
                    )}

                    {exp.genre_tag && (
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-cyan-400 uppercase tracking-wider border border-white/10">
                        {exp.genre_tag}
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-cyan-600 transition-colors">
                      {exp.title}
                    </h3>
                    {exp.description && (
                      <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-bold text-slate-400">
                    {exp.preset_count > 0 && <span>{exp.preset_count} Presets</span>}
                    {exp.preset_count > 0 && exp.file_size && <span> • </span>}
                    {exp.file_size && <span>{exp.file_size}</span>}
                  </div>

                  <a 
                    href={`/api/download?id=${exp.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-black text-xs hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" /> Descargar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
