import { Music2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
  src?: string | null
  alt?: string
  size: number
  shape?: "circle" | "square"
  fallback?: React.ReactNode
  className?: string
}

export function AvatarImage({ src, alt, size, shape = "circle", fallback, className }: Props) {
  return (
    <div
      className={cn(
        "flex-shrink-0 overflow-hidden bg-[var(--k-surface-2)]",
        shape === "circle" ? "rounded-full" : "rounded-[10px]",
        className
      )}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        fallback ?? (
          <div className="flex h-full w-full items-center justify-center">
            <Music2 size={size * 0.3} className="text-[var(--k-text-3)]" />
          </div>
        )
      )}
    </div>
  )
}
