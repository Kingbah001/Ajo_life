// Helpers for user-created and joined circles.
const POOL = ['Mum', 'Tunde', 'Ife', 'Seun', 'Bisi', 'Dami', 'Ola', 'Yemi', 'Kayode', 'Tola', 'Ngozi']

// Deterministic member names, in join order: organiser, then You (unless You organise), then the pool.
export const namesOf = (c) => {
  const p = POOL.filter((x) => x !== c.by)
  return c.by === 'You' ? ['You', ...p] : [c.by, 'You', ...p]
}
export const lenText = (every, n) => (every === 'week' ? `${n} weeks` : every === '2 weeks' ? `${n * 2} weeks` : `${n} months`)
export const copyText = async (text, toast, ok) => {
  try { await navigator.clipboard.writeText(text); toast(ok) } catch { toast(text) }
}
