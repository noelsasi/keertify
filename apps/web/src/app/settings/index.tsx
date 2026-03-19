import { Check, ArrowLeft, Monitor, Sun, Moon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/store/app.store"
import { useTheme } from "@/components/layouts/ThemeProvider"
import { cn } from "@/lib/utils"
import type { Language } from "@/types/song.types"

type Theme = "light" | "dark" | "system"

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
]

const THEMES: {
  value: Theme
  label: string
  description: string
  icon: React.ElementType
}[] = [
  { value: "light", label: "Light", description: "Always light", icon: Sun },
  { value: "dark", label: "Dark", description: "Always dark", icon: Moon },
  {
    value: "system",
    label: "System",
    description: "Follows your device",
    icon: Monitor,
  },
]

export function Settings() {
  const navigate = useNavigate()
  const { language, setLanguage } = useAppStore()
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* Mobile header */}
      <div className="bg-[var(--k-surface)] border-b border-[var(--k-border)] px-4 pt-12 pb-5 md:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-[var(--k-text-1)]" />
          </button>
          <h1
            className="text-[var(--k-text-1)]"
            style={{ fontFamily: "var(--k-font-display)", fontSize: 22, fontWeight: 500 }}
          >
            Settings
          </h1>
        </div>
      </div>

      {/* Desktop header */}
      <div className="mb-8 hidden md:block">
        <h1
          className="text-[var(--k-text-1)] leading-none"
          style={{ fontFamily: "var(--k-font-display)", fontSize: 44, fontWeight: 400 }}
        >
          Settings
        </h1>
        <p className="mt-2 text-muted-foreground">Manage your preferences</p>
      </div>

      <div className="space-y-8 px-4 py-6 md:max-w-lg md:px-0 md:py-0">
        {/* ── Appearance ───────────────────────────── */}
        <section>
          <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Appearance
          </p>
          <div className="grid grid-cols-3 gap-2">
            {THEMES.map(({ value, label, description, icon: Icon }) => {
              const active = theme === value
              return (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(
                    "flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-3 py-4 transition-all duration-200",
                    active
                      ? "border-[var(--k-ink)] bg-[var(--k-ink)]"
                      : "border-border bg-card text-foreground hover:border-[var(--k-ink)]/40"
                  )}
                >
                  <Icon
                    size={20}
                    className={
                      active ? "text-[var(--k-gold)]" : "text-muted-foreground"
                    }
                  />
                  <span className={cn("text-sm font-semibold", active ? "text-[var(--k-gold-pale)]" : "text-foreground")}>
                    {label}
                  </span>
                  <span
                    className={cn(
                      "text-center text-[10px] leading-tight",
                      active ? "text-[var(--k-text-3)]" : "text-muted-foreground"
                    )}
                  >
                    {description}
                  </span>
                  {active && (
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--k-gold)]" />
                  )}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Tip: press{" "}
            <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">
              D
            </kbd>{" "}
            anywhere to toggle dark mode
          </p>
        </section>

        {/* ── Language ─────────────────────────────── */}
        <section>
          <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Language Preference
          </p>
          <div className="space-y-2">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 transition-all duration-200",
                  language === lang.code
                    ? "border-[var(--k-ink)] bg-[var(--k-ink)]"
                    : "border-border bg-card text-foreground hover:border-[var(--k-ink)]/40"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn("font-semibold", language === lang.code ? "text-[var(--k-gold-pale)]" : "text-foreground")}>
                    {lang.label}
                  </span>
                  <span
                    className={cn(
                      "text-sm",
                      language === lang.code
                        ? "text-[var(--k-text-3)]"
                        : "text-muted-foreground"
                    )}
                  >
                    {lang.native}
                  </span>
                </div>
                {language === lang.code && (
                  <Check size={18} className="text-[var(--k-gold)]" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ── About ────────────────────────────────── */}
        <section>
          <p className="mb-3 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            About
          </p>
          <div className="rounded-xl border border-border bg-card px-4 py-3">
            <p className="text-sm font-semibold">Keertanalu</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Version 1.0.0 · Christian Songs
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
