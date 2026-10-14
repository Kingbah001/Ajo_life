import { useEffect, useState } from 'react'

// Flips to true two frames after mount so CSS transitions have a start state to animate from.
const useArmed = () => {
  const [a, set] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => set(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  return a
}

export function MemberRing({ round = 3, size = 8, pot }) {
  const armed = useArmed(), C = 2 * Math.PI * 62
  return (
    <svg viewBox="0 0 160 160" className="h-[140px] w-[140px] shrink-0" role="img" aria-label={`${size} members, round ${round} of ${size}`}>
      <circle cx="80" cy="80" r="62" fill="none" stroke="var(--ring)" strokeWidth="3" />
      <circle cx="80" cy="80" r="62" fill="none" stroke="var(--btn)" strokeWidth="3" strokeDasharray={C}
        strokeDashoffset={armed ? C * (1 - round / size) : C} transform="rotate(-90 80 80)"
        style={{ transition: 'stroke-dashoffset 1.1s .2s cubic-bezier(.2,.7,.2,1)' }} />
      {Array.from({ length: size }, (_, k) => {
        const a = (k / size) * Math.PI * 2 - Math.PI / 2, x = 80 + 62 * Math.cos(a), y = 80 + 62 * Math.sin(a)
        if (k < round - 1) return <circle key={k} cx={x} cy={y} r="11" fill="var(--btn)" />
        if (k === round - 1) return <circle key={k} cx={x} cy={y} r="15" fill="#F2B705" stroke="var(--ink)" strokeWidth="2" />
        return <circle key={k} cx={x} cy={y} r="11" fill="var(--card)" stroke={k === round ? 'var(--ink)' : 'var(--line)'} strokeWidth="2" />
      })}
      <text x="80" y="80" textAnchor="middle" className="fill-ink font-num" fontSize="21">{pot}</text>
      <text x="80" y="98" textAnchor="middle" className="fill-mute" fontSize="11">Round {round} of {size}</text>
    </svg>
  )
}

export function GoalRing({ name, saved, goal }) {
  const armed = useArmed(), c = 2 * Math.PI * 26, p = saved / goal, pct = Math.round(p * 100)
  return (
    <div className="flex w-[152px] shrink-0 snap-start flex-col gap-1.5 border border-line bg-card p-4">
      <svg viewBox="0 0 64 64" className="h-16 w-16" role="img" aria-label={`${pct} percent`}>
        <circle cx="32" cy="32" r="26" fill="none" stroke="var(--ring)" strokeWidth="7" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="#F2B705" strokeWidth="7" strokeDasharray={c}
          strokeDashoffset={armed ? c * (1 - p) : c} transform="rotate(-90 32 32)"
          style={{ transition: 'stroke-dashoffset 1.1s .2s cubic-bezier(.2,.7,.2,1)' }} />
        <text x="32" y="36" textAnchor="middle" fontSize="13" fontWeight="700" className="fill-ink">{pct}%</text>
      </svg>
      <strong>{name}</strong>
      <span className="text-sm text-mute">₦{saved / 1000}k of ₦{goal / 1000}k</span>
    </div>
  )
}

// Ring of member dots: filled = joined, dashed = open place. swellAt highlights one dot (payout day).
export function CircleRing({ size, joined = size, center, swellAt = -1, className = 'h-[150px] w-[150px]' }) {
  const r = size > 8 ? 9 : 11
  return (
    <svg viewBox="0 0 160 160" className={`${className} shrink-0`} role="img" aria-label={`${joined} of ${size} places filled`}>
      <circle cx="80" cy="80" r="62" fill="none" stroke="var(--ring)" strokeWidth="3" />
      {Array.from({ length: size }, (_, k) => {
        const a = (k / size) * Math.PI * 2 - Math.PI / 2, x = 80 + 62 * Math.cos(a), y = 80 + 62 * Math.sin(a)
        if (k === swellAt) return <circle key={k} className="swell" cx={x} cy={y} r="14" fill="#F2B705" stroke="var(--ink)" strokeWidth="2" />
        return k < joined
          ? <circle key={k} cx={x} cy={y} r={r} fill="var(--btn)" />
          : <circle key={k} cx={x} cy={y} r={r} fill="none" stroke="var(--mute)" strokeWidth="2" strokeDasharray="3 3" />
      })}
      <text x="80" y="88" textAnchor="middle" className="fill-ink font-num" fontSize="24">{center}</text>
    </svg>
  )
}
