import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Music, Disc3, ListMusic } from "lucide-react"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { AvatarImage } from "@/components/AvatarImage"
import { SectionHeader } from "@/components/SectionHeader"
import { useArtist } from "@/hooks/useSongs"
import { LANGUAGE_LABELS } from "@/lib/constants"
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
      <div className="border-b border-[var(--k-border)] bg-[var(--k-surface)] px-4 pt-12 pb-5 md:hidden">
        <button onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft size={22} className="text-[var(--k-text-1)]" />
        </button>
        <div className="flex items-center gap-4">
          <AvatarImage
            src={artist.avatarUrl}
            alt={artist.name}
            size={64}
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Music size={28} className="text-[var(--k-text-3)]" />
              </div>
            }
            className="ring-2 ring-[var(--k-border)]"
          />
          <div className="min-w-0">
            <h1
              className="leading-tight text-[var(--k-text-1)]"
              style={{ fontFamily: "var(--k-font-display)", fontSize: 22, fontWeight: 500 }}
            >
              {artist.name}
            </h1>
            {artist.nameTelugu && (
              <p className="font-telugu text-sm text-[var(--k-text-3)]">{artist.nameTelugu}</p>
            )}
            <p className="mt-1 text-xs text-[var(--k-text-3)]">
              {artist.songs.length} songs · {artist.albums.length} albums
            </p>
          </div>
        </div>
      </div>

      {/* ── Desktop header ── */}
      <div className="mb-6 hidden md:block">
        <div className="text-muted-foreground mb-5">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: artist.name }]} />
        </div>
        <div className="flex items-center gap-6">
          <AvatarImage
            src={artist.avatarUrl}
            alt={artist.name}
            size={96}
            fallback={
              <div className="flex h-full w-full items-center justify-center">
                <Music size={36} className="text-[var(--k-text-3)]" />
              </div>
            }
            className="ring-border ring-2"
          />
          <div>
            <h1
              className="leading-none text-[var(--k-text-1)]"
              style={{ fontFamily: "var(--k-font-display)", fontSize: 36, fontWeight: 400 }}
            >
              {artist.name}
            </h1>
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
            <SectionHeader title="Albums" icon={Disc3} />
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
                <ListMusic size={16} className="text-[var(--k-gold)]" />
                <h2 className="text-foreground text-base font-semibold">Songs</h2>
              </div>
              {artist.songs.length > TOP_SONGS_LIMIT && (
                <button
                  onClick={() => setShowAllSongs((v) => !v)}
                  className="text-xs font-semibold text-[var(--k-gold)] transition-opacity hover:opacity-70"
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
          <div className="flex h-full w-full items-center justify-center bg-[var(--k-surface-2)]">
            <Disc3 size={36} className="text-[var(--k-text-4)]" />
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

  return (
    <div
      onClick={() => navigate(`/song/${song.slug}`)}
      className="border-border bg-card flex cursor-pointer items-center gap-0 overflow-hidden rounded-xl border transition-all duration-150 hover:border-[var(--k-gold)]/30 hover:shadow-md active:scale-[0.98]"
    >
      {/* Song icon box */}
      <div className="mx-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[8px] bg-[var(--k-ink)] dark:bg-[var(--k-surface-2)]">
        <svg
          width="12"
          height="12"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="9" y="1" width="2.5" height="14" rx="1.25" fill="var(--k-gold-light)" />
          <rect x="3" y="6" width="14" height="2.5" rx="1.25" fill="var(--k-gold-light)" />
        </svg>
      </div>
      <div className="min-w-0 flex-1 py-3.5 pr-4">
        <p className="text-foreground truncate text-sm leading-snug font-semibold">{song.title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {song.category} ·{" "}
          <span className="text-[var(--k-gold)]">
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
