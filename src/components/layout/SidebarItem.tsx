'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface SidebarItemProps {
  href: string
  icon: LucideIcon
  title: string
  isActive?: boolean
  onClick?: () => void
}

export function SidebarItem({ href, icon: Icon, title, isActive, onClick }: SidebarItemProps) {
  const pathname = usePathname()
  const active = isActive !== undefined ? isActive : pathname === href || (href !== '/dashboard' && pathname.startsWith(`${href}`))

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-300 ease-out",
        active
          ? "bg-gradient-to-r from-cyan-500/10 via-sky-500/10 to-blue-500/5 text-cyan-700 shadow-sm border border-cyan-500/20 translate-x-1"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 hover:translate-x-1"
      )}
    >
      {/* Active Indicator Bar */}
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full shadow-sm shadow-cyan-500/50" />
      )}

      {/* Animated Icon */}
      <Icon
        className={cn(
          "w-4.5 h-4.5 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6",
          active ? "text-cyan-600 animate-pulse-subtle" : "text-slate-400 group-hover:text-cyan-600"
        )}
      />
      
      <span className="tracking-tight">{title}</span>
    </Link>
  )
}
