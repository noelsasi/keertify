import { Outlet } from "react-router-dom"
import { Toaster } from "sonner"
import { ScrollToTop } from "@/components/ScrollToTop"
import { BottomNav } from "./BottomNav"
import { TopNav } from "./TopNav"

export function Layout() {
  return (
    <>
      <ScrollToTop />
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
            background: "var(--k-ink)",
            color: "var(--k-gold-pale)",
            border: "1px solid var(--k-border)",
          },
        }}
      />
    </div>
    </>
  )
}
