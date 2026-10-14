import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const Ctx = createContext(null)

export const phoneDigits = (s) => {
  let d = String(s).replace(/\D/g, '')
  if (d.startsWith('234')) d = d.slice(3)
  if (d.startsWith('0')) d = d.slice(1)
  return d
}
export const formatPhone = (d) => (d && d.length === 10 ? `+234 ${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}` : '')

// Profile data plus the transaction PIN. In-memory only, like the rest of the demo.
export function UserProvider({ children }) {
  const [u, setU] = useState({ name: '', phone: '', pin: '1234', pinSet: false, theme: 'system', bio: false, prefs: { reminders: true, circles: true, goals: true } })
  const update = useCallback((p) => setU((x) => ({ ...x, ...p })), [])
  const setPref = useCallback((k, v) => setU((x) => ({ ...x, prefs: { ...x.prefs, [k]: v } })), [])
  const reset = useCallback(() => setU((x) => ({ ...x, name: '', phone: '', theme: 'system', bio: false, prefs: { reminders: true, circles: true, goals: true } })), [])
  // 'system' follows the device; 'light' and 'dark' override it via the data-theme attribute the CSS already understands.
  useEffect(() => {
    const r = document.documentElement
    if (u.theme === 'system') r.removeAttribute('data-theme'); else r.setAttribute('data-theme', u.theme)
  }, [u.theme])
  const checkPin = useCallback((p) => p === u.pin, [u.pin])
  return <Ctx.Provider value={{ ...u, update, setPref, reset, checkPin }}>{children}</Ctx.Provider>
}
export const useUser = () => useContext(Ctx)
