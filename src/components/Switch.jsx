export default function Switch({ checked, onChange, label }) {
  return (
    <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className="relative h-11 w-[52px] shrink-0">
      <span className={`absolute left-0 top-2.5 h-6 w-[52px] rounded-full border transition-colors ${checked ? 'border-btn bg-btn' : 'border-line bg-ring'}`} />
      <span className={`absolute left-[3px] top-[13px] h-[18px] w-[18px] rounded-full transition-transform ${checked ? 'translate-x-7 bg-btn-ink' : 'bg-card ring-1 ring-mute'}`} />
    </button>
  )
}
