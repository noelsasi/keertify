import { Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/app.store"
import { CATEGORY_COLORS, LANGUAGE_LABELS } from "@/lib/constants"
import type { Song } from "@/types/song.types"

interface SongCardProps {
  song: Song
}

export function SongCard({ song }: SongCardProps) {
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite } = useAppStore()
  const favourite = isFavourite(song.id)
  const accentColor = CATEGORY_COLORS[song.category] ?? CATEGORY_COLORS.Default

  const handleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavourite(song.id)
    toast(favourite ? "Removed from saved" : "Added to saved ♪")
  }

  return (
    <div
      onClick={() => navigate(`/song/${song.slug}`)}
      className="border-border bg-card hover:border-brand-gold/30 flex cursor-pointer items-center gap-0 overflow-hidden rounded-xl border transition-all duration-150 hover:shadow-md active:scale-[0.98]"
    >
      {/* Category accent bar */}
      <div className={cn("w-1.5 flex-shrink-0 self-stretch", accentColor)} />

      {/* Content */}
      <div className="min-w-0 flex-1 px-4 py-4">
        <p className="text-foreground truncate text-base leading-snug font-semibold">
          {song.title}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {song.artist || "NA"} · {song.category} ·{" "}
          <span className="text-brand-blue">{LANGUAGE_LABELS[song.language]}</span>
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
            favourite ? "fill-red-500 stroke-red-500" : "stroke-muted-foreground"
          )}
        />
      </button>
    </div>
  )
}
