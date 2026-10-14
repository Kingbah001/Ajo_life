import { createContext, useCallback, useContext, useRef, useState } from 'react'

const Ctx = createContext(() => {})

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState('')
  const [on, setOn] = useState(false)
  const timer = useRef(0)
  const toast = useCallback((m) => {
    setMsg(m); setOn(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setOn(false), 1800)
  }, [])
  return (
    <Ctx.Provider value={toast}>
      {children}
      <div role="status" className={`pointer-events-none fixed bottom-24 left-1/2 -translate-x-1/2 bg-ink px-4 py-2.5 font-semibold text-bg transition-opacity ${on ? 'opacity-100' : 'opacity-0'}`}>{msg}</div>
    </Ctx.Provider>
  )
}
export const useToast = () => useContext(Ctx)
