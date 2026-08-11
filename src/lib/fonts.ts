import { Space_Grotesk, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

/**
 * Sistema tipográfico "Nautic Audio Tech v3"
 * - Space Grotesk: fuente display futurista, moderna y de alta legibilidad para titulares, sintes, vst y marcas.
 * - Plus Jakarta Sans: cuerpo de texto e interfaz limpia, legible y optimizada.
 * - JetBrains Mono: metadata técnica, versiones, parámetros DSP y código.
 */
export const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
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
