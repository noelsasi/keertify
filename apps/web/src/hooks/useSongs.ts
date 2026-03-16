import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api, type SongListQuery } from "@/lib/api"
import type { Language } from "@/types/song.types"

/** Delays updating `value` until `delay` ms have passed with no changes. */
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

/** Fetch a paginated list of songs. Query fires only when `enabled` is true. */
export function useSongs(query: SongListQuery, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["songs", query],
    queryFn: () => api.songs.list(query),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // matches API Redis TTL
  })
}

/** Fetch a single song detail by slug — includes sections and streaming links. */
export function useSong(slug: string | undefined) {
  return useQuery({
    queryKey: ["song", slug],
    queryFn: () => api.songs.get(slug!),
    enabled: !!slug,
    staleTime: 30 * 60 * 1000, // matches API 30-min song detail TTL
  })
}

/** Fetch albums list, optionally filtered by language. */
export function useAlbums(language?: Language) {
  return useQuery({
    queryKey: ["albums", language],
    queryFn: () => api.albums.list(language),
    staleTime: 60 * 60 * 1000, // 1h — matches API TTL
  })
}

/** Fetch all artists. */
export function useArtists() {
  return useQuery({
    queryKey: ["artists"],
    queryFn: () => api.artists.list(),
    staleTime: 60 * 60 * 1000, // 1h — matches API TTL
  })
}

/**
 * Debounces a search string then feeds it into useSongs.
 * Returns the raw input handler alongside the query result so the
 * component only needs one hook call for the full search experience.
 */
export function useSongSearch(baseQuery: Omit<SongListQuery, "search">) {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search)

  const result = useSongs({
    ...baseQuery,
    search: debouncedSearch || undefined,
  })

  return { search, setSearch, ...result }
}
