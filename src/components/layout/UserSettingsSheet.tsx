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
      // La actualización del perfil pasa por una Server Action:
      // nunca mutamos tablas directamente desde el cliente.
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
      <SheetTrigger className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors" title="Ajustes de Cuenta">
        <Settings className="w-4 h-4" />
      </SheetTrigger>

      <SheetContent side="right" className="w-[400px] sm:w-[480px] p-0 bg-white border-l border-slate-200 flex flex-col h-full">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <SheetTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-600 animate-spin-slow" />
            Ajustes del Campus
          </SheetTitle>
          <SheetDescription className="text-xs font-semibold text-slate-500 mt-1">
            Gestiona tu perfil, preferencias de cuenta y configuración.
          </SheetDescription>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 mt-6 bg-slate-200/60 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'account'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Seguridad
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-amber-600 hover:text-amber-700'
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
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className={`w-14 h-14 rounded-2xl text-white font-extrabold flex items-center justify-center text-xl shadow-md ${isAdmin ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-amber-500/40 relative' : 'bg-gradient-to-br from-cyan-500 to-blue-600'}`}>
                  {isAdmin && <Crown className="w-5 h-5 absolute -top-2 -right-1 text-yellow-400 drop-shadow-md rotate-[15deg]" fill="currentColor" />}
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">{name}</h4>
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    {isAdmin ? '👑 Fundador & Admin' : 'Alumno Pro'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nombre Completo</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="rounded-xl bg-slate-50 border-slate-200 text-xs font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rol de Cuenta</label>
                <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-between">
                  <span>{isAdmin ? 'Administrador Maestro' : 'Estudiante Pro'}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">Verificado</span>
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs">
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Contraseña Actual</label>
                <Input type="password" placeholder="••••••••" className="rounded-xl bg-slate-50 border-slate-200 text-xs" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Nueva Contraseña</label>
                <Input type="password" placeholder="Mínimo 8 caracteres" className="rounded-xl bg-slate-50 border-slate-200 text-xs" />
              </div>
              <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2">
                <Key className="w-4 h-4" /> Actualizar Contraseña
              </Button>
            </div>
          )}

          {activeTab === 'admin' && isAdmin && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-2">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-amber-600" /> Configuración de Servidor
                </span>
                <p className="text-xs text-amber-700 leading-relaxed font-medium">
                  Desde aquí puedes monitorear el estado de Google Drive API y los tokens de acceso del backend.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Google Drive API</span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">CONECTADO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Supabase DB</span>
                  <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md">ONLINE</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </SheetContent>
    </Sheet>
  )
}
