import { createAdminClient, createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AdminSoftwareClient } from './AdminSoftwareClient'
import { Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminSoftwarePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const adminSupabase = await createAdminClient()

  // Verify admin
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch manufacturers
  const { data: manufacturers } = await adminSupabase
    .from('software_manufacturers')
    .select('*')
    .order('name', { ascending: true })

  // Fetch products with their items and manufacturer
  const { data: products } = await adminSupabase
    .from('software_products')
    .select('*, manufacturer:software_manufacturers(*), software_items(*)')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 text-xs font-bold mb-3 border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Panel de Administración
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Gestión de Software & Plugins
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-2">
          Administra fabricantes, crea sintetizadores y añade expansiones pegando tus enlaces de Google Drive sin escribir código.
        </p>
      </div>

      <AdminSoftwareClient 
        manufacturers={manufacturers || []} 
        products={products || []} 
      />
    </div>
  )
}
