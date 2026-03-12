import { Redis } from "@upstash/redis"

function createRedis(): Redis {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables are required"
    )
  }

  return new Redis({ url, token })
}

let _redis: Redis | null = null

export function redis(): Redis {
  if (!_redis) {
    _redis = createRedis()
  }
  return _redis
}

// ---------------------------------------------------------------------------
// Typed cache helpers
// ---------------------------------------------------------------------------

export const CACHE_TTL = {
  SONG_LIST: 60 * 5, // 5 min — list changes infrequently
  SONG_DETAIL: 60 * 30, // 30 min — individual song data is stable
  CATEGORIES: 60 * 60, // 1 hour
  FAVOURITES: 60 * 2, // 2 min — more dynamic, session-specific
} as const

export function cacheKey(...parts: string[]): string {
  return parts.join(":")
}
