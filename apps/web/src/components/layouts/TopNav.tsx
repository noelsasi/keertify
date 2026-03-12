import { NavLink, useNavigate } from "react-router-dom"
import { Settings, Music } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/browse", label: "Browse", end: false },
]

export function TopNav() {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-nav-border bg-nav-bg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6">
        {/* Left — Logo */}
        <NavLink to="/" className="flex flex-shrink-0 items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gold/20">
            <Music size={16} className="text-brand-gold" />
          </div>
          <span className="text-lg font-bold tracking-tight text-nav-foreground">
            Keertify
          </span>
        </NavLink>

        {/* Center — Nav links */}
        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "relative rounded-lg px-4 py-2 text-sm font-medium text-nav-foreground transition-all duration-200",
                  isActive
                    ? "opacity-100"
                    : "opacity-60 hover:bg-black/5 hover:opacity-90 dark:hover:bg-white/10 dark:hover:opacity-90"
                )
              }
            >
              {({ isActive }) => (
                <>
                  {label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2 rounded-full bg-brand-gold" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right — Settings icon */}
        <button
          onClick={() => navigate("/settings")}
          className="flex-shrink-0 rounded-lg p-2 text-nav-foreground/60 transition-all duration-200 hover:bg-black/5 hover:text-nav-foreground dark:hover:bg-white/10 dark:hover:text-nav-foreground"
          aria-label="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    </header>
  )
}
