import type { Category } from "@/types/song.types"

export interface CategoryConfig {
  label: string
  color: string
  textColor: string
  badgeBg: string
  emoji: string
  description: string
  group: "evergreen" | "thematic" | "seasonal" | "special"
}

export const CATEGORIES: Record<Category, CategoryConfig> = {
  // ── Evergreen ────────────────────────────────────────
  Praise: {
    label: "Praise",
    color: "bg-blue-500",
    textColor: "text-blue-700 dark:text-blue-300",
    badgeBg: "bg-blue-100 dark:bg-blue-500/20",
    emoji: "🙌",
    description: "Upbeat songs glorifying God",
    group: "evergreen",
  },
  Worship: {
    label: "Worship",
    color: "bg-purple-500",
    textColor: "text-purple-700 dark:text-purple-300",
    badgeBg: "bg-purple-100 dark:bg-purple-500/20",
    emoji: "🙏",
    description: "Intimate devotional songs",
    group: "evergreen",
  },
  Thanksgiving: {
    label: "Thanksgiving",
    color: "bg-amber-500",
    textColor: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-100 dark:bg-amber-500/20",
    emoji: "🎊",
    description: "Gratitude and testimony",
    group: "evergreen",
  },
  Prayer: {
    label: "Prayer",
    color: "bg-sky-500",
    textColor: "text-sky-700 dark:text-sky-300",
    badgeBg: "bg-sky-100 dark:bg-sky-500/20",
    emoji: "🕊️",
    description: "Intercession and prayer songs",
    group: "evergreen",
  },
  Gospel: {
    label: "Gospel",
    color: "bg-orange-500",
    textColor: "text-orange-700 dark:text-orange-300",
    badgeBg: "bg-orange-100 dark:bg-orange-500/20",
    emoji: "📖",
    description: "Evangelism and salvation songs",
    group: "evergreen",
  },

  // ── Thematic ─────────────────────────────────────────
  Comfort: {
    label: "Comfort",
    color: "bg-teal-500",
    textColor: "text-teal-700 dark:text-teal-300",
    badgeBg: "bg-teal-100 dark:bg-teal-500/20",
    emoji: "💚",
    description: "Comfort, hope and encouragement",
    group: "thematic",
  },
  Repentance: {
    label: "Repentance",
    color: "bg-rose-500",
    textColor: "text-rose-700 dark:text-rose-300",
    badgeBg: "bg-rose-100 dark:bg-rose-500/20",
    emoji: "🫶",
    description: "Repentance and correction songs",
    group: "thematic",
  },
  Commitment: {
    label: "Commitment",
    color: "bg-indigo-500",
    textColor: "text-indigo-700 dark:text-indigo-300",
    badgeBg: "bg-indigo-100 dark:bg-indigo-500/20",
    emoji: "✋",
    description: "Dedication and surrender songs",
    group: "thematic",
  },

  // ── Seasonal ─────────────────────────────────────────
  Christmas: {
    label: "Christmas",
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-300",
    badgeBg: "bg-red-100 dark:bg-red-500/20",
    emoji: "🎄",
    description: "Birth of Christ — December",
    group: "seasonal",
  },
  "Good Friday": {
    label: "Good Friday",
    color: "bg-slate-600",
    textColor: "text-slate-600 dark:text-slate-300",
    badgeBg: "bg-slate-100 dark:bg-slate-500/20",
    emoji: "✝️",
    description: "Crucifixion and sacrifice",
    group: "seasonal",
  },
  Easter: {
    label: "Easter",
    color: "bg-emerald-500",
    textColor: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-100 dark:bg-emerald-500/20",
    emoji: "✨",
    description: "Resurrection and victory",
    group: "seasonal",
  },
  "Second Coming": {
    label: "Second Coming",
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-300",
    badgeBg: "bg-yellow-100 dark:bg-yellow-500/20",
    emoji: "☁️",
    description: "Rapture and end times",
    group: "seasonal",
  },

  // ── Special ──────────────────────────────────────────
  Kids: {
    label: "Kids",
    color: "bg-pink-500",
    textColor: "text-pink-700 dark:text-pink-300",
    badgeBg: "bg-pink-100 dark:bg-pink-500/20",
    emoji: "🧒",
    description: "Children's songs",
    group: "special",
  },
  Marriage: {
    label: "Marriage",
    color: "bg-fuchsia-500",
    textColor: "text-fuchsia-700 dark:text-fuchsia-300",
    badgeBg: "bg-fuchsia-100 dark:bg-fuchsia-500/20",
    emoji: "💍",
    description: "Wedding and marriage songs",
    group: "special",
  },
  Offering: {
    label: "Offering",
    color: "bg-lime-500",
    textColor: "text-lime-700 dark:text-lime-300",
    badgeBg: "bg-lime-100 dark:bg-lime-500/20",
    emoji: "🤲",
    description: "Tithing and offering songs",
    group: "special",
  },
  Default: {
    label: "Default",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    badgeBg: "bg-gray-100",
    emoji: "🎵",
    description: "Default category",
    group: "special",
  },
}

export type CategoryGroup = "evergreen" | "thematic" | "seasonal" | "special"

export const GROUP_LABELS: Record<CategoryGroup, string> = {
  evergreen: "Every Sunday",
  thematic: "By Theme",
  seasonal: "Occasions",
  special: "Special",
}

export const ALL_CATEGORIES = Object.keys(CATEGORIES) as Category[]

export const CATEGORIES_BY_GROUP = (group: CategoryGroup): Category[] =>
  ALL_CATEGORIES.filter((c) => CATEGORIES[c].group === group)

export function getCategoryConfig(category: string): CategoryConfig {
  return (
    CATEGORIES[category as Category] ?? {
      label: category,
      color: "bg-slate-400",
      textColor: "text-slate-600 dark:text-slate-300",
      badgeBg: "bg-slate-100 dark:bg-slate-500/20",
      emoji: "🎵",
      description: "",
      group: "evergreen" as CategoryGroup,
    }
  )
}
