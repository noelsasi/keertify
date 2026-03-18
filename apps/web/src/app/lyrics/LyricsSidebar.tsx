import { Type, Bold, Minus, Plus, Presentation } from "lucide-react"
import { cn } from "@/lib/utils"
import { READING_MODES, type ReadingMode } from "./constants"

interface Props {
  fontSize: number
  bold: boolean
  readingMode: ReadingMode
  onFontDecrease: () => void
  onFontIncrease: () => void
  onBoldToggle: () => void
  onReadingModeChange: (mode: ReadingMode) => void
  onPresent: () => void
}

export function LyricsSidebar({
  fontSize,
  bold,
  readingMode,
  onFontDecrease,
  onFontIncrease,
  onBoldToggle,
  onReadingModeChange,
  onPresent,
}: Props) {
  return (
    <aside className="sticky top-6 hidden w-48 flex-shrink-0 self-start rounded-2xl border border-border/60 bg-card p-4 shadow-sm md:block">
      {/* Font size */}
      <div className="mb-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          <Type size={11} /> Font Size
        </p>
        <div className="flex items-center justify-between rounded-xl border border-border/60 p-1">
          <button
            onClick={onFontDecrease}
            disabled={fontSize <= 12}
            className="rounded-lg p-1.5 transition-colors hover:bg-muted disabled:opacity-30"
          >
            <Minus size={12} className="text-muted-foreground" />
          </button>
          <span className="text-xs font-semibold text-foreground tabular-nums">
            {fontSize}px
          </span>
          <button
            onClick={onFontIncrease}
            disabled={fontSize >= 28}
            className="rounded-lg p-1.5 transition-colors hover:bg-muted disabled:opacity-30"
          >
            <Plus size={12} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="mb-4 h-px bg-border/50" />

      {/* Bold */}
      <div className="mb-4">
        <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          <Bold size={11} /> Style
        </p>
        <button
          onClick={onBoldToggle}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150",
            bold
              ? "bg-primary/8 text-primary ring-1 ring-primary/15"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Bold size={13} />
          Bold text
          {bold && (
            <span className="ml-auto text-[9px] font-semibold tracking-wider text-primary/60 uppercase">
              On
            </span>
          )}
        </button>
      </div>

      <div className="mb-4 h-px bg-border/50" />

      {/* Reading mode */}
      <div>
        <p className="mb-2.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          Background
        </p>
        <div className="space-y-1">
          {(["light", "warm", "night"] as ReadingMode[]).map((mode) => {
            const cfg = READING_MODES[mode]
            const Icon = cfg.icon
            const isActive = readingMode === mode
            return (
              <button
                key={mode}
                onClick={() => onReadingModeChange(mode)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary/8 text-primary ring-1 ring-primary/15"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span
                  className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-border/60 shadow-sm"
                  style={{ backgroundColor: cfg.swatch }}
                >
                  <Icon
                    size={10}
                    style={{
                      color:
                        mode === "night"
                          ? "#9D8FCC"
                          : mode === "warm"
                            ? "#A06820"
                            : "#9CA3AF",
                    }}
                  />
                </span>
                {cfg.label}
                {isActive && (
                  <span className="ml-auto text-[9px] font-semibold tracking-wider text-primary/60 uppercase">
                    On
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-4 h-px bg-border/50" />

      {/* Present */}
      <div className="mt-4">
        <button
          onClick={onPresent}
          className="flex w-full items-center gap-2.5 rounded-xl bg-brand-blue/10 px-3 py-2.5 text-xs font-medium text-brand-blue transition-colors hover:bg-brand-blue/20"
          title="Present mode (P)"
        >
          <Presentation size={13} />
          Present
        </button>
      </div>
    </aside>
  )
}
