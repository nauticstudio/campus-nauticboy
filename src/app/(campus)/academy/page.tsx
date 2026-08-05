import Link from 'next/link'
import { 
  Library, 
  Package, 
  Drum, 
  Plug, 
  FileText, 
  Video, 
  BrainCircuit, 
  Target, 
  ArrowRight, 
  Sparkles,
  Search
} from 'lucide-react'

export default function AcademyPage() {
  const categories = [
    {
      name: 'Plantillas & Projects',
      slug: 'plantillas',
      description: 'Proyectos completos de Ableton Live y FL Studio organizados por género.',
      icon: Library,
      count: '24 Recursos',
      gradient: 'from-cyan-500/10 via-sky-500/10 to-blue-500/10',
      iconColor: 'text-cyan-600',
      borderColor: 'group-hover:border-cyan-400/60'
    },
    {
      name: 'Presets de Sintes',
      slug: 'presets',
      description: 'Presets exclusivos para Serum, Vital, Diva y Wavetable listos para usar.',
      icon: Package,
      count: '48 Packs',
      gradient: 'from-purple-500/10 via-indigo-500/10 to-violet-500/10',
      iconColor: 'text-purple-600',
      borderColor: 'group-hover:border-purple-400/60'
    },
    {
      name: 'Sample Packs',
      slug: 'samples',
      description: 'Kicks, snares, 808s, hi-hats y fx procesados analógicamente.',
      icon: Drum,
      count: '32 Librerías',
      gradient: 'from-amber-500/10 via-orange-500/10 to-yellow-500/10',
      iconColor: 'text-amber-600',
      borderColor: 'group-hover:border-amber-400/60'
    },
    {
      name: 'Plugins & Racks',
      slug: 'plugins',
      description: 'Instrumentos virtuales y cadenas de efectos de mezcla y master.',
      icon: Plug,
      count: '18 Herramientas',
      gradient: 'from-emerald-500/10 via-teal-500/10 to-green-500/10',
      iconColor: 'text-emerald-600',
      borderColor: 'group-hover:border-emerald-400/60'
    },
    {
      name: 'Guías & PDFs',
      slug: 'pdfs',
      description: 'Manuales de síntesis, tablas de frecuencias y teoría musical rápida.',
      icon: FileText,
      count: '15 Manuales',
      gradient: 'from-rose-500/10 via-pink-500/10 to-red-500/10',
      iconColor: 'text-rose-600',
      borderColor: 'group-hover:border-rose-400/60'
    },
    {
      name: 'Micro Tutoriales',
      slug: 'videos',
      description: 'Videos cortos de 5 min resolviendo problemas técnicos concretos.',
      icon: Video,
      count: '60 Videos',
      gradient: 'from-blue-500/10 via-indigo-500/10 to-sky-500/10',
      iconColor: 'text-blue-600',
      borderColor: 'group-hover:border-blue-400/60'
    },
    {
      name: 'Cheatsheets',
      slug: 'cheatsheets',
      description: 'Hojas de referencia rápida para atajos de teclado y ecualización.',
      icon: BrainCircuit,
      count: '10 Hojas',
      gradient: 'from-teal-500/10 via-cyan-500/10 to-emerald-500/10',
      iconColor: 'text-teal-600',
      borderColor: 'group-hover:border-teal-400/60'
    },
    {
      name: 'Desafíos de Producción',
      slug: 'desafios',
      description: 'Retos semanales para poner a prueba tus habilidades de composición.',
      icon: Target,
      count: '8 Retos',
      gradient: 'from-violet-500/10 via-fuchsia-500/10 to-purple-500/10',
      iconColor: 'text-violet-600',
      borderColor: 'group-hover:border-violet-400/60'
    }
  ]

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-7xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 p-8 md:p-12 text-white shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-3.5 py-1 text-xs font-bold text-sky-400 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Biblioteca de Recursos Ilimitados</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            La Academia 📚
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
            Explora por categoría todas las plantillas, presets, samples y guías exclusivas de la comunidad.
          </p>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(cat => {
          const Icon = cat.icon
          return (
            <Link key={cat.slug} href={`/academy/${cat.slug}`} className="group">
              <div className={`glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden ${cat.borderColor}`}>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${cat.gradient} border border-slate-200/60 flex items-center justify-center ${cat.iconColor} group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60">
                      {cat.count}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-xl text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-600 group-hover:text-cyan-600">
                  <span>Explorar colección</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>

              </div>
            </Link>
          )
        })}
      </div>

    </div>
  )
}
