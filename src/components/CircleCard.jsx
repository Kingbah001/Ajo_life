import Bar from './Bar.jsx'
import { money } from '../lib/format.js'

// Summary card for a joined or created circle: members while waiting, round once it is running.
export default function CircleCard({ c, onOpen }) {
  const badge = c.round ? (c.done ? 'Completed' : `Round ${c.round}`) : `${c.joinedN} of ${c.size} joined`
  return (
    <button onClick={onOpen} className="flex w-full flex-col gap-2 border border-line bg-card p-4 text-left">
      <span className="flex w-full items-center justify-between gap-2">
        <strong className="text-lg">{c.name}</strong>
        <span className={`px-2 py-1 text-xs font-bold ${c.round ? 'bg-btn text-btn-ink' : 'bg-saf text-[#0F2A24]'}`}>{badge}</span>
      </span>
      <span className="text-sm text-mute">{money(c.amt)} every {c.every} · {money(c.amt * c.size)} pot{c.round ? '' : ' · starts when full'}</span>
      <Bar pct={(c.joinedN / c.size) * 100} />
    </button>
  )
}
