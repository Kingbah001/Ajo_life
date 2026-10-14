import { useNav } from '../lib/nav.jsx'

// Standard screen header: Back on the left, title in the middle, optional action on the right.
export default function Header({ title, right, onBack }) {
  const { back } = useNav()
  return (
    <header className="flex items-center justify-between gap-3">
      <button onClick={onBack || back} className="min-h-11 border border-current px-3 text-[13px] font-semibold">Back</button>
      <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      <div className="flex min-w-[72px] justify-end">{right}</div>
    </header>
  )
}
