import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronRight, TrendingUp, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SongCard } from "@/components/SongCard"
import { useAppStore } from "@/store/app.store"
import { MOCK_SONGS, LANGUAGE_LABELS } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

const CATEGORIES = ["All", "Praise", "Worship", "Hymn", "Christmas"]

export function Home() {
  const navigate = useNavigate()
  const { language } = useAppStore()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const filtered = useMemo(() => {
    return MOCK_SONGS.filter((s) => {
      const matchesLang = s.language === language
      const matchesCat =
        activeCategory === "All" || s.category === activeCategory
      const matchesSearch =
        search === "" ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.artist.toLowerCase().includes(search.toLowerCase())
      return matchesLang && matchesCat && matchesSearch
    })
  }, [language, activeCategory, search])

  const recentSongs = MOCK_SONGS.filter((s) => s.language === language).slice(
    0,
    3
  )

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* Mobile-only header */}
      <div className="bg-brand-navy px-4 pt-12 pb-5 md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Keertify
            </h1>
            <p className="mt-0.5 text-xs text-white/50">Christian Songs</p>
          </div>
          <Badge
            onClick={() => navigate("/settings")}
            className="cursor-pointer border-brand-gold/30 bg-brand-gold/20 px-3 py-2 text-xs font-semibold text-brand-gold hover:bg-brand-gold/30"
          >
            {LANGUAGE_LABELS[language]}
          </Badge>
        </div>
        {/* Mobile search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs, artists..."
            className="rounded-xl border-white/10 bg-white/10 pl-9 text-white placeholder:text-white/40 focus-visible:ring-brand-gold/50"
          />
        </div>
      </div>

      {/* Desktop header */}
      <div className="mb-8 hidden md:block">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Good morning 🎵
            </h1>
            <p className="mt-1 text-muted-foreground">
              {LANGUAGE_LABELS[language]} Christian songs
            </p>
          </div>
          <Badge
            onClick={() => navigate("/settings")}
            className="cursor-pointer border-brand-navy bg-brand-navy px-4 py-3 text-sm font-semibold text-white hover:bg-brand-navy/90"
          >
            {LANGUAGE_LABELS[language]}
          </Badge>
        </div>

        {/* Desktop search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs, artists, categories..."
            className="h-12 rounded-2xl border-border pl-11 text-base focus-visible:ring-brand-navy/30"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto border-b border-border px-4 py-3 md:mb-6 md:border-0 md:px-0 md:py-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex-shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 md:py-2 md:text-sm",
              activeCategory === cat
                ? "border-brand-navy bg-brand-navy text-white"
                : "border-border bg-transparent text-muted-foreground hover:border-brand-navy/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-8 px-4 py-4 md:px-0 md:py-0">
        {/* Search results */}
        {search && (
          <section>
            <p className="mb-3 text-xs text-muted-foreground md:text-sm">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
              {search}"
            </p>
            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {filtered.length === 0 ? (
                <div className="col-span-2 py-16 text-center text-sm text-muted-foreground">
                  No songs found
                </div>
              ) : (
                filtered.map((song) => <SongCard key={song.id} song={song} />)
              )}
            </div>
          </section>
        )}

        {/* Category filtered */}
        {!search && activeCategory !== "All" && (
          <section>
            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {filtered.map((song) => (
                <SongCard key={song.id} song={song} />
              ))}
            </div>
          </section>
        )}

        {/* Default view */}
        {!search && activeCategory === "All" && (
          <>
            {/* Recently Added */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground md:text-base">
                    Recently Added
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/browse")}
                  className="flex cursor-pointer items-center gap-0.5 text-xs font-medium text-brand-blue md:text-sm"
                >
                  See all <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                {recentSongs.map((song) => (
                  <SongCard key={song.id} song={song} />
                ))}
              </div>
            </section>

            {/* Trending */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-gold" />
                <h2 className="text-sm font-semibold text-foreground md:text-base">
                  Trending this week
                </h2>
              </div>
              <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                {MOCK_SONGS.filter((s) => s.language === language)
                  .slice(0, 4)
                  .map((song) => (
                    <SongCard key={song.id} song={song} />
                  ))}
              </div>
            </section>

            {/* Browse CTA — mobile only */}
            <section
              className="cursor-pointer rounded-2xl bg-brand-navy p-5 transition-transform active:scale-[0.98] md:hidden"
              onClick={() => navigate("/browse")}
            >
              <p className="text-base font-semibold text-white">
                Browse all songs
              </p>
              <p className="mt-1 text-xs text-white/50">
                {MOCK_SONGS.filter((s) => s.language === language).length}+{" "}
                {LANGUAGE_LABELS[language]} songs
              </p>
              <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-gold">
                Open library <ChevronRight size={14} />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
