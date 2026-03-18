import { create } from "zustand"

interface UIStore {
  isPresenting: boolean
  setIsPresenting: (v: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  isPresenting: false,
  setIsPresenting: (isPresenting) => set({ isPresenting }),
}))
