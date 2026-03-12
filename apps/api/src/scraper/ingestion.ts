import { eq } from "drizzle-orm"
import { db } from "../db/index.ts"
import { songs, songSections, categories } from "../db/schema/index.ts"
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
  const categoryId = await resolveCategoryId(opts.categorySlug ?? "default")

  const [existing] = await db()
    .select({ id: songs.id })
    .from(songs)
    .where(eq(songs.slug, parsed.slug))
    .limit(1)

  if (existing && !opts.upsert) {
    return { action: "skipped", songId: existing.id, slug: parsed.slug }
  }

  if (existing) {
    return updateSong(existing.id, parsed, categoryId)
  }

  return createSong(parsed, categoryId)
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Returns the id for the given category slug, creating the category first if
 * it does not already exist. The name is derived from the slug by title-casing
 * each hyphen-separated word (e.g. "good-friday" → "Good Friday").
 */
async function resolveCategoryId(slug: string): Promise<string> {
  const [existing] = await db()
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)

  if (existing) return existing.id

  const name = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  const id = crypto.randomUUID()

  await db().insert(categories).values({ id, slug, name }).onConflictDoNothing()

  // Re-fetch in case a concurrent insert won the race
  const [row] = await db()
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)

  if (!row) throw new Error(`Failed to create category "${slug}".`)

  return row.id
}

// The neon-http driver does not support transactions, so we sequence the
// writes manually and compensate (delete) on section-insert failure.

async function createSong(parsed: ParsedSong, categoryId: string): Promise<IngestResult> {
  const songId = crypto.randomUUID()

  await db().insert(songs).values({
    id: songId,
    slug: parsed.slug,
    canonicalSlug: parsed.slug,
    title: parsed.title,
    artist: parsed.artist,
    categoryId,
    language: parsed.language,
    lyrics: parsed.lyrics,
    lyricsEnglish: parsed.lyricsEnglish ?? null,
    sourceUrl: parsed.sourceUrl,
    isActive: true,
  })

  if (parsed.sections.length > 0) {
    try {
      await db().insert(songSections).values(toSectionRows(songId, parsed.sections))
    } catch (err) {
      // Roll back the song row so we don't leave an orphan without sections
      await db().delete(songs).where(eq(songs.id, songId))
      throw err
    }
  }

  return { action: "inserted", songId, slug: parsed.slug }
}

async function updateSong(
  songId: string,
  parsed: ParsedSong,
  categoryId: string
): Promise<IngestResult> {
  await db()
    .update(songs)
    .set({
      title: parsed.title,
      artist: parsed.artist,
      categoryId,
      language: parsed.language,
      lyrics: parsed.lyrics,
      lyricsEnglish: parsed.lyricsEnglish ?? null,
      sourceUrl: parsed.sourceUrl,
      updatedAt: new Date(),
    })
    .where(eq(songs.id, songId))

  // Replace sections wholesale — delete then re-insert
  await db().delete(songSections).where(eq(songSections.songId, songId))

  if (parsed.sections.length > 0) {
    await db().insert(songSections).values(toSectionRows(songId, parsed.sections))
  }

  return { action: "updated", songId, slug: parsed.slug }
}

/**
 * Maps parsed section objects to the shape expected by the `song_sections`
 * table. Note: `number` and `position` are stored as `text` in the schema.
 */
function toSectionRows(songId: string, sections: ParsedSection[]) {
  return sections.map((s) => ({
    songId,
    type: s.type,
    number: String(s.number),
    position: String(s.position),
    content: s.content,
    repeatCount: s.repeatCount != null ? String(s.repeatCount) : null,
    refLabel: s.refLabel ?? null,
  }))
}
