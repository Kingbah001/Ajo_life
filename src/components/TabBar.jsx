export default function TabBar({ tabs, current, onSelect }) {
  return (
    <nav aria-label="Main" className="fixed bottom-0 left-1/2 flex w-[min(430px,100%)] -translate-x-1/2 border-t border-line bg-card pb-[env(safe-area-inset-bottom)]">
      {tabs.map((t) => (
        <button key={t} onClick={() => onSelect(t)} aria-current={current === t ? 'page' : undefined}
          className={`min-h-[60px] flex-1 text-xs font-semibold ${current === t ? 'font-bold text-btn' : 'text-mute'}`}>{t}</button>
      ))}
    </nav>
  )
}
