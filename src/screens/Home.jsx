import { useWallet } from '../lib/wallet.jsx'
import { useNav } from '../lib/nav.jsx'
import { useUser } from '../lib/user.jsx'
import { useNotify } from '../lib/notify.jsx'
import { useToast } from '../lib/toast.jsx'
import { usePayRound } from '../lib/usePayRound.js'
import { useCountUp } from '../lib/useCountUp.js'
import { money, moneyExact, signed } from '../lib/format.js'
import CircleCard from '../components/CircleCard.jsx'
import Guilloche from '../components/Guilloche.jsx'
import { GoalRing, MemberRing } from '../components/Rings.jsx'

const ACTIONS = [['Save', 'Goals'], ['Send', 'Send'], ['Join circle', 'Join'], ['Request', 'Request']]

export default function Home() {
  const { go } = useNav()
  const { name } = useUser()
  const { unread } = useNotify()
  const { balance, paid, activity, goals, circles, addMoney } = useWallet()
  const { pay, youPaid } = usePayRound()
  const toast = useToast()
  const shown = useCountUp(balance)

  const add = async () => { await addMoney(10000); toast('₦10,000 added') }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div><div className="text-sm text-mute">{name ? `Good morning, ${name}` : 'Good morning'}</div><h1 className="text-2xl font-bold tracking-tight">Your savings</h1></div>
        <div className="flex gap-2">
        <button onClick={() => go('Notifications')} aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} className="relative grid h-11 w-11 place-items-center rounded-full border border-line bg-card">
          <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 17v-6a6 6 0 0112 0v6l2 2H4z" /><path d="M10 21h4" /></svg>
          {unread > 0 && <span className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-saf px-1 text-[11px] font-bold text-[#0F2A24]">{unread > 9 ? '9+' : unread}</span>}
        </button>
        <button onClick={() => go('Profile')} aria-label="Open profile" className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card font-bold">{name ? name[0].toUpperCase() : 'A'}</button>
        </div>
      </header>

      <section className="relative flex min-h-56 flex-col gap-1.5 overflow-hidden bg-[#0F2A24] p-5 text-[#E6EEE9]">
        <Guilloche />
        <div className="relative flex items-center justify-between">
          <span className="text-sm opacity-85">Total balance</span>
          <span className="bg-saf px-2.5 py-1 text-xs font-bold text-[#0F2A24]">+₦12,400 this month</span>
        </div>
        <div className="relative font-num text-[46px] font-medium leading-none tracking-tight tabular-nums" aria-live="polite">{moneyExact(shown)}</div>
        <svg viewBox="0 0 320 48" preserveAspectRatio="none" className="relative h-12 w-full" aria-label="Balance over the last six months">
          <path pathLength="1" fill="none" stroke="#F2B705" strokeWidth="2" d="M0 40 L55 36 L110 38 L165 26 L220 20 L275 12 L320 6"
            style={{ strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw 1.2s .3s ease-out forwards' }} />
        </svg>
        <div className="relative mt-auto flex gap-3">
          <button onClick={add} className="min-h-11 bg-saf px-[18px] font-bold text-[#0F2A24]">Add ₦10,000</button>
          <button onClick={() => go('Send')} className="min-h-11 border border-[#E6EEE9] px-[18px] font-semibold">Send</button>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-2">
        {ACTIONS.map(([label, view]) => (
          <button key={label} onClick={() => go(view)} className="flex min-h-[68px] flex-col items-center justify-center gap-1.5 border border-line bg-card text-[13px] font-semibold">
            <span className="h-[22px] w-[22px] rounded-full border-2 border-btn" aria-hidden="true" />{label}
          </button>
        ))}
      </div>

      <section>
        <div className="flex items-center justify-between"><h2 className="text-[17px] font-bold">Your circle</h2>
          <button onClick={() => go('Circles')} className="min-h-11 border border-current px-3 text-[13px] font-semibold">Open Office Ajo</button></div>
        <div className="mt-2.5 flex items-center gap-4 border border-line bg-card p-4">
          <MemberRing pot="₦200k" />
          <div className="flex flex-col items-start gap-1.5">
            <h2 className="text-[17px] font-bold">Chika collects in 3 days</h2>
            <div className="text-sm text-mute">Your turn comes in round 4</div>
            <div className="text-sm text-mute">{paid} of 8 paid this round</div>
            <button onClick={pay} disabled={youPaid} className="min-h-11 bg-btn px-[18px] font-bold text-btn-ink disabled:opacity-60">{youPaid ? 'Paid for this round' : 'Pay ₦25,000'}</button>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between"><h2 className="text-[17px] font-bold">Goals</h2><span className="text-sm text-mute">See all</span></div>
        <div className="-mx-5 mt-2.5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-1">
          {goals.map((g) => <GoalRing key={g.n} name={g.n} saved={g.s} goal={g.g} />)}
        </div>
      </section>

      {circles.length > 0 && (
        <section>
          <h2 className="text-[17px] font-bold">Your other circles</h2>
          <div className="mt-2.5 flex flex-col gap-3">{circles.map((c) => <CircleCard key={c.code} c={c} onOpen={() => go('CircleRoom', { code: c.code })} />)}</div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between"><h2 className="text-[17px] font-bold">Recent activity</h2>
          <button onClick={() => go('Activity')} className="min-h-11 border border-current px-3 text-[13px] font-semibold">See all</button></div>
        <ul className="mt-2.5">
          {activity.map((x, i) => (
            <li key={i} className="flex justify-between gap-3 border-b border-line py-3 tabular-nums">
              <span>{x.t}</span><span className={x.a < 0 ? 'text-coral' : ''}>{signed(x.a)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
