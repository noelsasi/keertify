import { Type, Bold, Minus, Plus, Presentation, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/layouts/ThemeProvider"

interface Props {
  fontSize: number
  bold: boolean
  onFontDecrease: () => void
  onFontIncrease: () => void
  onBoldToggle: () => void
  onPresent: () => void
}

export function LyricsSidebar({
  fontSize,
  bold,
  onFontDecrease,
  onFontIncrease,
  onBoldToggle,
  onPresent,
}: Props) {
  const { theme, setTheme } = useTheme()
  return (
    <aside className="sticky top-20 hidden w-[200px] flex-shrink-0 self-start rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] p-[18px] md:block">
      {/* ── Font Size ── */}
      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-medium tracking-[2.5px] text-[var(--k-text-3)] uppercase">
        <Type size={10} /> Font Size
      </p>
      <div className="flex overflow-hidden rounded-lg border border-[var(--k-border)]">
        <button
          onClick={onFontDecrease}
          disabled={fontSize <= 12}
          className="flex h-[34px] w-[34px] items-center justify-center bg-[var(--k-surface-2)] text-lg text-[var(--k-ink)] transition-colors hover:bg-[var(--k-border)] disabled:opacity-30 dark:text-[var(--k-text-1)]"
        >
          <Minus size={13} />
        </button>
        <span className="flex h-[34px] min-w-[44px] flex-1 items-center justify-center border-x border-[var(--k-border)] text-[13px] font-medium text-[var(--k-ink)] tabular-nums dark:text-[var(--k-text-1)]">
          {fontSize}px
        </span>
        <button
          onClick={onFontIncrease}
          disabled={fontSize >= 28}
          className="flex h-[34px] w-[34px] items-center justify-center bg-[var(--k-surface-2)] text-lg text-[var(--k-ink)] transition-colors hover:bg-[var(--k-border)] disabled:opacity-30 dark:text-[var(--k-text-1)]"
        >
          <Plus size={13} />
        </button>
      </div>

      <div className="my-[14px] h-px bg-[var(--k-border)]" />

      {/* ── Style ── */}
      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-medium tracking-[2.5px] text-[var(--k-text-3)] uppercase">
        <Bold size={10} /> Style
      </p>
      <button
        onClick={onBoldToggle}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all duration-150",
          bold
            ? "bg-[var(--k-ink)] text-[var(--k-gold-pale)] dark:bg-[var(--k-gold)] dark:text-[var(--k-ink)]"
            : "bg-[var(--k-surface-2)] text-[var(--k-text-2)] hover:text-[var(--k-text-1)]"
        )}
      >
        <Bold size={12} />
        Bold text
        {bold && (
          <span className="ml-auto text-[9px] font-semibold tracking-wider uppercase opacity-70">
            On
          </span>
        )}
      </button>

      <div className="my-[14px] h-px bg-[var(--k-border)]" />

      {/* ── Present ── */}
      <button
        onClick={onPresent}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--k-gold-pale)] bg-[var(--k-gold-faint)] px-3 py-2.5 text-[13px] font-medium text-[var(--k-gold)] transition-opacity hover:opacity-80 dark:border-[var(--k-gold)] dark:bg-[var(--k-gold)] dark:text-[var(--k-ink)]"
        title="Present mode (P)"
      >
        <Presentation size={13} />
        Present
      </button>

      <div className="my-[14px] h-px bg-[var(--k-border)]" />

      <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-medium tracking-[2.5px] text-[var(--k-text-3)] uppercase">
        Theme
      </p>
      <button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-all duration-150",
          bold
            ? "text-k-gold-pale bg-[var(--k-ink)] dark:bg-[var(--k-gold)] dark:text-[var(--k-ink)]"
            : "bg-[var(--k-surface-2)] text-[var(--k-text-2)] hover:text-[var(--k-text-1)]"
        )}
      >
        {theme === "light" ? <Sun size={12} /> : <Moon size={12} />}
        {theme === "light" ? "Light Mode" : "Dark Mode"}
      </button>
    </aside>
  )
}
