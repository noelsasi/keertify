import { Hono } from "hono"
import type { AppEnv } from "../types/env.ts"
import { listArtists, getArtistBySlug } from "../services/artists.service.ts"
import { cacheMiddleware } from "../middleware/cache.ts"
import { CACHE_TTL, cacheKey } from "../lib/redis.ts"

export const artistsRouter = new Hono<AppEnv>()

artistsRouter.get(
  "/",
  cacheMiddleware({
    ttl: CACHE_TTL.ARTISTS,
    keyFn: () => cacheKey("http", "artists"),
  }),
  async (c) => {
    const data = await listArtists()
    return c.json(data)
  }
)

artistsRouter.get(
  "/:slug",
  cacheMiddleware({
    ttl: CACHE_TTL.SONG_DETAIL,
    keyFn: (c) => cacheKey("http", "artists", c.req.param("slug")),
  }),
  async (c) => {
    const slug = c.req.param("slug")
    const artist = await getArtistBySlug(slug)

    if (!artist) {
      return c.json({ error: "Artist not found", status: 404 }, 404)
    }

    return c.json(artist)
  }
)
