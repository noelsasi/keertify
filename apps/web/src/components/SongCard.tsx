import { Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app.store"
import { LANGUAGE_LABELS } from "@/lib/constants"
import type { Song } from "@/types/song.types"

interface SongCardProps {
  song: Song
}

export function SongCard({ song }: SongCardProps) {
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite } = useAppStore()
  const favourite = isFavourite(song.id)

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavourite(song.id)
    toast(favourite ? "Removed from saved" : "Added to saved ♪")
  }

  return (
    <div
      onClick={() => navigate(`/song/${song.slug}`)}
      className="dark:bg-k-ink bg-k-surface border-k-border flex cursor-pointer items-center gap-0 overflow-hidden rounded-xl border transition-all duration-150 hover:border-(--k-gold)/30 hover:shadow-md active:scale-[0.98]"
    >
      {/* Song icon box */}
      <div className="bg-k-ink dark:bg-k-surface-2 mx-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] p-2">
        <svg className="ico16" viewBox="0 0 36 36" fill="none">
          <path d="M18 7C18 7 9 8 6 12L6 27C9 24 16 23 18 25Z" fill="#D4A92A" opacity="0.9" />
          <path d="M18 7C18 7 27 8 30 12L30 27C27 24 20 23 18 25Z" fill="#D4A92A" opacity="0.6" />
          <line
            x1="18"
            y1="7"
            x2="18"
            y2="25"
            stroke="var(--k-gold-pale)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M26 6.5L26 15L23.8 13L21.5 15L21.5 6.5Z" fill="#A63248" />
        </svg>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 py-3 pr-2">
        <p className="text-foreground truncate text-base leading-snug font-semibold">
          {song.title}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {song.artist || "NA"} · {song.category} ·{" "}
          <span className="text-k-gold">{LANGUAGE_LABELS[song.language]}</span>
        </p>
      </div>

      {/* Favourite button */}
      <button
        onClick={handleFavourite}
        className="shrink-0 px-4 py-3 transition-transform duration-150 active:scale-90"
        aria-label={favourite ? "Remove from saved" : "Save song"}
      >
        <Heart
          size={20}
          className={cn(
            "transition-colors duration-200",
            favourite ? "fill-k-crimson stroke-k-crimson" : "stroke-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}
