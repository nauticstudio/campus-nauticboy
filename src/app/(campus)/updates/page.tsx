import { createClient } from '@/lib/supabase/server'
import { Bell, Calendar, ArrowRight, Package } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/date'

export default async function UpdatesPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, type, created_at')
    .order('created_at', { ascending: false })

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
      {(!announcements || announcements.length === 0) ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">No hay novedades registradas</h3>
          <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
            Los anuncios y novedades que publiques desde el panel de administración aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map(item => (
            <div key={item.id} className="glass-card glass-card-hover rounded-3xl p-6 md:p-8 space-y-4 relative group">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold border bg-cyan-100 text-cyan-800 border-cyan-200">
                  {item.type}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formatDate(item.created_at)}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors tracking-tight">
                  {item.title}
                </h2>
                <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-3xl">
                  {item.content || 'Sin contenido en esta novedad.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
