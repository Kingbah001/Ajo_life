import { useNav } from '../lib/nav.jsx'
import { useNotify } from '../lib/notify.jsx'
import { useWallet } from '../lib/wallet.jsx'
import { ago, dayLabel } from '../lib/format.js'
import Header from '../components/Header.jsx'
import { Chip } from '../components/Buttons.jsx'

export default function Notifications() {
  const { go } = useNav()
  const { list, unread, read, readAll } = useNotify()
  const { circles } = useWallet()

  const open = (n) => {
    read(n.id)
    if (!n.go) return
    // A circle may have been left or cancelled since the notification was created.
    if (n.go.name === 'CircleRoom' && !circles.some((c) => c.code === n.go.params.code)) return go('Circles')
    go(n.go.name, n.go.params)
  }
  const groups = list.reduce((acc, n) => {
    const label = dayLabel(n.at), last = acc[acc.length - 1]
    if (last && last.label === label) last.items.push(n)
    else acc.push({ label, items: [n] })
    return acc
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <Header title="Notifications" right={<Chip onClick={readAll} disabled={!unread}>Mark all read</Chip>} />
      {groups.length ? groups.map((g) => (
        <section key={g.label}>
          <h2 className="pb-1 text-sm font-normal text-mute">{g.label}</h2>
          {g.items.map((n) => (
            <button key={n.id} onClick={() => open(n)} className="flex w-full items-start gap-3 border-b border-line py-3 text-left">
              <i className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${n.unread ? 'bg-saf' : ''}`} aria-hidden="true" />
              <span className="flex flex-col gap-0.5">
                <span className={n.unread ? 'font-bold' : ''}>{n.title}{n.unread && <span className="sr-only"> (unread)</span>}</span>
                <span className="text-sm text-mute">{n.sub} · {ago(n.at)}</span>
              </span>
            </button>
          ))}
        </section>
      )) : <p className="py-8 text-center text-mute">You are all caught up.</p>}
    </div>
  )
}
