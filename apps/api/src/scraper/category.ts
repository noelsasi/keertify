import { parse } from "node-html-parser"
import { parseSongHtml, type ParsedSong } from "./parser.ts"

/**
 * Fetches a category listing page from christianlyricz.com and parses every
 * song on it directly — no per-song HTTP requests needed because the category
 * page already embeds the full post content for each song.
 *
 * Each WordPress <article> block is passed to the same `parseSongHtml` used
 * for single-song pages, so all existing parsing logic is reused as-is.
 */
export async function parseSongsFromCategoryPage(categoryUrl: string): Promise<ParsedSong[]> {
  const response = await fetch(categoryUrl)
  if (!response.ok) {
    throw new Error(
      `Failed to fetch category page ${categoryUrl}: ${response.status} ${response.statusText}`
    )
  }

  const html = await response.text()
  const root = parse(html)

  // Each song is a full <article> block on the archive page
  const articles = root.querySelectorAll("article")
  const songs: ParsedSong[] = []

  for (const article of articles) {
    // The permalink is the canonical URL for slug/sourceUrl derivation
    const permalink = article.querySelector("h2.entry-title a")?.getAttribute("href")
    if (!permalink) continue

    try {
      const song = parseSongHtml(article.outerHTML, permalink)
      songs.push(song)
    } catch {
      // Skip articles that fail to parse — caller handles reporting
    }
  }

  return songs
}
