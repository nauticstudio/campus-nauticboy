'use client'

import Link from 'next/link'
import { Crown, LogOut, Settings, User, UserCog } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { logout } from '@/lib/actions/auth'

interface UserAvatarMenuProps {
  userName: string
  userEmail: string
  isAdmin: boolean
}

export function UserAvatarMenu({ userName, userEmail, isAdmin }: UserAvatarMenuProps) {
  const initial = (userName || userEmail || 'A').charAt(0).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menú de cuenta"
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-transform hover:scale-105 active:scale-95"
      >
        <Avatar className="border-2 border-white shadow-[var(--shadow-card)]">
          <AvatarFallback className={isAdmin
            ? 'bg-gradient-to-br from-amber-400 via-orange-400 to-primary text-white font-bold text-sm'
            : 'bg-gradient-to-tr from-ink-600 to-ink-800 text-white font-bold text-sm'
          }>
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-56 rounded-2xl border-sand-200 bg-white shadow-[var(--shadow-hero)] p-1.5"
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold text-ink-900 truncate">{userName}</span>
            {isAdmin && <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" fill="currentColor" />}
          </div>
          <span className="block text-[11px] font-medium text-ink-400 truncate mt-0.5">{userEmail}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-sand-200" />

        <DropdownMenuItem className="rounded-xl cursor-pointer">
          <Link href="/settings/profile" className="flex items-center gap-2.5 w-full px-1 py-1">
            <User className="w-4 h-4 text-ink-400" />
            <span className="text-sm font-semibold text-ink-800">Mi perfil</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem className="rounded-xl cursor-pointer">
            <Link href="/admin/users" className="flex items-center gap-2.5 w-full px-1 py-1">
              <UserCog className="w-4 h-4 text-ink-400" />
              <span className="text-sm font-semibold text-ink-800">Gestionar usuarios</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="rounded-xl cursor-pointer">
          <Link href="/settings" className="flex items-center gap-2.5 w-full px-1 py-1">
            <Settings className="w-4 h-4 text-ink-400" />
            <span className="text-sm font-semibold text-ink-800">Configuración</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-sand-200" />

        <DropdownMenuItem className="rounded-xl cursor-pointer p-0 focus:bg-rose-50">
          <form action={logout} className="w-full">
            <button type="submit" className="flex w-full items-center gap-2.5 px-1 py-1 rounded-xl text-left">
              <LogOut className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-semibold text-rose-600">Cerrar sesión</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
