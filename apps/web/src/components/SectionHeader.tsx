import type { LucideIcon } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  title: string
  icon?: LucideIcon
  onSeeAll?: () => void
  className?: string
}

export function SectionHeader({ title, icon: Icon, onSeeAll, className }: Props) {
  return (
    <div className={cn("mb-3 flex items-center justify-between", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[var(--k-gold)]" />}
        <span className="text-[15px] font-medium text-[var(--k-text-1)] md:text-[16px]">{title}</span>
      </div>
      {onSeeAll && (
        <>
          <button
            onClick={onSeeAll}
            className="hidden text-[12px] text-[var(--k-gold)] transition-opacity hover:opacity-70 md:block"
          >
            See all →
          </button>
          <button
            onClick={onSeeAll}
            className="flex items-center gap-0.5 text-[12px] text-[var(--k-gold)] md:hidden"
          >
            See all <ChevronRight size={13} />
          </button>
        </>
      )}
    </div>
  )
}
