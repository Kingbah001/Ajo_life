import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { OFFICE } from '../lib/provider.js'
import { money } from '../lib/format.js'
import { Outline } from '../components/Buttons.jsx'
import Bar from '../components/Bar.jsx'
import CircleCard from '../components/CircleCard.jsx'

export default function Circles() {
  const { go } = useNav()
  const { paid, circles } = useWallet()
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Circles</h1>
        <Outline onClick={() => go('Join')}>Join with code</Outline>
      </div>
      <button onClick={() => go('CircleDetail')} className="flex w-full flex-col gap-2 border border-line bg-card p-4 text-left">
        <span className="flex w-full items-center justify-between"><strong className="text-lg">{OFFICE.name}</strong><span className="bg-btn px-2 py-1 text-xs font-bold text-btn-ink">Active</span></span>
        <span className="text-sm text-mute">Round {OFFICE.round} of {OFFICE.size} · {money(OFFICE.each * OFFICE.size)} pot · {money(OFFICE.each)} each week</span>
        <Bar pct={(paid / OFFICE.size) * 100} />
        <span className="text-sm text-mute">{paid} of {OFFICE.size} paid · {OFFICE.collector} collects in 3 days</span>
      </button>
      {circles.map((c) => <CircleCard key={c.code} c={c} onOpen={() => go('CircleRoom', { code: c.code })} />)}
      <Outline onClick={() => go('Start')}>+ Start a circle</Outline>
    </div>
  )
}
