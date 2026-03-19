import { cn } from "@/lib/utils"

interface Props {
  variant?: "gold" | "stone" | "crimson"
  dot?: string // CSS color for leading dot
  children: React.ReactNode
  className?: string
}

const VARIANTS = {
  gold: "bg-[var(--k-gold-faint)] border-[var(--k-gold-pale)] text-[var(--k-gold)] dark:border-[rgba(212,169,42,0.25)] dark:bg-[rgba(212,169,42,0.1)]",
  stone: "bg-[var(--k-surface-2)] border-[var(--k-border)] text-[var(--k-text-3)]",
  crimson: "bg-[var(--k-crimson-pale)] border-[var(--k-crimson-pale)] text-[var(--k-crimson)]",
}

export function Pill({ variant = "stone", dot, children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-0.5 text-[10px] font-medium tracking-[1px] uppercase",
        VARIANTS[variant],
        className
      )}
    >
      {dot && <span style={{ color: dot, fontSize: 9 }}>●</span>}
      {children}
    </span>
  )
}
