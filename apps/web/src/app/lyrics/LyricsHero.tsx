import { ArrowLeft, Heart, Share2, Copy, Music2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Breadcrumbs } from "@/components/ui/breadcrumbs"
import { Pill } from "@/components/Pill"
import { AvatarImage } from "@/components/AvatarImage"
import { LANGUAGE_LABELS } from "@/lib/constants"
import type { SongDetail } from "@/types/song.types"
import type { CategoryConfig } from "@/lib/categories"
import { CATEGORY_THUMB_GRADIENTS } from "./constants"

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

function formatDateShort(iso: string) {
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" })
    .format(new Date(iso))
    .toUpperCase()
}

export function LyricsHero({
  song,
  catConfig,
  favourite,
  onBack,
  onToggleFavourite,
  onShare,
  onCopy,
}: Props) {
  const navigate = useNavigate()
  const thumbGradient = CATEGORY_THUMB_GRADIENTS[song.category] ?? CATEGORY_THUMB_GRADIENTS.Default
  const primaryAlbum = song.albums?.[0] ?? null
  const albumCover = primaryAlbum?.albumCoverUrl ?? null
  const langLabel = LANGUAGE_LABELS[song.language as keyof typeof LANGUAGE_LABELS] ?? song.language

  return (
    <>
      {/* ── Mobile: topbar ── */}
      <div className="border-k-border bg-k-surface flex items-center justify-between border-b px-4 py-3 md:hidden">
        <button
          onClick={onBack}
          className="text-k-text-3 hover:text-k-text-1 flex items-center gap-1.5 text-[13px] transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <p
          className="text-k-text-1 max-w-[180px] truncate text-[15px]"
          style={{ fontFamily: "var(--k-font-display)", fontWeight: 500 }}
        >
          {song.title}
        </p>
        <div className="w-12" />
      </div>

      {/* ── Mobile: hero card ── */}
      <div className="mx-3.5 mt-3 mb-0 md:hidden">
        <div
          className="border-k-border rounded-[14px] border p-4"
          style={{ background: "var(--hero-gradient)" }}
        >
          <div className="flex items-start gap-3.5">
            <AvatarImage
              src={albumCover}
              alt={primaryAlbum?.title}
              size={80}
              shape="square"
              fallback={
                <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br", thumbGradient)}>
                  <Music2 size={24} className="text-[var(--k-text-3)]" strokeWidth={1.5} />
                </div>
              }
              className="shadow-md ring-1 ring-[var(--k-surface-2)]"
            />

            <div className="min-w-0 flex-1">
              <h1
                className="text-k-ink dark:text-k-text-1 leading-tight"
                style={{
                  fontFamily: "var(--k-font-display)",
                  fontSize: 20,
                  fontWeight: 600,
                  letterSpacing: "-0.5px",
                }}
              >
                {song.title}
              </h1>

              {/* Artist + album inline */}
              <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                {song.artist && (
                  <button
                    onClick={() => song.artistSlug && navigate(`/artists/${song.artistSlug}`)}
                    className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                  >
                    <AvatarImage
                      src={song.artistAvatarUrl}
                      alt={song.artist}
                      size={18}
                      fallback={
                        <span className="flex h-full w-full items-center justify-center text-[8px] font-bold text-[var(--k-text-1)]">
                          {getInitials(song.artist)}
                        </span>
                      }
                    />
                    <span className="text-[13px] font-medium text-[var(--k-ink)] dark:text-[var(--k-text-1)]">
                      {song.artist}
                    </span>
                  </button>
                )}
                {song.artist && primaryAlbum && (
                  <span className="text-[12px] text-[var(--k-text-3)]">·</span>
                )}
                {primaryAlbum && (
                  <button
                    onClick={() => navigate(`/albums/${primaryAlbum.slug}`)}
                    className="transition-opacity hover:opacity-80"
                  >
                    <span className="text-[11px] text-[var(--k-text-3)]">{primaryAlbum.title}</span>
                  </button>
                )}
              </div>
              {/* Pill badges */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Pill variant="gold">{catConfig.label}</Pill>
                <Pill variant="stone">{langLabel}</Pill>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-3.5 flex gap-1.5">
            <button
              onClick={onCopy}
              className="border-k-border bg-k-bg text-k-ink dark:text-k-text-1 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-opacity hover:opacity-80"
            >
              <Copy size={12} /> Copy
            </button>
            <button
              onClick={onShare}
              className="border-k-border bg-k-bg text-k-ink dark:text-k-text-1 flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-[12px] font-medium transition-opacity hover:opacity-80"
            >
              <Share2 size={12} /> Share
            </button>
            <button
              onClick={onToggleFavourite}
              className="bg-k-ink text-k-gold-pale dark:bg-k-gold dark:text-k-ink flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium transition-opacity hover:opacity-80"
            >
              <Heart
                size={12}
                className={cn(favourite && "fill-k-gold-light stroke-k-gold-light")}
              />
              {favourite ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop: breadcrumb + hero ── */}
      <div className="mb-5 hidden md:block">
        <div className="text-muted-foreground mb-4">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              ...(song.artist && song.artistSlug
                ? [{ label: song.artist, href: `/artists/${song.artistSlug}` }]
                : []),
              { label: song.title },
            ]}
          />
        </div>

        <div
          className="overflow-hidden rounded-2xl border border-[var(--k-border)] px-8 py-7"
          style={{ background: "var(--hero-gradient)" }}
        >
          <div className="flex items-center gap-6">
            {/* Thumbnail */}
            <AvatarImage
              src={albumCover}
              alt={primaryAlbum?.title}
              size={90}
              shape="square"
              fallback={
                <div className={cn("flex h-full w-full items-center justify-center bg-gradient-to-br", thumbGradient)}>
                  <Music2 size={36} className="text-[var(--k-text-3)]" strokeWidth={1.4} />
                </div>
              }
              className="rounded-[12px] shadow-xl ring-1 ring-black/8"
            />

            <div className="min-w-0 flex-1">
              <h1
                className="leading-none text-[var(--k-ink)] dark:text-[var(--k-text-1)]"
                style={{
                  fontFamily: "var(--k-font-display)",
                  fontSize: 28,
                  fontWeight: 500,
                  letterSpacing: "-0.5px",
                }}
              >
                {song.title}
              </h1>

              {/* Artist + album name on same row */}
              <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                {song.artist && (
                  <button
                    onClick={() => song.artistSlug && navigate(`/artists/${song.artistSlug}`)}
                    className="flex items-center gap-2 transition-opacity hover:opacity-80"
                  >
                    <AvatarImage
                      src={song.artistAvatarUrl}
                      alt={song.artist}
                      size={24}
                      fallback={
                        <span className="flex h-full w-full items-center justify-center text-[10px] font-bold text-[var(--k-ink)] dark:text-[var(--k-text-1)]">
                          {getInitials(song.artist)}
                        </span>
                      }
                      className="bg-black/10 dark:bg-white/15"
                    />
                    <span className="text-[14px] font-medium text-[var(--k-ink)] dark:text-[var(--k-text-1)]">
                      {song.artist}
                    </span>
                  </button>
                )}
                {song.artist && primaryAlbum && (
                  <span className="text-[13px] text-[var(--k-text-3)]">·</span>
                )}
                {primaryAlbum && (
                  <button
                    onClick={() => navigate(`/albums/${primaryAlbum.slug}`)}
                    className="transition-opacity hover:opacity-80"
                  >
                    <span className="text-[13px] text-[var(--k-text-3)]">{primaryAlbum.title}</span>
                  </button>
                )}
              </div>

              {/* Pill badges: category + language + date */}
              <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                <Pill variant="gold">{catConfig.label}</Pill>
                <Pill variant="stone">{langLabel}</Pill>
                <Pill variant="stone">{formatDateShort(song.createdAt)}</Pill>
              </div>
            </div>

            {/* Desktop action buttons */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={onCopy}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--k-border)] bg-[var(--k-surface)] px-3.5 py-2 text-[12px] font-medium text-[var(--k-ink)] transition-opacity hover:opacity-80 dark:text-[var(--k-text-1)]"
              >
                <Copy size={13} /> Copy
              </button>
              <button
                onClick={onShare}
                className="flex items-center gap-1.5 rounded-lg border border-[var(--k-border)] bg-[var(--k-surface)] px-3.5 py-2 text-[12px] font-medium text-[var(--k-ink)] transition-opacity hover:opacity-80 dark:text-[var(--k-text-1)]"
              >
                <Share2 size={13} /> Share
              </button>
              <button
                onClick={onToggleFavourite}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--k-ink)] px-3.5 py-2 text-[12px] font-medium text-[var(--k-gold-pale)] transition-opacity hover:opacity-80 dark:bg-[var(--k-gold)] dark:text-[var(--k-ink)]"
              >
                <Heart
                  size={13}
                  className={cn(
                    favourite && "fill-[var(--k-gold-light)] stroke-[var(--k-gold-light)]"
                  )}
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
