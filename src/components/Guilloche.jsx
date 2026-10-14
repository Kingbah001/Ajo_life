import { useEffect, useMemo, useRef, useState } from 'react'

const rosette = (cx, cy, n, ph, base, step) => {
  let d = ''
  for (let i = 0; i < n; i++) {
    const r0 = base + i * step
    for (let k = 0; k <= 180; k++) {
      const a = (k / 180) * Math.PI * 2, r = r0 + 6 * Math.sin(9 * a + ph + i * 0.38)
      d += (k ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1)
    }
    d += 'Z'
  }
  return d
}

// Banknote-style line pattern that drifts as the pointer moves across its parent.
export default function Guilloche() {
  const ref = useRef(null)
  const [ph, setPh] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current.parentElement
    let raf = 0, x = 0
    const move = (e) => {
      const r = el.getBoundingClientRect()
      x = (e.clientX - r.left) / r.width
      if (!raf) raf = requestAnimationFrame(() => { setPh(x * 3); raf = 0 })
    }
    el.addEventListener('pointermove', move)
    return () => { el.removeEventListener('pointermove', move); cancelAnimationFrame(raf) }
  }, [])
  const a = useMemo(() => rosette(330, 30, 12, ph, 30, 7), [ph])
  const b = useMemo(() => rosette(30, 250, 9, -ph, 24, 8), [ph])
  return (
    <svg ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 390 224" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <path d={a} fill="none" stroke="#7DD3B5" strokeOpacity=".2" strokeWidth=".8" />
      <path d={b} fill="none" stroke="#7DD3B5" strokeOpacity=".12" strokeWidth=".8" />
    </svg>
  )
}
