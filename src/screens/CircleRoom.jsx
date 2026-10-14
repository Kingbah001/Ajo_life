import { useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { copyText, namesOf } from '../lib/circles.js'
import { money } from '../lib/format.js'
import Header from '../components/Header.jsx'
import Bar from '../components/Bar.jsx'
import { CircleRing } from '../components/Rings.jsx'
import { Card, Outline, Primary } from '../components/Buttons.jsx'

const Tag = ({ children }) => <span className="text-sm text-mute"> {children}</span>

export default function CircleRoom({ code }) {
  const { go, back } = useNav()
  const { circles, leaveCircle, payJoined } = useWallet()
  const toast = useToast()
  const [sure, setSure] = useState(false)
  const c = circles.find((x) => x.code === code)
  if (!c) return null

  const pot = c.amt * c.size
  const names = namesOf(c).slice(0, c.joinedN)
  const mine = c.by === 'You'
  const leave = async () => {
    if (!sure) return setSure(true)
    await leaveCircle(code); toast(mine ? 'Circle cancelled' : 'You left the circle'); back()
  }
  const pay = async () => { try { await payJoined(code); toast('Contribution paid') } catch (e) { toast(e.message) } }

  if (!c.round) {
    return (
      <div className="flex flex-col gap-5">
        <Header title={c.name} right={<span className="bg-saf px-2 py-1 text-xs font-bold text-[#0F2A24]">{c.joinedN} of {c.size} joined</span>} />
        <Card className="flex flex-col gap-2">
          <div className="flex justify-between"><strong>Waiting for members</strong><span className="text-sm text-mute">{money(c.amt)} every {c.every}</span></div>
          <Bar pct={(c.joinedN / c.size) * 100} />
          <span className="text-sm text-mute">Pot each round: {money(pot)} · organised by {c.by}</span>
        </Card>
        <div className="flex justify-center"><CircleRing size={c.size} joined={c.joinedN} center={`${c.joinedN}/${c.size}`} /></div>
        <Card className="flex items-center justify-between">
          <div><div className="text-sm text-mute">Invite code</div><h2 className="text-[17px] font-bold">{c.code}</h2></div>
          <Outline onClick={() => copyText(c.code, toast, 'Code copied')}>Copy</Outline>
        </Card>
        <section>
          <h2 className="text-[17px] font-bold">Members</h2>
          <ul className="mt-2.5">
            {names.map((n) => (
              <li key={n} className="flex min-h-14 items-center justify-between border-b border-line">
                <span>{n}{n === c.by ? <Tag>organiser</Tag> : n === 'You' ? <Tag>you</Tag> : null}</span>
                <span className="bg-btn px-2 py-1 text-xs font-bold text-btn-ink">Joined</span>
              </li>
            ))}
            <li className="flex min-h-14 items-center text-sm text-mute">{c.size - c.joinedN} {c.size - c.joinedN === 1 ? 'place' : 'places'} open</li>
          </ul>
        </section>
        <Card className="border-saf text-sm text-mute">The payout order is drawn when all {c.size} members have joined. Your first contribution is due when the circle starts.</Card>
        <Outline onClick={leave}>{sure ? 'Tap again to confirm' : mine ? 'Cancel circle' : 'Leave circle'}</Outline>
      </div>
    )
  }

  const r = Math.min(c.round, c.size), paidN = (c.paid ? 1 : 0) + c.others
  return (
    <div className="flex flex-col gap-5">
      <Header title={c.name} />
      {c.done ? (
        <Card className="border-btn"><strong>Circle completed</strong><div className="text-sm text-mute">All {c.size} rounds are done. Everyone has collected once.</div></Card>
      ) : c.pending ? (
        <Card className="flex flex-col gap-2 border-saf">
          <strong>Your payout is ready</strong><span className="text-sm text-mute">All {c.size} members paid round {r}.</span>
          <Primary onClick={() => go('Payout', { code })}>Collect {money(pot)}</Primary>
        </Card>
      ) : (
        <Card className="flex flex-col gap-2">
          <div className="flex justify-between"><strong>Round {r} of {c.size}</strong><span className="text-sm text-mute">{c.order[r - 1] === 'You' ? 'Your turn to collect' : `${c.order[r - 1]} collects`}</span></div>
          <Bar pct={(paidN / c.size) * 100} />
          <span className="text-sm text-mute">{paidN} of {c.size} paid · pot {money(pot)} · {money(c.amt)} every {c.every}</span>
        </Card>
      )}
      <div className="flex justify-center"><CircleRing size={c.size} center={`${c.size}/${c.size}`} /></div>
      <section>
        <h2 className="text-[17px] font-bold">Payout order</h2>
        <ul className="mt-2.5">
          {c.order.map((n, i) => (
            <li key={n} className="flex min-h-14 items-center justify-between border-b border-line">
              <span>{i + 1}. {n}{n === 'You' && <Tag>you</Tag>}</span>
              <span className="text-sm text-mute">{i + 1 < c.round || c.done ? 'collected' : i + 1 === c.round ? 'this round' : `round ${i + 1}`}</span>
            </li>
          ))}
        </ul>
      </section>
      {!c.done && <Primary onClick={pay} disabled={c.paid}>{c.paid ? `Paid for round ${r}${c.pending ? '' : ' · waiting for others'}` : `Pay round ${r} contribution ${money(c.amt)}`}</Primary>}
    </div>
  )
}
