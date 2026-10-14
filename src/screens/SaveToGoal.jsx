import { useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { money, moneyExact } from '../lib/format.js'
import Header from '../components/Header.jsx'
import Keypad from '../components/Keypad.jsx'
import Bar from '../components/Bar.jsx'
import { Card, Chip, Primary } from '../components/Buttons.jsx'

const QUICK = [5000, 10000, 20000]

export default function SaveToGoal({ index }) {
  const { go } = useNav()
  const { goals, balance, saveToGoal } = useWallet()
  const toast = useToast()
  const [amt, setAmt] = useState('')
  const [done, setDone] = useState(false)
  const g = goals[index]
  if (!g) return null

  const n = +amt || 0, over = n > balance, pct = Math.round((g.s / g.g) * 100), left = Math.max(0, g.g - g.s)
  const press = (k) => setAmt((a) => (k === 'del' ? a.slice(0, -1) : (a + k).replace(/^0+/, '').slice(0, 8)))
  const save = async () => { try { await saveToGoal(index, n); setDone(true) } catch (e) { toast(e.message) } }

  if (done) {
    const draw = { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw .9s ease-out forwards' }
    return (
      <div className="flex flex-col gap-5">
        <svg viewBox="0 0 120 120" className="mx-auto h-[110px] w-[110px]" aria-hidden="true">
          <circle pathLength="1" cx="60" cy="60" r="52" fill="none" stroke="var(--saf)" strokeWidth="6" style={draw} />
          <path pathLength="1" d="M36 62l16 16 32-34" fill="none" stroke="var(--saf)" strokeWidth="7" style={draw} />
        </svg>
        <div className="text-center"><div className="font-num text-[40px] tabular-nums">{money(n)} saved</div><div className="text-mute">to {g.n}</div></div>
        <Card className="flex flex-col gap-2">
          <div className="flex justify-between"><strong>{pct >= 100 ? 'Goal reached' : `${g.n} is ${pct}% there`}</strong><span className="text-sm text-mute">{left ? `${money(left)} to go` : ''}</span></div>
          <Bar pct={pct} />
        </Card>
        <Primary onClick={() => go('Home')}>Done</Primary>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Header title={`Save to ${g.n}`} />
      <Card className="flex flex-col gap-1">
        <div className="flex justify-between text-sm text-mute"><span>Saved so far</span><span>{pct}%</span></div>
        <strong>{money(g.s)} of {money(g.g)}</strong>
      </Card>
      <div className="text-center">
        <div className="font-num text-[52px] leading-tight tabular-nums">{money(n)}</div>
        <div className="text-sm text-mute">Wallet {moneyExact(balance)}</div>
        {over && <div className="font-semibold text-coral">That is more than your balance</div>}
      </div>
      <div className="flex justify-center gap-2">{QUICK.map((q) => <Chip key={q} onClick={() => setAmt(String(q))}>{money(q)}</Chip>)}</div>
      <Keypad onKey={press} />
      <Primary onClick={save} disabled={n <= 0 || over}>Save {n ? money(n) : ''}</Primary>
    </div>
  )
}
