const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del']

export default function Keypad({ onKey }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {KEYS.map((k, i) => k === '' ? <span key="blank" /> : (
        <button key={k} onClick={() => onKey(k)} aria-label={k === 'del' ? 'Delete' : undefined}
          className="min-h-[60px] border border-ink text-[22px]">{k === 'del' ? 'Del' : k}</button>
      ))}
    </div>
  )
}

export function PinDots({ length, filled }) {
  return (
    <div className="flex justify-center gap-4" role="img" aria-label={`${filled} of ${length} digits entered`}>
      {Array.from({ length }, (_, i) => (
        <i key={i} className={`h-[18px] w-[18px] rounded-full border-2 border-ink ${i < filled ? 'bg-ink' : ''}`} />
      ))}
    </div>
  )
}
