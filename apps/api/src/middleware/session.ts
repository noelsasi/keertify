import type { MiddlewareHandler } from "hono"
import type { AppEnv } from "../types/env.ts"
import { SESSION_HEADER, isValidSessionId } from "../lib/session.ts"

/**
 * Extracts and validates the X-Session-ID header.
 * Returns 400 if the header is missing or not a valid v4 UUID.
 * Sets `c.var.sessionId` on success.
 */
export const sessionMiddleware: MiddlewareHandler<AppEnv> = async (c, next) => {
  const raw = c.req.header(SESSION_HEADER)

  if (!isValidSessionId(raw)) {
    return c.json(
      { error: "Missing or invalid X-Session-ID header. Must be a v4 UUID.", status: 400 },
      400
    )
  }

  c.set("sessionId", raw)
  await next()
}
