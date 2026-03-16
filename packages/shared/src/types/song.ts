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

export interface ArtistSummary {
  id: string
  slug: string
  name: string
  nameTelugu: string | null
  avatarUrl: string | null
}

export interface Song {
  id: string
  slug: string
  title: string
  /** English canonical artist name — null when no artist is linked */
  artist: string | null
  /** Telugu artist name */
  artistNameTelugu?: string | null
  /** Artist page slug for navigation */
  artistSlug?: string | null
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
  /** Transliterated content (Roman script) */
  contentEnglish?: string
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

export interface SongAlbum {
  id: string
  slug: string
  title: string
  /** English canonical artist name — null when no artist is linked */
  artist: string | null
  /** Telugu artist name */
  artistNameTelugu?: string | null
  albumCoverUrl: string | null
}

export interface Album {
  id: string
  slug: string
  title: string
  artistName: string | null
  artistNameTelugu: string | null
  artistSlug: string | null
  albumCoverUrl: string | null
  language: string
  createdAt: string
  updatedAt: string
}

export interface Artist {
  id: string
  slug: string
  name: string
  nameTelugu: string | null
  avatarUrl: string | null
  isActive: boolean
}

/** Full song detail returned by GET /api/songs/:slug — includes sections, streaming links, and albums */
export interface SongDetail extends Song {
  artistAvatarUrl?: string | null
  sections: SongSection[]
  streamingLinks: StreamingLink[]
  /** Albums this song appears on — empty array if none */
  albums: SongAlbum[]
}
