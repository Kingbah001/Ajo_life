export default function Bar({ pct }) {
  const v = Math.min(100, pct)
  return (
    <div role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100} className="h-2 w-full bg-ring">
      <i className="block h-2 bg-saf transition-[width] duration-700" style={{ width: v + '%' }} />
    </div>
  )
}
