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
    <div className="rounded-2xl border border-[var(--k-border)] bg-[var(--k-surface)] px-5 py-4">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
        {[
          { label: "Artist", value: song.artist || "NA" },
          { label: "Category", value: `${catConfig.emoji} ${catConfig.label}` },
          { label: "Language", value: LANGUAGE_LABELS[song.language] },
          { label: "Added", value: formatDate(song.createdAt) },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[2px] text-[var(--k-text-3)]">
              {label}
            </p>
            <p className="text-[14px] font-medium text-[var(--k-ink)] dark:text-[var(--k-text-1)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Streaming */}
      {streamingLinks.length > 0 && (
        <>
          <div className="my-4 h-px bg-[var(--k-border)]" />
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[2px] text-[var(--k-text-3)]">
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
                    "flex items-center gap-2 rounded-lg border px-3.5 py-1.5 text-[13px] font-medium transition-all duration-150 hover:scale-[1.02] hover:shadow-sm",
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
                      ;(e.target as HTMLImageElement).style.display = "none"
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
          <div className="my-4 h-px bg-[var(--k-border)]" />
          <a
            href={song.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[12px] text-[var(--k-text-3)] transition-colors hover:text-[var(--k-text-2)]"
          >
            <ExternalLink size={11} />
            View original source
          </a>
        </>
      )}
    </div>
  )
}
