import { ref } from 'vue'

/**
 * Reactive current timestamp that ticks every second.
 * Used to automatically refresh relative time counters (e.g., "5 sc ago") across components.
 */
export const liveNow = ref(Date.now())

if (typeof window !== 'undefined') {
  // Update timestamp every 1000ms (1s) to drive reactive relative time updates in UI
  setInterval(() => {
    liveNow.value = Date.now()
  }, 1000)
}

/**
 * Formats an ISO date string into standard human-readable format.
 * Example: "Sep 17, 2026, 7:15 AM"
 * 
 * @param dateString ISO string or null
 * @returns Formatted date string or empty string
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(date)
}

/**
 * Formats a timestamp into an intuitive relative time string (e.g. "5 sc ago", "2 mn, 30 sc ago").
 * 
 * @param dateString ISO date string
 * @param nowTimestamp Reference timestamp (defaults to current time)
 * @returns Relative time description
 */
export function formatRelativeTime(dateString?: string | null, nowTimestamp: number = Date.now()): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const diffInSeconds = Math.max(0, Math.floor((nowTimestamp - date.getTime()) / 1000))

  // Less than 1 minute
  if (diffInSeconds < 60) {
    return `${diffInSeconds} sc ago`
  }
  // Less than 1 hour
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60)
    const secs = diffInSeconds % 60
    return `${mins} mn, ${secs} sc ago`
  }
  // Less than 1 day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    const mins = Math.floor((diffInSeconds % 3600) / 60)
    const secs = diffInSeconds % 60
    return `${hours} hours, ${mins} mn, ${secs} sc ago`
  }
  // Less than 1 week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    const hours = Math.floor((diffInSeconds % 86400) / 3600)
    const mins = Math.floor((diffInSeconds % 3600) / 60)
    return `${days} day${days > 1 ? 's' : ''}, ${hours}h, ${mins}mn ago`
  }
  // Less than 1 month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    const days = Math.floor((diffInSeconds % 604800) / 86400)
    return `${weeks} week${weeks > 1 ? 's' : ''}${days > 0 ? `, ${days}d` : ''} ago`
  }
  // Less than 1 year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} month${months > 1 ? 's' : ''} ago`
  }

  // Fallback to day/month/year for older dates
  return formatSlashDate(dateString)
}

/**
 * Formats date as DD/Mon/YYYY (e.g., "17/Sep/2026").
 * 
 * @param dateString ISO date string
 * @returns Formatted slash date
 */
export function formatSlashDate(dateString?: string | null): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return ''

  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Formats date for display on Note Cards showing both absolute date and relative time.
 * Example: "17/Sep/2026 (5 mn, 12 sc ago)"
 * 
 * @param dateString ISO date string
 * @returns Combined date and relative string
 */
export function formatNoteCardDate(dateString?: string | null): string {
  if (!dateString) return ''
  const slashDate = formatSlashDate(dateString)
  const relative = formatRelativeTime(dateString)

  if (!slashDate) return relative
  if (!relative || relative === slashDate) return slashDate

  return `${slashDate} (${relative})`
}
