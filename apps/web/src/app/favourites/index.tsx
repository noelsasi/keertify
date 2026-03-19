import { Heart } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { SongCard } from "@/components/SongCard"
import { MobilePageHeader } from "@/components/MobilePageHeader"
import { useAppStore } from "@/store/app.store"
import { MOCK_SONGS } from "@/lib/mock-data"

export function Favourites() {
  const navigate = useNavigate()
  const { favourites } = useAppStore()

  const savedSongs = MOCK_SONGS.filter((s) => favourites.includes(s.id))

  return (
    <div className="flex min-h-screen flex-col">
      <MobilePageHeader title="Saved Songs" onBack={() => navigate(-1)} />

      <div className="flex-1 px-4 py-4">
        {savedSongs.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
              <Heart size={28} className="text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-semibold">No saved songs yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
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
