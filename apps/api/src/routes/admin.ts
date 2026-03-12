import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { AppEnv } from "../types/env.ts"
import { insertParsedSong } from "../scraper/ingestion.ts"
import { parseSong } from "../scraper/parser.ts"
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

    let parsed
    try {
      parsed = await parseSong(url)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown scraping error"
      return c.json({ error: `Failed to scrape URL: ${message}`, status: 422 }, 422)
    }

    let result
    try {
      result = await insertParsedSong(parsed, { categorySlug, upsert })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown DB error"
      return c.json({ error: `Failed to insert song: ${message}`, status: 422 }, 422)
    }

    // Bust caches so the new/updated song is immediately visible
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
        title: parsed.title,
        artist: parsed.artist,
        sections: parsed.sections.length,
      },
      status
    )
  }
)
