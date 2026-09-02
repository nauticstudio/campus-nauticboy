import { createClient } from '@/lib/supabase/server'
import { Bell, Calendar, Package } from 'lucide-react'
import { formatDate } from '@/lib/date'

export default async function UpdatesPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, type, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-5xl mx-auto">
      
      <div className="glass-card rounded-[var(--radius)] p-8 md:p-12">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-coral-500/25 bg-coral-500/10 px-3.5 py-1 text-xs font-bold text-coral-300">
            <Bell className="w-3.5 h-3.5" />
            <span>Novedades del Campus</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-semibold tracking-editorial text-ink-50">
            Últimas Actualizaciones
          </h1>
          <p className="text-ink-300 text-base md:text-lg font-medium leading-relaxed">
            Mantente al día con los nuevos cursos, parches de sintetizadores y anuncios oficiales de la academia.
          </p>
        </div>
      </div>

      {/* Announcements Timeline */}
      {(!announcements || announcements.length === 0) ? (
        <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-500/10 text-coral-300 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-50">No hay novedades registradas</h3>
          <p className="text-xs font-semibold text-ink-300 max-w-sm mx-auto">
            Los anuncios y novedades que publiques desde el panel de administración aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {announcements.map(item => (
            <article key={item.id} className="glass-card rounded-[var(--radius)] p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold border bg-coral-500/10 text-coral-300 border-coral-500/25">
                  {item.type}
                </span>
                <span className="text-xs font-semibold text-ink-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-ink-400" />
                  {formatDate(item.created_at)}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-ink-50 tracking-tight">
                  {item.title}
                </h2>
                <p className="text-sm font-medium text-ink-300 leading-relaxed max-w-3xl">
                  {item.content || 'Sin contenido en esta novedad.'}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  )
}
