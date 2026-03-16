import {
  pgTable,
  text,
  boolean,
  integer,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { languageEnum, songs } from "./songs.ts"
import { artists } from "./artists.ts"

export const albums = pgTable(
  "albums",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    artistId: text("artist_id").references(() => artists.id, { onDelete: "set null" }),
    albumCoverUrl: text("album_cover_url"),
    language: languageEnum("language").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("albums_language_idx").on(table.language),
    index("albums_is_active_idx").on(table.isActive),
  ]
)

export const albumSongs = pgTable(
  "album_songs",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    albumId: text("album_id")
      .notNull()
      .references(() => albums.id, { onDelete: "cascade" }),
    songId: text("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    trackNumber: integer("track_number").notNull().default(0),
  },
  (table) => [
    index("album_songs_album_id_track_idx").on(table.albumId, table.trackNumber),
    index("album_songs_song_id_idx").on(table.songId),
    unique("album_songs_album_song_unique").on(table.albumId, table.songId),
  ]
)

export const albumsRelations = relations(albums, ({ one, many }) => ({
  artist: one(artists, {
    fields: [albums.artistId],
    references: [artists.id],
  }),
  albumSongs: many(albumSongs),
}))

export const albumSongsRelations = relations(albumSongs, ({ one }) => ({
  album: one(albums, {
    fields: [albumSongs.albumId],
    references: [albums.id],
  }),
  song: one(songs, {
    fields: [albumSongs.songId],
    references: [songs.id],
  }),
}))

export type Album = typeof albums.$inferSelect
export type NewAlbum = typeof albums.$inferInsert
export type AlbumSong = typeof albumSongs.$inferSelect
