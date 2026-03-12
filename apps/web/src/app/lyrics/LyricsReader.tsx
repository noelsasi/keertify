import { LANGUAGE_LABELS } from "@/lib/mock-data"
import type { Song } from "@/types/song.types"
import { READING_MODES, type ReadingMode, type LyricsTab } from "./constants"

interface Props {
  song: Song
  fontSize: number
  bold: boolean
  readingMode: ReadingMode
  lyricsTab: LyricsTab
  onTabChange: (tab: LyricsTab) => void
}

export function LyricsReader({
  song,
  fontSize,
  bold,
  readingMode,
  lyricsTab,
  onTabChange,
}: Props) {
  const modeConfig = READING_MODES[readingMode]

  return (
    <div
      className="rounded-none shadow-none transition-colors duration-300 md:rounded-2xl md:shadow-sm md:ring-1 md:ring-black/5"
      style={modeConfig.containerStyle}
    >
      {/* Tab bar — only if English transliteration exists */}
      {song.lyricsEnglish && (
        <div
          className="flex border-b px-5 pt-4"
          style={{ borderColor: modeConfig.dividerColor }}
        >
          {(["native", "english"] as LyricsTab[]).map((tab) => {
            const isActive = lyricsTab === tab
            const label =
              tab === "native" ? LANGUAGE_LABELS[song.language] : "English"
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className="relative mr-6 pb-3 text-sm font-semibold transition-colors duration-150"
                style={{
                  color: isActive
                    ? readingMode === "night"
                      ? "#C4B8F0"
                      : readingMode === "warm"
                        ? "#7A4A10"
                        : "var(--brand-navy)"
                    : readingMode === "night"
                      ? "#4A4060"
                      : readingMode === "warm"
                        ? "#C4A06A"
                        : "#C4C4C4",
                }}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full"
                    style={{
                      backgroundColor:
                        readingMode === "night"
                          ? "#9D8FCC"
                          : readingMode === "warm"
                            ? "#A06820"
                            : "var(--brand-gold)",
                    }}
                  />
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* Lyrics */}
      <div className="px-6 py-7">
        <div
          className="whitespace-pre-wrap"
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: 2.3,
            fontWeight: bold ? 600 : 400,
            letterSpacing: "0.01em",
          }}
        >
          {lyricsTab === "english" && song.lyricsEnglish
            ? song.lyricsEnglish
            : song.lyrics}
        </div>
      </div>
    </div>
  )
}
