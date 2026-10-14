import { useNav } from '../lib/nav.jsx'

export default function Placeholder({ name }) {
  const { go } = useNav()
  return (
    <div className="flex flex-col items-start gap-3 py-12">
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-mute">Not ported yet. The working version lives in reference/ajo-prototype.html.</p>
      <button onClick={() => go('Home')} className="min-h-11 border border-current px-4 font-semibold">Back to Home</button>
    </div>
  )
}
