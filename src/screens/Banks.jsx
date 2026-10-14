import { useState } from 'react'
import { useUser } from '../lib/user.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import Header from '../components/Header.jsx'
import { Card, Chip, Outline, Primary } from '../components/Buttons.jsx'

const BANKS = ['Access Bank', 'GTBank', 'Zenith Bank', 'First Bank', 'UBA', 'Kuda', 'Opay', 'Moniepoint', 'Wema Bank', 'Sterling Bank']
const field = 'min-h-12 w-full border border-ink bg-card px-3 text-ink'

export default function Banks() {
  const { name } = useUser()
  const { banks, addBank, removeBank } = useWallet()
  const toast = useToast()
  const [step, setStep] = useState(0) // 0 list, 1 form, 2 confirm, 3 success
  const [bank, setBank] = useState('')
  const [num, setNum] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const [sure, setSure] = useState(null)
  const holder = (name || 'Account holder').toUpperCase() // demo: the resolved name is made up

  const verify = async () => {
    const e = !bank ? 'Choose your bank.' : num.length !== 10 ? 'Account numbers have 10 digits.' : ''
    setErr(e); if (e) return
    setBusy(true); await new Promise((r) => setTimeout(r, 800)); setBusy(false); setStep(2)
  }
  const link = async () => { try { await addBank({ bank, num, name: holder }); setStep(3) } catch (e) { setErr(e.message); setStep(1) } }
  const remove = async (id) => { if (sure !== id) return setSure(id); await removeBank(id); setSure(null); toast('Account removed') }
  const onBack = step === 0 ? undefined : () => { setErr(''); setStep(step === 2 ? 1 : 0) }

  const draw = { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw .9s ease-out forwards' }
  return (
    <div className="flex flex-col gap-5">
      <Header title={step === 0 ? 'Bank accounts' : 'Add bank account'} onBack={onBack} />
      {step === 0 && (<>
        {banks.length ? banks.map((b) => (
          <Card key={b.id} className="flex items-center justify-between gap-3">
            <div><strong>{b.bank}</strong><div className="text-sm text-mute">{b.name} · •••• {b.num.slice(-4)}</div></div>
            <Chip onClick={() => remove(b.id)}>{sure === b.id ? 'Tap again' : 'Remove'}</Chip>
          </Card>
        )) : <Card><strong>No bank account linked</strong><div className="text-sm text-mute">Link an account to move money in and out of Ajo.</div></Card>}
        <Primary onClick={() => { setBank(''); setNum(''); setErr(''); setStep(1) }}>Add bank account</Primary>
      </>)}
      {step === 1 && (<>
        <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Bank</span>
          <select className={field} value={bank} onChange={(e) => setBank(e.target.value)}><option value="">Choose a bank</option>{BANKS.map((b) => <option key={b}>{b}</option>)}</select></label>
        <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Account number</span>
          <input className={field} inputMode="numeric" maxLength={10} placeholder="10 digits" value={num} onChange={(e) => setNum(e.target.value.replace(/\D/g, ''))} />
          {err && <span className="font-semibold text-coral">{err}</span>}</label>
        <Primary onClick={verify} disabled={busy}>{busy ? 'Verifying…' : 'Verify account'}</Primary>
      </>)}
      {step === 2 && (<>
        <Card>{[['Bank', bank], ['Account number', num], ['Account name', holder]].map(([k, v]) => <div key={k} className="flex justify-between border-b border-line py-2 last:border-0"><span className="text-mute">{k}</span><strong>{v}</strong></div>)}</Card>
        <div className="text-sm text-mute">Is this your account? Demo only: the name is made up.</div>
        <Primary onClick={link}>Link this account</Primary>
        <Outline onClick={() => setStep(1)}>Change details</Outline>
      </>)}
      {step === 3 && (<>
        <svg viewBox="0 0 120 120" className="mx-auto h-[110px] w-[110px]" aria-hidden="true">
          <circle pathLength="1" cx="60" cy="60" r="52" fill="none" stroke="var(--btn)" strokeWidth="6" style={draw} />
          <path pathLength="1" d="M36 62l16 16 32-34" fill="none" stroke="var(--btn)" strokeWidth="7" style={draw} />
        </svg>
        <div className="text-center"><div className="font-num text-4xl">Account linked</div><div className="text-mute">{bank} · •••• {num.slice(-4)}</div></div>
        <Primary onClick={() => setStep(0)}>Done</Primary>
      </>)}
    </div>
  )
}
