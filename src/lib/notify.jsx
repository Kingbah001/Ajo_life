import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useToast } from './toast.jsx'
import { useUser } from './user.jsx'

const Ctx = createContext(null)
const H = 36e5

// Earlier notifications, so the list isn't empty on first open.
const seed = () => [
  { id: 's1', title: 'Pay ₦25,000 by Friday', sub: 'Office Ajo', at: Date.now() - 2 * H, unread: true, go: { name: 'CircleDetail' } },
  { id: 's2', title: 'Chika collected ₦200,000', sub: 'Office Ajo', at: Date.now() - 5 * H, unread: true, go: { name: 'CircleDetail' } },
  { id: 's3', title: "You're 40% to New laptop", sub: 'Goals', at: Date.now() - 26 * H, unread: false, go: { name: 'Goals' } },
  { id: 's4', title: '6-week saving streak', sub: 'Save before Friday to keep it going', at: Date.now() - 27 * H, unread: false, go: { name: 'Goals' } },
  { id: 's5', title: 'Transfer to Amaka Obi completed', sub: 'Activity', at: Date.now() - 28 * H, unread: false, go: { name: 'Activity' } },
]

// notify(kind, title, sub, go): always shows a toast; adds to the list unless that kind is switched off in settings.
export function NotifyProvider({ children }) {
  const toast = useToast()
  const { prefs } = useUser()
  const prefsRef = useRef(prefs)
  prefsRef.current = prefs
  const [list, setList] = useState(seed)

  const notify = useCallback((kind, title, sub, go) => {
    toast(title)
    if (prefsRef.current[kind] === false) return
    setList((l) => [{ id: crypto.randomUUID(), title, sub, at: Date.now(), unread: true, go }, ...l])
  }, [toast])
  const read = useCallback((id) => setList((l) => l.map((n) => (n.id === id ? { ...n, unread: false } : n))), [])
  const readAll = useCallback(() => setList((l) => l.map((n) => ({ ...n, unread: false }))), [])
  const unread = list.filter((n) => n.unread).length

  return <Ctx.Provider value={{ list, unread, notify, read, readAll }}>{children}</Ctx.Provider>
}
export const useNotify = () => useContext(Ctx)
