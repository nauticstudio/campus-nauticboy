import { getSoftwareHubData } from '@/lib/data/software'
import Link from 'next/link'
import { Search, Sparkles, Layers, Cpu, Sliders, ArrowRight, Download, CheckCircle2, Package, ShieldCheck } from 'lucide-react'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getAdminViewMode } from '@/app/actions/view-mode'
import { InlineCreateSoftwareModal } from '@/components/admin/InlineCreateSoftwareModal'
import { InlineCreateManufacturerModal } from '@/components/admin/InlineCreateManufacturerModal'

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

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  let showAdminUI = false

  if (user) {
    const adminSupabase = await createAdminClient()
    const { data: profile } = await adminSupabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role === 'admin') {
      const mode = await getAdminViewMode()
      showAdminUI = mode === 'admin' || !mode
    }
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-7xl mx-auto space-y-12">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-sand-300/60 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-1000/10 text-coral-700 text-xs font-bold mb-3 border border-coral-500/25">
            <Sparkles className="w-3.5 h-3.5" /> Biblioteca de Software & Ecosistemas
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink-900 tracking-editorial">
            Software & Plugins
          </h1>
          <p className="text-sm font-semibold text-ink-500 mt-2 max-w-2xl">
            Explora el catálogo completo de sintetizadores, efectos y expansiones organizados por fabricante y producto. Todo lo que necesitas para tu flujo de producción.
          </p>
        </div>
      </div>

      {/* Hero Showcase (Featured Product) - Only show if NO filter is applied */}
      {!selectedManufacturer && heroProduct && (
        <div className="relative rounded-[var(--radius)] overflow-hidden bg-ink-900 text-white shadow-[var(--shadow-hero)] border border-ink-700 group">
          {/* Background Ambient Glow */}
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center blur-2xl transform scale-110 group-hover:scale-105 transition-transform duration-700" 
            style={{ backgroundImage: `url(${heroProduct.cover_image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-900/90 to-transparent z-10" />

          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-amber-200 text-xs font-bold tracking-wider uppercase border border-white/20">
                  {heroProduct.manufacturer?.name}
                </span>
                <span className="text-xs font-bold text-ink-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verificado
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-editorial text-white">
                {heroProduct.name}
              </h2>

              <p className="text-sm font-medium text-ink-200 line-clamp-2 leading-relaxed">
                {heroProduct.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-400 pt-2">
                <span>Versión: <strong className="text-white">{heroProduct.version}</strong></span>
                <span>•</span>
                <span>{heroProduct.compatibility}</span>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link 
                  href={`/software/${heroProduct.manufacturer?.slug}/${heroProduct.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-wider hover:bg-primary/95 transition-all shadow-lg shadow-[0_14px_32px_-8px_rgba(255,98,19,0.6)] active:scale-95"
                >
                  Explorar Ecosistema <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {heroProduct.cover_image_url && (
              <div className="w-full md:w-80 h-52 rounded-2xl overflow-hidden shadow-[var(--shadow-hero)] border border-white/10 flex-shrink-0 group-hover:rotate-1 group-hover:scale-105 transition-all duration-500">
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
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-ink-400">
                Principales Fabricantes
              </h3>
              {showAdminUI && <InlineCreateManufacturerModal />}
            </div>
            {selectedManufacturer && (
              <Link href="/software#catalog-grid" className="text-xs font-bold text-primary hover:text-primary transition-colors">
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
                    isSelected ? 'border-primary shadow-md shadow-[0_14px_32px_-8px_rgba(255,98,19,0.45)] bg-coral-100' : 'hover:border-coral-400/60 hover:shadow-md'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-transform ${
                    isSelected ? 'bg-white shadow-sm' : 'bg-sand-100 group-hover:scale-110'
                  }`}>
                    {m.logo_url ? (
                      <img src={m.logo_url} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-6 h-6 text-ink-400" />
                    )}
                  </div>
                  <span className={`font-bold text-xs transition-colors ${
                    isSelected ? 'text-coral-700' : 'text-ink-900 group-hover:text-primary'
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
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-semibold tracking-editorial text-ink-900">
              {selectedManufacturer ? 'Productos Filtrados' : 'Catálogo de Productos & Sintetizadores'}
            </h2>
            {showAdminUI && <InlineCreateSoftwareModal manufacturers={manufacturers} />}
          </div>
          <span className="text-xs font-bold text-ink-400">
            {displayProducts.length} productos disponibles
          </span>
        </div>

        {displayProducts.length === 0 ? (
          <div className="p-12 text-center rounded-[var(--radius)] border border-dashed border-sand-400 bg-sand-100/50 space-y-4">
            <Package className="w-12 h-12 text-ink-400 mx-auto" />
            <h3 className="text-lg font-bold text-ink-900">
              {selectedManufacturer ? 'No hay productos de esta marca aún.' : 'Aún no hay productos publicados en el campus.'}
            </h3>
            <p className="text-xs font-medium text-ink-500 max-w-md mx-auto">
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
                className="group glass-card rounded-[var(--radius)] p-6 flex flex-col justify-between hover:border-coral-500/50 hover:shadow-soft-lg transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-ink-900">
                    {product.cover_image_url ? (
                      <img 
                        src={product.cover_image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Cpu className="w-12 h-12 text-ink-700" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-ink-950/80 backdrop-blur-md text-[10px] font-black text-amber-300 uppercase tracking-wider border border-white/10">
                      {product.manufacturer?.name}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-ink-900 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs font-medium text-ink-500 mt-1 line-clamp-2">
                      {product.tagline || product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-sand-200 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-ink-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> v{product.version}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
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
