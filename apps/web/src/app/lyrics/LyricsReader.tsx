import type { CSSProperties } from "react"
import { LANGUAGE_LABELS } from "@/lib/constants"
import { Pill } from "@/components/Pill"
import type { Song, SongSection, SectionType } from "@/types/song.types"
import type { LyricsTab } from "./constants"

interface Props {
  song: Song
  sections: SongSection[]
  fontSize: number
  bold: boolean
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

export function LyricsReader({ song, sections, fontSize, bold, lyricsTab, onTabChange }: Props) {
  const hasSections = sections.length > 0
  const hasEnglish = !!song.lyricsEnglish || sections.some((s) => !!s.contentEnglish)

  const textStyle: CSSProperties = {
    fontSize: `${fontSize}px`,
    lineHeight: 2.3,
    fontWeight: bold ? 600 : 400,
    letterSpacing: "0.01em",
    color: "var(--k-text-1)",
  }

  return (
    <div className="md:bg-k-surface text-k-text-1 dark:text-k-text-3 md:border-k-border transition-colors duration-300 md:rounded-2xl md:border">
      {/* Language tab bar — only when transliteration is available */}
      {hasEnglish && (
        <div className="border-k-border flex border-b px-5 pt-4">
          {(["native", "english"] as LyricsTab[]).map((tab) => {
            const isActive = lyricsTab === tab
            const label = tab === "native" ? LANGUAGE_LABELS[song.language] : "English"
            return (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className="relative mr-6 cursor-pointer pb-3 text-sm font-semibold transition-colors duration-150"
                style={{
                  color: isActive ? "var(--k-ink) dark:var(--k-text-3)" : "var(--k-text-3)",
                }}
              >
                {label}
                {isActive && (
                  <span className="bg-k-gold absolute right-0 bottom-0 left-0 h-0.5 rounded-full" />
                )}
              </button>
            )
          })}
        </div>
      )}

      <div className="px-5 py-6 md:px-7 md:py-7">
        {hasSections ? (
          <div className="space-y-8">
            {sections.map((section) => {
              const content =
                lyricsTab === "english" && section.contentEnglish
                  ? section.contentEnglish
                  : section.content

              return (
                <div key={section.id}>
                  <Pill variant="gold" dot="var(--k-gold)" className="mb-2.5 tracking-[1.5px]">
                    {getSectionLabel(section)}
                    {section.repeatCount && section.repeatCount > 1
                      ? ` ×${section.repeatCount}`
                      : ""}
                  </Pill>
                  <p className="whitespace-pre-wrap" style={textStyle}>
                    {content}
                  </p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="whitespace-pre-wrap" style={textStyle}>
            {lyricsTab === "english" && song.lyricsEnglish ? song.lyricsEnglish : song.lyrics}
          </div>
        )}
      </div>
    </div>
  )
}
