import { getSoftwareHubData } from '@/lib/data/software'
import Link from 'next/link'
import { Search, Sparkles, Layers, Cpu, Sliders, ArrowRight, Download, CheckCircle2, Package, ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SoftwareHubPage(props: { searchParams?: Promise<{ manufacturer?: string }> }) {
  const searchParams = await props.searchParams
  const selectedManufacturer = searchParams?.manufacturer

  const { featuredProducts, allProducts, manufacturers, categories } = await getSoftwareHubData()

  // Filter products by manufacturer if selected
  const displayProducts = selectedManufacturer 
    ? allProducts.filter(p => p.manufacturer?.slug === selectedManufacturer)
    : allProducts

  const heroProduct = featuredProducts[0] || allProducts[0]

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-12">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/60 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-bold mb-3 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" /> Biblioteca de Software & Ecosistemas
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Software & Plugins
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2 max-w-2xl">
            Explora el catálogo completo de sintetizadores, efectos y expansiones organizados por fabricante y producto. Todo lo que necesitas para tu flujo de producción.
          </p>
        </div>
      </div>

      {/* Hero Showcase (Featured Product) - Only show if NO filter is applied */}
      {!selectedManufacturer && heroProduct && (
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-2xl border border-slate-800 group">
          {/* Background Ambient Glow */}
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center blur-2xl transform scale-110 group-hover:scale-105 transition-transform duration-700" 
            style={{ backgroundImage: `url(${heroProduct.cover_image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10" />

          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold tracking-wider uppercase border border-cyan-400/30">
                  {heroProduct.manufacturer?.name}
                </span>
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verificado
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                {heroProduct.name}
              </h2>

              <p className="text-sm font-medium text-slate-300 line-clamp-2 leading-relaxed">
                {heroProduct.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 pt-2">
                <span>Versión: <strong className="text-white">{heroProduct.version}</strong></span>
                <span>•</span>
                <span>{heroProduct.compatibility}</span>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link 
                  href={`/software/${heroProduct.manufacturer?.slug}/${heroProduct.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
                >
                  Explorar Ecosistema <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {heroProduct.cover_image_url && (
              <div className="w-full md:w-80 h-52 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 group-hover:rotate-1 group-hover:scale-105 transition-all duration-500">
                <img 
                  src={heroProduct.cover_image_url} 
                  alt={heroProduct.name}
                  className="w-full h-full object-cover" 
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manufacturers Carousel / Grid */}
      {manufacturers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
              Principales Fabricantes
            </h3>
            {selectedManufacturer && (
              <Link href="/software#catalog-grid" className="text-xs font-bold text-cyan-600 hover:text-cyan-500 transition-colors">
                Ver Todos
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {manufacturers.map((m) => {
              const isSelected = selectedManufacturer === m.slug
              return (
                <Link
                  key={m.id}
                  href={isSelected ? '/software#catalog-grid' : `/software?manufacturer=${m.slug}#catalog-grid`}
                  className={`glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all group ${
                    isSelected ? 'border-cyan-500 shadow-md shadow-cyan-500/20 bg-cyan-50' : 'hover:border-cyan-500/40 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-transform ${
                    isSelected ? 'bg-white shadow-sm' : 'bg-slate-100 group-hover:scale-110'
                  }`}>
                    {m.logo_url ? (
                      <img src={m.logo_url} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <span className={`font-bold text-xs transition-colors ${
                    isSelected ? 'text-cyan-700' : 'text-slate-900 group-hover:text-cyan-600'
                  }`}>
                    {m.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* All Products Catalog */}
      <div id="catalog-grid" className="space-y-6 scroll-mt-28">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {selectedManufacturer ? 'Productos Filtrados' : 'Catálogo de Productos & Sintetizadores'}
          </h2>
          <span className="text-xs font-bold text-slate-400">
            {displayProducts.length} productos disponibles
          </span>
        </div>

        {displayProducts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 space-y-4">
            <Package className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">
              {selectedManufacturer ? 'No hay productos de esta marca aún.' : 'Aún no hay productos publicados en el campus.'}
            </h3>
            <p className="text-xs font-medium text-slate-500 max-w-md mx-auto">
              {selectedManufacturer 
                ? 'La biblioteca está siendo preparada. Si eres Administrador, ve al "Admin Panel > Gestión de Software" para añadir productos a este fabricante.' 
                : 'La biblioteca está siendo preparada. ¡Pronto subiremos software oficial para que puedas descargarlo!'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProducts.map((product) => (
              <Link 
                key={product.id}
                href={`/software/${product.manufacturer?.slug}/${product.slug}`}
                className="group glass-card rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900">
                    {product.cover_image_url ? (
                      <img 
                        src={product.cover_image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Cpu className="w-12 h-12 text-slate-700" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-cyan-400 uppercase tracking-wider border border-white/10">
                      {product.manufacturer?.name}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-1 line-clamp-2">
                      {product.tagline || product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> v{product.version}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 group-hover:translate-x-1 transition-transform">
                    Ver Ecosistema <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
