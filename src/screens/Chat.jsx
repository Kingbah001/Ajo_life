import { useEffect, useRef, useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { usePayRound } from '../lib/usePayRound.js'
import { OFFICE } from '../lib/provider.js'
import { money } from '../lib/format.js'
import Bar from '../components/Bar.jsx'
import { Card, Chip, Primary } from '../components/Buttons.jsx'

export default function Chat() {
  const { go } = useNav()
  const { members, messages, paid, postMessage, nudge } = useWallet()
  const { pay, youPaid } = usePayRound()
  const toast = useToast()
  const [text, setText] = useState('')
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }) }, [messages.length])

  const submit = async (e) => {
    e.preventDefault()
    const t = text.trim()
    if (!t) return
    setText(''); await postMessage(t)
  }
  const remind = async (n) => { await nudge(n); toast(`Reminder sent to ${n}`) }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{OFFICE.name} chat</h1>
        <Chip onClick={() => go('CircleDetail')}>Details</Chip>
      </div>
      <Card className="flex flex-col gap-2">
        <div className="flex justify-between"><span>{paid} of {OFFICE.size} paid · {OFFICE.collector} collects Friday</span><span className="text-sm text-mute">Round {OFFICE.round} of {OFFICE.size}</span></div>
        <Bar pct={(paid / OFFICE.size) * 100} />
      </Card>
      <div className="flex flex-col gap-2.5" aria-live="polite">
        {messages.map((m, i) => m.k === 'sys' ? (
          <div key={i} className="mx-auto flex w-[92%] items-center justify-between gap-2.5 border border-dashed border-mute px-3 py-2.5 text-sm">
            <span>{m.t}</span>{m.nudge && <Chip onClick={() => remind(m.nudge)}>Nudge</Chip>}
          </div>
        ) : (
          <div key={i} className={`flex max-w-[80%] flex-col gap-0.5 border px-3 py-2.5 ${m.k === 'me' ? 'self-end border-btn bg-btn text-btn-ink' : 'self-start border-line bg-card'}`}>
            {m.f && <span className="text-sm text-mute">{m.f}</span>}<span>{m.t}</span>
          </div>
        ))}
      </div>
      <div ref={end} />
      <form onSubmit={submit} className="sticky bottom-[calc(60px+env(safe-area-inset-bottom))] flex gap-2 bg-bg py-2.5">
        <Chip type="button" onClick={pay} disabled={youPaid}>{youPaid ? 'Paid' : `Pay ${money(OFFICE.each)}`}</Chip>
        <input aria-label="Message" placeholder="Message" autoComplete="off" value={text} onChange={(e) => setText(e.target.value)}
          className="min-h-11 min-w-0 flex-1 border border-ink bg-card px-3 text-ink" />
        <Primary>Send</Primary>
      </form>
    </div>
  )
}
