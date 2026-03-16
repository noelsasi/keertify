import { eq, ilike } from "drizzle-orm"
import { db } from "../db/index.ts"
import { songs, songSections, streamingLinks, artists } from "../db/schema/index.ts"
import { parseSong, type ParsedSong, type ParsedSection } from "./parser.ts"

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export interface IngestOptions {
  /**
   * Slug of the category to assign the song to.
   * The category must already exist in the database.
   * Defaults to "default".
   */
  categorySlug?: string
  /**
   * When true, overwrite the existing song and replace its sections if the
   * slug already exists. When false (default), skip silently.
   */
  upsert?: boolean
}

export type IngestAction = "inserted" | "updated" | "skipped"

export interface IngestResult {
  action: IngestAction
  songId: string
  slug: string
  title: string
  artistName: string | null
  sectionCount: number
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches the song at `url`, parses it, and inserts (or updates) it in the
 * database. Returns a result describing what happened.
 */
export async function ingestSong(url: string, opts: IngestOptions = {}): Promise<IngestResult> {
  const parsed = await parseSong(url)
  return insertParsedSong(parsed, opts)
}

/**
 * Inserts (or updates) an already-parsed song in the database.
 * Separated from `ingestSong` to allow pre-fetched/test data to be inserted
 * without making a network request.
 */
export async function insertParsedSong(
  parsed: ParsedSong,
  opts: IngestOptions = {}
): Promise<IngestResult> {
  const categorySlug = opts.categorySlug || "default"

  const [existing] = await db()
    .select({ id: songs.id })
    .from(songs)
    .where(eq(songs.slug, parsed.slug))
    .limit(1)

  if (existing && !opts.upsert) {
    return {
      action: "skipped",
      songId: existing.id,
      slug: parsed.slug,
      title: parsed.title,
      artistName: parsed.artistEnglish ?? null,
      sectionCount: parsed.sections.length,
    }
  }

  return createSong(parsed, categorySlug)
}

async function createSong(parsed: ParsedSong, categorySlug: string): Promise<IngestResult> {
  const songId = crypto.randomUUID()

  // Resolve or create the artist record before inserting the song
  const artistId = parsed.artistEnglish
    ? await upsertArtist(parsed.artistEnglish, parsed.artist)
    : null

  await db()
    .insert(songs)
    .values({
      id: songId,
      slug: parsed.slug,
      canonicalSlug: parsed.slug,
      title: parsed.title,
      artistId,
      category: categorySlug,
      language: parsed.language,
      lyrics: parsed.lyrics,
      lyricsEnglish: parsed.lyricsEnglish ?? null,
      sourceUrl: parsed.sourceUrl,
      isActive: true,
    })

  // sections and streaming_links are independent — run them concurrently
  const writes: Promise<unknown>[] = []

  if (parsed.sections.length > 0) {
    writes.push(db().insert(songSections).values(toSectionRows(songId, parsed.sections, parsed.sectionsEnglish)))
  }

  if (parsed.youtubeUrl) {
    writes.push(
      db().insert(streamingLinks).values({ songId, platform: "youtube", url: parsed.youtubeUrl })
    )
  }

  if (writes.length > 0) {
    try {
      await Promise.all(writes)
    } catch (err) {
      // Roll back the song row to avoid leaving an orphan
      await db().delete(songs).where(eq(songs.id, songId))
      throw err
    }
  }

  return {
    action: "inserted",
    songId,
    slug: parsed.slug,
    title: parsed.title,
    artistName: parsed.artistEnglish ?? null,
    sectionCount: parsed.sections.length,
  }
}

/**
 * Finds an existing artist by English name (case-insensitive) or creates a new one.
 * English name is the canonical identity — the same artist across Telugu/Tamil/etc. songs.
 */
async function upsertArtist(nameEnglish: string, nameTelugu?: string | null): Promise<string> {
  const [existing] = await db()
    .select({ id: artists.id })
    .from(artists)
    .where(ilike(artists.name, nameEnglish))
    .limit(1)

  if (existing) return existing.id

  const id = crypto.randomUUID()
  const slug = generateArtistSlug(nameEnglish, id)

  await db().insert(artists).values({
    id,
    slug,
    name: nameEnglish,
    nameTelugu: nameTelugu ?? null,
    isActive: true,
  })

  return id
}

/**
 * Generates a URL-safe slug from the English artist name.
 * Falls back to artist-{uuid prefix} when the name has no ASCII characters.
 */
function generateArtistSlug(nameEnglish: string, fallbackId: string): string {
  const slugified = nameEnglish
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slugified.length > 0 ? slugified : `artist-${fallbackId.slice(0, 8)}`
}

/**
 * Maps parsed section objects to the shape expected by the `song_sections`
 * table. Note: `number` and `position` are stored as `text` in the schema.
 */
function toSectionRows(songId: string, sections: ParsedSection[], sectionsEnglish: ParsedSection[]) {
  return sections.map((s, i) => ({
    songId,
    type: s.type,
    number: String(s.number),
    position: String(s.position),
    content: s.content,
    contentEnglish: sectionsEnglish[i]?.content ?? null,
    repeatCount: s.repeatCount != null ? String(s.repeatCount) : null,
    refLabel: s.refLabel ?? null,
  }))
}
