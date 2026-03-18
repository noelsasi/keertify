import { Sun, Flame, Moon } from "lucide-react"
import type React from "react"

export type ReadingMode = "light" | "warm" | "night"
export type LyricsTab = "native" | "english"

export interface ReadingModeConfig {
  label: string
  icon: typeof Sun
  swatch: string
  containerStyle: React.CSSProperties
  dividerColor: string
}

export const CATEGORY_HERO_GRADIENTS: Record<string, string> = {
  Praise:         "from-blue-100 via-blue-200 to-indigo-300 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950",
  Worship:        "from-violet-100 via-purple-200 to-violet-300 dark:from-violet-900 dark:via-purple-950 dark:to-violet-950",
  Thanksgiving:   "from-amber-100 via-amber-200 to-orange-300 dark:from-amber-900 dark:via-amber-950 dark:to-orange-950",
  Prayer:         "from-sky-100 via-sky-200 to-cyan-300 dark:from-sky-900 dark:via-sky-950 dark:to-cyan-950",
  Gospel:         "from-orange-100 via-orange-200 to-red-300 dark:from-orange-900 dark:via-orange-950 dark:to-red-950",
  Comfort:        "from-teal-100 via-teal-200 to-emerald-300 dark:from-teal-900 dark:via-teal-950 dark:to-emerald-950",
  Repentance:     "from-rose-100 via-rose-200 to-pink-300 dark:from-rose-900 dark:via-rose-950 dark:to-pink-950",
  Commitment:     "from-indigo-100 via-indigo-200 to-violet-300 dark:from-indigo-900 dark:via-indigo-950 dark:to-violet-950",
  Christmas:      "from-red-100 via-red-200 to-rose-300 dark:from-red-900 dark:via-red-950 dark:to-rose-950",
  "Good Friday":  "from-slate-200 via-slate-300 to-slate-400 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950",
  Easter:         "from-emerald-100 via-emerald-200 to-green-300 dark:from-emerald-900 dark:via-emerald-950 dark:to-green-950",
  "Second Coming":"from-yellow-100 via-amber-200 to-orange-200 dark:from-yellow-900 dark:via-amber-950 dark:to-orange-950",
  Kids:           "from-pink-100 via-pink-200 to-fuchsia-300 dark:from-pink-900 dark:via-pink-950 dark:to-fuchsia-950",
  Marriage:       "from-fuchsia-100 via-fuchsia-200 to-purple-300 dark:from-fuchsia-900 dark:via-fuchsia-950 dark:to-purple-950",
  Offering:       "from-lime-100 via-lime-200 to-green-300 dark:from-lime-900 dark:via-lime-950 dark:to-green-950",
  Default:        "from-stone-100 via-stone-200 to-stone-300 dark:from-stone-800 dark:via-stone-900 dark:to-stone-950",
}

export const CATEGORY_THUMB_GRADIENTS: Record<string, string> = {
  Praise:         "from-blue-200 to-blue-400 dark:from-blue-800 dark:to-blue-950",
  Worship:        "from-violet-200 to-purple-400 dark:from-violet-800 dark:to-purple-950",
  Thanksgiving:   "from-amber-200 to-orange-300 dark:from-amber-800 dark:to-orange-950",
  Prayer:         "from-sky-200 to-sky-400 dark:from-sky-800 dark:to-sky-950",
  Gospel:         "from-orange-200 to-orange-400 dark:from-orange-800 dark:to-orange-950",
  Comfort:        "from-teal-200 to-teal-400 dark:from-teal-800 dark:to-teal-950",
  Repentance:     "from-rose-200 to-rose-400 dark:from-rose-800 dark:to-rose-950",
  Commitment:     "from-indigo-200 to-indigo-400 dark:from-indigo-800 dark:to-indigo-950",
  Christmas:      "from-red-200 to-red-400 dark:from-red-800 dark:to-red-950",
  "Good Friday":  "from-slate-300 to-slate-400 dark:from-slate-700 dark:to-slate-900",
  Easter:         "from-emerald-200 to-emerald-400 dark:from-emerald-800 dark:to-emerald-950",
  "Second Coming":"from-yellow-200 to-amber-300 dark:from-yellow-800 dark:to-amber-950",
  Kids:           "from-pink-200 to-pink-400 dark:from-pink-800 dark:to-pink-950",
  Marriage:       "from-fuchsia-200 to-fuchsia-400 dark:from-fuchsia-800 dark:to-fuchsia-950",
  Offering:       "from-lime-200 to-lime-400 dark:from-lime-800 dark:to-lime-950",
  Default:        "from-stone-200 to-stone-300 dark:from-stone-700 dark:to-stone-900",
}

export const READING_MODES: Record<ReadingMode, ReadingModeConfig> = {
  light: {
    label: "Light",
    icon: Sun,
    swatch: "#FAFAF7",
    containerStyle: { backgroundColor: "#FAFAF7", color: "#1C1917" },
    dividerColor: "#E7E5E4",
  },
  warm: {
    label: "Warm",
    icon: Flame,
    swatch: "#FFF8EE",
    containerStyle: { backgroundColor: "#FFF8EE", color: "#3B2000" },
    dividerColor: "#EDD9A3",
  },
  night: {
    label: "Night",
    icon: Moon,
    swatch: "#141210",
    containerStyle: { backgroundColor: "#141210", color: "#F5F0E8" },
    dividerColor: "#2C2420",
  },
}

export const STREAMING_PLATFORMS: Record<
  string,
  {
    label: string
    textColor: string
    bg: string
    border: string
    iconUrl: string
  }
> = {
  youtube: {
    label: "YouTube",
    textColor: "text-red-500",
    bg: "bg-red-50/80 dark:bg-red-950/30",
    border: "border-red-100 dark:border-red-900/40",
    iconUrl: "https://cdn.simpleicons.org/youtube/FF0000",
  },
  spotify: {
    label: "Spotify",
    textColor: "text-green-600",
    bg: "bg-green-50/80 dark:bg-green-950/30",
    border: "border-green-100 dark:border-green-900/40",
    iconUrl: "https://cdn.simpleicons.org/spotify/1DB954",
  },
  apple: {
    label: "Apple Music",
    textColor: "text-rose-500",
    bg: "bg-rose-50/80 dark:bg-rose-950/30",
    border: "border-rose-100 dark:border-rose-900/40",
    iconUrl: "https://cdn.simpleicons.org/applemusic/FC3C44",
  },
  gaana: {
    label: "Gaana",
    textColor: "text-orange-500",
    bg: "bg-orange-50/80 dark:bg-orange-950/30",
    border: "border-orange-100 dark:border-orange-900/40",
    iconUrl: "https://cdn.simpleicons.org/gaana/E72124",
  },
  jiosaavn: {
    label: "JioSaavn",
    textColor: "text-cyan-600",
    bg: "bg-cyan-50/80 dark:bg-cyan-950/30",
    border: "border-cyan-100 dark:border-cyan-900/40",
    iconUrl: "https://cdn.simpleicons.org/jiosaavn/2BC5B4",
  },
}

export const NOISE_BG =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
