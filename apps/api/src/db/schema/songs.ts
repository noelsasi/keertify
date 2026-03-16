import {
  pgTable,
  text,
  boolean,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { categories } from "./categories.ts"
import { artists } from "./artists.ts"

export const languageEnum = pgEnum("language", ["te", "en", "hi", "ta", "ml"])

export const sectionTypeEnum = pgEnum("section_type", [
  "pallavi",
  "charnam",
  "verse",
  "chorus",
  "bridge",
  "pre-chorus",
  "outro",
  "interlude",
])

export const streamingPlatformEnum = pgEnum("streaming_platform", [
  "youtube",
  "spotify",
  "apple",
  "gaana",
  "jiosaavn",
])

export const songs = pgTable(
  "songs",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    canonicalSlug: text("canonical_slug").notNull(),
    title: text("title").notNull(),
    artistId: text("artist_id").references(() => artists.id, { onDelete: "set null" }),
    category: text("category")
      .notNull()
      .references(() => categories.slug),
    language: languageEnum("language").notNull(),
    lyrics: text("lyrics").notNull(),
    lyricsEnglish: text("lyrics_english"),
    sourceUrl: text("source_url").notNull().default(""),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // Covers the main list query: WHERE is_active=true AND language=? ORDER BY created_at DESC
    index("songs_active_lang_created_idx").on(
      table.isActive,
      table.language,
      table.createdAt
    ),
    // Covers category-filtered list: WHERE is_active=true AND language=? AND category=?
    index("songs_active_lang_cat_idx").on(
      table.isActive,
      table.language,
      table.category
    ),
    index("songs_language_idx").on(table.language),
    index("songs_category_idx").on(table.category),
    index("songs_is_active_idx").on(table.isActive),
  ]
)

export const songSections = pgTable(
  "song_sections",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    songId: text("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    type: sectionTypeEnum("type").notNull(),
    number: text("number").notNull().default("0"),
    position: text("position").notNull().default("0"),
    content: text("content").notNull(),
    contentEnglish: text("content_english"),
    repeatCount: text("repeat_count"),
    refLabel: text("ref_label"),
  },
  (table) => [
    // Covers: WHERE song_id=? ORDER BY position — runs on every song detail page load
    index("song_sections_song_id_position_idx").on(table.songId, table.position),
  ]
)

export const streamingLinks = pgTable(
  "streaming_links",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    songId: text("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    platform: streamingPlatformEnum("platform").notNull(),
    url: text("url").notNull(),
  },
  (table) => [
    // Covers: WHERE song_id=? — runs on every song detail page load
    index("streaming_links_song_id_idx").on(table.songId),
  ]
)

export const songsRelations = relations(songs, ({ one, many }) => ({
  categoryRef: one(categories, {
    fields: [songs.category],
    references: [categories.slug],
  }),
  artist: one(artists, {
    fields: [songs.artistId],
    references: [artists.id],
  }),
  sections: many(songSections),
  streamingLinks: many(streamingLinks),
}))

export const songSectionsRelations = relations(songSections, ({ one }) => ({
  song: one(songs, {
    fields: [songSections.songId],
    references: [songs.id],
  }),
}))

export const streamingLinksRelations = relations(streamingLinks, ({ one }) => ({
  song: one(songs, {
    fields: [streamingLinks.songId],
    references: [songs.id],
  }),
}))

export type Song = typeof songs.$inferSelect
export type NewSong = typeof songs.$inferInsert
export type SongSection = typeof songSections.$inferSelect
export type StreamingLink = typeof streamingLinks.$inferSelect
