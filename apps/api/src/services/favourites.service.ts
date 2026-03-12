import { eq, and, desc } from "drizzle-orm"
import { db } from "../db/index.ts"
import { favourites, songs, categories } from "../db/schema/index.ts"
import type { Song } from "../db/schema/songs.ts"

export async function getFavourites(sessionId: string): Promise<Song[]> {
  const rows = await db()
    .select({ song: songs })
    .from(favourites)
    .innerJoin(songs, eq(favourites.songId, songs.id))
    .innerJoin(categories, eq(songs.categoryId, categories.id))
    .where(and(eq(favourites.sessionId, sessionId), eq(songs.isActive, true)))
    .orderBy(desc(favourites.createdAt))

  return rows.map((r) => r.song)
}

export async function addFavourite(
  sessionId: string,
  songId: string
): Promise<{ id: string }> {
  const existing = await db()
    .select({ id: favourites.id })
    .from(favourites)
    .where(and(eq(favourites.sessionId, sessionId), eq(favourites.songId, songId)))
    .limit(1)

  if (existing[0]) {
    return { id: existing[0].id }
  }

  const inserted = await db()
    .insert(favourites)
    .values({ sessionId, songId })
    .returning({ id: favourites.id })

  const row = inserted[0]
  if (!row) throw new Error("Insert failed — no row returned")
  return { id: row.id }
}

export async function removeFavourite(sessionId: string, songId: string): Promise<void> {
  await db()
    .delete(favourites)
    .where(and(eq(favourites.sessionId, sessionId), eq(favourites.songId, songId)))
}

export async function isFavourited(sessionId: string, songId: string): Promise<boolean> {
  const result = await db()
    .select({ id: favourites.id })
    .from(favourites)
    .where(and(eq(favourites.sessionId, sessionId), eq(favourites.songId, songId)))
    .limit(1)

  return result.length > 0
}
