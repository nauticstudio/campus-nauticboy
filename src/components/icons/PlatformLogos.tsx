import React from 'react'

export function AppleLogo({ className = "text-sm" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center justify-center leading-none select-none font-normal ${className}`} aria-hidden="true">
      
    </span>
  )
}

export function WindowsLogo({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 88" fill="currentColor" aria-hidden="true">
      <rect x="0" y="0" width="41" height="41" />
      <rect x="47" y="0" width="41" height="41" />
      <rect x="0" y="47" width="41" height="41" />
      <rect x="47" y="47" width="41" height="41" />
    </svg>
  )
}
