import { Home, Music2, Heart, Settings } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/ui.store"

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/browse", icon: Music2, label: "Browse" },
  { to: "/favourites", icon: Heart, label: "Saved" },
  { to: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const { isPresenting } = useUIStore()

  if (isPresenting) return null

  return (
    <nav className="bg-k-surface border-k-border fixed right-0 bottom-0 left-0 z-50 border-t shadow-[0_-4px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_40px_rgba(0,0,0,0.6)]">
      <div className="mx-auto w-full max-w-md">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-nav-foreground flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all duration-200",
                  isActive ? "text-k-gold" : "opacity-60 hover:opacity-90"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                    className="transition-all duration-200"
                  />
                  <span className="text-[10px] font-medium tracking-wide">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
        {/* iOS safe area */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </nav>
  )
}
