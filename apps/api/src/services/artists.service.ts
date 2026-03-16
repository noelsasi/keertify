import { eq, and, desc } from "drizzle-orm"
import { db } from "../db/index.ts"
import { artists, songs, albums, albumSongs, categories } from "../db/schema/index.ts"
import type { Artist } from "../db/schema/artists.ts"

export interface ArtistListItem {
  id: string
  slug: string
  name: string
  nameTelugu: string | null
  avatarUrl: string | null
  isActive: boolean
}

export interface ArtistSongItem {
  id: string
  slug: string
  title: string
  category: string
  language: string
  createdAt: Date
}

export interface ArtistAlbumItem {
  id: string
  slug: string
  title: string
  albumCoverUrl: string | null
  language: string
}

export interface ArtistDetail extends ArtistListItem {
  createdAt: Date
  updatedAt: Date
  songs: ArtistSongItem[]
  albums: ArtistAlbumItem[]
}

export async function listArtists(): Promise<ArtistListItem[]> {
  return db()
    .select({
      id: artists.id,
      slug: artists.slug,
      name: artists.name,
      nameTelugu: artists.nameTelugu,
      avatarUrl: artists.avatarUrl,
      isActive: artists.isActive,
    })
    .from(artists)
    .where(eq(artists.isActive, true))
    .orderBy(artists.name)
}

export async function getArtistBySlug(slug: string): Promise<ArtistDetail | null> {
  const [artist] = await db()
    .select()
    .from(artists)
    .where(and(eq(artists.slug, slug), eq(artists.isActive, true)))
    .limit(1)

  if (!artist) return null

  const a = artist as Artist

  const [songRows, albumRows] = await Promise.all([
    db()
      .select({
        id: songs.id,
        slug: songs.slug,
        title: songs.title,
        category: categories.name,
        language: songs.language,
        createdAt: songs.createdAt,
      })
      .from(songs)
      .innerJoin(categories, eq(songs.category, categories.slug))
      .where(and(eq(songs.artistId, a.id), eq(songs.isActive, true)))
      .orderBy(desc(songs.createdAt)),

    db()
      .select({
        id: albums.id,
        slug: albums.slug,
        title: albums.title,
        albumCoverUrl: albums.albumCoverUrl,
        language: albums.language,
      })
      .from(albums)
      .where(and(eq(albums.artistId, a.id), eq(albums.isActive, true)))
      .orderBy(desc(albums.createdAt)),
  ])

  return {
    id: a.id,
    slug: a.slug,
    name: a.name,
    nameTelugu: a.nameTelugu,
    avatarUrl: a.avatarUrl,
    isActive: a.isActive,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    songs: songRows,
    albums: albumRows,
  }
}
