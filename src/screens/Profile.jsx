import { useState } from 'react'
import { useNav } from '../lib/nav.jsx'
import { useUser, phoneDigits, formatPhone } from '../lib/user.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { useToast } from '../lib/toast.jsx'
import Header from '../components/Header.jsx'
import Switch from '../components/Switch.jsx'
import { Card, Chip, Outline, Primary } from '../components/Buttons.jsx'

const THEMES = [['light', 'Light'], ['dark', 'Dark'], ['system', 'System']]
const PREFS = [['reminders', 'Payment reminders'], ['circles', 'Circle activity'], ['goals', 'Goal milestones']]
const field = 'min-h-12 w-full border border-ink bg-card px-3 text-ink'

const Row = ({ label, children }) => <li className="flex min-h-14 items-center justify-between gap-3 border-b border-line"><span>{label}</span>{children}</li>
const Section = ({ title, children }) => <section><h2 className="text-[17px] font-bold">{title}</h2><ul className="mt-2.5">{children}</ul></section>

export default function Profile() {
  const { go, reset: resetNav } = useNav()
  const user = useUser()
  const { banks } = useWallet()
  const toast = useToast()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name: '', phone: '' })
  const [err, setErr] = useState('')

  const startEdit = () => { setDraft({ name: user.name, phone: user.phone }); setErr(''); setEditing(true) }
  const save = () => {
    const digits = phoneDigits(draft.phone)
    if (draft.phone.trim() && digits.length !== 10) return setErr('Enter a valid number, for example 801 234 5678')
    user.update({ name: draft.name.trim(), phone: draft.phone.trim() ? digits : '' })
    setEditing(false); toast('Profile saved')
  }
  const logout = () => { user.reset(); resetNav('Home'); go('Onboarding'); toast('Logged out') }

  return (
    <div className="flex flex-col gap-6">
      <Header title="Profile" />
      {editing ? (
        <Card className="flex flex-col gap-3">
          <h2 className="text-[17px] font-bold">Edit profile</h2>
          <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">First name</span>
            <input autoFocus className={field} maxLength={20} placeholder="e.g. Ada" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
          <label className="flex flex-col gap-1.5"><span className="text-sm text-mute">Phone number</span>
            <span className="flex gap-2"><span className="grid min-h-12 place-items-center border border-ink bg-card px-3 font-bold">+234</span>
              <input className={`${field} flex-1`} inputMode="tel" placeholder="801 234 5678" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></span>
            {err && <span className="font-semibold text-coral">{err}</span>}</label>
          <div className="flex justify-end gap-2"><Chip onClick={() => setEditing(false)}>Cancel</Chip><Primary onClick={save}>Save</Primary></div>
        </Card>
      ) : (
        <Card className="flex items-center gap-3.5">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full border border-line text-2xl font-bold" aria-hidden="true">{(user.name || 'A')[0].toUpperCase()}</div>
          <div className="min-w-0 flex-1"><h2 className="text-[17px] font-bold">{user.name || 'Add your name'}</h2><div className="text-sm text-mute">{formatPhone(user.phone) || 'No number added'}</div></div>
          <Chip onClick={startEdit}>Edit</Chip>
        </Card>
      )}

      <section><h2 className="text-[17px] font-bold">Appearance</h2>
        <div className="mt-2.5 flex flex-wrap gap-2">{THEMES.map(([k, l]) => <Chip key={k} aria-pressed={user.theme === k} onClick={() => user.update({ theme: k })}>{l}</Chip>)}</div></section>

      <Section title="Security">
        <Row label="Change PIN"><Chip onClick={() => go('ChangePin')}>Change</Chip></Row>
        <Row label="Fingerprint or face unlock"><Switch label="Fingerprint or face unlock" checked={user.bio} onChange={(v) => { user.update({ bio: v }); toast(v ? 'Biometric unlock on (demo)' : 'Biometric unlock off') }} /></Row>
      </Section>
      <Section title="Notifications">
        {PREFS.map(([k, l]) => <Row key={k} label={l}><Switch label={l} checked={user.prefs[k]} onChange={(v) => user.setPref(k, v)} /></Row>)}
      </Section>
      <Section title="Account">
        <Row label="Linked bank account"><Chip onClick={() => go('Banks')}>{banks.length ? 'Manage' : 'Add'}</Chip></Row>
        <Row label="Help and support"><Chip onClick={() => go('Help')}>Open</Chip></Row>
        <Row label="Replay onboarding"><Chip onClick={() => go('Onboarding')}>Replay</Chip></Row>
      </Section>
      <Outline onClick={logout}>Log out</Outline>
    </div>
  )
}
