import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useAppStore } from "@/store/app.store"
import { useUIStore } from "@/store/ui.store"
import { useSong } from "@/hooks/useSongs"
import { getCategoryConfig } from "@/lib/categories"
import { LyricsHero } from "./LyricsHero"
import { LyricsToolbar } from "./LyricsToolbar"
import { LyricsReader } from "./LyricsReader"
import { SongMeta } from "./SongMeta"
import { LyricsSidebar } from "./LyricsSidebar"
import { LyricsPresenter } from "./LyricsPresenter"
import type { LyricsTab } from "./constants"

export function LyricsPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { toggleFavourite, isFavourite } = useAppStore()

  const [fontSize, setFontSize] = useState(16)
  const [bold, setBold] = useState(false)
  const [lyricsTab, setLyricsTab] = useState<LyricsTab>("native")
  const { isPresenting, setIsPresenting } = useUIStore()
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRAF = useRef<number | null>(null)

  const { data: song, isLoading, isError } = useSong(slug)

  // Scroll progress bar
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRAF.current) cancelAnimationFrame(scrollRAF.current)
      scrollRAF.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(docHeight > 0 ? (scrollY / docHeight) * 100 : 0)
      })
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollRAF.current) cancelAnimationFrame(scrollRAF.current)
    }
  }, [])

  // Clean up presenting state on unmount
  useEffect(() => {
    return () => setIsPresenting(false)
  }, [setIsPresenting])

  // Keyboard shortcut: "P" to toggle presentation mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }
      if (e.key.toLowerCase() === "p" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        setIsPresenting(!isPresenting)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPresenting, setIsPresenting])

  if (isLoading) {
    return <LyricsPageSkeleton />
  }

  if (isError || !song) {
    return (
      <div className="text-muted-foreground flex min-h-screen items-center justify-center text-sm">
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

  const handlePresent = () => {
    setIsPresenting(true)
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
      {/* Scroll progress bar */}
      <div
        className="bg-k-gold fixed top-0 left-0 z-100 h-0.5 transition-[width] duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

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
        onFontDecrease={() => setFontSize((f) => Math.max(12, f - 2))}
        onFontIncrease={() => setFontSize((f) => Math.min(28, f + 2))}
        onBoldToggle={() => setBold((b) => !b)}
        onCopy={handleCopy}
        onPresent={handlePresent}
      />

      <div className="flex flex-1 gap-6 md:items-start md:px-0 md:py-0">
        <div className="min-w-0 flex-1 space-y-3">
          <LyricsReader
            song={song}
            sections={song.sections}
            fontSize={fontSize}
            bold={bold}
            lyricsTab={lyricsTab}
            onTabChange={setLyricsTab}
          />
          <div className="mx-3.5 md:mx-0">
            <SongMeta song={song} catConfig={catConfig} streamingLinks={song.streamingLinks} />
          </div>
        </div>

        <LyricsSidebar
          fontSize={fontSize}
          bold={bold}
          onFontDecrease={() => setFontSize((f) => Math.max(12, f - 2))}
          onFontIncrease={() => setFontSize((f) => Math.min(28, f + 2))}
          onBoldToggle={() => setBold((b) => !b)}
          onPresent={handlePresent}
        />
      </div>

      <LyricsPresenter
        song={song}
        sections={song.sections}
        isOpen={isPresenting}
        onClose={() => setIsPresenting(false)}
      />
    </div>
  )
}

function LyricsPageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col md:min-h-0">
      {/* Hero skeleton */}
      <div className="bg-muted h-48 animate-pulse md:h-40 md:rounded-2xl" />
      {/* Toolbar skeleton */}
      <div className="border-border bg-muted h-11 animate-pulse border-b md:hidden" />
      {/* Content skeleton */}
      <div className="flex-1 space-y-3 px-4 py-4 md:px-0">
        <div className="bg-muted h-[420px] animate-pulse rounded-2xl" />
        <div className="bg-muted h-28 animate-pulse rounded-2xl" />
      </div>
    </div>
  )
}
