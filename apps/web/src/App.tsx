import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Layout } from "@/components/layouts/Layout"
import { Home } from "@/app/home"
import { Browse } from "@/app/browse"
import { LyricsPage } from "@/app/lyrics"
import { Favourites } from "@/app/favourites"
import { Settings } from "@/app/settings"
import { ArtistPage } from "@/app/artist"
import { AlbumPage } from "@/app/album"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min — matches API Redis cache TTL
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/song/:slug" element={<LyricsPage />} />
            <Route path="/artists/:slug" element={<ArtistPage />} />
            <Route path="/albums/:slug" element={<AlbumPage />} />
            <Route path="/favourites" element={<Favourites />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
