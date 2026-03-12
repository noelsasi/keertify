import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAppStore } from "@/store/app.store"
import { MOCK_SONGS, MOCK_STREAMING_LINKS } from "@/lib/mock-data"
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

  const song = MOCK_SONGS.find((s) => s.slug === slug)
  if (!song) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Song not found
      </div>
    )
  }

  const favourite = isFavourite(song.id)
  const streamingLinks = MOCK_STREAMING_LINKS.filter(
    (l) => l.songId === song.id
  )
  const catConfig = getCategoryConfig(song.category)

  const handleCopy = () => {
    navigator.clipboard.writeText(song.lyrics)
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
            fontSize={fontSize}
            bold={bold}
            readingMode={readingMode}
            lyricsTab={lyricsTab}
            onTabChange={setLyricsTab}
          />
          <SongMeta
            song={song}
            catConfig={catConfig}
            streamingLinks={streamingLinks}
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
