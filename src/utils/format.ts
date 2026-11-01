export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function initials(name?: string, surname?: string): string {
  return `${name?.charAt(0) ?? ''}${surname?.charAt(0) ?? ''}`.toUpperCase() || '?'
}

/** converts a normal YouTube link (watch?v=, youtu.be) to the embed url which can be shown in an iframe */
export function toEmbedUrl(url: string): string {
  const u = url.trim()
  const watch = u.match(/[?&]v=([\w-]{6,})/)
  if (u.includes('youtube.com/watch') && watch) return `https://www.youtube.com/embed/${watch[1]}`
  const short = u.match(/youtu\.be\/([\w-]{6,})/)
  if (short) return `https://www.youtube.com/embed/${short[1]}`
  return u
}
