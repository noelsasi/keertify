import type { MiddlewareHandler } from "hono"
import { redis, cacheKey } from "../lib/redis.ts"

interface CacheOptions {
  /** Cache TTL in seconds */
  ttl: number
  /**
   * Function that derives the cache key from the request context.
   * Defaults to using the full request URL path + search params.
   */
  keyFn?: (c: Parameters<MiddlewareHandler>[0]) => string
}

/**
 * HTTP-level cache middleware backed by Upstash Redis.
 * Caches the full JSON response body for GET requests only.
 * Cache is bypassed for non-GET methods (they fall through to the handler).
 */
export function cacheMiddleware(options: CacheOptions): MiddlewareHandler {
  return async (c, next) => {
    // Skip all Redis I/O in dev — set DISABLE_CACHE=true in .env
    if (process.env.DISABLE_CACHE === "true") {
      await next()
      return
    }

    if (c.req.method !== "GET") {
      await next()
      return
    }

    const key = options.keyFn
      ? cacheKey("http", options.keyFn(c))
      : cacheKey("http", c.req.url)

    try {
      const cached = await redis().get<unknown>(key)
      if (cached !== null) {
        return c.json(cached, 200, { "X-Cache": "HIT" })
      }
    } catch {
      // Cache read failure — degrade gracefully, continue to handler
    }

    await next()

    // Only cache successful responses — fire-and-forget so the write doesn't block
    if (c.res.status === 200) {
      try {
        const cloned = c.res.clone()
        const body = await cloned.json()
        // Intentionally not awaited: client gets the response immediately
        redis()
          .set(key, body, { ex: options.ttl })
          .catch(() => {})
        c.res.headers.set("X-Cache", "MISS")
      } catch {
        // Body parse failure is non-fatal
      }
    }
  }
}

/**
 * Invalidates all cache keys matching a given prefix pattern.
 * Use after write operations (create/update/delete).
 */
export async function invalidateCache(prefix: string): Promise<void> {
  try {
    const r = redis()
    const keys = await r.keys(`${prefix}*`)
    if (keys.length > 0) {
      await r.del(...keys)
    }
  } catch {
    // Redis unavailable — skip invalidation, not fatal
  }
}
