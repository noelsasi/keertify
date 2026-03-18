import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Music, Disc3, ListMusic } from "lucide-react"
import { cn } from "@/lib/utils"
import { useArtist } from "@/hooks/useSongs"
import { CATEGORY_COLORS, LANGUAGE_LABELS } from "@/lib/constants"
import type { ArtistSongItem, ArtistAlbumItem } from "@/types/song.types"

const TOP_SONGS_LIMIT = 5

export function ArtistPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: artist, isLoading, isError } = useArtist(slug)
  const [showAllSongs, setShowAllSongs] = useState(false)

  if (isLoading) return <ArtistPageSkeleton />

  if (isError || !artist) {
    return (
      <div className="text-muted-foreground flex min-h-screen items-center justify-center text-sm">
        Artist not found
      </div>
    )
  }

  const visibleSongs = showAllSongs ? artist.songs : artist.songs.slice(0, TOP_SONGS_LIMIT)

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* ── Mobile header ── */}
      <div className="bg-brand-navy dark:bg-nav-bg px-4 pt-12 pb-5 md:hidden">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={22} className="text-white" />
        </button>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
            {artist.avatarUrl ? (
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-white/10">
                <Music size={28} className="text-white/60" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl leading-tight font-bold text-white">{artist.name}</h1>
            {artist.nameTelugu && (
              <p className="font-telugu text-sm text-white/60">{artist.nameTelugu}</p>
            )}
            <p className="mt-1 text-xs text-white/50">
              {artist.songs.length} songs · {artist.albums.length} albums
            </p>
          </div>
        </div>
      </div>

      {/* ── Desktop header ── */}
      <div className="mb-6 hidden md:block">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground mb-5 flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-6">
          <div className="ring-border h-24 w-24 flex-shrink-0 overflow-hidden rounded-full ring-2">
            {artist.avatarUrl ? (
              <img
                src={artist.avatarUrl}
                alt={artist.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="bg-muted flex h-full w-full items-center justify-center">
                <Music size={36} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-foreground text-3xl font-bold">{artist.name}</h1>
            {artist.nameTelugu && (
              <p className="text-muted-foreground font-telugu text-base">{artist.nameTelugu}</p>
            )}
            <p className="text-muted-foreground mt-1 text-sm">
              {artist.songs.length} songs · {artist.albums.length} albums
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-6 px-4 py-5 md:px-0 md:py-0">
        {/* ── Albums section ── */}
        {artist.albums.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Disc3 size={16} className="text-brand-gold" />
                <h2 className="text-foreground text-base font-semibold">Albums</h2>
              </div>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {artist.albums.map((album: ArtistAlbumItem) => (
                <ArtistAlbumCard key={album.id} album={album} />
              ))}
            </div>
          </section>
        )}

        {/* ── Songs section ── */}
        {artist.songs.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListMusic size={16} className="text-brand-gold" />
                <h2 className="text-foreground text-base font-semibold">Songs</h2>
              </div>
              {artist.songs.length > TOP_SONGS_LIMIT && (
                <button
                  onClick={() => setShowAllSongs((v) => !v)}
                  className="text-brand-gold text-xs font-semibold transition-opacity hover:opacity-70"
                >
                  {showAllSongs ? "Show less" : `See all ${artist.songs.length}`}
                </button>
              )}
            </div>
            <div className="space-y-2">
              {visibleSongs.map((song: ArtistSongItem) => (
                <ArtistSongRow key={song.id} song={song} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function ArtistAlbumCard({ album }: { album: ArtistAlbumItem }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/albums/${album.slug}`)}
      className="w-[140px] flex-shrink-0 cursor-pointer transition-transform active:scale-[0.97]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        {album.albumCoverUrl ? (
          <img src={album.albumCoverUrl} alt={album.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-300 dark:from-neutral-700 dark:to-neutral-900">
            <Disc3 size={36} className="text-black/20 dark:text-white/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      </div>
      <span className="right-2.5 bottom-2.5 left-2.5 truncate rounded-md px-2 py-0.5 text-[11px] leading-tight font-bold">
        {album.title}
      </span>
    </div>
  )
}

function ArtistSongRow({ song }: { song: ArtistSongItem }) {
  const navigate = useNavigate()
  const accentColor =
    CATEGORY_COLORS[song.category as keyof typeof CATEGORY_COLORS] ?? CATEGORY_COLORS.Default

  return (
    <div
      onClick={() => navigate(`/song/${song.slug}`)}
      className="border-border bg-card hover:border-brand-gold/30 flex cursor-pointer items-center gap-0 overflow-hidden rounded-xl border transition-all duration-150 hover:shadow-md active:scale-[0.98]"
    >
      <div className={cn("w-1.5 flex-shrink-0 self-stretch", accentColor)} />
      <div className="min-w-0 flex-1 px-4 py-3.5">
        <p className="text-foreground truncate text-sm leading-snug font-semibold">{song.title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {song.category} ·{" "}
          <span className="text-brand-blue">
            {LANGUAGE_LABELS[song.language as keyof typeof LANGUAGE_LABELS] ?? song.language}
          </span>
        </p>
      </div>
    </div>
  )
}

function ArtistPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      <div className="bg-muted h-40 animate-pulse md:hidden" />
      <div className="space-y-6 px-4 py-5 md:px-0 md:py-0">
        <div className="hidden md:flex md:items-center md:gap-6">
          <div className="bg-muted h-24 w-24 animate-pulse rounded-full" />
          <div className="space-y-2">
            <div className="bg-muted h-8 w-48 animate-pulse rounded" />
            <div className="bg-muted h-4 w-32 animate-pulse rounded" />
          </div>
        </div>
        <div>
          <div className="bg-muted mb-3 h-5 w-24 animate-pulse rounded" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[140px] flex-shrink-0">
                <div className="bg-muted aspect-square w-full animate-pulse rounded-2xl" />
                <div className="bg-muted mt-1.5 h-3 w-3/4 animate-pulse rounded" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="bg-muted mb-3 h-5 w-20 animate-pulse rounded" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-muted h-[60px] animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
