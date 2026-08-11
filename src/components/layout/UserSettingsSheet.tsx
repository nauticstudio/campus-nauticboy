'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { Settings, User, Shield, Lock, Crown, Check, Key } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateProfileNameAction } from '@/lib/actions/auth'

interface UserSettingsSheetProps {
  userName: string
  isAdmin: boolean
}

export function UserSettingsSheet({ userName, isAdmin }: UserSettingsSheetProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'admin'>('profile')
  const [name, setName] = useState(userName)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const result = await updateProfileNameAction(name)
      if (result?.error) {
        console.error(result.error)
        setIsLoading(false)
        return
      }
      setIsSaved(true)
      router.refresh()
      setTimeout(() => setIsSaved(false), 2000)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger className="p-2 rounded-xl text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-colors" title="Ajustes de Cuenta">
        <Settings className="w-4 h-4" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] sm:w-[480px] p-0 bg-ink-950 text-ink-100 border-l border-ink-800/80 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="p-6 border-b border-ink-800/80 bg-ink-900/40">
          <SheetTitle className="text-xl font-bold text-ink-50 flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-coral-400" />
            Ajustes del Campus
          </SheetTitle>
          <SheetDescription className="text-xs font-medium text-ink-400 mt-1">
            Gestiona tu perfil, preferencias de cuenta y configuración.
          </SheetDescription>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-5 bg-ink-900 p-1 rounded-xl border border-ink-800/80">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-coral-500 text-white shadow-md'
                  : 'text-ink-400 hover:text-ink-100'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'account'
                  ? 'bg-coral-500 text-white shadow-md'
                  : 'text-ink-400 hover:text-ink-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Seguridad
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                <Crown className="w-3.5 h-3.5" />
                Admin
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-5">
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-ink-900/50 border border-ink-800/80">
                <div className={`w-14 h-14 rounded-2xl text-white font-extrabold flex items-center justify-center text-xl shadow-md ${isAdmin ? 'bg-gradient-to-br from-coral-500 via-amber-500 to-coral-600 shadow-coral-500/20 relative' : 'bg-gradient-to-br from-ink-700 to-ink-800'}`}>
                  {isAdmin && <Crown className="w-5 h-5 absolute -top-2 -right-1 text-amber-400 drop-shadow-md rotate-[15deg]" fill="currentColor" />}
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-ink-50 text-base">{name}</h4>
                  <span className="text-xs font-bold text-coral-400 flex items-center gap-1 mt-0.5">
                    {isAdmin ? '👑 Fundador & Admin' : 'Alumno Pro'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-300 uppercase tracking-wider">Nombre Completo</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 text-xs font-semibold focus:border-coral-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-300 uppercase tracking-wider">Rol de Cuenta</label>
                <div className="p-3 rounded-xl bg-ink-900/80 text-ink-200 text-xs font-bold flex items-center justify-between border border-ink-800/80">
                  <span>{isAdmin ? 'Administrador Maestro' : 'Estudiante Pro'}</span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">Verificado</span>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(255,98,19,0.3)]">
                {isLoading ? (
                  'Guardando...'
                ) : isSaved ? (
                  <span className="flex items-center gap-1.5"><Check className="w-4 h-4" /> ¡Guardado!</span>
                ) : (
                  'Guardar Cambios'
                )}
              </Button>
            </form>
          )}

          {activeTab === 'account' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-300 uppercase tracking-wider">Contraseña Actual</label>
                <Input type="password" placeholder="••••••••" className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-300 uppercase tracking-wider">Nueva Contraseña</label>
                <Input type="password" placeholder="Mínimo 8 caracteres" className="rounded-xl bg-ink-900 border-ink-800 text-ink-100 text-xs" />
              </div>
              <Button className="w-full rounded-xl bg-ink-800 hover:bg-ink-700 text-ink-50 font-bold text-xs flex items-center gap-2">
                <Key className="w-4 h-4" /> Actualizar Contraseña
              </Button>
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-800/40 space-y-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-400" /> Configuración de Servidor
                </span>
                <p className="text-xs text-amber-200/80 leading-relaxed font-medium">
                  Desde aquí puedes monitorear el estado de Google Drive API y los tokens de acceso del backend.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-ink-900/50 border border-ink-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-200">Google Drive API</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-md">CONECTADO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-ink-200">Supabase DB</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 px-2 py-0.5 rounded-md">ONLINE</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  )
}
