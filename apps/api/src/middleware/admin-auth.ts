import type { MiddlewareHandler } from "hono"

const ADMIN_KEY_HEADER = "X-Admin-Key"

/**
 * Guards admin-only routes with a static bearer key stored in ADMIN_API_KEY.
 * Rejects with 401 if the header is missing or does not match.
 * Rejects with 500 if the env var is not configured.
 */
export const adminAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const configured = process.env.ADMIN_API_KEY
  if (!configured) {
    return c.json(
      { error: "Admin API key is not configured on the server.", status: 500 },
      500
    )
  }

  const provided = c.req.header(ADMIN_KEY_HEADER)
  if (!provided || provided !== configured) {
    return c.json(
      { error: `Missing or invalid ${ADMIN_KEY_HEADER} header.`, status: 401 },
      401
    )
  }

  await next()
}
