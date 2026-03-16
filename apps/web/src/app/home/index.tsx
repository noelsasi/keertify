import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronRight, TrendingUp, Clock, Disc3, Music, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SongCard } from "@/components/SongCard"
import { useAppStore } from "@/store/app.store"
import { useSongs, useDebounce, useAlbums, useArtists } from "@/hooks/useSongs"
import { LANGUAGE_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Category, Album, Artist } from "@/types/song.types"
import { CATEGORY_LABELS } from "@/lib/categories"

const CATEGORIES = ["All", ...Object.keys(CATEGORY_LABELS)].slice(0, 6)

export function Home() {
  const navigate = useNavigate()
  const { language } = useAppStore()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const greetingMessage = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  // Debounce prevents API calls on every keystroke
  const debouncedSearch = useDebounce(search)

  // Use debounced value so both queries flip state at the same moment —
  // filter query never fires until debounce settles, discovery feed stays
  // visible while the user is still typing
  const isFiltering = !!(debouncedSearch || activeCategory !== "All")

  // Filter query — fires only when user is actively searching or filtering
  const { data: filteredData, isLoading: filterLoading } = useSongs(
    {
      language,
      search: debouncedSearch || undefined,
      category:
        activeCategory !== "All"
          ? (CATEGORY_LABELS[activeCategory as Category] as Category)
          : undefined,
      pageSize: 50,
    },
    { enabled: isFiltering }
  )

  // Discovery feed — fires only when idle; mutually exclusive with filter query
  // (exactly 1 API call at any given time)
  const { data: homeData, isLoading: homeLoading } = useSongs(
    { language, pageSize: 10 },
    { enabled: !isFiltering }
  )

  const recentSongs = homeData?.data.slice(0, 3) ?? []
  const trendingSongs = homeData?.data.slice(3, 7) ?? []
  const totalSongs = homeData?.total ?? 0
  const filteredSongs = filteredData?.data ?? []
  const filteredCount = filteredData?.total ?? 0

  const { data: albumsData, isLoading: albumsLoading } = useAlbums(language)
  const { data: artistsData, isLoading: artistsLoading } = useArtists()

  const topAlbums = albumsData?.slice(0, 5) ?? []
  const topArtists = artistsData?.slice(0, 5) ?? []

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* Mobile-only header */}
      <div className="bg-brand-navy px-4 pt-12 pb-5 md:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Keertify</h1>
            <p className="mt-0.5 text-xs text-white/50">Christian Songs</p>
          </div>
          <Badge
            onClick={() => navigate("/settings")}
            className="border-brand-gold/30 bg-brand-gold/20 text-brand-gold hover:bg-brand-gold/30 cursor-pointer px-3 py-2 text-xs font-semibold"
          >
            {LANGUAGE_LABELS[language]}
          </Badge>
        </div>
        <div className="relative">
          <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-white/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs, artists..."
            className="focus-visible:ring-brand-gold/50 rounded-xl border-white/10 bg-white/10 pl-9 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      {/* Desktop header */}
      <div className="mb-8 hidden md:block">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              {greetingMessage} 🎵
            </h1>
            <p className="text-muted-foreground mt-1">
              {LANGUAGE_LABELS[language]} Christian songs
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
            placeholder="Search songs, artists, categories..."
            className="border-border focus-visible:ring-brand-navy/30 h-12 rounded-2xl pl-11 text-base"
          />
        </div>
      </div>

      {/* Category filters */}
      <div className="scrollbar-none border-border flex gap-2 overflow-x-auto border-b px-4 py-3 md:mb-6 md:border-0 md:px-0 md:py-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex-shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 md:py-2 md:text-sm",
              activeCategory === cat
                ? "border-brand-navy bg-brand-navy text-white"
                : "border-border text-muted-foreground hover:border-brand-navy/40 bg-transparent"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 space-y-8 px-4 py-4 md:px-0 md:py-0">
        {/* Search / filter results */}
        {isFiltering && (
          <section>
            <p className="text-muted-foreground mb-3 text-xs md:text-sm">
              {filterLoading
                ? "Searching…"
                : `${filteredCount} result${filteredCount !== 1 ? "s" : ""}${debouncedSearch ? ` for "${debouncedSearch}"` : ""}`}
            </p>
            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {filterLoading ? (
                <SongListSkeleton count={4} />
              ) : filteredSongs.length === 0 ? (
                <div className="text-muted-foreground col-span-2 py-16 text-center text-sm">
                  No songs found
                </div>
              ) : (
                filteredSongs.map((song) => <SongCard key={song.id} song={song} />)
              )}
            </div>
          </section>
        )}

        {/* Default discovery view */}
        {!isFiltering && (
          <>
            <section>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <h2 className="text-foreground text-sm font-semibold md:text-base">
                    Recently Added
                  </h2>
                </div>
                <button
                  onClick={() => navigate("/browse")}
                  className="text-brand-blue flex cursor-pointer items-center gap-0.5 text-xs font-medium md:text-sm"
                >
                  See all <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                {homeLoading ? (
                  <SongListSkeleton count={3} />
                ) : (
                  recentSongs.map((song) => <SongCard key={song.id} song={song} />)
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-gold" />
                <h2 className="text-foreground text-sm font-semibold md:text-base">
                  Trending this week
                </h2>
              </div>
              <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                {homeLoading ? (
                  <SongListSkeleton count={4} />
                ) : (
                  trendingSongs.map((song) => <SongCard key={song.id} song={song} />)
                )}
              </div>
            </section>

            {/* Top Albums */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Disc3 size={16} className="text-brand-blue" />
                <h2 className="text-foreground text-sm font-semibold md:text-base">Top Albums</h2>
              </div>
              <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
                {albumsLoading
                  ? Array.from({ length: 5 }).map((_, i) => <AlbumCardSkeleton key={i} />)
                  : topAlbums.map((album, i) => (
                      <AlbumCard key={album.id} album={album} index={i} />
                    ))}
              </div>
            </section>

            {/* Top Artists */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Users size={16} className="text-brand-gold" />
                <h2 className="text-foreground text-sm font-semibold md:text-base">Top Artists</h2>
              </div>
              <div className="scrollbar-none flex gap-4 overflow-x-auto pb-1">
                {artistsLoading
                  ? Array.from({ length: 5 }).map((_, i) => <ArtistCardSkeleton key={i} />)
                  : topArtists.map((artist, i) => (
                      <ArtistCard key={artist.id} artist={artist} index={i} />
                    ))}
              </div>
            </section>

            {/* Browse CTA — mobile only */}
            <section
              className="bg-brand-navy cursor-pointer rounded-2xl p-5 transition-transform active:scale-[0.98] md:hidden"
              onClick={() => navigate("/browse")}
            >
              <p className="text-base font-semibold text-white">Browse all songs</p>
              <p className="mt-1 text-xs text-white/50">
                {totalSongs}+ {LANGUAGE_LABELS[language]} songs
              </p>
              <div className="text-brand-gold mt-3 flex items-center gap-1 text-xs font-semibold">
                Open library <ChevronRight size={14} />
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function SongListSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border-border bg-muted h-[72px] animate-pulse rounded-xl border" />
      ))}
    </>
  )
}

function AlbumCard({ album, index }: { album: Album; index: number }) {
  const navigate = useNavigate()
  const num = String(index + 1).padStart(2, "0")
  return (
    <div
      onClick={() => navigate(`/albums/${album.slug}`)}
      className="w-[155px] flex-shrink-0 cursor-pointer transition-transform active:scale-[0.97]"
    >
      {/* Card image with overlaid badges */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        {album.albumCoverUrl ? (
          <img src={album.albumCoverUrl} alt={album.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 dark:from-neutral-700 dark:to-neutral-900">
            <Music size={40} className="text-black/20 dark:text-white/30" />
          </div>
        )}
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        {/* Badges */}
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex items-end justify-between gap-1">
          <span className="max-w-[95px] truncate rounded-md bg-black/60 px-2 py-0.5 text-[11px] leading-tight font-bold text-amber-300">
            {album.title}
          </span>
          <span className="flex-shrink-0 rounded-md bg-black/60 px-2 py-0.5 text-sm leading-tight font-black text-white">
            {num}
          </span>
        </div>
      </div>
      <p className="text-muted-foreground mt-2 truncate text-xs">{album.artistName ?? "Various"}</p>
    </div>
  )
}

function AlbumCardSkeleton() {
  return (
    <div className="w-[155px] flex-shrink-0">
      <div className="bg-muted aspect-square w-full animate-pulse rounded-2xl" />
      <div className="bg-muted mt-2 h-3 w-3/5 animate-pulse rounded" />
    </div>
  )
}

function ArtistCard({ artist, index }: { artist: Artist; index: number }) {
  const navigate = useNavigate()
  const num = String(index + 1).padStart(2, "0")
  return (
    <div
      onClick={() => navigate(`/artists/${artist.slug}`)}
      className="w-[155px] flex-shrink-0 cursor-pointer transition-transform active:scale-[0.97]"
    >
      {/* Card image with overlaid badges */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        {artist.avatarUrl ? (
          <img src={artist.avatarUrl} alt={artist.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 dark:from-neutral-700 dark:to-neutral-900">
            <Music size={40} className="text-black/20 dark:text-white/30" />
          </div>
        )}
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        {/* Badges */}
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex items-end justify-between gap-1">
          <span className="flex-shrink-0 rounded-md bg-black/60 px-2 py-0.5 text-sm leading-tight font-black text-white">
            {num}
          </span>
        </div>
      </div>
      <p className="text-muted-foreground mt-2 truncate text-xs">{artist.name ?? "NA"}</p>
    </div>
  )
}

function ArtistCardSkeleton() {
  return (
    <div className="w-[155px] flex-shrink-0">
      <div className="bg-muted aspect-square w-full animate-pulse rounded-2xl" />
      <div className="bg-muted mt-2 h-3 w-3/5 animate-pulse rounded" />
    </div>
  )
}
