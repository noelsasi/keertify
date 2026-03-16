import { ArrowLeft, Heart, Share2, Copy, Music2, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { LANGUAGE_LABELS } from "@/lib/constants"
import type { Song } from "@/types/song.types"
import type { CategoryConfig } from "@/lib/categories"
import { CATEGORY_HERO_GRADIENTS, CATEGORY_THUMB_GRADIENTS, NOISE_BG } from "./constants"

interface Props {
  song: Song
  catConfig: CategoryConfig
  favourite: boolean
  onBack: () => void
  onToggleFavourite: () => void
  onShare: () => void
  onCopy: () => void
}

function getInitials(name: string) {
  if (!name) return
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
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
  const heroGradient = CATEGORY_HERO_GRADIENTS[song.category] ?? CATEGORY_HERO_GRADIENTS.Default
  const thumbGradient = CATEGORY_THUMB_GRADIENTS[song.category] ?? CATEGORY_THUMB_GRADIENTS.Default

  return (
    <>
      {/* ── Mobile hero ── */}
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br px-4 pt-12 pb-7 md:hidden",
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
            className="rounded-full p-1.5 transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={21} className="text-white" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavourite}
              className="rounded-full p-1.5 transition-colors hover:bg-white/10"
            >
              <Heart
                size={21}
                className={cn(favourite ? "fill-white stroke-white" : "stroke-white/80")}
              />
            </button>
            <button
              onClick={onShare}
              className="rounded-full p-1.5 transition-colors hover:bg-white/10"
            >
              <Share2 size={19} className="stroke-white/80" />
            </button>
          </div>
        </div>

        <div className="relative flex items-start gap-4">
          <div
            className={cn(
              "flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg ring-1 ring-white/20",
              thumbGradient
            )}
          >
            <Music2 size={32} className="text-white/90" strokeWidth={1.5} />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h1 className="text-xl leading-snug font-bold text-white">{song.title}</h1>
            {song.artist && <div className="mt-1.5 flex items-center gap-2">
              <div
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-[9px] font-bold text-white"
                )}
              >
                {getInitials(song.artist || '')}
              </div>
              <span className="text-sm text-white/85">{song.artist}</span>
            </div>}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white/90 backdrop-blur-sm">
                {catConfig.emoji} {catConfig.label}
              </span>
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] text-white/75 backdrop-blur-sm">
                {LANGUAGE_LABELS[song.language]}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/45">
                <CalendarDays size={10} />
                {formatDate(song.createdAt)}
              </span>
            </div>
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
            <div
              className={cn(
                "flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-xl ring-1 ring-white/20",
                thumbGradient
              )}
            >
              <Music2 size={40} className="text-white/90" strokeWidth={1.4} />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-white">{song.title}</h1>
              {song.artist && <div className="shadow-m mt-2 flex w-fit cursor-pointer items-center gap-2 px-1.5 py-1">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[11px] font-bold text-white"
                  )}
                >
                  {getInitials(song.artist || "")}
                </div>
                <span className="truncate text-sm font-medium text-white/85">
                  {song.artist ?? song.artist}
                </span>
              </div>}
            </div>
            {/* Desktop hero actions — Copy, Share, Save. NOT duplicated in sidebar */}
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={onCopy}
                className="flex items-center gap-2 rounded-xl bg-white/12 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Copy size={14} /> Copy
              </button>
              <button
                onClick={onShare}
                className="flex items-center gap-2 rounded-xl bg-white/12 px-3.5 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <Share2 size={14} /> Share
              </button>
              <button
                onClick={onToggleFavourite}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium backdrop-blur-sm transition-colors",
                  favourite ? "bg-white/25 text-white" : "bg-white/12 text-white hover:bg-white/20"
                )}
              >
                <Heart size={14} className={favourite ? "fill-white stroke-white" : ""} />
                {favourite ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
