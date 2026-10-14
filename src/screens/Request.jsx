import { useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { money } from '../lib/format.js'
import Header from '../components/Header.jsx'
import Keypad from '../components/Keypad.jsx'
import { Chip, Outline, Primary } from '../components/Buttons.jsx'

const PEOPLE = ['Amaka Obi', 'Tunde', 'Chika', 'Sade']
const QUICK = [5000, 10000, 20000]

export default function Request() {
  const { go } = useNav()
  const { requests, requestMoney } = useWallet()
  const [to, setTo] = useState(null)
  const [amt, setAmt] = useState('')
  const [note, setNote] = useState('')
  const [sent, setSent] = useState(false)
  const n = +amt || 0
  const press = (k) => setAmt((a) => (k === 'del' ? a.slice(0, -1) : (a + k).replace(/^0+/, '').slice(0, 8)))
  const send = async () => { await requestMoney(to, n, note.trim()); setSent(true) }
  const again = () => { setTo(null); setAmt(''); setNote(''); setSent(false) }

  if (sent) {
    const draw = { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw .9s ease-out forwards' }
    return (
      <div className="flex flex-col gap-5 pt-6">
        <svg viewBox="0 0 120 120" className="mx-auto h-[110px] w-[110px]" aria-hidden="true">
          <circle pathLength="1" cx="60" cy="60" r="52" fill="none" stroke="var(--btn)" strokeWidth="6" style={draw} />
          <path pathLength="1" d="M36 62l16 16 32-34" fill="none" stroke="var(--btn)" strokeWidth="7" style={draw} />
        </svg>
        <div className="text-center">
          <div className="font-num text-4xl">Request sent</div>
          <div className="text-mute">{money(n)} from {to}</div>
          <div className="mt-1.5 text-sm text-mute">We'll let you know when they pay.</div>
        </div>
        <Primary onClick={() => go('Home')}>Done</Primary>
        <Outline onClick={again}>Request again</Outline>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <Header title="Request money" />
      <div>
        <div className="mb-2 text-sm text-mute">Request from</div>
        <div className="flex flex-wrap gap-2">{PEOPLE.map((p) => <Chip key={p} aria-pressed={to === p} onClick={() => setTo(p)}>{p}</Chip>)}</div>
      </div>
      <div className="text-center font-num text-5xl tabular-nums">{money(n)}</div>
      <div className="flex justify-center gap-2">{QUICK.map((q) => <Chip key={q} onClick={() => setAmt(String(q))}>{money(q)}</Chip>)}</div>
      <input aria-label="Note" placeholder="Add a note (optional)" maxLength={60} value={note} onChange={(e) => setNote(e.target.value)}
        className="min-h-12 w-full border border-ink bg-card px-3 text-ink" />
      <Keypad onKey={press} />
      <Primary onClick={send} disabled={!to || n <= 0}>{to ? `Request ${n ? money(n) : ''} from ${to}` : 'Choose who to request from'}</Primary>
      {requests.length > 0 && (
        <section>
          <h2 className="text-[17px] font-bold">Requests</h2>
          <ul className="mt-2.5">
            {requests.map((r) => (
              <li key={r.id} className="flex min-h-12 items-center justify-between gap-3 border-b border-line">
                <span>{r.n}{r.note && <span className="text-mute"> · {r.note}</span>}</span>
                <span className="flex items-center gap-2 tabular-nums">{money(r.a)}
                  <span className={`px-2 py-1 text-xs font-bold ${r.s === 'paid' ? 'bg-btn text-btn-ink' : 'bg-saf text-[#0F2A24]'}`}>{r.s === 'paid' ? 'Paid' : 'Pending'}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
