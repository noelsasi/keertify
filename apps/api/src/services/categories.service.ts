import { eq } from "drizzle-orm"
import { db } from "../db/index.ts"
import { categories } from "../db/schema/index.ts"
import type { Category } from "../db/schema/categories.ts"

export async function listCategories(): Promise<Category[]> {
  return db().select().from(categories).orderBy(categories.name)
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const result = await db()
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1)

  return result[0] ?? null
}
