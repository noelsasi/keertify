import type { Category } from "@/types/song.types"

export const LANGUAGE_LABELS: Record<string, string> = {
  te: "Telugu",
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  ml: "Malayalam",
}

export const CATEGORY_COLORS: Record<Category, string> = {
  Praise: "bg-blue-500",
  Worship: "bg-purple-500",
  Thanksgiving: "bg-amber-500",
  Prayer: "bg-sky-500",
  Gospel: "bg-orange-500",
  Comfort: "bg-teal-500",
  Repentance: "bg-rose-500",
  Commitment: "bg-indigo-500",
  Christmas: "bg-red-500",
  "Good Friday": "bg-slate-600",
  Easter: "bg-emerald-500",
  "Second Coming": "bg-yellow-500",
  Kids: "bg-pink-500",
  Marriage: "bg-fuchsia-500",
  Offering: "bg-lime-500",
  Default: "bg-gray-500",
}

export const STREAMING_ICONS: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  youtube: {
    label: "YouTube",
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-500/10",
    icon: "▶",
  },
  spotify: {
    label: "Spotify",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-500/10",
    icon: "♫",
  },
  apple: {
    label: "Apple Music",
    color: "text-pink-500",
    bg: "bg-pink-50 dark:bg-pink-500/10",
    icon: "♪",
  },
  gaana: {
    label: "Gaana",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-500/10",
    icon: "♬",
  },
  jiosaavn: {
    label: "JioSaavn",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    icon: "♩",
  },
}
