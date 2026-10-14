import { useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { provider } from '../lib/provider.js'
import { money } from '../lib/format.js'
import Header from '../components/Header.jsx'
import { Card, Primary } from '../components/Buttons.jsx'

export default function Join() {
  const { go } = useNav()
  const { joinCircle } = useWallet()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [code, setCode] = useState('')
  const [err, setErr] = useState('')
  const [c, setC] = useState(null)

  const find = async () => {
    try { setC(await provider.findCircle(code)); setErr(''); setStep(1) } catch (e) { setErr(e.message) }
  }
  const join = async () => { try { await joinCircle(c); setStep(2) } catch (e) { toast(e.message) } }

  if (step === 2) {
    const draw = { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw .9s ease-out forwards' }
    return (
      <div className="flex flex-col gap-5 pt-6">
        <svg viewBox="0 0 120 120" className="mx-auto h-[110px] w-[110px]" aria-hidden="true">
          <circle pathLength="1" cx="60" cy="60" r="52" fill="none" stroke="var(--btn)" strokeWidth="6" style={draw} />
          <path pathLength="1" d="M36 62l16 16 32-34" fill="none" stroke="var(--btn)" strokeWidth="7" style={draw} />
        </svg>
        <div className="text-center"><div className="font-num text-4xl">You're in</div><div className="text-mute">{c.name} · {c.joinedN + 1} of {c.size} joined</div></div>
        <Primary onClick={() => go('Circles')}>Done</Primary>
      </div>
    )
  }
  if (step === 1) {
    return (
      <div className="flex flex-col gap-5">
        <Header title="Review circle" onBack={() => { setStep(0); setErr('') }} />
        <Card className="flex flex-col gap-2.5">
          <h2 className="text-[17px] font-bold">{c.name}</h2>
          <div className="text-sm text-mute">Organised by {c.by}</div>
          {[['Contribution', `${money(c.amt)} every ${c.every}`], ['Pot each round', money(c.amt * c.size)], ['Members', `${c.joinedN} of ${c.size} joined`]].map(([k, v]) => (
            <div key={k} className="flex justify-between border-t border-line py-2"><span className="text-mute">{k}</span><strong>{v}</strong></div>
          ))}
        </Card>
        <Card className="border-saf text-sm text-mute">The payout order is drawn once all {c.size} members have joined. Your first contribution is due when the circle starts.</Card>
        <Primary onClick={join}>Join {c.name}</Primary>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-5">
      <Header title="Join a circle" />
      <p className="text-mute">Enter the invite code you were sent.</p>
      <label className="flex flex-col gap-1.5"><span className="sr-only">Invite code</span>
        <input aria-label="Invite code" placeholder="AJO-0000" maxLength={8} autoComplete="off" value={code}
          onChange={(e) => setCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && find()}
          className="min-h-12 w-full border border-ink bg-card px-3 uppercase tracking-[.08em] text-ink" />
        {err && <div className="font-semibold text-coral">{err}</div>}
      </label>
      <Primary onClick={find}>Find circle</Primary>
      <div className="text-sm text-mute">Demo codes: AJO-3580 or AJO-7305</div>
    </div>
  )
}
