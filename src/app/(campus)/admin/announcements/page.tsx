import { createClient } from '@/lib/supabase/server'
import { Shield, Package } from 'lucide-react'
import { formatDate } from '@/lib/date'

export default async function AdminAnnouncementsPage() {
  const supabase = await createClient()

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, type, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-8 max-w-7xl mx-auto">
      
      <div>
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-1">
            <Shield className="w-3.5 h-3.5" /> Panel de Administración
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink-50 tracking-editorial">Novedades & Anuncios</h1>
          <p className="mt-2 text-sm font-medium text-ink-300">Consulta las comunicaciones publicadas en el campus.</p>
        </div>
      </div>

      {(!announcements || announcements.length === 0) ? (
        <div className="glass-card rounded-[var(--radius)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-coral-500/10 text-coral-300 flex items-center justify-center mx-auto">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-semibold text-ink-50">No hay novedades registradas</h3>
          <p className="text-xs font-semibold text-ink-300 max-w-sm mx-auto">
            Las comunicaciones publicadas para los alumnos aparecerán en esta lista.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(ann => (
            <article key={ann.id} className="glass-card rounded-[var(--radius)] p-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-ink-50 text-base">{ann.title}</h3>
                <span className="text-xs font-medium text-ink-400">Publicado el {formatDate(ann.created_at)}</span>
              </div>
            </article>
          ))}
        </div>
      )}

    </div>
  )
}
