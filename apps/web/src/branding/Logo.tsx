import React from 'react'

/**
 * Keertanalu Logo Component
 * Usage: <Logo variant="horizontal" theme="light" size="md" />
 */

const logoIcon = (theme: string = "light") => {
  const isDark = theme === "dark"
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="64" height="64" rx="16" fill={isDark ? "#251C0A" : "#1A1208"} />
      {isDark && (
        <rect
          x="0.5"
          y="0.5"
          width="63"
          height="63"
          rx="15.5"
          stroke="#3A2E18"
          strokeWidth="1"
          fill="none"
        />
      )}
      {/* Left page */}
      <path
        d="M32 16 C32 16 17.5 17.5 12.5 23 L12.5 46.5 C17.5 41.5 29 40 32 43 Z"
        fill="#D4A92A"
        opacity="0.9"
      />
      {/* Right page */}
      <path
        d="M32 16 C32 16 46.5 17.5 51.5 23 L51.5 46.5 C46.5 41.5 35 40 32 43 Z"
        fill="#D4A92A"
        opacity="0.62"
      />
      {/* Spine */}
      <path d="M32 16 L32 43" stroke="#F5E6B8" strokeWidth="1.5" strokeLinecap="round" />
      {/* Text lines */}
      <line
        x1="19"
        y1="29"
        x2="30"
        y2="28.5"
        stroke="#F5E6B8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <line
        x1="18.5"
        y1="33"
        x2="30"
        y2="32.5"
        stroke="#F5E6B8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.3"
      />
      <line
        x1="18.5"
        y1="37"
        x2="29.5"
        y2="36.5"
        stroke="#F5E6B8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.2"
      />
      {/* Bookmark ribbon */}
      <path d="M46 15 L46 30.5 L42.8 27.5 L39.5 30.5 L39.5 15 Z" fill="#A63248" />
    </svg>
  )
}

const SIZES = {
  xs: { icon: 24, font: 16, tagFont: 9, gap: 8 },
  sm: { icon: 32, font: 20, tagFont: 10, gap: 10 },
  md: { icon: 40, font: 26, tagFont: 11, gap: 12 },
  lg: { icon: 56, font: 34, tagFont: 12, gap: 16 },
  xl: { icon: 80, font: 48, tagFont: 14, gap: 20 },
}

type LogoProps = {
  variant?: "horizontal" | "icon" | "wordmark" | "stacked"
  theme?: string
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  showTagline?: boolean
  className?: string
  style?: React.CSSProperties
}

export function Logo({
  variant = "horizontal", // 'horizontal' | 'icon' | 'wordmark' | 'stacked'
  theme = "light", // 'light' | 'dark'
  size = "md", // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showTagline = false,
  className = "",
  style = {},
}: LogoProps) {
  const isDark = theme === "dark"
  const s = SIZES[size] || SIZES.md

  const textPrimary = isDark ? "#F5E6B8" : "#1A1208"
  const goldAccent = isDark ? "#D4A92A" : "#B8860B"
  const taglineColor = isDark ? "#8C7850" : "#8C8070"

  const Wordmark = () => (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <span
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: s.font,
          fontWeight: 500,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: textPrimary,
          whiteSpace: "nowrap",
        }}
      >
        Keert<span style={{ color: goldAccent }}>a</span>nalu
      </span>
      {showTagline && (
        <span
          style={{
            fontFamily: "'DM Sans', system-ui, sans-serif",
            fontSize: s.tagFont,
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: taglineColor,
            marginTop: 4,
            whiteSpace: "nowrap",
          }}
        >
          Christian Lyrics
        </span>
      )}
    </div>
  )

  if (variant === "icon") {
    return (
      <div className={className} style={{ width: s.icon, height: s.icon, flexShrink: 0, ...style }}>
        {logoIcon(theme)}
      </div>
    )
  }

  if (variant === "wordmark") {
    return (
      <div className={className} style={style}>
        <Wordmark />
      </div>
    )
  }

  if (variant === "stacked") {
    return (
      <div
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: s.gap / 2,
          ...style,
        }}
      >
        <div style={{ width: s.icon, height: s.icon, flexShrink: 0 }}>{logoIcon(theme)}</div>
        <Wordmark />
      </div>
    )
  }

  // Default: horizontal
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: s.gap, ...style }}
    >
      <div style={{ width: s.icon, height: s.icon, flexShrink: 0 }}>{logoIcon(theme)}</div>
      <Wordmark />
    </div>
  )
}

export default Logo
