import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronRight, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SongCard } from "@/components/SongCard"
import { LogoIcon } from "@/components/LogoIcon"
import { useAppStore } from "@/store/app.store"
import { useSongs, useDebounce, useAlbums, useArtists } from "@/hooks/useSongs"
import { LANGUAGE_LABELS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { Category, Album, Artist } from "@/types/song.types"
import { CATEGORY_LABELS } from "@/lib/categories"

const CATEGORIES = ["All", ...Object.keys(CATEGORY_LABELS)].slice(0, 8)

const VERSE = {
  text: "Sing to the Lord a new song; sing to the Lord, all the earth.",
  ref: "Psalm 96:1",
}

const LANGUAGE_CARDS = [
  {
    code: "te",
    native: "తెలుగు",
    label: "Telugu",
    style: {
      bg: "var(--k-ink)",
      text: "var(--k-gold-light)",
      sub: "var(--k-text-3)",
    },
  },
  {
    code: "ta",
    native: "தமிழ்",
    label: "Tamil",
    style: {
      bg: "var(--k-gold-faint)",
      border: "1px solid var(--k-gold-pale)",
      text: "var(--k-ink)",
      sub: "var(--k-text-3)",
    },
  },
  {
    code: "hi",
    native: "हिन्दी",
    label: "Hindi",
    style: {
      bg: "var(--k-crimson-pale)",
      border: "1px solid #E8C0C8",
      text: "var(--k-crimson)",
      sub: "var(--k-crimson)",
    },
  },
  {
    code: "en",
    native: "English",
    label: "English",
    style: {
      bg: "var(--k-surface-2)",
      border: "1px solid var(--k-border)",
      text: "var(--k-text-3)",
      sub: "var(--k-text-4)",
    },
  },
]


export function Home() {
  const navigate = useNavigate()
  const { language, setLanguage } = useAppStore()
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")

  const greetingMessage = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }, [])

  const debouncedSearch = useDebounce(search)
  const isFiltering = !!(debouncedSearch || activeCategory !== "All")

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

  const { data: homeData, isLoading: homeLoading } = useSongs(
    { language, pageSize: 10 },
    { enabled: !isFiltering }
  )

  const recentSongs = homeData?.data.slice(0, 3) ?? []
  const trendingSongs = homeData?.data.slice(3, 6) ?? []
  const totalSongs = homeData?.total ?? 0
  const filteredSongs = filteredData?.data ?? []
  const filteredCount = filteredData?.total ?? 0

  const { data: albumsData } = useAlbums(language)
  const { data: artistsData, isLoading: artistsLoading } = useArtists()

  const topAlbums = albumsData?.slice(0, 5) ?? []
  const topArtists = artistsData?.slice(0, 6) ?? []

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">

      {/* ══════════════════════════════════════
          MOBILE HEADER — logo + settings icon
      ══════════════════════════════════════ */}
      <div className="bg-[var(--k-surface)] border-b border-[var(--k-border)] px-5 py-3.5 flex items-center justify-between md:hidden">
        <div className="flex items-center gap-2.5">
          <LogoIcon size={32} />
          <span
            className="text-[var(--k-text-1)] leading-none"
            style={{ fontFamily: "var(--k-font-display)", fontSize: 20, fontWeight: 500 }}
          >
            Keert<span style={{ color: "var(--k-gold)" }}>a</span>nalu
          </span>
        </div>
        <button
          onClick={() => navigate("/settings")}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--k-border)] bg-[var(--k-surface-2)]"
          aria-label="Settings"
        >
          <Settings size={14} className="text-[var(--k-text-3)]" />
        </button>
      </div>

      {/* ══════════════════════════════════════
          MOBILE HERO — greeting + headline + search
      ══════════════════════════════════════ */}
      <div className="bg-[var(--k-bg)] px-5 pt-6 pb-4 md:hidden">
        <p
          className="mb-1.5 text-[var(--k-text-3)]"
          style={{ fontSize: 11, fontWeight: 400, letterSpacing: "3px", textTransform: "uppercase" }}
        >
          {greetingMessage}
        </p>
        <h1
          className="mb-4 leading-tight text-[var(--k-text-1)]"
          style={{ fontFamily: "var(--k-font-display)", fontSize: 34, fontWeight: 400, letterSpacing: "-0.5px" }}
        >
          {LANGUAGE_LABELS[language]} Christian<br />
          <em style={{ color: "var(--k-gold)" }}>Lyrics</em>
        </h1>
        <div className="flex items-center gap-2.5 rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] px-4 py-3">
          <Search size={15} className="flex-shrink-0 text-[var(--k-text-4)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search songs, artists…"
            className="flex-1 bg-transparent text-[14px] text-[var(--k-text-1)] placeholder:text-[var(--k-text-4)] outline-none"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP HERO — 2-column layout
      ══════════════════════════════════════ */}
      <div className="mb-0 hidden md:block">
        <div className="flex items-start justify-between gap-10 pb-8 pt-10">
          {/* Left column */}
          <div className="min-w-0 flex-1">
            <p
              className="mb-2.5 text-[var(--k-text-3)]"
              style={{ fontSize: 12, fontWeight: 400, letterSpacing: "3px", textTransform: "uppercase" }}
            >
              {greetingMessage}
            </p>
            <h1
              className="mb-2 leading-tight text-[var(--k-text-1)]"
              style={{ fontFamily: "var(--k-font-display)", fontSize: 52, fontWeight: 400, letterSpacing: "-1px" }}
            >
              {LANGUAGE_LABELS[language]} Christian
              <br />
              <em style={{ color: "var(--k-gold)", fontStyle: "italic" }}>Lyrics &amp; Songs</em>
            </h1>
            <p className="mb-7 max-w-md text-[15px] leading-relaxed text-[var(--k-text-3)]">
              Your complete keertana companion. Browse thousands of devotional lyrics in Telugu,
              Tamil, Hindi and English.
            </p>

            {/* Hero search bar */}
            <div className="mb-7 flex max-w-lg items-center gap-3 rounded-full border border-[var(--k-border)] bg-[var(--k-surface)] px-5 py-3.5">
              <Search size={16} className="flex-shrink-0 text-[var(--k-text-3)]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search songs, artists, categories…"
                className="flex-1 border-0 bg-transparent p-0 text-[14px] text-[var(--k-text-1)] placeholder:text-[var(--k-text-4)] shadow-none outline-none ring-0 focus-visible:ring-0"
              />
              <span
                className="flex-shrink-0 rounded px-2 py-0.5 text-[11px] text-[var(--k-text-4)]"
                style={{ border: "1px solid var(--k-border)", letterSpacing: "0.5px" }}
              >
                ⌘K
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8">
              <div>
                <p
                  className="text-[var(--k-text-1)] leading-none"
                  style={{ fontFamily: "var(--k-font-display)", fontSize: 28, fontWeight: 500 }}
                >
                  {totalSongs > 0 ? `${totalSongs}` : "2,400"}
                  <span style={{ color: "var(--k-gold)" }}>+</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-[var(--k-text-3)]">Songs</p>
              </div>
              <div className="h-8 w-px bg-[var(--k-border)]" />
              <div>
                <p
                  className="text-[var(--k-text-1)] leading-none"
                  style={{ fontFamily: "var(--k-font-display)", fontSize: 28, fontWeight: 500 }}
                >
                  4{" "}
                  <span style={{ fontSize: 18, color: "var(--k-gold)" }}>Languages</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-[var(--k-text-3)]">
                  Telugu · Tamil · Hindi · English
                </p>
              </div>
              <div className="h-8 w-px bg-[var(--k-border)]" />
              <div>
                <p
                  className="text-[var(--k-text-1)] leading-none"
                  style={{ fontFamily: "var(--k-font-display)", fontSize: 28, fontWeight: 500 }}
                >
                  {artistsData ? `${artistsData.length}` : "120"}
                  <span style={{ color: "var(--k-gold)" }}>+</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-[var(--k-text-3)]">Artists</p>
              </div>
            </div>
          </div>

          {/* Right column — Verse of the day */}
          <div className="flex-shrink-0 w-[280px]">
            <div
              className="rounded-2xl p-7"
              style={{ background: "var(--k-ink)" }}
            >
              <p
                className="mb-3.5 text-[10px] uppercase tracking-[3px]"
                style={{ color: "var(--k-text-3)" }}
              >
                Verse of the day
              </p>
              <p
                className="mb-3.5 leading-relaxed"
                style={{
                  fontFamily: "var(--k-font-display)",
                  fontSize: 17,
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "var(--k-gold-pale)",
                }}
              >
                "{VERSE.text}"
              </p>
              <p className="text-[11px] tracking-wide text-[var(--k-text-3)]">{VERSE.ref}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CATEGORY CHIPS
      ══════════════════════════════════════ */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto px-5 py-3 md:border-0 md:px-0 md:pb-6 md:pt-0">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "flex-shrink-0 rounded-full border px-4 py-1.5 text-[13px] transition-all duration-200",
              activeCategory === cat
                ? "border-[var(--k-ink)] bg-[var(--k-ink)] text-[var(--k-gold-pale)] dark:border-[var(--k-gold)] dark:bg-[var(--k-gold)] dark:text-[var(--k-ink)]"
                : "border-[var(--k-border)] bg-[var(--k-surface)] text-[var(--k-text-3)] hover:border-[var(--k-ink)] hover:text-[var(--k-text-1)]"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          CONTENT
      ══════════════════════════════════════ */}
      <div className="flex-1 px-5 py-5 md:px-0 md:py-0">
        {/* ── Search / filter results ── */}
        {isFiltering && (
          <section>
            <p className="mb-3 text-xs text-muted-foreground">
              {filterLoading
                ? "Searching…"
                : `${filteredCount} result${filteredCount !== 1 ? "s" : ""}${debouncedSearch ? ` for "${debouncedSearch}"` : ""}`}
            </p>
            <div className="space-y-2 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
              {filterLoading ? (
                <SongListSkeleton count={4} />
              ) : filteredSongs.length === 0 ? (
                <div className="col-span-2 py-16 text-center text-sm text-muted-foreground">
                  No songs found
                </div>
              ) : (
                filteredSongs.map((song) => <SongCard key={song.id} song={song} />)
              )}
            </div>
          </section>
        )}

        {/* ── Discovery feed ── */}
        {!isFiltering && (
          <div className="md:space-y-0">

            {/* Desktop: 2-column content grid */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-x-10 md:gap-y-10 md:pb-10">

              {/* Col 1: Recently Added */}
              <section>
                <SectionHeader
                  title="Recently Added"
                  onSeeAll={() => navigate("/browse")}
                />
                <div className="space-y-2">
                  {homeLoading ? (
                    <SongListSkeleton count={3} />
                  ) : (
                    recentSongs.map((song) => <SongCard key={song.id} song={song} />)
                  )}
                </div>
              </section>

              {/* Col 2: Trending */}
              <section>
                <SectionHeader
                  title="Trending this week"
                  onSeeAll={() => navigate("/browse")}
                />
                <div className="space-y-2">
                  {homeLoading ? (
                    <SongListSkeleton count={3} />
                  ) : (
                    trendingSongs.map((song) => <SongCard key={song.id} song={song} />)
                  )}
                </div>
              </section>

              {/* Col 1: Top Artists (pills) */}
              <section>
                <SectionHeader title="Top Artists" onSeeAll={() => navigate("/browse")} />
                <div className="flex flex-wrap gap-2">
                  {artistsLoading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-14 w-48 animate-pulse rounded-xl bg-muted" />
                      ))
                    : topArtists.map((artist) => (
                        <ArtistPill key={artist.id} artist={artist} />
                      ))}
                </div>
              </section>

              {/* Col 2: Browse by language */}
              <section>
                <SectionHeader title="Browse by language" />
                <div className="grid grid-cols-2 gap-2.5">
                  {LANGUAGE_CARDS.map((card, i) => (
                    <LanguageCard
                      key={card.code}
                      card={card}
                      onClick={() => {
                        setLanguage(card.code as "te" | "en" | "hi" | "ta" | "ml")
                        navigate("/browse")
                      }}
                    />
                  ))}
                </div>
              </section>

            </div>

            {/* Desktop: Top Albums — full width below */}
            {topAlbums.length > 0 && (
              <section className="hidden md:block md:pb-10">
                <SectionHeader title="Top Albums" />
                <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
                  {topAlbums.map((album, i) => (
                    <AlbumCard key={album.id} album={album} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* ─── MOBILE content (stacked) ─── */}
            <div className="space-y-7 md:hidden">

              {/* Recently Added */}
              <section>
                <MobileSectionHeader title="Recently Added" onSeeAll={() => navigate("/browse")} />
                <div className="space-y-2">
                  {homeLoading ? <SongListSkeleton count={2} /> : recentSongs.map((s) => <SongCard key={s.id} song={s} />)}
                </div>
              </section>

              {/* Trending */}
              <section>
                <MobileSectionHeader title="Trending this week" onSeeAll={() => navigate("/browse")} />
                <div className="space-y-2">
                  {homeLoading ? <SongListSkeleton count={2} /> : trendingSongs.map((s) => <SongCard key={s.id} song={s} />)}
                </div>
              </section>

              {/* Verse of the day — mobile */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "var(--k-ink)" }}
              >
                <p
                  className="mb-2.5 text-[10px] uppercase tracking-[3px]"
                  style={{ color: "var(--k-text-3)" }}
                >
                  Verse of the day
                </p>
                <p
                  className="mb-2.5 leading-relaxed"
                  style={{
                    fontFamily: "var(--k-font-display)",
                    fontSize: 16,
                    fontWeight: 400,
                    fontStyle: "italic",
                    color: "var(--k-gold-pale)",
                    lineHeight: 1.6,
                  }}
                >
                  "{VERSE.text}"
                </p>
                <p className="text-[11px] tracking-wide text-[var(--k-text-3)]">{VERSE.ref}</p>
              </div>

              {/* Browse by language — mobile */}
              <section>
                <MobileSectionHeader title="Browse by language" />
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGE_CARDS.map((card, i) => (
                    <LanguageCard
                      key={card.code}
                      card={card}
                      onClick={() => {
                        setLanguage(card.code as "te" | "en" | "hi" | "ta" | "ml")
                        navigate("/browse")
                      }}
                    />
                  ))}
                </div>
              </section>

            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Sub-components ───────────────────────────────── */

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="mb-3.5 flex items-center justify-between">
      <span className="text-[16px] font-medium text-[var(--k-text-1)]">{title}</span>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="text-[12px] text-[var(--k-gold)] transition-opacity hover:opacity-70"
        >
          See all →
        </button>
      )}
    </div>
  )
}

function MobileSectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <span className="text-[15px] font-medium text-[var(--k-text-1)]">{title}</span>
      {onSeeAll && (
        <button
          onClick={onSeeAll}
          className="flex items-center gap-0.5 text-[12px] text-[var(--k-gold)]"
        >
          See all <ChevronRight size={13} />
        </button>
      )}
    </div>
  )
}

function ArtistPill({ artist }: { artist: Artist }) {
  const navigate = useNavigate()
  const initials = artist.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div
      onClick={() => navigate(`/artists/${artist.slug}`)}
      className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--k-border)] bg-[var(--k-surface)] px-3.5 py-2.5 transition-opacity hover:opacity-80 active:scale-[0.98]"
    >
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-[13px] font-medium"
        style={{
          background: "var(--k-gold-faint)",
          color: "var(--k-gold)",
          border: "1px solid var(--k-gold-pale)",
        }}
      >
        {artist.avatarUrl ? (
          <img src={artist.avatarUrl} alt={artist.name} className="h-full w-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-[13px] font-medium text-[var(--k-text-1)]">{artist.name}</p>
      </div>
    </div>
  )
}


function LanguageCard({
  card,
  onClick,
}: {
  card: (typeof LANGUAGE_CARDS)[0]
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`lang-card-${card.code} rounded-xl p-4 text-left transition-opacity hover:opacity-90 active:scale-[0.98]`}
    >
      <p
        className="mb-1 leading-none text-[var(--lc-text)]"
        style={{ fontFamily: "var(--k-font-display)", fontSize: 22 }}
      >
        {card.native}
      </p>
      <p className="text-[12px] text-[var(--lc-sub)]">{card.label}</p>
    </button>
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
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        {album.albumCoverUrl ? (
          <img src={album.albumCoverUrl} alt={album.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--k-surface-2)]">
            <span className="text-3xl text-[var(--k-text-4)]">♪</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute right-2.5 bottom-2.5 left-2.5 flex items-end justify-between gap-1">
          <span className="max-w-[95px] truncate rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold leading-tight text-[var(--k-gold-pale)]">
            {album.title}
          </span>
          <span className="flex-shrink-0 rounded-md bg-black/60 px-2 py-0.5 text-sm font-black leading-tight text-white">
            {num}
          </span>
        </div>
      </div>
      <p className="mt-2 truncate text-xs text-muted-foreground">{album.artistName ?? "Various"}</p>
    </div>
  )
}

function SongListSkeleton({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-[68px] animate-pulse rounded-xl border border-border bg-muted" />
      ))}
    </>
  )
}
