import { useEffect, useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useUser } from '../lib/user.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useDigits } from '../lib/useDigits.js'
import { money, moneyExact } from '../lib/format.js'
import Header from '../components/Header.jsx'
import Keypad, { PinDots } from '../components/Keypad.jsx'
import { Card, Primary, Outline } from '../components/Buttons.jsx'

const TO = 'Amaka Obi' // the demo has a single saved recipient


function AmountStep({ amt, setAmt, balance, onNext }) {
  const n = +amt || 0
  const press = (k) => setAmt((a) => (k === 'del' ? a.slice(0, -1) : (a + k).replace(/^0+/, '').slice(0, 8)))
  const over = n > balance
  return (
    <>
      <Card><div className="text-sm text-mute">To</div><strong>{TO} · 0123 456 789</strong></Card>
      <div className="text-center">
        <div className="font-num text-[52px] leading-tight tabular-nums">{money(n)}</div>
        <div className="text-sm text-mute">Available {moneyExact(balance)}</div>
        {over && <div className="font-semibold text-coral">That is more than your balance</div>}
      </div>
      <Keypad onKey={press} />
      <Primary onClick={onNext} disabled={n <= 0 || over}>Continue</Primary>
    </>
  )
}

function PinStep({ amount, onOk, onFail }) {
  const { checkPin, pinSet } = useUser()
  const [pin, press, reset] = useDigits(4)
  const [tries, setTries] = useState(3)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (pin.length !== 4) return
    const id = setTimeout(() => {
      if (checkPin(pin)) return onOk()
      const left = tries - 1
      setTries(left); reset()
      if (left <= 0) onFail('Too many wrong attempts.')
      else setErr(`Wrong PIN. ${left} attempt${left > 1 ? 's' : ''} left.`)
    }, 250)
    return () => clearTimeout(id)
  }, [pin])

  return (
    <>
      <Card className="text-center">
        <div className="text-sm text-mute">You are sending</div>
        <div className="font-num text-[38px] tabular-nums">{money(amount)}</div>
        <div className="text-sm text-mute">to {TO} · Fee ₦0</div>
      </Card>
      <h2 className="text-center text-[17px] font-bold">Enter your PIN</h2>
      <PinDots length={4} filled={pin.length} />
      <div className={`text-center text-sm ${err ? 'font-semibold text-coral' : 'text-mute'}`}>
        {err || (pinSet ? 'Enter the PIN you created' : 'Demo PIN is 1234')}
      </div>
      <Keypad onKey={(k) => { setErr(''); press(k) }} />
    </>
  )
}

function Receipt({ amount, info, onDone }) {
  const rows = [
    ['Date', info.at.toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })],
    ['Reference', info.ref], ['Fee', '₦0'], ['Status', 'Completed'],
  ]
  const draw = { strokeDasharray: 1, strokeDashoffset: 1, animation: 'draw .9s ease-out forwards' }
  return (
    <>
      <svg viewBox="0 0 120 120" className="mx-auto h-[120px] w-[120px]" aria-hidden="true">
        <circle pathLength="1" cx="60" cy="60" r="52" fill="none" stroke="var(--btn)" strokeWidth="6" style={draw} />
        <path pathLength="1" d="M36 62l16 16 32-34" fill="none" stroke="var(--btn)" strokeWidth="7" style={draw} />
      </svg>
      <div className="text-center"><div className="font-num text-[40px] tabular-nums">{money(amount)} sent</div><div className="text-mute">to {TO}</div></div>
      <Card>{rows.map(([k, v]) => <div key={k} className="flex justify-between py-1.5"><span className="text-mute">{k}</span><span>{v}</span></div>)}</Card>
      <Primary onClick={onDone}>Done</Primary>
    </>
  )
}

function Failed({ amount, message, onRetry, onHome }) {
  return (
    <>
      <svg viewBox="0 0 120 120" className="mx-auto h-[110px] w-[110px]" aria-hidden="true">
        <circle cx="60" cy="60" r="52" fill="none" stroke="var(--coral)" strokeWidth="6" />
        <path d="M42 42l36 36M78 42L42 78" stroke="var(--coral)" strokeWidth="7" />
      </svg>
      <div className="text-center">
        <h1 className="text-2xl font-bold">Transfer failed</h1>
        <p className="font-semibold text-coral">{message}</p>
        <p className="text-mute">{money(amount)} was not sent. Your money is safe in your wallet.</p>
      </div>
      <Primary onClick={onRetry}>Try again</Primary>
      <Outline onClick={onHome}>Back to home</Outline>
    </>
  )
}

export default function Send() {
  const { go } = useNav()
  const { balance, send } = useWallet()
  const [step, setStep] = useState('amount')
  const [amt, setAmt] = useState('')
  const [info, setInfo] = useState({})
  const amount = +amt || 0

  const confirm = async () => {
    try { setInfo({ ref: await send(amount, TO), at: new Date() }); setStep('done') }
    catch (e) { setInfo({ err: e.message }); setStep('fail') }
  }
  const retry = () => { setAmt(''); setInfo({}); setStep('amount') }

  return (
    <div className="flex flex-col gap-5">
      {step === 'amount' && <Header title="Send money" />}
      {step === 'pin' && <Header title="Confirm transfer" onBack={() => setStep('amount')} />}
      {step === 'amount' && <AmountStep amt={amt} setAmt={setAmt} balance={balance} onNext={() => setStep('pin')} />}
      {step === 'pin' && <PinStep amount={amount} onOk={confirm} onFail={(m) => { setInfo({ err: m }); setStep('fail') }} />}
      {step === 'done' && <Receipt amount={amount} info={info} onDone={() => go('Home')} />}
      {step === 'fail' && <Failed amount={amount} message={info.err} onRetry={retry} onHome={() => go('Home')} />}
    </div>
  )
}
