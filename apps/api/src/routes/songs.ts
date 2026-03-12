import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { AppEnv } from "../types/env.ts"
import { listSongs, getSongBySlug } from "../services/songs.service.ts"
import { cacheMiddleware, invalidateCache } from "../middleware/cache.ts"
import { CACHE_TTL, cacheKey } from "../lib/redis.ts"

const LANGUAGE_VALUES = ["te", "en", "hi", "ta", "ml"] as const

const listQuerySchema = z.object({
  language: z.enum(LANGUAGE_VALUES).optional(),
  category: z.string().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
})

export const songsRouter = new Hono<AppEnv>()

songsRouter.get(
  "/",
  cacheMiddleware({
    ttl: CACHE_TTL.SONG_LIST,
    keyFn: (c) => cacheKey("songs", new URL(c.req.url).search),
  }),
  zValidator("query", listQuerySchema),
  async (c) => {
    const query = c.req.valid("query")
    const result = await listSongs(query)
    return c.json(result)
  }
)

songsRouter.get(
  "/:slug",
  cacheMiddleware({
    ttl: CACHE_TTL.SONG_DETAIL,
    keyFn: (c) => cacheKey("song", c.req.param("slug") ?? ""),
  }),
  async (c) => {
    const slug = c.req.param("slug")
    const song = await getSongBySlug(slug)

    if (!song) {
      return c.json({ error: "Song not found", status: 404 }, 404)
    }

    return c.json(song)
  }
)

// Admin: invalidate song cache (e.g. after CMS update)
songsRouter.post("/:slug/invalidate-cache", async (c) => {
  const slug = c.req.param("slug")
  await Promise.all([
    invalidateCache(cacheKey("song", slug)),
    invalidateCache(cacheKey("songs")),
  ])
  return c.json({ ok: true })
})
