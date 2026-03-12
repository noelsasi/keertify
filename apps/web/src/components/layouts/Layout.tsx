import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { BottomNav } from "./BottomNav"
import { TopNav } from "./TopNav"

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop — top navbar + full content area */}
      <div className="hidden min-h-screen md:flex md:flex-col">
        <TopNav />
        <main className="flex-1">
          <div className="mx-auto max-w-5xl px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile — bottom nav */}
      <div className="md:hidden">
        <main className="pb-20">
          <Outlet />
        </main>
        <BottomNav />
      </div>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.04 264)",
            color: "white",
            border: "1px solid oklch(1 0 0 / 10%)",
          },
        }}
      />
    </div>
  )
}
