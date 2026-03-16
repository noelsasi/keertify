import { ExternalLink } from "lucide-react"
import { LANGUAGE_LABELS } from "@/lib/constants"
import type { Song } from "@/types/song.types"
import type { CategoryConfig } from "@/lib/categories"
import type { StreamingLink } from "@/types/song.types"
import { STREAMING_PLATFORMS } from "./constants"
import { cn } from "@/lib/utils"

interface Props {
  song: Song
  catConfig: CategoryConfig
  streamingLinks: StreamingLink[]
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

export function SongMeta({ song, catConfig, streamingLinks }: Props) {
  return (
    <div className="rounded-none border-t border-border/60 bg-card px-5 py-5 md:rounded-2xl md:border md:border-border/60">
      <div className="grid grid-cols-2 gap-x-6 gap-y-3.5 md:grid-cols-4">
        {[
          { label: "Artist", value: song.artist || "NA" },
          { label: "Category", value: `${catConfig.emoji} ${catConfig.label}` },
          { label: "Language", value: LANGUAGE_LABELS[song.language] },
          { label: "Added", value: formatDate(song.createdAt) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="mb-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
              {label}
            </p>
            <p className="text-sm font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>
      {/* Streaming */}
      {streamingLinks.length > 0 && (
        <>
          <div className="my-4 h-px bg-border/50" />
          <p className="mb-2.5 text-[10px] font-semibold tracking-widest text-muted-foreground/70 uppercase">
            Listen on
          </p>
          <div className="flex flex-wrap gap-2">
            {streamingLinks.map((link) => {
              const p = STREAMING_PLATFORMS[link.platform]
              if (!p) return null
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-sm font-medium transition-all duration-150 hover:scale-[1.02] hover:shadow-sm",
                    p.bg,
                    p.border,
                    p.textColor
                  )}
                >
                  <img
                    src={p.iconUrl}
                    alt={p.label}
                    className="h-3.5 w-3.5"
                    onError={(e) => {
                      ; (e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
                  {p.label}
                  <ExternalLink size={10} className="opacity-35" />
                </a>
              )
            })}
          </div>
        </>
      )}
      {/* Source */}
      {song.sourceUrl && (
        <>
          <div className="my-4 h-px bg-border/50" />
          <a
            href={song.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            <ExternalLink size={11} />
            View original source
          </a>
        </>
      )}
    </div>
  )
}
