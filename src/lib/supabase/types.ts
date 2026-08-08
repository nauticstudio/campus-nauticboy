/**
 * Tipos de dominio de auth/perfil.
 *
 * Hoy los deriva el Data Access Layer (`src/server/auth/guards.ts`), que es la
 * única pieza del servidor que toca perfiles. Cuando tengas acceso remoto al
 * proyecto (`SUPABASE_PROJECT_ID`), ejecuta `npm run types:db` para regenerar
 * `src/types/database.ts` con el `Database` completo y sustituir este shim.
 */
export type { Profile, Role } from '@/server/auth/guards'

