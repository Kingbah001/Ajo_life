import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { money } from '../lib/format.js'
import { Outline } from '../components/Buttons.jsx'
import Bar from '../components/Bar.jsx'

export default function Goals() {
  const { go } = useNav()
  const { goals } = useWallet()
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold tracking-tight">Goals</h1>
      {goals.map((g, i) => {
        const pct = Math.round((g.s / g.g) * 100)
        return (
          <button key={g.n + i} onClick={() => go('SaveToGoal', { index: i })} className="flex w-full flex-col gap-2 border border-line bg-card p-4 text-left">
            <span className="flex w-full justify-between"><strong>{g.n}</strong><span className="text-sm text-mute">{pct}%</span></span>
            <Bar pct={pct} />
            <span className="text-sm text-mute">{money(g.s)} of {money(g.g)} · {g.d ? `by ${g.d} · ` : ''}tap to save</span>
          </button>
        )
      })}
      <Outline onClick={() => go('NewGoal')}>+ New goal</Outline>
    </div>
  )
}
