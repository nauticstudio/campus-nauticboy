'use client'

import { Search } from 'lucide-react'

/**
 * Botón "Buscar" del hero del dashboard.
 *
 * Es Client Component porque despacha el CustomEvent `open-command-menu` que
 * escucha el CommandMenu global (document.addEventListener). Un Server
 * Component no puede pasar onClick al DOM — por eso vive aislado aquí y la
 * página (Server Component) solo lo renderiza.
 */
export function OpenCommandMenuButton() {
  return (
    <button
      type="button"
      onClick={() => document.dispatchEvent(new Event('open-command-menu'))}
      className="hidden sm:inline-flex items-center gap-2 h-12 px-5 rounded-[var(--radius-sm)] border border-[var(--border)] text-ink-200 font-semibold text-sm hover:bg-white/5 transition-colors"
    >
      <Search className="w-4 h-4 text-ink-400" /> Buscar
      <kbd className="ml-1 rounded border border-[var(--border)] bg-[var(--surface-elevated)] px-1.5 py-0.5 font-mono text-[10px] text-ink-400">⌘K</kbd>
    </button>
  )
}
