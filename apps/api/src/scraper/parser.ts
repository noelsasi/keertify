import { parse, type HTMLElement } from "node-html-parser"
import type { SectionType } from "@keertify/shared"

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------

export interface ParsedSection {
  type: SectionType
  /** 1-based for charnams; 0 for pallavi */
  number: number
  /** Render order (0-based) */
  position: number
  content: string
  /** Repeat instruction stored in the lyrics, e.g. (2) */
  repeatCount?: number
  /** Back-reference label, e.g. "ఆరాధన" from ||ఆరాధన|| */
  refLabel?: string
}

export interface ParsedSong {
  title: string
  /** Transliterated / English title derived from the URL slug */
  titleEnglish: string
  /** Artist name in native script */
  artist: string
  /** Artist name in English */
  artistEnglish: string
  language: "te"
  sourceUrl: string
  slug: string
  youtubeUrl: string | null
  /** Raw native-script lyrics joined across sections (for the DB `lyrics` column) */
  lyrics: string
  /** Raw transliterated lyrics joined across sections */
  lyricsEnglish: string | null
  sections: ParsedSection[]
  sectionsEnglish: ParsedSection[]
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetches and parses a song page from christianlyricz.com.
 */
export async function parseSong(url: string): Promise<ParsedSong> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status} ${response.statusText}`)
  }
  const html = await response.text()
  return parseSongHtml(html, url)
}

/**
 * Parses a pre-fetched HTML string from christianlyricz.com.
 * Separated from `parseSong` to allow unit testing without network access.
 */
export function parseSongHtml(html: string, sourceUrl: string): ParsedSong {
  const root = parse(html)

  const title = extractTitle(root)
  const slug = slugFromUrl(sourceUrl)
  const { artist, artistEnglish } = extractArtist(root)
  const youtubeUrl = extractYoutubeUrl(root)

  // Single song pages wrap content in .pf-content; category page articles use .entry-content directly
  const pfContent = root.querySelector(".pf-content") ?? root.querySelector(".entry-content")
  const tabMap = buildTabMap(pfContent)

  const teluguParas = tabMap["Telugu Lyrics"] ?? []
  const englishParas = tabMap["English Lyrics"] ?? []

  const sections = parseSections(teluguParas)
  const sectionsEnglish = parseSections(englishParas)

  const lyrics = sections.map((s) => s.content).join("\n\n")
  const lyricsEnglish =
    sectionsEnglish.length > 0 ? sectionsEnglish.map((s) => s.content).join("\n\n") : null

  return {
    title,
    titleEnglish: slugToTitle(slug),
    artist,
    artistEnglish,
    language: "te",
    sourceUrl,
    slug,
    youtubeUrl,
    lyrics,
    lyricsEnglish,
    sections,
    sectionsEnglish,
  }
}

// ---------------------------------------------------------------------------
// Extraction helpers
// ---------------------------------------------------------------------------

function extractTitle(root: HTMLElement): string {
  const entryTitle = root.querySelector(".entry-title")
  if (entryTitle?.textContent?.trim()) {
    return entryTitle.textContent.trim()
  }
  // Fall back to <title> — strip the site name suffix ("– CHRISTIAN LYRICZ")
  const pageTitle = root.querySelector("title")?.textContent ?? ""
  return pageTitle.split(/\s*[–—-]\s*/)[0]?.trim() ?? ""
}

function extractArtist(root: HTMLElement): { artist: string; artistEnglish: string } {
  const pfContent = root.querySelector(".pf-content") ?? root.querySelector(".entry-content")
  // The first <p> inside the content wrapper contains the lyricist block
  const lyricistPara = pfContent?.querySelector("p")
  const text = lyricistPara?.textContent ?? ""

  const teluguMatch = text.match(/పాట\s+రచయిత\s*:\s*(.+)/u)
  const englishMatch = text.match(/Lyricist\s*:\s*(.+)/i)

  return {
    artist: teluguMatch?.[1]?.trim() ?? "",
    artistEnglish: englishMatch?.[1]?.trim() ?? "",
  }
}

function extractYoutubeUrl(root: HTMLElement): string | null {
  const embed = root.querySelector("[data-facadesrc]")
  const src = embed?.getAttribute("data-facadesrc") ?? ""
  const match = src.match(/embed\/([A-Za-z0-9_-]{11})/)
  return match ? `https://www.youtube.com/watch?v=${match[1]}` : null
}

/**
 * Maps tab titles to their paragraph arrays.
 *
 * The site has two tab plugin formats depending on post age:
 *
 * Format A — "responsive-tabs" (older posts):
 *   <h2 class="tabtitle">Telugu Lyrics</h2>
 *   <div class="tabcontent"><p>…</p></div>
 *
 * Format B — "wordpress-post-tabs" (newer posts):
 *   <div class="wordpress-post-tabs …">
 *     <ul><li><a href="…#tabs-16327-0-0">Telugu Lyrics</a></li></ul>
 *     <div id="tabs-16327-0-0"><p>…</p></div>
 *   </div>
 */
function buildTabMap(pfContent: HTMLElement | null): Record<string, HTMLElement[]> {
  if (!pfContent) return {}

  const formatA = buildTabMapFormatA(pfContent)
  if (Object.keys(formatA).length > 0) return formatA

  return buildTabMapFormatB(pfContent)
}

/** Format A: h2.tabtitle + div.tabcontent (responsive-tabs plugin) */
function buildTabMapFormatA(pfContent: HTMLElement): Record<string, HTMLElement[]> {
  const tabMap: Record<string, HTMLElement[]> = {}
  const titles = pfContent.querySelectorAll("h2.tabtitle")
  const contents = pfContent.querySelectorAll("div.tabcontent")

  titles.forEach((title, i) => {
    const label = title.textContent.trim()
    const container = contents[i]
    if (container) {
      tabMap[label] = container.querySelectorAll("p")
    }
  })

  return tabMap
}

/** Format B: ul/li/a nav + div[id] panels (wordpress-post-tabs plugin) */
function buildTabMapFormatB(pfContent: HTMLElement): Record<string, HTMLElement[]> {
  const tabMap: Record<string, HTMLElement[]> = {}

  const wrapper = pfContent.querySelector("div[class*='wordpress-post-tabs']")
  if (!wrapper) return tabMap

  const navLinks = wrapper.querySelectorAll("ul li a")

  navLinks.forEach((link) => {
    const label = link.textContent.trim()
    const href = link.getAttribute("href") ?? ""
    // href is a full URL with a fragment: "…#tabs-16327-0-0" → "tabs-16327-0-0"
    const tabId = href.split("#").pop()
    if (!tabId) return

    const panel = wrapper.querySelector(`[id="${tabId}"]`)
    if (panel) {
      tabMap[label] = panel.querySelectorAll("p")
    }
  })

  return tabMap
}

// ---------------------------------------------------------------------------
// Section parsing
// ---------------------------------------------------------------------------

/**
 * Converts an array of <p> elements into structured song sections.
 *
 * Detection rules (Telugu song tradition):
 *   - A paragraph WITHOUT a ||...|| suffix is the pallavi (refrain).
 *   - A paragraph WITH a ||...|| suffix is a charnam (verse).
 *   - If somehow no paragraph lacks a suffix, the first one is still pallavi.
 */
function parseSections(paragraphs: HTMLElement[]): ParsedSection[] {
  const sections: ParsedSection[] = []
  let charnamCount = 0

  for (let i = 0; i < paragraphs.length; i++) {
    const content = extractParagraphContent(paragraphs[i])
    if (!content) continue

    const refLabel = extractRefLabel(content)
    const cleanContent = refLabel ? content.replace(/\s*\|\|[^|]+\|\|\s*$/, "").trimEnd() : content

    // First non-empty paragraph without a refLabel is always the pallavi.
    // If the first paragraph does have a refLabel, still call it pallavi.
    const isPallavi = sections.length === 0
    const type: SectionType = isPallavi ? "pallavi" : "charnam"

    if (type === "charnam") charnamCount++

    sections.push({
      type,
      number: type === "charnam" ? charnamCount : 0,
      position: i,
      content: cleanContent,
      refLabel,
    })
  }

  return sections
}

// ---------------------------------------------------------------------------
// Content normalization
// ---------------------------------------------------------------------------

/**
 * Extracts clean plain text from a <p> element.
 * Replaces <br> with newlines, strips HTML tags, decodes entities.
 */
function extractParagraphContent(para: HTMLElement): string {
  const raw = para.innerHTML
    // Normalise <br> / <br /> → newline
    .replace(/<br\s*\/?>/gi, "\n")
    // Unwrap inline elements that only add formatting
    .replace(/<\/?(strong|em|b|i|span)[^>]*>/gi, "")
    // Strip remaining tags
    .replace(/<[^>]+>/g, "")
    // Decode common HTML entities
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))

  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n")
}

/**
 * Extracts the back-reference label from a content string.
 * e.g. "నే పాపిని నన్ను చేకొనుమా ||ఆరాధన||" → "ఆరాధన"
 */
function extractRefLabel(content: string): string | undefined {
  const match = content.match(/\|\|([^|]+)\|\|\s*$/)
  return match?.[1]?.trim()
}

// ---------------------------------------------------------------------------
// Slug utilities
// ---------------------------------------------------------------------------

function slugFromUrl(url: string): string {
  return new URL(url).pathname.replace(/\/$/, "").split("/").pop() ?? ""
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
