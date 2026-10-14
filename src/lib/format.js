export const money = (n) => '₦' + n.toLocaleString('en-NG')
export const moneyExact = (n) => '₦' + n.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
export const signed = (n) => (n < 0 ? '−' : '+') + money(Math.abs(n))

const sameDay = (a, b) => a.toDateString() === b.toDateString()
export const dayLabel = (at) => {
  const d = new Date(at), now = new Date(), y = new Date(now)
  y.setDate(now.getDate() - 1)
  if (sameDay(d, now)) return 'Today'
  if (sameDay(d, y)) return 'Yesterday'
  return d.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })
}
export const timeLabel = (at) => new Date(at).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' })
export const ago = (at) => {
  const m = Math.round((Date.now() - at) / 6e4)
  return m < 1 ? 'Just now' : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : dayLabel(at)
}
