import { eq } from "drizzle-orm"
import { db } from "../db/index.ts"
import { songs, songSections, streamingLinks } from "../db/schema/index.ts"
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
  artist: string
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
      artist: parsed.artist,
      sectionCount: parsed.sections.length,
    }
  }

  return createSong(parsed, categorySlug)
}

async function createSong(parsed: ParsedSong, categorySlug: string): Promise<IngestResult> {
  const songId = crypto.randomUUID()

  await db()
    .insert(songs)
    .values({
      id: songId,
      slug: parsed.slug,
      canonicalSlug: parsed.slug,
      title: parsed.title,
      artist: parsed.artist,
      artistEnglish: parsed.artistEnglish ?? null,
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
    artist: parsed.artist,
    sectionCount: parsed.sections.length,
  }
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
