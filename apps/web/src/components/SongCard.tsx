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
      className="border-border bg-card hover:border-[var(--k-gold)]/30 flex cursor-pointer items-center gap-0 overflow-hidden rounded-xl border transition-all duration-150 hover:shadow-md active:scale-[0.98]"
    >
      {/* Song icon box */}
      <div className="mx-3 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] bg-[var(--k-ink)] dark:bg-[var(--k-surface-2)]">
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="9" y="1" width="2.5" height="14" rx="1.25" fill="var(--k-gold-light)" />
          <rect x="3" y="6" width="14" height="2.5" rx="1.25" fill="var(--k-gold-light)" />
        </svg>
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 py-4 pr-2">
        <p className="text-foreground truncate text-base leading-snug font-semibold">
          {song.title}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {song.artist || "NA"} · {song.category} ·{" "}
          <span className="text-[var(--k-gold)]">{LANGUAGE_LABELS[song.language]}</span>
        </p>
      </div>

      {/* Favourite button */}
      <button
        onClick={handleFavourite}
        className="flex-shrink-0 px-4 py-4 transition-transform duration-150 active:scale-90"
        aria-label={favourite ? "Remove from saved" : "Save song"}
      >
        <Heart
          size={20}
          className={cn(
            "transition-colors duration-200",
            favourite
              ? "fill-[var(--k-crimson)] stroke-[var(--k-crimson)]"
              : "stroke-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}
