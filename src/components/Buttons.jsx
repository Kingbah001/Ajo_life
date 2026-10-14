export const Card = ({ children, className = '' }) => <div className={`border border-line bg-card p-4 ${className}`}>{children}</div>
export const Primary = (p) => <button {...p} className="min-h-11 bg-btn px-[18px] font-bold text-btn-ink disabled:opacity-60" />
export const Outline = (p) => <button {...p} className="min-h-11 border border-current px-[18px] font-semibold" />
export const Chip = (p) => <button {...p} className="min-h-11 border border-current px-3 text-[13px] font-semibold aria-pressed:bg-ink aria-pressed:text-bg" />
