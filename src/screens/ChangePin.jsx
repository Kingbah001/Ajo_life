import { useEffect, useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useUser } from '../lib/user.jsx'
import { useToast } from '../lib/toast.jsx'
import { useDigits } from '../lib/useDigits.js'
import Header from '../components/Header.jsx'
import Keypad, { PinDots } from '../components/Keypad.jsx'

const TITLE = { old: 'Enter your current PIN', new: 'Choose a new PIN', conf: 'Confirm your new PIN' }

export default function ChangePin() {
  const { back } = useNav()
  const { checkPin, update } = useUser()
  const toast = useToast()
  const [mode, setMode] = useState('old')
  const [next, setNext] = useState('')
  const [err, setErr] = useState('')
  const [pin, press, reset] = useDigits(4)

  useEffect(() => {
    if (pin.length !== 4) return
    const id = setTimeout(() => {
      if (mode === 'old') { if (checkPin(pin)) { setMode('new'); setErr('') } else setErr('That PIN is wrong.') }
      else if (mode === 'new') { setNext(pin); setMode('conf') }
      else if (pin === next) { update({ pin, pinSet: true }); toast('PIN changed'); return back() }
      else { setErr("PINs don't match. Try again."); setMode('new') }
      reset()
    }, 250)
    return () => clearTimeout(id)
  }, [pin])

  return (
    <div className="flex flex-col gap-5">
      <Header title="Change PIN" />
      <h2 className="text-center text-[17px] font-bold">{TITLE[mode]}</h2>
      <PinDots length={4} filled={pin.length} />
      <div className={`min-h-5 text-center text-sm ${err ? 'font-semibold text-coral' : ''}`}>{err}</div>
      <Keypad onKey={(k) => { setErr(''); press(k) }} />
    </div>
  )
}
