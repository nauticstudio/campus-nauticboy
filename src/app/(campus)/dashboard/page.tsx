import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import { requireUser } from '@/server/auth/guards'
import { BookOpen, Users, Cpu, Download, Shield } from 'lucide-react'
import { getAdminViewMode } from '@/app/actions/view-mode'
import { Reveal } from '@/components/motion/Reveal'
import { StaggerGroup, StaggerItem } from '@/components/motion/Stagger'
import { NauticCard, NauticCardHover } from '@/components/ui/nautic-card'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { profile } = await requireUser()
  const isAdmin = profile?.role === 'admin'

  let currentViewMode = await getAdminViewMode()
  if (isAdmin && !currentViewMode) currentViewMode = 'admin'
  const showAdminUI = isAdmin && currentViewMode === 'admin'

  // Si no estamos en vista admin, la home del alumno es La Academia (/academy)
  if (!showAdminUI) {
    redirect('/academy')
  }

  // --- ADMIN DASHBOARD ---
  const adminSupabase = await createAdminClient()
  const [uRes, pRes, cRes, iRes] = await Promise.all([
    adminSupabase.from('profiles').select('id', { count: 'exact', head: true }),
    adminSupabase.from('software_products').select('id', { count: 'exact', head: true }),
    adminSupabase.from('courses').select('id', { count: 'exact', head: true }),
    adminSupabase.from('software_items').select('id', { count: 'exact', head: true }),
  ])
  const adminStats = {
    users: uRes.count || 0,
    products: pRes.count || 0,
    courses: cRes.count || 0,
    items: iRes.count || 0,
  }

  return (
    <div className="p-6 md:p-10 lg:p-12 space-y-10 max-w-6xl mx-auto mb-20">
      <Reveal>
        <NauticCard className="relative overflow-hidden p-8 md:p-12">
          {/* Luz ambiental única: el hero admin es sobrio, sin glow editorial */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-coral-500/10 blur-[100px] pointer-events-none" aria-hidden />
          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-coral-500/30 bg-coral-500/10 px-3.5 py-1.5 text-xs font-bold text-coral-300">
              <Shield className="w-3.5 h-3.5" />
              <span>Modo Administrador</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-quant text-ink-50">
              Panel de Control
            </h1>
            <p className="text-ink-300 text-base md:text-lg font-medium leading-relaxed">Vista general del rendimiento y contenido del campus.</p>
          </div>
        </NauticCard>
      </Reveal>

      <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Alumnos Registrados', value: adminStats.users, icon: Users },
          { label: 'Cursos Creados', value: adminStats.courses, icon: BookOpen },
          { label: 'Sintetizadores', value: adminStats.products, icon: Cpu },
          { label: 'Expansiones y Archivos', value: adminStats.items, icon: Download },
        ].map(({ label, value, icon: Icon }) => (
          <StaggerItem key={label}>
            <NauticCardHover className="p-6 flex flex-col gap-2">
              <div className="w-12 h-12 rounded-[var(--radius-sm)] flex items-center justify-center bg-[var(--surface-elevated)] border border-[var(--border)] text-coral-300"><Icon className="w-6 h-6" /></div>
              <div className="mt-2">
                <span className="font-display text-4xl font-semibold tracking-quant text-ink-50">{value}</span>
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mt-1">{label}</p>
              </div>
            </NauticCardHover>
          </StaggerItem>
        ))}
      </StaggerGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Link href="/admin/users" className="block">
          <NauticCardHover className="p-6">
            <h3 className="text-lg font-bold text-ink-50 flex items-center gap-2">
              <Users className="w-5 h-5 text-coral-300" /> Gestionar Usuarios
            </h3>
            <p className="text-sm font-medium text-ink-400 mt-2">Administra alumnos, roles y estados de cuenta del campus.</p>
          </NauticCardHover>
        </Link>
        <Link href="/admin/categories" className="block">
          <NauticCardHover className="p-6">
            <h3 className="text-lg font-bold text-ink-50 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-coral-300" /> Gestionar Categorías
            </h3>
            <p className="text-sm font-medium text-ink-400 mt-2">Organiza las categorías de la Academia (plantillas, presets, samples…).</p>
          </NauticCardHover>
        </Link>
        <Link href="/academy/plugins" className="block">
          <NauticCardHover className="p-6">
            <h3 className="text-lg font-bold text-ink-50 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-coral-300" /> Gestionar Software
            </h3>
            <p className="text-sm font-medium text-ink-400 mt-2">Entra a la categoría Plugins y activa la edición para añadir o modificar productos.</p>
          </NauticCardHover>
        </Link>
        <Link href="/academy" className="block">
          <NauticCardHover className="p-6">
            <h3 className="text-lg font-bold text-ink-50 flex items-center gap-2">
              <Download className="w-5 h-5 text-coral-300" /> Gestionar Material
            </h3>
            <p className="text-sm font-medium text-ink-400 mt-2">Sube y publica recursos de la Academia directamente en cada categoría.</p>
          </NauticCardHover>
        </Link>
      </div>
    </div>
  )
}
