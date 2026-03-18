import { LANGUAGE_LABELS } from "@/lib/constants"
import type { Song, SongSection, SectionType } from "@/types/song.types"
import { READING_MODES, type ReadingMode, type LyricsTab } from "./constants"

interface Props {
  song: Song
  sections: SongSection[]
  fontSize: number
  bold: boolean
  readingMode: ReadingMode
  lyricsTab: LyricsTab
  onTabChange: (tab: LyricsTab) => void
}

const SECTION_LABELS: Record<SectionType, string> = {
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

export function LyricsReader({
  song,
  sections,
  fontSize,
  bold,
  readingMode,
  lyricsTab,
  onTabChange,
}: Props) {
  const modeConfig = READING_MODES[readingMode]
  const hasSections = sections.length > 0
  const hasEnglish = !!song.lyricsEnglish || sections.some((s) => !!s.contentEnglish)

  const textStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: 2.3,
    fontWeight: bold ? 600 : 400,
    letterSpacing: "0.01em",
  }

  return (
    <div
      className="rounded-none shadow-none transition-colors duration-300 md:rounded-2xl md:shadow-sm md:ring-1 md:ring-black/5"
      style={modeConfig.containerStyle}
    >
      {/* Language tab bar — only when transliteration is available */}
      {hasEnglish && (
        <div className="flex border-b px-5 pt-4" style={{ borderColor: modeConfig.dividerColor }}>
          {(["native", "english"] as LyricsTab[]).map((tab) => {
            const isActive = lyricsTab === tab
            const label = tab === "native" ? LANGUAGE_LABELS[song.language] : "English"
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

      <div className="px-6 py-7">
        {hasSections ? (
          // Structured rendering — one block per section with label
          <div className="space-y-7">
            {sections.map((section) => {
              const content =
                lyricsTab === "english" && section.contentEnglish
                  ? section.contentEnglish
                  : section.content

              return (
                <div key={section.id}>
                  <p
                    className="mb-2 text-[10px] font-semibold tracking-widest uppercase"
                    style={{
                      color:
                        readingMode === "night"
                          ? "#6A5F8A"
                          : readingMode === "warm"
                            ? "#C4A06A"
                            : "var(--muted-foreground, #9CA3AF)",
                    }}
                  >
                    {getSectionLabel(section)}
                    {section.repeatCount && section.repeatCount > 1
                      ? ` ×${section.repeatCount}`
                      : ""}
                  </p>
                  <p className="whitespace-pre-wrap" style={textStyle}>
                    {content}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          // Fallback: raw lyrics string for unstructured songs
          <div className="whitespace-pre-wrap" style={textStyle}>
            {lyricsTab === "english" && song.lyricsEnglish ? song.lyricsEnglish : song.lyrics}
          </div>
        )}
      </div>
    </div>
  )
}
