import Link from 'next/link'
import { ArrowRight, CheckCircle2, Cpu, Package, ShieldCheck } from 'lucide-react'
import type { SoftwareProduct, SoftwareManufacturer } from '@/lib/data/software'
import { InlineCreateSoftwareModal } from '@/components/admin/InlineCreateSoftwareModal'
import { InlineCreateManufacturerModal } from '@/components/admin/InlineCreateManufacturerModal'
import { InlineEditManufacturerModal } from '@/components/admin/InlineEditManufacturerModal'

/**
 * Catálogo reutilizable del hub de software y sintetizadores.
 */
export function SoftwareCatalog({
  featuredProducts,
  allProducts,
  manufacturers,
  selectedManufacturer,
  showAdminUI,
}: {
  featuredProducts: SoftwareProduct[]
  allProducts: SoftwareProduct[]
  manufacturers: SoftwareManufacturer[]
  selectedManufacturer?: string
  showAdminUI: boolean
}) {
  const displayProducts = selectedManufacturer
    ? allProducts.filter(p => p.manufacturer?.slug === selectedManufacturer)
    : allProducts

  const heroProduct = featuredProducts[0] || allProducts[0]

  return (
    <div className="space-y-12">

      {/* Hero Showcase (Featured Product) */}
      {!selectedManufacturer && heroProduct && (
        <div className="relative rounded-[var(--radius)] overflow-hidden bg-ink-950 text-white shadow-[var(--shadow-hero)] border border-ink-800/80 group">
          {/* Background Ambient Glow */}
          <div
            className="absolute inset-0 opacity-30 bg-cover bg-center blur-3xl transform scale-125 group-hover:scale-110 transition-transform duration-700"
            style={{ backgroundImage: `url(${heroProduct.cover_image_url})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/90 to-transparent z-10" />

          <div className="relative z-20 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-coral-500/20 text-coral-300 text-xs font-bold tracking-wider uppercase border border-coral-500/30">
                  {heroProduct.manufacturer?.name}
                </span>
                <span className="text-xs font-bold text-ink-300 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Verificado
                </span>
              </div>

              <h2 className="font-display text-3xl md:text-5xl font-bold tracking-quant text-ink-50">
                {heroProduct.name}
              </h2>

              <p className="text-sm font-medium text-ink-200 line-clamp-2 leading-relaxed">
                {heroProduct.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-ink-400 pt-2">
                <span>Versión: <strong className="text-ink-100">{heroProduct.version}</strong></span>
                <span>•</span>
                <span>{heroProduct.compatibility}</span>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href={`/software/${heroProduct.manufacturer?.slug}/${heroProduct.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-coral-500 text-white font-bold text-xs uppercase tracking-wider hover:bg-coral-600 transition-all shadow-[0_4px_20px_rgba(255,98,19,0.4)] active:scale-95"
                >
                  Explorar Ecosistema <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {heroProduct.cover_image_url && (
              <div className="w-full md:w-80 h-52 rounded-2xl overflow-hidden shadow-2xl border border-ink-800 flex-shrink-0 group-hover:rotate-1 group-hover:scale-105 transition-all duration-500">
                {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* Manufacturers Grid — High Contrast NAUTIC v3 */}
      {manufacturers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">
                Principales Fabricantes
              </h3>
              {showAdminUI && <InlineCreateManufacturerModal />}
            </div>
            {selectedManufacturer && (
              <Link href="/academy/plugins#catalog-grid" className="text-xs font-bold text-coral-400 hover:text-coral-300 transition-colors">
                Ver Todos
              </Link>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {manufacturers.map((m) => {
              const isSelected = selectedManufacturer === m.slug
              return (
                <div key={m.id} className="relative group/m-card">
                  <Link
                    href={isSelected ? '/academy/plugins#catalog-grid' : `/academy/plugins?manufacturer=${m.slug}#catalog-grid`}
                    className={`h-full rounded-2xl p-3.5 flex flex-col items-center justify-center text-center gap-2.5 transition-all group border ${
                      isSelected
                        ? 'border-coral-500 bg-coral-500/15 shadow-[0_0_20px_rgba(255,98,19,0.3)]'
                        : 'border-ink-800/80 bg-ink-900/60 hover:border-coral-500/40 hover:bg-ink-900 hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden transition-transform border ${
                      isSelected ? 'bg-ink-950 border-coral-500/50 shadow-sm' : 'bg-ink-950/80 border-ink-800 group-hover:scale-105'
                    }`}>
                      {m.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.logo_url} alt={m.name} className="w-full h-full object-contain p-1.5" />
                      ) : (
                        <Package className="w-6 h-6 text-coral-400" />
                      )}
                    </div>
                    <span className={`font-bold text-xs transition-colors ${
                      isSelected ? 'text-coral-400 font-extrabold' : 'text-ink-100 group-hover:text-coral-300'
                    }`}>
                      {m.name}
                    </span>
                  </Link>
                  {showAdminUI && <InlineEditManufacturerModal manufacturer={m} />}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Products Catalog */}
      <div id="catalog-grid" className="space-y-6 scroll-mt-28">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl font-bold tracking-quant text-ink-50">
              {selectedManufacturer ? 'Productos Filtrados' : 'Catálogo de Productos & Sintetizadores'}
            </h2>
            {showAdminUI && <InlineCreateSoftwareModal manufacturers={manufacturers} />}
          </div>
          <span className="text-xs font-bold text-ink-400">
            {displayProducts.length} productos disponibles
          </span>
        </div>

        {displayProducts.length === 0 ? (
          <div className="p-12 text-center rounded-[var(--radius)] border border-dashed border-ink-800 bg-ink-900/40 space-y-4">
            <Package className="w-12 h-12 text-coral-400 mx-auto" />
            <h3 className="text-lg font-bold text-ink-50">
              {selectedManufacturer ? 'No hay productos de esta marca aún.' : 'Aún no hay productos publicados en el campus.'}
            </h3>
            <p className="text-xs font-medium text-ink-400 max-w-md mx-auto">
              {selectedManufacturer
                ? 'La biblioteca está siendo preparada. Si eres Administrador, entra a esta categoría en modo edición para añadir productos a este fabricante.'
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
                className="group rounded-[var(--radius)] p-5 md:p-6 flex flex-col justify-between border border-ink-800/80 bg-ink-900/60 hover:bg-ink-900 hover:border-coral-500/50 hover:shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="relative h-44 rounded-xl overflow-hidden bg-ink-950 border border-ink-800">
                    {product.cover_image_url ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={product.cover_image_url}
                          alt={product.name}
                          className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Cpu className="w-12 h-12 text-ink-500" />
                      </div>
                    )}
                    {/* Brand icon */}
                    {(product.icon_url || product.logo_image_url) && (
                      <span className="absolute top-3 left-3 w-9 h-9 rounded-lg bg-ink-950/90 backdrop-blur border border-coral-500/40 p-1.5 grid place-items-center shadow-[0_0_14px_rgba(255,98,19,0.3)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={(product.icon_url ?? product.logo_image_url)!} alt="" className="w-full h-full object-contain" />
                      </span>
                    )}
                    <div className={`absolute top-3 px-2.5 py-1 rounded-lg bg-ink-950/90 backdrop-blur-md text-[10px] font-mono font-bold text-coral-300 uppercase tracking-wider border border-ink-800 ${(product.icon_url || product.logo_image_url) ? 'left-14' : 'left-3'}`}>
                      {product.manufacturer?.name}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display text-xl font-bold text-ink-50 tracking-quant group-hover:text-coral-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-ink-300 mt-1 line-clamp-2 leading-relaxed font-medium">
                      {product.tagline || product.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-ink-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-ink-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-coral-400" /> v{product.version}
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-coral-400 group-hover:text-coral-300 group-hover:translate-x-1 transition-all">
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
