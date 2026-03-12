import { pgTable, text, timestamp, unique } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { songs } from "./songs.ts"

/**
 * Session-based favourites. No user accounts — sessions are anonymous UUIDs
 * stored in localStorage on the client and sent as the X-Session-ID header.
 */
export const favourites = pgTable(
  "favourites",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    sessionId: text("session_id").notNull(),
    songId: text("song_id")
      .notNull()
      .references(() => songs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique("favourites_session_song_unique").on(t.sessionId, t.songId)]
)

export const favouritesRelations = relations(favourites, ({ one }) => ({
  song: one(songs, {
    fields: [favourites.songId],
    references: [songs.id],
  }),
}))

export type Favourite = typeof favourites.$inferSelect
export type NewFavourite = typeof favourites.$inferInsert
