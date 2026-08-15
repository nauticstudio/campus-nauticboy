import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return ''
  const gb = 1024 * 1024 * 1024
  const mb = 1024 * 1024
  const kb = 1024

  if (bytes >= gb) {
    const val = bytes / gb
    return `${parseFloat(val.toFixed(2))} GB`
  }
  if (bytes >= mb) {
    const val = bytes / mb
    return `${parseFloat(val.toFixed(1))} MB`
  }
  if (bytes >= kb) {
    const val = bytes / kb
    return `${parseFloat(val.toFixed(0))} KB`
  }
  return `${bytes} B`
}

