'use client'

import Link from 'next/link'
import { Crown, LogOut, Settings, User, UserCog, FolderDown } from 'lucide-react'
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
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-coral-500 transition-transform hover:scale-105 active:scale-95"
      >
        <Avatar className="border-2 border-ink-700 shadow-md">
          <AvatarFallback
            className={
              isAdmin
                ? 'bg-gradient-to-br from-coral-500 via-coral-600 to-amber-600 text-white font-bold text-sm shadow-[0_0_12px_rgba(255,98,19,0.4)]'
                : 'bg-gradient-to-tr from-ink-700 to-ink-800 text-ink-100 font-bold text-sm'
            }
          >
            {initial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-60 rounded-2xl border-ink-800/80 bg-ink-950/95 backdrop-blur-2xl text-ink-100 shadow-[0_16px_50px_rgba(0,0,0,0.8)] p-1.5"
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-ink-50 truncate">{userName}</span>
            {isAdmin && <Crown className="w-3.5 h-3.5 text-coral-400 shrink-0" fill="currentColor" />}
          </div>
          <span className="block text-[11px] font-medium text-ink-400 truncate mt-0.5">{userEmail}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-ink-800/80" />

        <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-ink-900 focus:bg-ink-900 focus:text-white p-0">
          <Link href="/settings/profile" className="flex items-center gap-2.5 w-full px-3 py-2">
            <User className="w-4 h-4 text-coral-400" />
            <span className="text-sm font-semibold text-ink-200 hover:text-white">Mi perfil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-ink-900 focus:bg-ink-900 focus:text-white p-0">
          <Link href="/my-materials" className="flex items-center gap-2.5 w-full px-3 py-2">
            <FolderDown className="w-4 h-4 text-coral-400" />
            <span className="text-sm font-semibold text-ink-200 hover:text-white">Material de clase</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-ink-900 focus:bg-ink-900 focus:text-white p-0">
            <Link href="/admin/users" className="flex items-center gap-2.5 w-full px-3 py-2">
              <UserCog className="w-4 h-4 text-coral-400" />
              <span className="text-sm font-semibold text-ink-200 hover:text-white">Gestionar usuarios</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem className="rounded-xl cursor-pointer hover:bg-ink-900 focus:bg-ink-900 focus:text-white p-0">
          <Link href="/settings/profile" className="flex items-center gap-2.5 w-full px-3 py-2">
            <Settings className="w-4 h-4 text-coral-400" />
            <span className="text-sm font-semibold text-ink-200 hover:text-white">Configuración</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-ink-800/80" />

        <DropdownMenuItem className="rounded-xl cursor-pointer p-0 hover:bg-rose-950/40 focus:bg-rose-950/40">
          <form action={logout} className="w-full">
            <button type="submit" className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-left">
              <LogOut className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-semibold text-rose-400">Cerrar sesión</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
