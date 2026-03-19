import { useRef } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { Settings, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import Logo from "@/branding/Logo"
import { useTheme } from "./ThemeProvider"

const navItems = [{ to: "/browse", label: "Browse A-Z", end: false }]

export function TopNav() {
  const { theme } = useTheme()
  const navigate = useNavigate()
  const searchRef = useRef<HTMLInputElement>(null)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = searchRef.current?.value.trim()
    if (q) navigate("/browse")
  }

  return (
    <header className="border-nav-border bg-nav-bg dark:bg-k-ink sticky top-0 z-50 w-full border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-6">
        {/* Left — Logo */}
        <NavLink to="/" className="flex shrink-0 items-center gap-2.5">
          <Logo
            variant="icon"
            theme={
              theme === "dark" ||
              (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark"
                : "light"
            }
            size="sm"
          />
          <span
            className="text-k-text-1 tracking-tight"
            style={{ fontFamily: "var(--k-font-display)", fontSize: 22, fontWeight: 700 }}
          >
            Keertanalu
          </span>
        </NavLink>

        {/* Center — Nav links */}

        {/* Right — compact search + settings */}
        <div className="ml-auto flex items-center gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="border-k-border bg-k-surface-2 flex w-48 items-center gap-2 rounded-full border px-3.5 py-2 transition-all duration-200 focus-within:w-56 focus-within:border-[var(--k-gold)]/60"
          >
            <Search size={13} className="text-k-text-3 shrink-0" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search lyrics…"
              className="w-full bg-transparent text-[13px] text-[var(--k-text-1)] outline-none placeholder:text-[var(--k-text-4)]"
            />
          </form>

          <nav className="flex items-center gap-1">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  cn(
                    "relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-k-text-1"
                      : "text-[var(--k-text-3)] opacity-70 hover:bg-[var(--k-surface-2)] hover:text-[var(--k-text-1)] hover:opacity-100"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-[var(--k-gold)]" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={() => navigate("/settings")}
            className="shrink-0 cursor-pointer rounded-lg p-2 text-[var(--k-text-3)] transition-all duration-200 hover:bg-[var(--k-surface-2)] hover:text-[var(--k-text-1)]"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  )
}
