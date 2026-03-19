import { Moon, Sun } from "lucide-react"
import { useTheme } from "./layouts/ThemeProvider"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }
  return (
    <button
      onClick={handleThemeToggle}
      className="border-k-border bg-k-surface-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border"
      aria-label="Toggle theme"
    >
      {theme === "light" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

export default ThemeToggle
