import { serve } from "@hono/node-server"
import { Hono } from "hono"
import { cors } from "hono/cors"
import { logger } from "hono/logger"
import { secureHeaders } from "hono/secure-headers"
import { trimTrailingSlash } from "hono/trailing-slash"
import type { AppEnv } from "./types/env.ts"
import { rateLimitMiddleware } from "./middleware/rate-limit.ts"
import { songsRouter } from "./routes/songs.ts"
import { categoriesRouter } from "./routes/categories.ts"
import { favouritesRouter } from "./routes/favourites.ts"
import { adminRouter } from "./routes/admin.ts"

const app = new Hono<AppEnv>()

// ---------------------------------------------------------------------------
// Global middleware
// ---------------------------------------------------------------------------

app.use(trimTrailingSlash())
app.use(secureHeaders())
app.use(logger())

const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())

app.use(
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "X-Session-ID"],
    exposeHeaders: ["X-Cache", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
    maxAge: 86400,
  })
)

// Global rate limit: 120 req/min per IP
app.use(
  "/api/*",
  rateLimitMiddleware({ limit: 120, window: 60 })
)

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

app.route("/api/songs", songsRouter)
app.route("/api/categories", categoriesRouter)
app.route("/api/favourites", favouritesRouter)
app.route("/api/admin", adminRouter)

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() })
})

// ---------------------------------------------------------------------------
// 404 fallback
// ---------------------------------------------------------------------------

app.notFound((c) => {
  return c.json({ error: "Not found", status: 404 }, 404)
})

// ---------------------------------------------------------------------------
// Error handler
// ---------------------------------------------------------------------------

app.onError((err, c) => {
  console.error("[unhandled error]", err)
  return c.json({ error: "Internal server error", status: 500 }, 500)
})

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const port = Number(process.env.PORT ?? 3000)

serve({ fetch: app.fetch, port }, () => {
  console.log(`[api] running on http://localhost:${port}`)
})

export default app
