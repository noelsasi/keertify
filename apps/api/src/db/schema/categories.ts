import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { songs } from "./songs.ts"

export const categories = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
})

export const categoriesRelations = relations(categories, ({ many }) => ({
  songs: many(songs),
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
