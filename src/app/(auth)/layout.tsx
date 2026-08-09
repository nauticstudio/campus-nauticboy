import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nautic Campus — Acceso',
  description: 'Campus virtual de producción musical de Nautic Boy Academy',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen w-full bg-sand-50 text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Pearl ambient */}
      <div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] bg-coral-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] bg-ink-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="grain-overlay absolute inset-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  )
}
