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
    <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="grain-overlay absolute inset-0 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {children}
      </div>
    </div>
  )
}
