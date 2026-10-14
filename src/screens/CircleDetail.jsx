import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { usePayRound } from '../lib/usePayRound.js'
import { OFFICE } from '../lib/provider.js'
import { money } from '../lib/format.js'
import Header from '../components/Header.jsx'
import Bar from '../components/Bar.jsx'
import Status from '../components/Status.jsx'
import { Card, Chip, Primary } from '../components/Buttons.jsx'

export default function CircleDetail() {
  const { go } = useNav()
  const { members, paid, nudge } = useWallet()
  const { pay, youPaid } = usePayRound()
  const toast = useToast()
  const send = async (n) => { await nudge(n); toast(`Reminder sent to ${n}`) }

  return (
    <div className="flex flex-col gap-5">
      <Header title={OFFICE.name} right={<Chip onClick={() => go('Chats')}>Chat</Chip>} />
      <Card className="flex flex-col gap-2">
        <div className="flex justify-between text-sm text-mute"><span>Pot this round</span><span>{OFFICE.size} members</span></div>
        <div className="font-num text-[38px] leading-tight tabular-nums">{money(OFFICE.each * OFFICE.size)}</div>
        <div className="text-sm text-mute">{money(OFFICE.each)} each, every Friday</div>
        <Bar pct={(paid / OFFICE.size) * 100} />
        <div className="text-sm text-mute">{paid} of {OFFICE.size} paid this round</div>
      </Card>
      <Card className="border-saf"><h2 className="text-[17px] font-bold">{OFFICE.collector} collects in 3 days</h2><div className="text-sm text-mute">Friday · your turn is round 4</div></Card>
      <section>
        <h2 className="text-[17px] font-bold">Payout order</h2>
        <ul className="mt-2.5">
          {members.map((m, i) => (
            <li key={m.n} className="flex min-h-14 items-center justify-between gap-3 border-b border-line">
              <span>{i + 1}. {m.n}{i === OFFICE.round - 1 && <span className="text-sm text-mute"> collects next</span>}</span>
              <span className="flex items-center gap-2">{m.s === 'late' && <Chip onClick={() => send(m.n)}>Nudge</Chip>}<Status s={m.s} /></span>
            </li>
          ))}
        </ul>
      </section>
      <Primary onClick={pay} disabled={youPaid}>{youPaid ? 'Paid for this round' : `Pay ${money(OFFICE.each)}`}</Primary>
    </div>
  )
}
