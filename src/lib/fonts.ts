import { Fraunces, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

/**
 * Sistema tipográfico "Pearl Studio".
 * - Fraunces: display editorial para titulares, números de stats y momentos hero.
 * - Plus Jakarta Sans: cuerpo/UI (ya era la fuente de la casa).
 * - JetBrains Mono: datos técnicos, códigos y pills de metadata.
 */
export const fontDisplay = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

export const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})
