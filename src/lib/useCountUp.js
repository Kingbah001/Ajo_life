import { useEffect, useRef, useState } from 'react'

export function useCountUp(target, ms = 900) {
  const [v, setV] = useState(0)
  const from = useRef(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(target); from.current = target; return }
    const t0 = performance.now(), a = from.current
    let id
    const f = (t) => {
      const p = Math.min(1, (t - t0) / ms), x = a + (target - a) * (1 - Math.pow(1 - p, 3))
      setV(x); from.current = x
      if (p < 1) id = requestAnimationFrame(f)
    }
    id = requestAnimationFrame(f)
    return () => cancelAnimationFrame(id)
  }, [target, ms])
  return v
}
