import { useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { copyText, lenText } from '../lib/circles.js'
import { money } from '../lib/format.js'
import Header from '../components/Header.jsx'
import { Card, Chip, Outline, Primary } from '../components/Buttons.jsx'

const FREQ = [['week', 'Weekly'], ['2 weeks', 'Every 2 weeks'], ['month', 'Monthly']]
const field = 'min-h-12 w-full border border-ink bg-card px-3 text-ink'

export default function Start() {
  const { replace } = useNav()
  const { createCircle } = useWallet()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [amt, setAmt] = useState('')
  const [every, setEvery] = useState('week')
  const [size, setSize] = useState(6)
  const [code, setCode] = useState('')
  const a = parseInt(amt.replace(/\D/g, '')) || 0

  const next = () => { setCode('AJO-' + (1000 + Math.floor(Math.random() * 9000))); setStep(1) }
  const create = async () => {
    await createCircle({ code, name: name.trim(), amt: a, every, size })
    toast('Circle created')
    replace('CircleRoom', { code })
  }
  const share = async () => {
    const text = `Join my Ajo circle ${name.trim()} with code ${code}`
    try { if (navigator.share) await navigator.share({ text }); else await copyText(text, toast, 'Invite message copied') } catch { /* share cancelled */ }
  }

  if (step === 1) {
    return (
      <div className="flex flex-col gap-5">
        <Header title="Start a circle" onBack={() => setStep(0)} />
        <div className="text-sm text-mute">Step 2 of 2 · Invite</div>
        <Card className="flex flex-col items-center gap-2">
          <div className="text-sm text-mute">Share this code</div>
          <div className="font-num text-[38px] tracking-[.06em]">{code}</div>
          <div className="flex gap-2"><Outline onClick={() => copyText(code, toast, 'Code copied')}>Copy code</Outline><Outline onClick={share}>Share</Outline></div>
        </Card>
        <Card className="flex flex-col gap-2.5">
          <div className="flex justify-between"><strong>1 of {size} joined</strong><span className="text-sm text-mute">{name.trim()}</span></div>
          <div className="flex flex-wrap gap-2" aria-hidden="true">
            {Array.from({ length: size }, (_, i) => <i key={i} className={`h-4 w-4 rounded-full ${i ? 'border-2 border-dashed border-mute' : 'bg-btn'}`} />)}
          </div>
        </Card>
        <Card className="border-saf text-sm text-mute">The payout order is drawn once all {size} members have joined. You can share the code any time from the circle page.</Card>
        <Primary onClick={create}>Create circle</Primary>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Header title="Start a circle" />
      <div className="text-sm text-mute">Step 1 of 2 · Details</div>
      <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Circle name</span>
        <input className={field} maxLength={30} placeholder="e.g. Office Ajo" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Contribution each (₦)</span>
        <input className={field} inputMode="numeric" placeholder="25000" value={amt} onChange={(e) => setAmt(e.target.value)} /></label>
      <div><div className="mb-2 text-sm text-mute">How often</div>
        <div className="flex flex-wrap gap-2">{FREQ.map(([k, l]) => <Chip key={k} aria-pressed={every === k} onClick={() => setEvery(k)}>{l}</Chip>)}</div></div>
      <div className="flex items-center justify-between"><span>Members</span>
        <div className="flex items-center gap-3">
          <Chip aria-label="Fewer members" onClick={() => setSize((n) => Math.max(3, n - 1))}>−</Chip><strong>{size}</strong>
          <Chip aria-label="More members" onClick={() => setSize((n) => Math.min(12, n + 1))}>+</Chip></div></div>
      <Card className="flex flex-col gap-2">
        {a ? (<>
          <div className="flex justify-between"><span className="text-sm text-mute">Pot each round</span><strong>{money(a * size)}</strong></div>
          <div className="flex justify-between"><span className="text-sm text-mute">Length</span><span>{size} rounds · {lenText(every, size)}</span></div>
        </>) : <span className="text-sm text-mute">Enter a contribution to see the pot.</span>}
      </Card>
      <Primary onClick={next} disabled={!name.trim() || a < 1000}>Continue to invites</Primary>
    </div>
  )
}
