import { useState, useMemo } from "react"
import { Search, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { SongCard } from "@/components/SongCard"
import { useAppStore } from "@/store/app.store"
import { MOCK_SONGS, LANGUAGE_LABELS } from "@/lib/mock-data"

export function Browse() {
  const navigate = useNavigate()
  const { language } = useAppStore()
  const [search, setSearch] = useState("")

  const songs = useMemo(() => {
    return MOCK_SONGS.filter((s) => {
      const matchesLang = s.language === language
      const matchesSearch =
        search === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.artist.toLowerCase().includes(search.toLowerCase())
      return matchesLang && matchesSearch
    }).sort((a, b) => a.title.localeCompare(b.title))
  }, [language, search])

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* Mobile header */}
      <div className="bg-brand-navy px-4 pt-12 pb-4 md:hidden">
        <div className="mb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">
            Browse · {LANGUAGE_LABELS[language]}
          </h1>
        </div>
        <div className="relative">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter songs..."
            className="rounded-xl border-white/10 bg-white/10 pl-9 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Desktop header */}
      <div className="mb-8 hidden md:block">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Browse</h1>
            <p className="mt-1 text-muted-foreground">
              {songs.length} {LANGUAGE_LABELS[language]} songs · A–Z
            </p>
          </div>
        </div>
        <div className="relative">
          <Search
            size={18}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or artist..."
            className="h-12 rounded-2xl pl-11 text-base"
          />
        </div>
      </div>

      {/* Mobile count bar */}
      <div className="border-b border-border px-4 py-3 md:hidden">
        <p className="text-xs text-muted-foreground">
          {songs.length} songs · A–Z
        </p>
      </div>

      {/* Song grid */}
      <div className="flex-1 px-4 py-3 md:px-0 md:py-0">
        {songs.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No songs found
          </div>
        ) : (
          <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
