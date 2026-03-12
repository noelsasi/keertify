import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Language } from "@/types/song.types"

interface AppStore {
  sessionId: string
  language: Language
  setLanguage: (lang: Language) => void
  favourites: string[]
  toggleFavourite: (songId: string) => void
  isFavourite: (songId: string) => boolean
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      sessionId: crypto.randomUUID(),
      language: "te",
      setLanguage: (lang) => set({ language: lang }),
      favourites: [],
      toggleFavourite: (songId) => {
        const { favourites } = get()
        set({
          favourites: favourites.includes(songId)
            ? favourites.filter((id) => id !== songId)
            : [...favourites, songId],
        })
      },
      isFavourite: (songId) => get().favourites.includes(songId),
    }),
    { name: "keertify-store" }
  )
)
