import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema/index.ts"

function getDb() {
  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error("DATABASE_URL environment variable is not set")
  }
  const sql = neon(url)
  return drizzle(sql, { schema, logger: process.env.NODE_ENV === "development" })
}

// Singleton — reuse across requests in the same process lifetime
let _db: ReturnType<typeof getDb> | null = null

export function db() {
  if (!_db) {
    _db = getDb()
  }
  return _db
}

export type Db = ReturnType<typeof db>
