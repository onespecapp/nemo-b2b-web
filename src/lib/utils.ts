// Shared utility functions

export function parseUTCDate(dateStr: string): Date {
  if (!dateStr.endsWith('Z') && !dateStr.includes('+')) {
    return new Date(dateStr + 'Z')
  }
  return new Date(dateStr)
}

export function formatDuration(seconds: number | null): string {
  if (!seconds) return '-'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatRelativeTime(dateStr: string): string {
  const date = parseUTCDate(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const absDiffMs = Math.abs(diffMs)
  const isFuture = diffMs < 0

  const minutes = Math.floor(absDiffMs / 60000)
  const hours = Math.floor(absDiffMs / 3600000)
  const days = Math.floor(absDiffMs / 86400000)

  let label: string
  if (minutes < 1) label = 'just now'
  else if (minutes < 60) label = `${minutes}m`
  else if (hours < 24) label = `${hours}h`
  else if (days < 30) label = `${days}d`
  else label = `${Math.floor(days / 30)}mo`

  if (label === 'just now') return label
  return isFuture ? `in ${label}` : `${label} ago`
}

export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
