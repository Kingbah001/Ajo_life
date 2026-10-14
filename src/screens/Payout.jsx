import { useEffect, useRef, useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { useCountUp } from '../lib/useCountUp.js'
import { money } from '../lib/format.js'
import { CircleRing } from '../components/Rings.jsx'
import { Card, Outline, Primary } from '../components/Buttons.jsx'

export default function Payout({ code }) {
  const { back } = useNav()
  const { circles, collect } = useWallet()
  const toast = useToast()
  const [done, setDone] = useState(false)
  const c = circles.find((x) => x.code === code)
  const snap = useRef(null)
  if (c && !snap.current && c.pending) snap.current = { round: c.round, size: c.size, amt: c.amt, name: c.name }
  const s = snap.current
  const pot = s ? s.amt * s.size : 0
  const shown = useCountUp(pot)

  useEffect(() => { if (!s) back() }, [s])
  if (!s) return null

  const take = async () => { try { await collect(code); toast(`${money(pot)} collected`); setDone(true) } catch (e) { toast(e.message) } }
  const draw = { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw .9s ease-out forwards' }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between"><Outline onClick={back}>Close</Outline><span className="text-sm text-mute">{s.name} · Round {s.round}</span></div>
      {!done ? (
        <>
          <div className="flex justify-center"><CircleRing size={s.size} joined={s.size} swellAt={s.round - 1} center={money(Math.round(shown / 1000)) + 'k'} className="h-[240px] w-[240px]" /></div>
          <div className="text-center"><h1 className="text-2xl font-bold">It's your turn to collect</h1><div className="text-mute">All {s.size} members have paid round {s.round}.</div></div>
          <Card>
            <div className="flex justify-between border-b border-line py-2"><span className="text-mute">From</span><span>{s.size} members × {money(s.amt)}</span></div>
            <div className="flex justify-between py-2"><span className="text-mute">Goes to</span><span>Main wallet</span></div>
          </Card>
          <Primary onClick={take}>Collect {money(pot)}</Primary>
        </>
      ) : (
        <>
          <div className="relative mx-auto h-[110px] w-[110px]">
            {Array.from({ length: 14 }, (_, i) => <i key={i} className="burst absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full bg-saf" style={{ '--a': `${(i * 360) / 14}deg` }} />)}
            <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
              <circle pathLength="1" cx="60" cy="60" r="52" fill="none" stroke="var(--btn)" strokeWidth="6" style={draw} />
              <path pathLength="1" d="M36 62l16 16 32-34" fill="none" stroke="var(--btn)" strokeWidth="7" style={draw} />
            </svg>
          </div>
          <div className="text-center"><div className="font-num text-[42px] tabular-nums">{money(Math.round(shown))}</div><div className="text-mute">added to your wallet</div></div>
          <Primary onClick={back}>Done</Primary>
        </>
      )}
    </div>
  )
}
