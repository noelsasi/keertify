import {
  pgTable,
  text,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core"

export const artists = pgTable(
  "artists",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    slug: text("slug").notNull().unique(),
    /** English canonical name — used as the stable identity across languages */
    name: text("name").notNull().unique(),
    /** Telugu display name */
    nameTelugu: text("name_telugu"),
    avatarUrl: text("avatar_url"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("artists_is_active_idx").on(table.isActive),
  ]
)

export type Artist = typeof artists.$inferSelect
export type NewArtist = typeof artists.$inferInsert
