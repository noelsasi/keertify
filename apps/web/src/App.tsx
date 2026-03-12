import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Layout } from "@/components/layouts/Layout"
import { Home } from "@/app/home"
import { Browse } from "@/app/browse"
import { LyricsPage } from "@/app/lyrics"
import { Favourites } from "@/app/favourites"
import { Settings } from "@/app/settings"

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/song/:slug" element={<LyricsPage />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
