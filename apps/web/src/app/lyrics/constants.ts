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
  Praise: "from-blue-300 via-blue-500 to-indigo-700",
  Worship: "from-violet-300 via-purple-500 to-violet-800",
  Thanksgiving: "from-amber-300 via-amber-500 to-orange-700",
  Prayer: "from-sky-300 via-sky-500 to-cyan-700",
  Gospel: "from-orange-300 via-orange-500 to-red-700",
  Comfort: "from-teal-300 via-teal-500 to-emerald-700",
  Repentance: "from-rose-300 via-rose-500 to-pink-700",
  Commitment: "from-indigo-300 via-indigo-500 to-violet-700",
  Christmas: "from-red-300 via-red-500 to-rose-700",
  "Good Friday": "from-slate-400 via-slate-500 to-slate-700",
  Easter: "from-emerald-300 via-emerald-500 to-green-700",
  "Second Coming": "from-yellow-300 via-amber-400 to-orange-600",
  Kids: "from-pink-300 via-pink-400 to-fuchsia-600",
  Marriage: "from-fuchsia-300 via-fuchsia-500 to-purple-700",
  Offering: "from-lime-300 via-lime-500 to-green-700",
  Default: "from-slate-300 via-slate-500 to-slate-700",
}

export const CATEGORY_THUMB_GRADIENTS: Record<string, string> = {
  Praise: "from-blue-300 to-blue-500",
  Worship: "from-violet-300 to-purple-500",
  Thanksgiving: "from-amber-300 to-orange-400",
  Prayer: "from-sky-300 to-sky-500",
  Gospel: "from-orange-300 to-orange-500",
  Comfort: "from-teal-300 to-teal-500",
  Repentance: "from-rose-300 to-rose-500",
  Commitment: "from-indigo-300 to-indigo-500",
  Christmas: "from-red-300 to-red-500",
  "Good Friday": "from-slate-300 to-slate-500",
  Easter: "from-emerald-300 to-emerald-500",
  "Second Coming": "from-yellow-300 to-amber-400",
  Kids: "from-pink-300 to-pink-400",
  Marriage: "from-fuchsia-300 to-fuchsia-500",
  Offering: "from-lime-300 to-lime-500",
  Default: "from-slate-300 to-slate-400",
}

export const READING_MODES: Record<ReadingMode, ReadingModeConfig> = {
  light: {
    label: "Light",
    icon: Sun,
    swatch: "#FFFFFF",
    containerStyle: { backgroundColor: "#FAFAFA", color: "#1a1a2e" },
    dividerColor: "#EBEBEB",
  },
  warm: {
    label: "Warm",
    icon: Flame,
    swatch: "#FFF8EE",
    containerStyle: { backgroundColor: "#FFF8EE", color: "#3B1F00" },
    dividerColor: "#EDD9A3",
  },
  night: {
    label: "Night",
    icon: Moon,
    swatch: "#0E0C14",
    containerStyle: { backgroundColor: "#0E0C14", color: "#E4DFFA" },
    dividerColor: "#2E2845",
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
