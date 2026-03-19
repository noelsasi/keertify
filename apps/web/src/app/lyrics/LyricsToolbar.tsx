import { Minus, Plus, Type, Bold, Presentation } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  fontSize: number
  bold: boolean
  onFontDecrease: () => void
  onFontIncrease: () => void
  onBoldToggle: () => void
  onCopy: () => void
  onPresent: () => void
}

export function LyricsToolbar({
  fontSize,
  bold,
  onFontDecrease,
  onFontIncrease,
  onBoldToggle,
  onPresent,
}: Props) {
  return (
    <div className="border-k-border sticky top-0 z-20 mt-5 flex items-center gap-2.5 border-t border-b px-4 py-2.5 md:hidden">
      {/* Font size pill */}
      <div
        className="flex items-center overflow-hidden rounded-sm border border-[var(--k-border)]"
        style={{ height: 28 }}
      >
        <button
          onClick={onFontDecrease}
          className="flex h-full w-8 items-center justify-center bg-[var(--k-surface-2)] text-[var(--k-text-2)] transition-colors hover:bg-[var(--k-border)]"
        >
          <Minus size={11} />
        </button>
        <span className="flex h-full min-w-[44px] items-center justify-center gap-1 border-x border-[var(--k-border)] text-[11px] font-medium text-[var(--k-text-2)]">
          <Type size={9} /> {fontSize}
        </span>
        <button
          onClick={onFontIncrease}
          className="bg-k-surface-2 flex h-full w-8 items-center justify-center text-[var(--k-text-2)] transition-colors hover:bg-[var(--k-border)]"
        >
          <Plus size={11} />
        </button>
      </div>

      {/* Bold */}
      <button
        onClick={onBoldToggle}
        className={cn(
          "flex h-7 items-center rounded-sm border px-2.5 text-[11px] font-bold transition-all duration-150",
          bold
            ? "border-[var(--k-ink)] bg-[var(--k-ink)] text-[var(--k-gold-pale)]"
            : "border-[var(--k-border)] bg-[var(--k-surface-2)] text-[var(--k-text-2)]"
        )}
      >
        <Bold size={11} />
      </button>

      {/* Present */}
      <button
        onClick={onPresent}
        className="bg-k-bg dark:bg-k-gold text-k-ink border-k-border ml-auto flex cursor-pointer items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[11px] font-medium transition-opacity hover:opacity-85"
        title="Present mode (P)"
      >
        <Presentation size={11} />
        Present
      </button>
    </div>
  )
}
