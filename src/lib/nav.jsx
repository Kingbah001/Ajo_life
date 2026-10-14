import { createContext, useCallback, useContext, useState } from 'react'

export const TABS = ['Home', 'Goals', 'Circles', 'Chats', 'Activity']
const Ctx = createContext(null)

// A tiny navigation stack. Going to a tab resets the stack to that tab; anything else is pushed on top.
export function NavProvider({ children }) {
  const [stack, setStack] = useState([{ name: 'Onboarding', params: {} }]) // first-time visitors start with onboarding
  const go = useCallback((name, params = {}) =>
    setStack((s) => (TABS.includes(name) ? [{ name, params }] : [...s, { name, params }])), [])
  const back = useCallback(() => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)), [])
  const replace = useCallback((name, params = {}) => setStack((s) => [...s.slice(0, -1), { name, params }]), [])
  const reset = useCallback((name = 'Home', params = {}) => setStack([{ name, params }]), [])
  const top = stack[stack.length - 1]
  return <Ctx.Provider value={{ top, root: stack[0].name, depth: stack.length, go, back, replace, reset }}>{children}</Ctx.Provider>
}
export const useNav = () => useContext(Ctx)
