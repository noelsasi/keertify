export type Language = "te" | "en" | "hi" | "ta" | "ml"

export type Category =
  | "Praise"
  | "Worship"
  | "Thanksgiving"
  | "Prayer"
  | "Gospel"
  | "Comfort"
  | "Repentance"
  | "Commitment"
  | "Christmas"
  | "Good Friday"
  | "Easter"
  | "Second Coming"
  | "Kids"
  | "Marriage"
  | "Offering"
  | "Default"

export type SectionType =
  | "pallavi" // Telugu refrain — repeated throughout
  | "charnam" // Telugu verse
  | "verse" // English/Hindi verse
  | "chorus" // English/Hindi chorus
  | "bridge"
  | "pre-chorus"
  | "outro"
  | "interlude"

export interface Song {
  id: string
  slug: string
  title: string
  artist: string
  category: Category
  language: Language
  /** Native script — తెలుగు, हिन्दी, தமிழ் */
  lyrics: string
  /** Same lyrics in Roman/English script (transliteration) */
  lyricsEnglish?: string
  canonicalSlug: string
  sourceUrl: string
  isActive: boolean
  createdAt: string
}

export interface SongSection {
  id: string
  songId: string
  type: SectionType
  /** Charnam 1, Charnam 2... */
  number: number
  /** Render order */
  position: number
  content: string
  /** Stores (2) instruction */
  repeatCount?: number
  /** Stores ||ఆరాధన|| back-reference label */
  refLabel?: string
}

export interface StreamingLink {
  id: string
  songId: string
  platform: "youtube" | "spotify" | "apple" | "gaana" | "jiosaavn"
  url: string
}

// ---------------------------------------------------------------------------
// API request/response shapes — shared between apps/api and apps/web
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface ApiError {
  error: string
  code?: string
  status: number
}

export interface SongListQuery {
  language?: Language
  category?: Category
  search?: string
  page?: number
  pageSize?: number
}
