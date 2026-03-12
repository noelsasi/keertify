import { eq, ilike, and, count, desc } from "drizzle-orm"
import type { Language, PaginatedResponse } from "@keertify/shared"
import { db } from "../db/index.ts"
import { songs, categories } from "../db/schema/index.ts"
import type { Song } from "../db/schema/songs.ts"

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

export interface SongListOptions {
  language?: Language
  category?: string
  search?: string
  page?: number
  pageSize?: number
}

export async function listSongs(
  opts: SongListOptions
): Promise<PaginatedResponse<Song & { categoryName: string }>> {
  const page = Math.max(1, opts.page ?? 1)
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, opts.pageSize ?? DEFAULT_PAGE_SIZE))
  const offset = (page - 1) * pageSize

  const conditions = [eq(songs.isActive, true)]

  if (opts.language) {
    conditions.push(eq(songs.language, opts.language))
  }

  if (opts.search) {
    const term = `%${opts.search}%`
    conditions.push(ilike(songs.title, term))
  }

  const where = and(...conditions)

  const [rows, totalRows] = await Promise.all([
    db()
      .select({
        id: songs.id,
        slug: songs.slug,
        canonicalSlug: songs.canonicalSlug,
        title: songs.title,
        artist: songs.artist,
        categoryId: songs.categoryId,
        categoryName: categories.name,
        language: songs.language,
        lyrics: songs.lyrics,
        lyricsEnglish: songs.lyricsEnglish,
        sourceUrl: songs.sourceUrl,
        isActive: songs.isActive,
        createdAt: songs.createdAt,
        updatedAt: songs.updatedAt,
      })
      .from(songs)
      .innerJoin(categories, eq(songs.categoryId, categories.id))
      .where(
        opts.category
          ? and(where, eq(categories.slug, opts.category))
          : where
      )
      .orderBy(desc(songs.createdAt))
      .limit(pageSize)
      .offset(offset),

    db()
      .select({ value: count() })
      .from(songs)
      .innerJoin(categories, eq(songs.categoryId, categories.id))
      .where(
        opts.category
          ? and(where, eq(categories.slug, opts.category))
          : where
      ),
  ])

  const total = totalRows[0]?.value ?? 0

  return {
    data: rows,
    total,
    page,
    pageSize,
    hasMore: offset + rows.length < total,
  }
}

export async function getSongBySlug(slug: string): Promise<Song | null> {
  const result = await db()
    .select()
    .from(songs)
    .where(and(eq(songs.slug, slug), eq(songs.isActive, true)))
    .limit(1)

  return result[0] ?? null
}
