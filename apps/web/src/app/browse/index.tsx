import { useNavigate } from "react-router-dom"
import { Search, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SongCard } from "@/components/SongCard"
import { useAppStore } from "@/store/app.store"
import { useSongSearch } from "@/hooks/useSongs"
import { LANGUAGE_LABELS } from "@/lib/constants"

export function Browse() {
  const navigate = useNavigate()
  const { language } = useAppStore()

  const { search, setSearch, data, isLoading } = useSongSearch({
    language,
    pageSize: 100, // fetch full library; sorted A-Z client-side
  })

  const songs = [...(data?.data ?? [])].sort((a, b) => a.title.localeCompare(b.title))
  const total = data?.total ?? 0

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
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40" />
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
              {isLoading ? "Loading…" : `${total} ${LANGUAGE_LABELS[language]} songs · A–Z`}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground" />
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
          {isLoading ? "Loading…" : `${songs.length} songs · A–Z`}
        </p>
      </div>

      {/* Song grid */}
      <div className="flex-1 px-4 py-3 md:px-0 md:py-0">
        {isLoading ? (
          <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-xl border border-border bg-muted" />
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">No songs found</div>
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
