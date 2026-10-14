import { useMemo, useState } from 'react'
import { useWallet } from '../lib/wallet.jsx'
import { dayLabel, money, signed, timeLabel } from '../lib/format.js'
import { Chip } from '../components/Buttons.jsx'

const FILTERS = {
  all: ['All', () => true],
  in: ['Money in', (x) => x.a > 0],
  out: ['Money out', (x) => x.a < 0],
  goals: ['Goals', (x) => /^Saved to/.test(x.t)],
  circles: ['Circles', (x) => /Ajo|contribution$|payout$/.test(x.t)],
}

export default function Activity() {
  const { allActivity } = useWallet()
  const [q, setQ] = useState('')
  const [f, setF] = useState('all')

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    return allActivity.filter((x) => FILTERS[f][1](x) && x.t.toLowerCase().includes(term))
  }, [allActivity, q, f])
  const total = (fn) => money(list.filter(fn).reduce((s, x) => s + Math.abs(x.a), 0))
  const groups = list.reduce((acc, x) => {
    const label = dayLabel(x.at), last = acc[acc.length - 1]
    if (last && last.label === label) last.items.push(x)
    else acc.push({ label, items: [x] })
    return acc
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
      <input type="search" aria-label="Search transactions" placeholder="Search transactions" value={q} onChange={(e) => setQ(e.target.value)}
        className="min-h-12 w-full border border-ink bg-card px-3 text-ink" />
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter transactions">
        {Object.entries(FILTERS).map(([key, [label]]) => <Chip key={key} aria-pressed={f === key} onClick={() => setF(key)}>{label}</Chip>)}
      </div>
      <div className="flex justify-between text-sm text-mute" aria-live="polite">
        <span>In {total((x) => x.a > 0)}</span><span>Out {total((x) => x.a < 0)}</span>
      </div>
      {groups.length ? groups.map((g) => (
        <section key={g.label}>
          <h2 className="pb-1 text-sm font-normal text-mute">{g.label}</h2>
          <ul>
            {g.items.map((x, i) => (
              <li key={g.label + i} className="flex min-h-14 items-center justify-between gap-3 border-b border-line tabular-nums">
                <div><div>{x.t}</div><div className="text-sm text-mute">{timeLabel(x.at)}</div></div>
                <span className={x.a < 0 ? 'text-coral' : ''}>{signed(x.a)}</span>
              </li>
            ))}
          </ul>
        </section>
      )) : <p className="py-8 text-center text-mute">No transactions match.</p>}
    </div>
  )
}
