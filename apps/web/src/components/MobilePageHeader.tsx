import { ArrowLeft } from "lucide-react"
import ThemeToggle from "./ThemeToggle"

interface Props {
  title: string
  subtitle?: string
  onBack: () => void
  right?: React.ReactNode
}

export function MobilePageHeader({ title, subtitle, onBack }: Props) {
  return (
    <div className="border-k-border bg-k-surface sticky top-0 z-10 border-b px-4 py-3 md:hidden">
      <div className="flex items-center gap-3">
        <button onClick={onBack} aria-label="Go back">
          <ArrowLeft size={22} className="text-k-text-1" />
        </button>
        <div className="min-w-0 flex-1">
          <h2
            className="text-k-text-1 dark:text-k-text-3 truncate"
            style={{ fontFamily: "var(--k-font-display)", fontSize: 18, fontWeight: 500 }}
          >
            {title}
          </h2>
          {subtitle && <p className="text-k-text-3 mt-0.5 text-xs">{subtitle}</p>}
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}
