'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Retardo en segundos (para stagger manual). */
  delay?: number
  /** Desplazamiento vertical inicial en px. Por defecto 16. */
  y?: number
  className?: string
}

/**
 * Entrada editorial: fade + subida suave, usada en heroes y cards principales.
 * Respeta `prefers-reduced-motion` animando solo opacidad.
 */
export function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
