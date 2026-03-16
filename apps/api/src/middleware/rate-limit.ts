import type { MiddlewareHandler } from "hono"
import { redis } from "../lib/redis.ts"

interface RateLimitOptions {
  /** Max requests allowed within the window */
  limit: number
  /** Window size in seconds */
  window: number
  /**
   * Function to derive the rate limit key from the request.
   * Defaults to the client IP address.
   */
  keyFn?: (c: Parameters<MiddlewareHandler>[0]) => string
}

/**
 * Sliding window rate limiter backed by Upstash Redis.
 * Uses a simple fixed-window counter via INCR + EXPIRE.
 */
export function rateLimitMiddleware(options: RateLimitOptions): MiddlewareHandler {
  return async (c, next) => {
    // Skip rate limiting in dev — set DISABLE_CACHE=true in .env
    if (process.env.DISABLE_CACHE === "true") {
      await next()
      return
    }

    const identifier = options.keyFn
      ? options.keyFn(c)
      : (c.req.header("x-forwarded-for") ?? c.req.header("x-real-ip") ?? "unknown")

    const key = `rl:${c.req.path}:${identifier}`

    try {
      const r = redis()
      // Single round-trip: INCR + EXPIRE NX (only set TTL if key is new)
      const [current] = await r
        .pipeline()
        .incr(key)
        .expire(key, options.window, "nx")
        .exec() as [number, number]

      c.res.headers.set("X-RateLimit-Limit", String(options.limit))
      c.res.headers.set("X-RateLimit-Remaining", String(Math.max(0, options.limit - current)))

      if (current > options.limit) {
        return c.json(
          { error: "Too many requests. Please slow down.", status: 429 },
          429,
          { "Retry-After": String(options.window) }
        )
      }
    } catch {
      // Redis failure — fail open, let the request through
    }

    await next()
  }
}
