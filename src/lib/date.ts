/**
 * Formato de fechas determinista.
 *
 * `toLocaleDateString()` sin argumentos usa el locale del runtime: en el
 * servidor (Node) suele ser `en-US` y en el navegador el locale del usuario,
 * provocando hydration mismatch ("07/08/2026" vs "8/7/2026"). Centralizamos
 * aquí un formateador con locale y timeZone fijos para que servidor y cliente
 * rendericen siempre lo mismo.
 */
const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC', // los timestamps de Supabase vienen en UTC; fijarlo evita
                   // que la fecha "salte" un día según el huso del cliente
}

const formatter = new Intl.DateTimeFormat('es-MX', DATE_FORMAT_OPTIONS)

export function formatDate(dateIso: string | Date): string {
  return formatter.format(new Date(dateIso))
}
