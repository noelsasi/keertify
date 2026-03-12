/**
 * Typed Hono context bindings.
 * `c.var.sessionId` is set by the session middleware and is always a valid v4 UUID.
 */
export type AppEnv = {
  Variables: {
    sessionId: string
  }
}
