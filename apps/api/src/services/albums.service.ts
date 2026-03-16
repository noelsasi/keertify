import { eq, and, asc, desc } from "drizzle-orm"
import type { Language } from "@keertify/shared"
import { db } from "../db/index.ts"
import { albums, albumSongs, songs, categories, artists } from "../db/schema/index.ts"

export interface AlbumListItem {
  id: string
  slug: string
  title: string
  artistName: string | null
  artistNameTelugu: string | null
  artistSlug: string | null
  albumCoverUrl: string | null
  language: string
  createdAt: Date
  updatedAt: Date
}

export interface AlbumSongItem {
  id: string
  slug: string
  title: string
  artistName: string | null
  artistNameTelugu: string | null
  category: string
  language: string
  trackNumber: number
}

export interface AlbumDetail extends AlbumListItem {
  songs: AlbumSongItem[]
}

export async function listAlbums(opts: { language?: Language } = {}): Promise<AlbumListItem[]> {
  const conditions = [eq(albums.isActive, true)]

  if (opts.language) {
    conditions.push(eq(albums.language, opts.language))
  }

  return db()
    .select({
      id: albums.id,
      slug: albums.slug,
      title: albums.title,
      artistName: artists.name,
      artistNameTelugu: artists.nameTelugu,
      artistSlug: artists.slug,
      albumCoverUrl: albums.albumCoverUrl,
      language: albums.language,
      createdAt: albums.createdAt,
      updatedAt: albums.updatedAt,
    })
    .from(albums)
    .leftJoin(artists, eq(albums.artistId, artists.id))
    .where(and(...conditions))
    .orderBy(desc(albums.createdAt))
}

export async function getAlbumBySlug(slug: string): Promise<AlbumDetail | null> {
  const albumRows = await db()
    .select({
      id: albums.id,
      slug: albums.slug,
      title: albums.title,
      artistId: albums.artistId,
      artistName: artists.name,
      artistNameTelugu: artists.nameTelugu,
      artistSlug: artists.slug,
      albumCoverUrl: albums.albumCoverUrl,
      language: albums.language,
      isActive: albums.isActive,
      createdAt: albums.createdAt,
      updatedAt: albums.updatedAt,
    })
    .from(albums)
    .leftJoin(artists, eq(albums.artistId, artists.id))
    .where(and(eq(albums.slug, slug), eq(albums.isActive, true)))
    .limit(1)

  if (!albumRows[0]) return null

  const album = albumRows[0]

  const songRows = await db()
    .select({
      id: songs.id,
      slug: songs.slug,
      title: songs.title,
      artistName: artists.name,
      artistNameTelugu: artists.nameTelugu,
      category: categories.name,
      language: songs.language,
      trackNumber: albumSongs.trackNumber,
    })
    .from(albumSongs)
    .innerJoin(songs, eq(albumSongs.songId, songs.id))
    .innerJoin(categories, eq(songs.category, categories.slug))
    .leftJoin(artists, eq(songs.artistId, artists.id))
    .where(and(eq(albumSongs.albumId, album.id), eq(songs.isActive, true)))
    .orderBy(asc(albumSongs.trackNumber))

  return {
    id: album.id,
    slug: album.slug,
    title: album.title,
    artistName: album.artistName ?? null,
    artistNameTelugu: album.artistNameTelugu ?? null,
    artistSlug: album.artistSlug ?? null,
    albumCoverUrl: album.albumCoverUrl,
    language: album.language,
    createdAt: album.createdAt,
    updatedAt: album.updatedAt,
    songs: songRows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      artistName: r.artistName ?? null,
      artistNameTelugu: r.artistNameTelugu ?? null,
      category: r.category,
      language: r.language,
      trackNumber: r.trackNumber,
    })),
  }
}
