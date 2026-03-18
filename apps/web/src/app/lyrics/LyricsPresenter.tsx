import { useState, useEffect, useCallback, useRef } from "react"
import { ArrowLeft, ArrowRight, X, Play, Pause, Maximize2, Minimize2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Song, SongSection } from "@/types/song.types"

interface Props {
  song: Song
  sections: SongSection[]
  isOpen: boolean
  onClose: () => void
}

const SECTION_LABELS: Record<string, string> = {
  pallavi: "Pallavi",
  charnam: "Charnam",
  verse: "Verse",
  chorus: "Chorus",
  bridge: "Bridge",
  "pre-chorus": "Pre-Chorus",
  outro: "Outro",
  interlude: "Interlude",
}

function getSectionLabel(section: SongSection): string {
  const base = SECTION_LABELS[section.type] ?? section.type
  const showNumber = (section.type === "charnam" || section.type === "verse") && section.number > 0
  return showNumber ? `${base} ${section.number}` : base
}

export function LyricsPresenter({ song, sections, isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlayInterval, setAutoPlayInterval] = useState(5000)
  const [isFocusMode, setIsFocusMode] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const totalSections = sections.length > 0 ? sections.length : 1

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSections)
  }, [totalSections])

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSections) % totalSections)
  }, [totalSections])

  // Reset index when opened
  useEffect(() => {
    if (isOpen) setCurrentIndex(0)
  }, [isOpen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (isOpen) {
        switch (e.key) {
          case "ArrowRight":
          case "ArrowDown":
          case " ":
            e.preventDefault()
            goToNext()
            break
          case "ArrowLeft":
          case "ArrowUp":
            e.preventDefault()
            goToPrev()
            break
          case "Escape":
            e.preventDefault()
            if (isFocusMode) setIsFocusMode(false)
            else onClose()
            break
          case "f":
          case "F":
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault()
              setIsFocusMode((f) => !f)
            }
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFocusMode, goToNext, goToPrev, onClose])

  // Auto-play
  useEffect(() => {
    if (!isPlaying || !isOpen) return
    const interval = setInterval(goToNext, autoPlayInterval)
    return () => clearInterval(interval)
  }, [isPlaying, isOpen, autoPlayInterval, goToNext])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = touchStartX.current - e.changedTouches[0].clientX
    const dy = Math.abs(touchStartY.current - e.changedTouches[0].clientY)

    // Only handle horizontal swipes (ignore vertical scrolls)
    if (Math.abs(dx) > 50 && Math.abs(dx) > dy) {
      if (dx > 0) goToNext()
      else goToPrev()
    } else if (Math.abs(dx) < 10 && dy < 10) {
      // Tap — toggle focus mode
      setIsFocusMode((f) => !f)
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  if (!isOpen) return null

  const currentSection = sections.length > 0 ? sections[currentIndex] : null

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col bg-black text-white"
      role="dialog"
      aria-label="Lyrics presentation mode"
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-sm transition-all duration-300 md:px-6",
          isFocusMode && "pointer-events-none opacity-0"
        )}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
            <span className="hidden sm:inline">Exit</span>
          </button>
          <span className="text-sm font-semibold text-white">{song.title}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Navigation controls */}
          <div className="flex items-center gap-1 rounded-lg bg-white/5 p-1">
            <button
              onClick={goToPrev}
              className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              title="Previous (← / ↑)"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="px-3 text-sm font-medium tabular-nums">
              {currentIndex + 1} / {totalSections}
            </span>
            <button
              onClick={goToNext}
              className="rounded-md p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              title="Next (→ / ↓ / Space)"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Auto-play toggle */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isPlaying
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
            )}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span className="hidden sm:inline">Auto-play</span>
          </button>

          {/* Focus mode toggle (desktop) */}
          <button
            onClick={() => setIsFocusMode((f) => !f)}
            className="hidden rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white sm:flex"
            title="Focus mode (F)"
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>

      {/* Main content — swipeable on mobile */}
      <div
        className="flex flex-1 items-center justify-center px-8 md:px-24"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full max-w-5xl">
          {sections.length > 0 ? (
            <div className="space-y-8">
              {currentSection && (
                <p className="text-center text-sm font-semibold tracking-widest text-white/40 uppercase">
                  {getSectionLabel(currentSection)}
                  {currentSection.repeatCount && currentSection.repeatCount > 1
                    ? ` ×${currentSection.repeatCount}`
                    : ""}
                </p>
              )}
              <p
                className="text-center text-3xl font-medium leading-relaxed whitespace-pre-wrap md:text-4xl lg:text-5xl"
                style={{ lineHeight: 1.8 }}
              >
                {currentSection
                  ? currentSection.content || currentSection.contentEnglish
                  : song.lyrics}
              </p>
            </div>
          ) : (
            <p className="text-center text-3xl font-medium leading-relaxed whitespace-pre-wrap md:text-4xl lg:text-5xl">
              {song.lyrics}
            </p>
          )}
        </div>

        {/* Mobile: tap hint shown briefly when focus mode is on */}
        {isFocusMode && (
          <div className="pointer-events-none absolute bottom-8 left-0 right-0 flex justify-center">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/30">
              Tap to show controls · Swipe to navigate
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-white/10 bg-black/80 px-4 py-4 backdrop-blur-sm transition-all duration-300 md:px-6",
          isFocusMode && "pointer-events-none opacity-0"
        )}
      >
        {/* Progress bar */}
        <div className="mb-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalSections) * 100}%` }}
            />
          </div>
          <span className="text-xs text-white/40 tabular-nums">
            {Math.round(((currentIndex + 1) / totalSections) * 100)}%
          </span>
        </div>

        {/* Speed + hints */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40">Speed:</span>
            {[3000, 5000, 8000, 12000].map((speed) => (
              <button
                key={speed}
                onClick={() => setAutoPlayInterval(speed)}
                className={cn(
                  "rounded px-2 py-1 text-xs font-medium transition-colors",
                  autoPlayInterval === speed
                    ? "bg-white/20 text-white"
                    : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"
                )}
              >
                {speed / 1000}s
              </button>
            ))}
          </div>

          <div className="hidden text-xs text-white/30 sm:block">
            <span className="font-medium">←</span> Prev
            <span className="mx-2">·</span>
            <span className="font-medium">→</span> Next
            <span className="mx-2">·</span>
            <span className="font-medium">F</span> Focus
            <span className="mx-2">·</span>
            <span className="font-medium">Esc</span> Exit
          </div>
        </div>
      </div>

      {/* Focus mode toggle — always visible floating button */}
      <button
        onClick={() => setIsFocusMode((f) => !f)}
        className="absolute right-4 bottom-4 rounded-full bg-white/10 p-2.5 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
        title={isFocusMode ? "Show controls (F)" : "Focus mode (F)"}
      >
        {isFocusMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  )
}
