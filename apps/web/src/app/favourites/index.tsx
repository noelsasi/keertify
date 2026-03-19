import { Heart, ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { SongCard } from "@/components/SongCard"
import { useAppStore } from "@/store/app.store"
import { MOCK_SONGS, LANGUAGE_LABELS } from "@/lib/mock-data"

export function Favourites() {
  const navigate = useNavigate()
  const { favourites, language } = useAppStore()

  const savedSongs = MOCK_SONGS.filter((s) => favourites.includes(s.id))

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-[var(--k-surface)] border-b border-[var(--k-border)] px-4 pt-12 pb-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={22} className="text-[var(--k-text-1)]" />
          </button>
          <div>
            <h1
              className="text-[var(--k-text-1)]"
              style={{ fontFamily: "var(--k-font-display)", fontSize: 22, fontWeight: 500 }}
            >
              Saved Songs
            </h1>
            <p className="text-xs text-[var(--k-text-3)]">
              {savedSongs.length} saved · {LANGUAGE_LABELS[language]}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        {savedSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Heart size={28} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">
                No saved songs yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap ♥ on any song to save it here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {savedSongs.map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
