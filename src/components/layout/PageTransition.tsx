'use client'

import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      key={pathname}
      initial={{
        opacity: 0,
        y: reduceMotion ? 0 : 14,
        filter: reduceMotion ? 'none' : 'blur(8px)',
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1], // Curva cinematográfica suave y progresiva
      }}
      className="w-full flex-1 flex flex-col will-change-transform"
    >
      {children}
    </motion.div>
  )
}
