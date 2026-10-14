import { useState } from 'react'
import { useToast } from '../lib/toast.jsx'
import Header from '../components/Header.jsx'
import { Card, Primary } from '../components/Buttons.jsx'

const FAQ = [
  ['How does a circle work?', 'Every member pays the same amount each round, and one member collects the whole pot. Everyone collects once, in an order drawn at random when the circle is full.'],
  ['Can I leave a circle?', 'Yes, while it is still waiting for members. Once a circle is full and running, contributions are committed.'],
  ['What if someone is late?', 'Their payment shows as overdue, and you can send a nudge from the circle page.'],
  ['How do I change my PIN?', 'Open your profile, then Security, then Change PIN.'],
  ['Is real money being moved?', 'No. This is a demo built on sample data, so no real payments, banks or codes are involved.'],
]

export default function Help() {
  const toast = useToast()
  const [msg, setMsg] = useState('')
  const send = () => { setMsg(''); toast('Message sent. We reply within a day (demo)') }
  return (
    <div className="flex flex-col gap-5">
      <Header title="Help and support" />
      <div className="border-t border-line">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group border-b border-line">
            <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between font-semibold [&::-webkit-details-marker]:hidden">
              {q}<span className="text-mute group-open:hidden" aria-hidden="true">+</span><span className="hidden text-mute group-open:inline" aria-hidden="true">−</span>
            </summary>
            <p className="pb-3.5 text-mute">{a}</p>
          </details>
        ))}
      </div>
      <Card className="flex flex-col gap-2.5">
        <h2 className="text-[17px] font-bold">Still need help?</h2>
        <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Your message</span>
          <textarea rows={4} maxLength={500} placeholder="Tell us what is going on" value={msg} onChange={(e) => setMsg(e.target.value)}
            className="border border-ink bg-card px-3 py-2.5 text-ink" /></label>
        <Primary onClick={send} disabled={!msg.trim()}>Send message</Primary>
        <div className="text-sm text-mute">Or email <a className="font-semibold text-btn" href="mailto:support@ajo.example">support@ajo.example</a></div>
      </Card>
    </div>
  )
}
