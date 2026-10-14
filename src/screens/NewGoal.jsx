import { useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { money } from '../lib/format.js'
import Header from '../components/Header.jsx'
import { Primary } from '../components/Buttons.jsx'

const input = 'min-h-12 w-full border border-ink bg-card px-3 text-ink'

export default function NewGoal() {
  const { replace } = useNav()
  const { addGoal } = useWallet()
  const toast = useToast()
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [month, setMonth] = useState('')

  const t = parseInt(target.replace(/\D/g, '')) || 0
  const now = new Date()
  let hint = ''
  if (month && t) {
    const [y, m] = month.split('-').map(Number)
    const mo = (y - now.getFullYear()) * 12 + (m - 1 - now.getMonth())
    hint = mo >= 1 ? `Save about ${money(Math.ceil(t / mo))} a month to get there` : 'Pick a month in the future'
  }
  const create = async () => {
    const label = month ? new Date(month + '-01').toLocaleString('en-NG', { month: 'short', year: 'numeric' }) : ''
    const index = await addGoal(name.trim(), t, label)
    toast('Goal created')
    replace('SaveToGoal', { index }) // go straight to a first deposit; Back returns to the goals list
  }

  return (
    <div className="flex flex-col gap-5">
      <Header title="New goal" />
      <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Goal name</span>
        <input className={input} maxLength={30} placeholder="e.g. Trip to Cape Town" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Target amount (₦)</span>
        <input className={input} inputMode="numeric" placeholder="450000" value={target} onChange={(e) => setTarget(e.target.value)} /></label>
      <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Target month (optional)</span>
        <input className={input} type="month" min={now.toISOString().slice(0, 7)} value={month} onChange={(e) => setMonth(e.target.value)} /></label>
      <div className="text-sm text-mute" aria-live="polite">{hint}</div>
      <Primary onClick={create} disabled={!name.trim() || t < 1000}>Create goal</Primary>
    </div>
  )
}
