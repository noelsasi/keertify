import { eq, ilike, and, count, desc, asc } from "drizzle-orm"
import type { Category, Language, PaginatedResponse, SongDetail } from "@keertify/shared"
import { db } from "../db/index.ts"
import {
  songs,
  songSections,
  streamingLinks,
  categories,
  albumSongs,
  albums,
  artists,
} from "../db/schema/index.ts"
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

export async function listSongs(opts: SongListOptions): Promise<PaginatedResponse<Song>> {
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
        artistId: songs.artistId,
        artist: artists.name,
        artistNameTelugu: artists.nameTelugu,
        artistSlug: artists.slug,
        category: categories.name,
        language: songs.language,
        lyrics: songs.lyrics,
        lyricsEnglish: songs.lyricsEnglish,
        isActive: songs.isActive,
        createdAt: songs.createdAt,
        updatedAt: songs.updatedAt,
      })
      .from(songs)
      .innerJoin(categories, eq(songs.category, categories.slug))
      .leftJoin(artists, eq(songs.artistId, artists.id))
      .where(opts.category ? and(where, eq(songs.category, opts.category)) : where)
      .orderBy(desc(songs.createdAt))
      .limit(pageSize)
      .offset(offset),

    db()
      .select({ value: count() })
      .from(songs)
      .innerJoin(categories, eq(songs.category, categories.slug))
      .where(opts.category ? and(where, eq(songs.category, opts.category)) : where),
  ])

  return {
    data: rows as unknown as Song[],
    total: totalRows[0]?.value ?? 0,
    page,
    pageSize,
    hasMore: offset + rows.length < (totalRows[0]?.value ?? 0),
  }
}

export async function getSongBySlug(slug: string): Promise<SongDetail | null> {
  // Round-trip 1: fetch song + category name + artist (via LEFT JOIN)
  const songRows = await db()
    .select({
      id: songs.id,
      slug: songs.slug,
      canonicalSlug: songs.canonicalSlug,
      title: songs.title,
      artistId: songs.artistId,
      artist: artists.name,
      artistNameTelugu: artists.nameTelugu,
      artistSlug: artists.slug,
      artistAvatarUrl: artists.avatarUrl,
      category: categories.name,
      language: songs.language,
      lyrics: songs.lyrics,
      lyricsEnglish: songs.lyricsEnglish,
      sourceUrl: songs.sourceUrl,
      isActive: songs.isActive,
      createdAt: songs.createdAt,
    })
    .from(songs)
    .innerJoin(categories, eq(songs.category, categories.slug))
    .leftJoin(artists, eq(songs.artistId, artists.id))
    .where(and(eq(songs.slug, slug), eq(songs.isActive, true)))
    .limit(1)

  if (!songRows[0]) return null

  const songId = songRows[0].id

  // Round-trip 2: sections, links, and albums in parallel
  const [sectionRows, linkRows, albumRows] = await Promise.all([
    db()
      .select({
        id: songSections.id,
        songId: songSections.songId,
        type: songSections.type,
        number: songSections.number,
        position: songSections.position,
        content: songSections.content,
        contentEnglish: songSections.contentEnglish,
        repeatCount: songSections.repeatCount,
        refLabel: songSections.refLabel,
      })
      .from(songSections)
      .where(eq(songSections.songId, songId))
      .orderBy(asc(songSections.position)),

    db().select().from(streamingLinks).where(eq(streamingLinks.songId, songId)),

    db()
      .select({
        id: albums.id,
        slug: albums.slug,
        title: albums.title,
        artistName: artists.name,
        artistNameTelugu: artists.nameTelugu,
        albumCoverUrl: albums.albumCoverUrl,
      })
      .from(albumSongs)
      .innerJoin(albums, eq(albumSongs.albumId, albums.id))
      .leftJoin(artists, eq(albums.artistId, artists.id))
      .where(and(eq(albumSongs.songId, songId), eq(albums.isActive, true))),
  ])

  const row = songRows[0]

  return {
    ...(row as unknown as SongDetail),
    category: row.category as Category,
    artist: row.artist ?? null,
    artistNameTelugu: row.artistNameTelugu ?? null,
    artistSlug: row.artistSlug ?? null,
    artistAvatarUrl: row.artistAvatarUrl ?? null,
    sections: sectionRows.map((r) => ({
      id: r.id,
      songId: r.songId,
      type: r.type,
      number: Number(r.number),
      position: Number(r.position),
      content: r.content,
      contentEnglish: r.contentEnglish ?? undefined,
      repeatCount: r.repeatCount != null ? Number(r.repeatCount) : undefined,
      refLabel: r.refLabel ?? undefined,
    })),
    streamingLinks: linkRows.map((r) => ({
      id: r.id,
      songId: r.songId,
      platform: r.platform,
      url: r.url,
    })),
    albums: albumRows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      artist: r.artistName ?? null,
      artistNameTelugu: r.artistNameTelugu ?? null,
      albumCoverUrl: r.albumCoverUrl,
    })),
  }
}
