import { ArrowLeft } from "lucide-react"

interface Props {
  title: string
  subtitle?: string
  onBack: () => void
  right?: React.ReactNode
}

export function MobilePageHeader({ title, subtitle, onBack, right }: Props) {
  return (
    <div className="border-b border-[var(--k-border)] bg-[var(--k-surface)] px-4 py-3 md:hidden">
      <div className="flex items-center gap-3">
        <button onClick={onBack} aria-label="Go back">
          <ArrowLeft size={22} className="text-[var(--k-text-1)]" />
        </button>
        <div className="min-w-0 flex-1">
          <h1
            className="truncate text-[var(--k-text-1)]"
            style={{ fontFamily: "var(--k-font-display)", fontSize: 22, fontWeight: 500 }}
          >
            {title}
          </h1>
          {subtitle && <p className="mt-0.5 text-xs text-[var(--k-text-3)]">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  )
}
