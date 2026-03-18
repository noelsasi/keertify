import { ArrowLeft, Heart, Share2, Copy, Music2, Disc3 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { SongDetail } from "@/types/song.types"
import type { CategoryConfig } from "@/lib/categories"
import { CATEGORY_HERO_GRADIENTS, CATEGORY_THUMB_GRADIENTS, NOISE_BG } from "./constants"

interface Props {
  song: SongDetail
  catConfig: CategoryConfig
  favourite: boolean
  onBack: () => void
  onToggleFavourite: () => void
  onShare: () => void
  onCopy: () => void
}

function getInitials(name: string) {
  if (!name) return ""
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function LyricsHero({
  song,
  favourite,
  onBack,
  onToggleFavourite,
  onShare,
  onCopy,
}: Props) {
  const navigate = useNavigate()
  const heroGradient = CATEGORY_HERO_GRADIENTS[song.category] ?? CATEGORY_HERO_GRADIENTS.Default
  const thumbGradient = CATEGORY_THUMB_GRADIENTS[song.category] ?? CATEGORY_THUMB_GRADIENTS.Default
  const primaryAlbum = song.albums?.[0] ?? null
  const albumCover = primaryAlbum?.albumCoverUrl ?? null

  return (
    <>
      {/* ── Mobile hero ── */}
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br px-4 pt-4 pb-7 md:hidden",
          heroGradient
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-10 mix-blend-soft-light"
          style={{ backgroundImage: NOISE_BG }}
        />

        <div className="relative mb-5 flex items-center justify-between">
          <button
            onClick={onBack}
            className="rounded-full p-1.5 transition-colors hover:bg-black/8 dark:hover:bg-white/10"
          >
            <ArrowLeft size={21} className="text-stone-700 dark:text-white" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavourite}
              className="rounded-full p-1.5 transition-colors hover:bg-black/8 dark:hover:bg-white/10"
            >
              <Heart
                size={21}
                className={cn(
                  favourite
                    ? "fill-stone-700 stroke-stone-700 dark:fill-white dark:stroke-white"
                    : "stroke-stone-600 dark:stroke-white/80"
                )}
              />
            </button>
            <button
              onClick={onShare}
              className="rounded-full p-1.5 transition-colors hover:bg-black/8 dark:hover:bg-white/10"
            >
              <Share2 size={19} className="stroke-stone-600 dark:stroke-white/80" />
            </button>
          </div>
        </div>

        <div className="relative flex items-start gap-4">
          {/* Thumbnail — album art or category gradient */}
          <div
            className={cn(
              "h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/10 dark:ring-white/20",
              !albumCover && "flex items-center justify-center bg-gradient-to-br",
              !albumCover && thumbGradient
            )}
          >
            {albumCover ? (
              <img src={albumCover} alt={primaryAlbum!.title} className="h-full w-full object-cover" />
            ) : (
              <Music2 size={32} className="text-stone-600 dark:text-white/90" strokeWidth={1.5} />
            )}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="text-2xl leading-snug font-bold text-stone-800 dark:text-white">
              {song.title}
            </h1>

            {/* Artist row */}
            {song.artist && (
              <button
                onClick={() => song.artistSlug && navigate(`/artists/${song.artistSlug}`)}
                className="mt-1.5 flex items-center gap-2 transition-opacity hover:opacity-80"
              >
                <div className="h-5 w-5 flex-shrink-0 overflow-hidden rounded-full bg-black/10 dark:bg-white/20">
                  {song.artistAvatarUrl ? (
                    <img src={song.artistAvatarUrl} alt={song.artist} className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-[9px] font-bold text-stone-700 dark:text-white">
                      {getInitials(song.artist)}
                    </span>
                  )}
                </div>
                <span className="text-sm text-stone-600 dark:text-white/85">{song.artist}</span>
              </button>
            )}

            {/* Album row */}
            {primaryAlbum && (
              <button
                onClick={() => navigate(`/albums/${primaryAlbum.slug}`)}
                className="mt-1 flex items-center gap-1.5 transition-opacity hover:opacity-80"
              >
                <Disc3 size={11} className="text-stone-500 dark:text-white/50" />
                <span className="text-xs text-stone-500 dark:text-white/60">{primaryAlbum.title}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Desktop hero ── */}
      <div className="mb-5 hidden md:block">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl bg-gradient-to-br px-8 py-7",
            heroGradient
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-10 mix-blend-soft-light"
            style={{ backgroundImage: NOISE_BG }}
          />
          <div className="relative flex items-center gap-6">
            {/* Thumbnail — album art or category gradient */}
            <div
              className={cn(
                "h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/10 dark:ring-white/20",
                !albumCover && "flex items-center justify-center bg-gradient-to-br",
                !albumCover && thumbGradient
              )}
            >
              {albumCover ? (
                <img src={albumCover} alt={primaryAlbum!.title} className="h-full w-full object-cover" />
              ) : (
                <Music2 size={40} className="text-stone-600 dark:text-white/90" strokeWidth={1.4} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-stone-800 dark:text-white">{song.title}</h1>

              {/* Artist row */}
              {song.artist && (
                <button
                  onClick={() => song.artistSlug && navigate(`/artists/${song.artistSlug}`)}
                  className="mt-2 flex items-center gap-2 rounded-lg px-1.5 py-1 transition-opacity hover:opacity-80"
                >
                  <div className="h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-black/10 dark:bg-white/20">
                    {song.artistAvatarUrl ? (
                      <img src={song.artistAvatarUrl} alt={song.artist} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-[11px] font-bold text-stone-700 dark:text-white">
                        {getInitials(song.artist)}
                      </span>
                    )}
                  </div>
                  <span className="truncate text-sm font-medium text-stone-600 dark:text-white/85">
                    {song.artist}
                  </span>
                </button>
              )}

              {/* Album row */}
              {primaryAlbum && (
                <button
                  onClick={() => navigate(`/albums/${primaryAlbum.slug}`)}
                  className="mt-1 ml-1.5 flex items-center gap-1.5 transition-opacity hover:opacity-80"
                >
                  <Disc3 size={12} className="text-stone-500 dark:text-white/50" />
                  <span className="text-xs text-stone-500 dark:text-white/60">{primaryAlbum.title}</span>
                </button>
              )}
            </div>

            {/* Desktop hero actions */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={onCopy}
                className="flex items-center gap-2 rounded-xl bg-black/8 px-3.5 py-2 text-sm font-medium text-stone-700 backdrop-blur-sm transition-colors hover:bg-black/12 dark:bg-white/12 dark:text-white dark:hover:bg-white/20"
              >
                <Copy size={14} /> Copy
              </button>
              <button
                onClick={onShare}
                className="flex items-center gap-2 rounded-xl bg-black/8 px-3.5 py-2 text-sm font-medium text-stone-700 backdrop-blur-sm transition-colors hover:bg-black/12 dark:bg-white/12 dark:text-white dark:hover:bg-white/20"
              >
                <Share2 size={14} /> Share
              </button>
              <button
                onClick={onToggleFavourite}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium backdrop-blur-sm transition-colors",
                  favourite
                    ? "bg-black/12 text-stone-800 dark:bg-white/25 dark:text-white"
                    : "bg-black/8 text-stone-700 hover:bg-black/12 dark:bg-white/12 dark:text-white dark:hover:bg-white/20"
                )}
              >
                <Heart
                  size={14}
                  className={
                    favourite
                      ? "fill-stone-800 stroke-stone-800 dark:fill-white dark:stroke-white"
                      : ""
                  }
                />
                {favourite ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
