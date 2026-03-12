import { Hono } from "hono"
import type { AppEnv } from "../types/env.ts"
import { listCategories, getCategoryBySlug } from "../services/categories.service.ts"
import { cacheMiddleware } from "../middleware/cache.ts"
import { CACHE_TTL, cacheKey } from "../lib/redis.ts"

export const categoriesRouter = new Hono<AppEnv>()

categoriesRouter.get(
  "/",
  cacheMiddleware({
    ttl: CACHE_TTL.CATEGORIES,
    keyFn: () => cacheKey("categories"),
  }),
  async (c) => {
    const data = await listCategories()
    return c.json(data)
  }
)

categoriesRouter.get("/:slug", async (c) => {
  const slug = c.req.param("slug")
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return c.json({ error: "Category not found", status: 404 }, 404)
  }

  return c.json(category)
})
