import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Music, Disc3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAlbum } from "@/hooks/useSongs"
import { CATEGORY_COLORS, LANGUAGE_LABELS } from "@/lib/constants"
import type { AlbumSongItem } from "@/types/song.types"

export function AlbumPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: album, isLoading, isError } = useAlbum(slug)

  if (isLoading) return <AlbumPageSkeleton />

  if (isError || !album) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Album not found
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* ── Mobile header ── */}
      <div className="bg-brand-navy dark:bg-nav-bg md:hidden">
        <div className="px-4 pt-12 pb-5">
          <button onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft size={22} className="text-white" />
          </button>
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/20">
              {album.albumCoverUrl ? (
                <img src={album.albumCoverUrl} alt={album.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-white/10">
                  <Disc3 size={28} className="text-white/60" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h1 className="text-xl font-bold text-white leading-tight">{album.title}</h1>
              {album.artistName && (
                <button
                  onClick={() => album.artistSlug && navigate(`/artists/${album.artistSlug}`)}
                  className="mt-1.5 flex items-center gap-1.5 transition-opacity hover:opacity-70"
                >
                  <span className="text-sm text-white/70">{album.artistName}</span>
                </button>
              )}
              <p className="mt-1 text-xs text-white/50">
                {album.songs.length} tracks · {LANGUAGE_LABELS[album.language as keyof typeof LANGUAGE_LABELS] ?? album.language}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop header ── */}
      <div className="mb-6 hidden md:block">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-6">
          <div className="h-36 w-36 flex-shrink-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-border">
            {album.albumCoverUrl ? (
              <img src={album.albumCoverUrl} alt={album.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Disc3 size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{album.title}</h1>
            {album.artistName && (
              <button
                onClick={() => album.artistSlug && navigate(`/artists/${album.artistSlug}`)}
                className="mt-1 flex items-center gap-2 transition-opacity hover:opacity-70"
              >
                <span className="text-base text-muted-foreground">{album.artistName}</span>
              </button>
            )}
            <p className="mt-1 text-sm text-muted-foreground">
              {album.songs.length} tracks · {LANGUAGE_LABELS[album.language as keyof typeof LANGUAGE_LABELS] ?? album.language}
            </p>
          </div>
        </div>
      </div>

      {/* ── Track list ── */}
      <div className="flex-1 space-y-2 px-4 py-5 md:px-0 md:py-0">
        <div className="mb-3 flex items-center gap-2">
          <Music size={16} className="text-brand-gold" />
          <h2 className="text-base font-semibold text-foreground">Tracks</h2>
        </div>
        {album.songs.map((song, index) => (
          <AlbumTrackRow key={song.id} song={song} index={index} />
        ))}
        {album.songs.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">No tracks yet</p>
        )}
      </div>
    </div>
  )
}

function AlbumTrackRow({ song, index }: { song: AlbumSongItem; index: number }) {
  const navigate = useNavigate()
  const accentColor = CATEGORY_COLORS[song.category as keyof typeof CATEGORY_COLORS] ?? CATEGORY_COLORS.Default

  return (
    <div
      onClick={() => navigate(`/song/${song.slug}`)}
      className="border-border bg-card hover:border-brand-gold/30 flex cursor-pointer items-center gap-0 overflow-hidden rounded-xl border transition-all duration-150 hover:shadow-md active:scale-[0.98]"
    >
      <div className={cn("w-1.5 flex-shrink-0 self-stretch", accentColor)} />
      <div className="flex w-9 flex-shrink-0 items-center justify-center py-3.5">
        <span className="text-xs font-semibold tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="min-w-0 flex-1 py-3.5 pr-4">
        <p className="text-foreground truncate text-sm font-semibold leading-snug">{song.title}</p>
        <p className="text-muted-foreground mt-0.5 text-xs">
          {song.artistName ?? "—"} · {song.category}
        </p>
      </div>
    </div>
  )
}

function AlbumPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      <div className="h-44 animate-pulse bg-muted md:hidden" />
      <div className="space-y-2 px-4 py-5 md:px-0 md:py-0">
        <div className="hidden md:flex md:items-center md:gap-6">
          <div className="h-36 w-36 animate-pulse rounded-2xl bg-muted" />
          <div className="space-y-2">
            <div className="h-8 w-48 animate-pulse rounded bg-muted" />
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="mb-3 h-5 w-20 animate-pulse rounded bg-muted" />
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[60px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
