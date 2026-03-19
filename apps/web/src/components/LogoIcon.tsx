interface LogoIconProps {
  size?: number
  className?: string
}

export function LogoIcon({ size = 36, className }: LogoIconProps) {
  const s = size
  return (
    <div
      className={className}
      style={{
        width: s,
        height: s,
        borderRadius: Math.round(s * 0.25),
        background: "var(--k-ink)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(s * 0.55)}
        height={Math.round(s * 0.55)}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vertical bar of cross */}
        <rect x="9" y="1" width="2.5" height="14" rx="1.25" fill="var(--k-gold-light)" />
        {/* Horizontal bar of cross */}
        <rect x="3" y="6" width="14" height="2.5" rx="1.25" fill="var(--k-gold-light)" />
        {/* Music note stem */}
        <rect x="14.5" y="12" width="1.5" height="6" rx="0.75" fill="var(--k-crimson-lt)" />
        {/* Music note dot */}
        <circle cx="14" cy="18.5" r="2" fill="var(--k-crimson-lt)" />
      </svg>
    </div>
  )
}
