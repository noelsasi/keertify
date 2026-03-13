import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { AppEnv } from "../types/env.ts"
import { ingestSong, insertParsedSong } from "../scraper/ingestion.ts"
import { parseSongsFromCategoryPage } from "../scraper/category.ts"
import { rateLimitMiddleware } from "../middleware/rate-limit.ts"
import { invalidateCache } from "../middleware/cache.ts"
import { cacheKey } from "../lib/redis.ts"

const ingestBodySchema = z.object({
  /** Full URL of the christianlyricz.com song page to scrape */
  url: z.string().url(),
  /**
   * Slug of an existing category to assign the song to.
   * Defaults to "default" if omitted.
   */
  categorySlug: z.string().min(1).optional(),
  /**
   * When true, overwrite an existing song with the same slug and replace its
   * sections. When false (default), a duplicate slug is a no-op.
   */
  upsert: z.boolean().optional().default(false),
})

export const adminRouter = new Hono<AppEnv>()

// Tighter rate limit for admin operations: 20 req/min
adminRouter.use(rateLimitMiddleware({ limit: 20, window: 60 }))

/**
 * POST /api/admin/ingest
 *
 * Scrapes the given URL, parses the song, and inserts (or updates) it in the
 * database along with its sections.
 *
 * Request body:
 *   { url, categorySlug?, upsert? }
 *
 * Responses:
 *   201 — song was freshly inserted
 *   200 — song was updated (upsert: true) or skipped (already exists)
 *   400 — validation error
 *   401 — invalid or missing X-Admin-Key
 *   422 — scraping or DB error (e.g. category not found, parse failure)
 */
adminRouter.post(
  "/ingest",
  zValidator("json", ingestBodySchema),
  async (c) => {
    const { url, categorySlug, upsert } = c.req.valid("json")

    let result
    try {
      result = await ingestSong(url, { categorySlug, upsert })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      return c.json({ error: `Failed to ingest song: ${message}`, status: 422 }, 422)
    }

    if (result.action !== "skipped") {
      await Promise.allSettled([
        invalidateCache(cacheKey("songs")),
        invalidateCache(cacheKey("song", result.slug)),
      ])
    }

    const status = result.action === "inserted" ? 201 : 200

    return c.json(
      {
        action: result.action,
        songId: result.songId,
        slug: result.slug,
        title: result.title,
        artist: result.artist,
        sections: result.sectionCount,
      },
      status
    )
  }
)

// ---------------------------------------------------------------------------
// POST /api/admin/ingest-bulk
//
// Accepts a list of category page URLs, extracts all song links from each,
// and ingests every song using the same logic as /ingest.
//
// Request body:
//   { urls, categorySlug?, upsert? }
//
// Response:
//   { total, success, failed, results: [{ songUrl, categoryUrl, slug?, title?,
//     action?, sectionCount?, status: "success"|"failed", reason? }] }
// ---------------------------------------------------------------------------

const ingestBulkBodySchema = z.object({
  urls: z.array(z.string().url()).min(1),
  categorySlug: z.string().min(1).optional(),
  upsert: z.boolean().optional().default(false),
})

adminRouter.post("/ingest-bulk", zValidator("json", ingestBulkBodySchema), async (c) => {
  const { urls, categorySlug, upsert } = c.req.valid("json")

  type SongResult = {
    categoryUrl: string
    songUrl: string
    slug?: string
    title?: string
    action?: "inserted" | "updated" | "skipped"
    sectionCount?: number
    status: "success" | "failed"
    reason?: string
  }

  const results: SongResult[] = []
  let anyChanged = false

  for (const categoryUrl of urls) {
    // Step 1: Fetch the category page and parse all songs from it directly —
    // no per-song HTTP requests needed since the page embeds full content
    let parsedSongs: Awaited<ReturnType<typeof parseSongsFromCategoryPage>>
    try {
      parsedSongs = await parseSongsFromCategoryPage(categoryUrl)
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Unknown error"
      return c.json({ error: `Failed to fetch category page: ${reason}` }, 422)
    }

    // Step 2: Insert each parsed song into the DB
    for (const parsed of parsedSongs) {
      // Skip insert entirely if no sections were parsed (e.g. password-protected posts)
      if (parsed.sections.length === 0) {
        results.push({
          categoryUrl,
          songUrl: parsed.sourceUrl,
          title: parsed.title,
          status: "failed",
          reason: "no sections parsed",
        })
        continue
      }

      try {
        const result = await insertParsedSong(parsed, { categorySlug, upsert })

        if (result.action !== "skipped") {
          anyChanged = true
        }

        results.push({
          categoryUrl,
          songUrl: parsed.sourceUrl,
          slug: result.slug,
          title: result.title,
          action: result.action,
          sectionCount: result.sectionCount,
          status: "success",
        })
      } catch (err) {
        results.push({
          categoryUrl,
          songUrl: parsed.sourceUrl,
          title: parsed.title,
          status: "failed",
          reason: err instanceof Error ? err.message : "Unknown error",
        })
      }
    }
  }

  // Invalidate song list cache once if anything was written
  if (anyChanged) {
    await invalidateCache(cacheKey("songs"))
  }

  const success = results.filter((r) => r.status === "success").length
  const failed = results.filter((r) => r.status === "failed").length

  return c.json({ total: results.length, success, failed, results })
})
