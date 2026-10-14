const LABEL = { paid: 'Paid', due: 'Due today', late: 'Overdue' }
const STYLE = {
  paid: 'bg-btn text-btn-ink',
  due: 'bg-saf text-[#0F2A24]',
  late: 'bg-coral text-bg',
}
// Always shows a text label, so state never relies on colour alone.
export default function Status({ s }) {
  return <span className={`whitespace-nowrap px-2 py-1 text-xs font-bold ${STYLE[s]}`}>{LABEL[s]}</span>
}
