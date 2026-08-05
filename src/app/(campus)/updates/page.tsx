import { Bell, Sparkles, Megaphone, Calendar, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'

export default function UpdatesPage() {
  const announcements = [
    {
      id: 'ann-1',
      title: 'Nuevo Módulo Lanzado: Mastering para Spotify & Apple Music',
      date: 'Hace 2 horas',
      type: 'course_update',
      content: 'Añadimos un nuevo módulo exclusivo en el curso Ableton Live Masterclass enfocado en la medición precisa de LUFS y codificación AAC.',
      badge: 'Nuevo Módulo',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      link: '/courses/produccion-ableton'
    },
    {
      id: 'ann-2',
      title: 'Librería Exclusiva: Afro House Drums & Percussion 2026',
      date: 'Ayer',
      type: 'new_resource',
      content: 'Ya puedes descargar más de 120 samples de percusiones orgánicas procesadas con cinta analógica.',
      badge: 'Nuevo Pack',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      link: '/academy/samples'
    },
    {
      id: 'ann-3',
      title: 'Mantenimiento Programado del Campus',
      date: '3 de Agosto, 2026',
      type: 'announcement',
      content: 'El próximo domingo realizaremos mejoras de infraestructura para acelerar las descargas de Google Drive.',
      badge: 'Anuncio',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      link: null
    }
  ]

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-950 p-8 md:p-12 text-white shadow-xl shadow-slate-900/10">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-1 text-xs font-bold text-cyan-400 backdrop-blur-md">
            <Bell className="w-3.5 h-3.5 animate-pulse" />
            <span>Novedades del Campus</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
            Últimas Actualizaciones 📢
          </h1>
          <p className="text-slate-300 text-base md:text-lg font-medium leading-relaxed">
            Mantente al día con los nuevos cursos, parches de sintetizadores y anuncios oficiales de la academia.
          </p>
        </div>
      </div>

      {/* Announcements Timeline */}
      <div className="space-y-6">
        {announcements.map(item => (
          <div key={item.id} className="glass-card glass-card-hover rounded-3xl p-6 md:p-8 space-y-4 relative group">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${item.badgeColor}`}>
                {item.badge}
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {item.date}
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                {item.title}
              </h2>
              <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
                {item.content}
              </p>
            </div>

            {item.link && (
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-2 text-xs font-extrabold text-cyan-600 hover:text-cyan-700 transition-colors group/link"
                >
                  <span>Ver más detalles</span>
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  )
}
