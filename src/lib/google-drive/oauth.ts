/**
 * Constantes y helpers del flujo OAuth de Google Drive.
 * Mantener separado de los route handlers porque Next.js 16 no permite
 * exportar miembros no-HTTP desde `route.ts`.
 */
export const DRIVE_OAUTH_STATE_COOKIE = 'gdrive_oauth_state'