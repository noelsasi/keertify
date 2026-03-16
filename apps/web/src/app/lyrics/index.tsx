import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAppStore } from "@/store/app.store"
import { useSong } from "@/hooks/useSongs"
import { getCategoryConfig } from "@/lib/categories"
import { LyricsHero } from "./LyricsHero"
import { LyricsToolbar } from "./LyricsToolbar"
import { LyricsReader } from "./LyricsReader"
import { SongMeta } from "./SongMeta"
import { LyricsSidebar } from "./LyricsSidebar"
import type { ReadingMode, LyricsTab } from "./constants"

export function LyricsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite } = useAppStore()

  const [fontSize, setFontSize] = useState(16)
  const [bold, setBold] = useState(false)
  const [readingMode, setReadingMode] = useState<ReadingMode>("light")
  const [lyricsTab, setLyricsTab] = useState<LyricsTab>("native")

  const { data: song, isLoading, isError } = useSong(slug)

  if (isLoading) {
    return <LyricsPageSkeleton />
  }

  if (isError || !song) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Song not found
      </div>
    )
  }

  const favourite = isFavourite(song.id)
  const catConfig = getCategoryConfig(song.category)

  const handleCopy = () => {
    const text =
      song.sections.length > 0
        ? song.sections.map((s: { content: string }) => s.content).join("\n\n")
        : song.lyrics
    navigator.clipboard.writeText(text)
    toast("Lyrics copied")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: song.title, text: song.lyrics })
    } else {
      handleCopy()
    }
  }

  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      <LyricsHero
        song={song}
        catConfig={catConfig}
        favourite={favourite}
        onBack={() => navigate(-1)}
        onToggleFavourite={() => toggleFavourite(song.id)}
        onShare={handleShare}
        onCopy={handleCopy}
      />

      <LyricsToolbar
        fontSize={fontSize}
        bold={bold}
        readingMode={readingMode}
        onFontDecrease={() => setFontSize((f) => Math.max(12, f - 2))}
        onFontIncrease={() => setFontSize((f) => Math.min(28, f + 2))}
        onBoldToggle={() => setBold((b) => !b)}
        onReadingModeChange={setReadingMode}
        onCopy={handleCopy}
      />

      <div className="flex flex-1 gap-6 pt-0 md:items-start md:pt-0">
        <div className="min-w-0 flex-1 space-y-3">
          <LyricsReader
            song={song}
            sections={song.sections}
            fontSize={fontSize}
            bold={bold}
            readingMode={readingMode}
            lyricsTab={lyricsTab}
            onTabChange={setLyricsTab}
          />
          <SongMeta
            song={song}
            catConfig={catConfig}
            streamingLinks={song.streamingLinks}
          />
        </div>

        <LyricsSidebar
          fontSize={fontSize}
          bold={bold}
          readingMode={readingMode}
          onFontDecrease={() => setFontSize((f) => Math.max(12, f - 2))}
          onFontIncrease={() => setFontSize((f) => Math.min(28, f + 2))}
          onBoldToggle={() => setBold((b) => !b)}
          onReadingModeChange={setReadingMode}
        />
      </div>
    </div>
  )
}

function LyricsPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* Hero skeleton */}
      <div className="h-48 animate-pulse bg-muted md:h-40 md:rounded-2xl" />
      {/* Toolbar skeleton */}
      <div className="h-11 animate-pulse border-b border-border bg-muted md:hidden" />
      {/* Content skeleton */}
      <div className="flex-1 space-y-3 px-4 py-4 md:px-0">
        <div className="h-[420px] animate-pulse rounded-2xl bg-muted" />
        <div className="h-28 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  )
}
