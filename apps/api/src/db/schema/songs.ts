import { pgTable, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { categories } from "./categories.ts"

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

export const songs = pgTable("songs", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  canonicalSlug: text("canonical_slug").notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id),
  language: languageEnum("language").notNull(),
  lyrics: text("lyrics").notNull(),
  lyricsEnglish: text("lyrics_english"),
  sourceUrl: text("source_url").notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})

export const songSections = pgTable("song_sections", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  songId: text("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "cascade" }),
  type: sectionTypeEnum("type").notNull(),
  number: text("number").notNull().default("0"),
  position: text("position").notNull().default("0"),
  content: text("content").notNull(),
  repeatCount: text("repeat_count"),
  refLabel: text("ref_label"),
})

export const streamingLinks = pgTable("streaming_links", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  songId: text("song_id")
    .notNull()
    .references(() => songs.id, { onDelete: "cascade" }),
  platform: streamingPlatformEnum("platform").notNull(),
  url: text("url").notNull(),
})

export const songsRelations = relations(songs, ({ one, many }) => ({
  category: one(categories, {
    fields: [songs.categoryId],
    references: [categories.id],
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
