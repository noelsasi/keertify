import { Minus, Plus, Type, Bold, Copy, Presentation } from "lucide-react"
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
  onCopy: () => void
  onPresent: () => void
}

export function LyricsToolbar({
  fontSize,
  bold,
  readingMode,
  onFontDecrease,
  onFontIncrease,
  onBoldToggle,
  onReadingModeChange,
  onCopy,
  onPresent,
}: Props) {
  return (
    <div className="border-border bg-background/95 sticky top-0 z-20 flex items-center gap-2.5 border-b px-4 py-2 backdrop-blur-sm md:hidden">
      {/* Font size */}
      <div className="flex items-center gap-1">
        <button
          onClick={onFontDecrease}
          className="hover:bg-muted rounded-lg p-1.5 transition-colors"
        >
          <Minus size={12} className="text-muted-foreground" />
        </button>
        <span className="text-muted-foreground flex w-9 items-center justify-center gap-1 text-xs">
          <Type size={10} /> {fontSize}
        </span>
        <button
          onClick={onFontIncrease}
          className="hover:bg-muted rounded-lg p-1.5 transition-colors"
        >
          <Plus size={12} className="text-muted-foreground" />
        </button>
      </div>

      <div className="bg-border h-4 w-px" />

      {/* Reading mode swatches */}
      <div className="flex items-center gap-1">
        {(["light", "warm", "night"] as ReadingMode[]).map((mode) => {
          const cfg = READING_MODES[mode]
          const Icon = cfg.icon
          return (
            <button
              key={mode}
              onClick={() => onReadingModeChange(mode)}
              title={cfg.label}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200",
                readingMode === mode ? "border-primary/60 scale-110 shadow-sm" : "border-border/60"
              )}
              style={{ backgroundColor: cfg.swatch }}
            >
              <Icon
                size={11}
                style={{
                  color: mode === "night" ? "#9D8FCC" : mode === "warm" ? "#A06820" : "#9CA3AF",
                }}
              />
            </button>
          )
        })}
      </div>

      <div className="bg-border h-4 w-px" />

      {/* Bold */}
      <button
        onClick={onBoldToggle}
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-lg border transition-all duration-150",
          bold
            ? "border-primary/50 bg-primary/8 text-primary"
            : "border-border/60 text-muted-foreground"
        )}
      >
        <Bold size={12} />
      </button>

      {/* Present button */}
      <button
        onClick={onPresent}
        className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 ml-auto flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors"
        title="Present mode (P)"
      >
        <Presentation size={12} />
        <span className="">Present</span>
      </button>

      {/* Copy — far right */}
      <button
        onClick={onCopy}
        className="text-brand-blue hover:bg-brand-blue/20 flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium"
      >
        <Copy size={12} /> Copy
      </button>
    </div>
  )
}
