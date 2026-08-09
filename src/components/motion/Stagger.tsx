'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface StaggerGroupProps {
  children: ReactNode
  /** Separación entre hijos en segundos. Por defecto 0.07 */
  gap?: number
  className?: string
}

interface StaggerItemProps {
  children: ReactNode
  className?: string
}

/**
 * Grupo que orquesta la entrada en cascada de tarjetas/listas.
 * Úsalo envolviendo los ítems con <StaggerItem>.
 */
export function StaggerGroup({ children, gap = 0.07, className }: StaggerGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px 0px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}
