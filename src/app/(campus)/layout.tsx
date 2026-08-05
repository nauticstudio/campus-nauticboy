import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { CommandMenu } from '@/components/layout/CommandMenu'

export default async function CampusLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch profile to check role and name
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  const userName = profile?.full_name || user.email?.split('@')[0] || 'Alumno'

  return (
    <div className="flex min-h-screen w-full bg-[#F8FAFC] font-sans text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900 relative overflow-x-hidden">
      
      {/* Premium Light Ambient Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none z-0 animate-pulse-subtle" />
      <div className="fixed top-1/3 -right-40 w-[30rem] h-[30rem] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Sidebar for Desktop */}
      <Sidebar isAdmin={isAdmin} userName={userName} />

      <div className="flex flex-col flex-1 min-w-0 z-10">
        {/* Header with Mobile Nav for small screens */}
        <Header isAdmin={isAdmin} userName={userName} />
        
        {/* Main Content Area */}
        <main className="flex-1 w-full relative">
          {children}
        </main>
      </div>

      {/* Global Cmd+K Menu */}
      <CommandMenu />
    </div>
  )
}
