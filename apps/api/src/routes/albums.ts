import { Hono } from "hono"
import type { AppEnv } from "../types/env.ts"
import { listAlbums, getAlbumBySlug } from "../services/albums.service.ts"
import { cacheMiddleware } from "../middleware/cache.ts"
import { CACHE_TTL, cacheKey } from "../lib/redis.ts"
import type { Language } from "@keertify/shared"

export const albumsRouter = new Hono<AppEnv>()

albumsRouter.get(
  "/",
  cacheMiddleware({
    ttl: CACHE_TTL.CATEGORIES, // 1 hour — same as categories
    keyFn: (c) => {
      const language = c.req.query("language")
      return cacheKey("http", "albums", language ?? "all")
    },
  }),
  async (c) => {
    const language = c.req.query("language") as Language | undefined
    const data = await listAlbums({ language })
    return c.json(data)
  }
)

albumsRouter.get(
  "/:slug",
  cacheMiddleware({
    ttl: CACHE_TTL.SONG_DETAIL, // 30 min
    keyFn: (c) => cacheKey("http", "albums", c.req.param("slug")),
  }),
  async (c) => {
    const slug = c.req.param("slug")
    const album = await getAlbumBySlug(slug)

    if (!album) {
      return c.json({ error: "Album not found", status: 404 }, 404)
    }

    return c.json(album)
  }
)
