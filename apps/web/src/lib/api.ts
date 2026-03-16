import type { Song, SongDetail, Language, Category, PaginatedResponse, Album, Artist } from "@/types/song.types"

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000"

export interface SongListQuery {
  language?: Language
  category?: Category
  search?: string
  page?: number
  pageSize?: number
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }))
    throw new Error(body?.error ?? `API error ${res.status}`)
  }

  return res.json() as Promise<T>
}

function toParams(query: Record<string, string | number | undefined>): string {
  const params = new URLSearchParams()
  for (const [key, val] of Object.entries(query)) {
    if (val !== undefined && val !== "") params.set(key, String(val))
  }
  const str = params.toString()
  return str ? `?${str}` : ""
}

export const api = {
  songs: {
    list: (query: SongListQuery) =>
      apiFetch<PaginatedResponse<Song>>(
        `/api/songs${toParams(query as Record<string, string | number | undefined>)}`
      ),

    get: (slug: string) => apiFetch<SongDetail>(`/api/songs/${slug}`),
  },

  albums: {
    list: (language?: Language) =>
      apiFetch<Album[]>(`/api/albums${toParams({ language })}`),
  },

  artists: {
    list: () => apiFetch<Artist[]>("/api/artists"),
  },
}
