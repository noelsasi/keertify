import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SongCard } from "@/components/SongCard"
import { MobilePageHeader } from "@/components/MobilePageHeader"
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
      <MobilePageHeader
        title={`Browse · ${LANGUAGE_LABELS[language]}`}
        onBack={() => navigate(-1)}
      />

      {/* Mobile search */}
      <div className="px-4 py-4 md:hidden">
        <div className="relative">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--k-text-3)]"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter songs..."
            className="border-[var(--k-border)] bg-[var(--k-surface-2)] pl-9 text-[var(--k-text-1)] placeholder:text-[var(--k-text-4)] focus-visible:ring-[var(--k-gold)]/30"
          />
        </div>
      </div>

      {/* Desktop header */}
      <div className="mb-8 hidden md:block">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1
              className="leading-none text-[var(--k-text-1)]"
              style={{ fontFamily: "var(--k-font-display)", fontSize: 44, fontWeight: 400 }}
            >
              Browse
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLoading ? "Loading…" : `${total} ${LANGUAGE_LABELS[language]} songs · A–Z`}
            </p>
          </div>
        </div>
        <div className="relative">
          <Search
            size={18}
            className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or artist..."
            className="h-12 rounded-2xl border-[var(--k-border)] bg-[var(--k-surface)] pl-11 text-base focus-visible:ring-[var(--k-gold)]/30"
          />
        </div>
      </div>

      {/* Mobile count bar */}
      <div className="border-b border-[var(--k-border)] px-4 py-3 md:hidden">
        <p className="text-muted-foreground text-xs">
          {isLoading ? "Loading…" : `${songs.length} songs · A–Z`}
        </p>
      </div>

      {/* Song grid */}
      <div className="flex-1 px-4 py-3 md:px-0 md:py-0">
        {isLoading ? (
          <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="border-border bg-muted h-[72px] animate-pulse rounded-xl border"
              />
            ))}
          </div>
        ) : songs.length === 0 ? (
          <div className="text-muted-foreground py-16 text-center text-sm">No songs found</div>
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
