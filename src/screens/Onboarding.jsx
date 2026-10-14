import { useEffect, useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useUser, phoneDigits } from '../lib/user.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import { useDigits } from '../lib/useDigits.js'
import Keypad, { PinDots } from '../components/Keypad.jsx'
import { CircleRing } from '../components/Rings.jsx'
import { Chip, Outline, Primary } from '../components/Buttons.jsx'

const GOALS = [['Rent', 600000], ['New laptop', 450000], ['Emergency fund', 500000], ['School fees', 300000], ['Travel', 800000], ['Wedding', 1500000], ['Business', 1000000]]
const field = 'min-h-12 w-full border border-ink bg-card px-3 text-ink'

// Steps: 0 phone, 1 code, 2 create PIN, 3 confirm PIN, 4 name and goals, 5 done.
export default function Onboarding() {
  const { reset: resetNav } = useNav()
  const user = useUser()
  const { goals, addGoal } = useWallet()
  const toast = useToast()
  const [step, setStep] = useState(0)
  const [phone, setPhone] = useState('')
  const [err, setErr] = useState('')
  const [wait, setWait] = useState(0)
  const [pin1, setPin1] = useState('')
  const [name, setName] = useState('')
  const [picks, setPicks] = useState([])
  const [made, setMade] = useState(0)
  const [buf, press, clear] = useDigits(step === 1 ? 6 : 4)

  // Resend countdown while on the code step.
  useEffect(() => {
    if (step !== 1) return
    setWait(30)
    const id = setInterval(() => setWait((w) => Math.max(0, w - 1)), 1000)
    return () => clearInterval(id)
  }, [step])

  // Check a code or PIN shortly after the last digit.
  useEffect(() => {
    const max = step === 1 ? 6 : 4
    if (step < 1 || step > 3 || buf.length !== max) return
    const id = setTimeout(() => {
      if (step === 1) { if (buf === '123456') { setStep(2); setErr('') } else setErr('That code is wrong. Try again.') }
      else if (step === 2) { setPin1(buf); setStep(3) }
      else if (buf === pin1) { setStep(4); setErr('') }
      else { setErr("PINs don't match. Start again."); setStep(2); setPin1('') }
      clear()
    }, 250)
    return () => clearTimeout(id)
  }, [buf, step])

  const sendCode = () => {
    if (phoneDigits(phone).length !== 10) return setErr('Enter a valid Nigerian number, for example 801 234 5678')
    setErr(''); clear(); setStep(1)
  }
  const back = () => { setErr(''); clear(); setStep((s) => s - 1) }
  const toggle = (g) => setPicks((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]))
  const finish = async () => {
    const have = goals.map((g) => g.n)
    const fresh = picks.filter((p) => !have.includes(p))
    for (const p of fresh) await addGoal(p, GOALS.find((g) => g[0] === p)[1], '')
    setMade(fresh.length)
    user.update({ name: name.trim(), phone: phoneDigits(phone), pin: pin1, pinSet: true })
    setStep(5)
  }
  const draw = { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw .9s ease-out forwards' }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end gap-2">
        {step > 0 && step < 5 && <Chip onClick={back}>Back</Chip>}
        {step < 5 && <Chip onClick={() => resetNav('Home')}>Skip intro</Chip>}
      </div>

      {step === 0 && (<>
        <div className="font-num text-5xl leading-none">Ajo</div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight">Save together,<br />reach sooner.</h1>
        <p className="text-mute">Set goals, join a circle and watch it grow with people you trust.</p>
        <div className="flex justify-center"><CircleRing size={8} joined={2} swellAt={2} center="" className="h-[140px] w-[140px]" /></div>
        <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Phone number</span>
          <span className="flex gap-2"><span className="grid min-h-12 place-items-center border border-ink bg-card px-3 font-bold">+234</span>
            <input className={`${field} flex-1`} inputMode="tel" autoComplete="tel" placeholder="801 234 5678" value={phone}
              onChange={(e) => setPhone(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendCode()} /></span>
          {err && <span className="font-semibold text-coral">{err}</span>}</label>
        <Primary onClick={sendCode}>Send code</Primary>
        <p className="text-center text-sm text-mute">This is a demo, so no real code is sent.</p>
      </>)}

      {step === 1 && (<>
        <h1 className="text-3xl font-bold tracking-tight">Enter the code</h1>
        <p className="text-mute">We sent a 6-digit code to +234 ••• ••• {phoneDigits(phone).slice(-4)}</p>
        <PinDots length={6} filled={buf.length} />
        <div className={`text-center text-sm ${err ? 'font-semibold text-coral' : 'text-mute'}`}>{err || 'Demo code is 123456'}</div>
        <Keypad onKey={(k) => { setErr(''); press(k) }} />
        <Outline disabled={wait > 0} onClick={() => { setWait(30); toast('New code sent (demo: 123456)') }}>{wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}</Outline>
      </>)}

      {(step === 2 || step === 3) && (<>
        <h1 className="text-3xl font-bold tracking-tight">{step === 2 ? 'Create your PIN' : 'Confirm your PIN'}</h1>
        <p className="text-mute">{step === 2 ? "You'll use this 4-digit PIN to confirm transfers." : 'Enter the same PIN again.'}</p>
        <PinDots length={4} filled={buf.length} />
        <div className={`min-h-5 text-center text-sm ${err ? 'font-semibold text-coral' : ''}`}>{err}</div>
        <Keypad onKey={(k) => { setErr(''); press(k) }} />
      </>)}

      {step === 4 && (<>
        <h1 className="text-3xl font-bold tracking-tight">What are you saving for?</h1>
        <p className="text-mute">Pick as many as you like. You can add more later.</p>
        <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Your first name</span>
          <input className={field} maxLength={20} autoComplete="given-name" placeholder="e.g. Ada" value={name} onChange={(e) => setName(e.target.value)} /></label>
        <div className="flex flex-wrap gap-2">{GOALS.map(([g]) => <Chip key={g} aria-pressed={picks.includes(g)} onClick={() => toggle(g)}>{g}</Chip>)}</div>
        <Primary onClick={finish}>Finish setup</Primary>
      </>)}

      {step === 5 && (<>
        <svg viewBox="0 0 120 120" className="mx-auto h-[110px] w-[110px]" aria-hidden="true">
          <circle pathLength="1" cx="60" cy="60" r="52" fill="none" stroke="var(--btn)" strokeWidth="6" style={draw} />
          <path pathLength="1" d="M36 62l16 16 32-34" fill="none" stroke="var(--btn)" strokeWidth="7" style={draw} />
        </svg>
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">You're all set{name.trim() ? `, ${name.trim()}` : ''}</h1>
          <div className="text-mute">{made ? `We added ${made} new ${made === 1 ? 'goal' : 'goals'} to your wallet.` : 'Your wallet is ready.'}</div>
        </div>
        <Primary onClick={() => resetNav('Home')}>Go to my wallet</Primary>
      </>)}
    </div>
  )
}
