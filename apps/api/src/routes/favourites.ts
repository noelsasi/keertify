import { Hono } from "hono"
import { zValidator } from "@hono/zod-validator"
import { z } from "zod"
import type { AppEnv } from "../types/env.ts"
import { sessionMiddleware } from "../middleware/session.ts"
import { cacheMiddleware, invalidateCache } from "../middleware/cache.ts"
import {
  getFavourites,
  addFavourite,
  removeFavourite,
} from "../services/favourites.service.ts"
import { CACHE_TTL, cacheKey } from "../lib/redis.ts"

const songIdSchema = z.object({
  songId: z.string().uuid(),
})

export const favouritesRouter = new Hono<AppEnv>()

// All favourites routes require a valid session
favouritesRouter.use("*", sessionMiddleware)

favouritesRouter.get(
  "/",
  cacheMiddleware({
    ttl: CACHE_TTL.FAVOURITES,
    keyFn: (c) => cacheKey("favourites", c.var.sessionId),
  }),
  async (c) => {
    const data = await getFavourites(c.var.sessionId)
    return c.json(data)
  }
)

favouritesRouter.post("/", zValidator("json", songIdSchema), async (c) => {
  const { songId } = c.req.valid("json")
  const result = await addFavourite(c.var.sessionId, songId)
  await invalidateCache(cacheKey("favourites", c.var.sessionId))
  return c.json(result, 201)
})

favouritesRouter.delete("/:songId", async (c) => {
  const songId = c.req.param("songId")

  const parsed = z.string().uuid().safeParse(songId)
  if (!parsed.success) {
    return c.json({ error: "Invalid songId — must be a UUID", status: 400 }, 400)
  }

  await removeFavourite(c.var.sessionId, songId)
  await invalidateCache(cacheKey("favourites", c.var.sessionId))
  return c.body(null, 204)
})
