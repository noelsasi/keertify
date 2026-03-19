# Keertanalu Brand Assets

## File Structure
```
src/
├── assets/brand/
│   ├── logo-icon.svg              # Square icon, dark bg — navbar, app icon
│   ├── logo-icon-on-dark.svg      # Square icon with border — for dark surfaces
│   ├── logo-horizontal-light.svg  # Full lockup — light mode
│   ├── logo-horizontal-dark.svg   # Full lockup — dark mode
│   ├── wordmark-light.svg         # Text only — light mode
│   ├── wordmark-dark.svg          # Text only — dark mode
│   ├── favicon.svg                # 32px — browser tab
│   ├── app-icon-512.svg           # 512px — PWA manifest, app stores
│   ├── og-image.svg               # 1200×630 — social sharing / Open Graph
│   ├── splash-screen.svg          # 390×844 — mobile splash
│   ├── tokens.css                 # CSS custom properties
│   └── tokens.js                  # JS/TS tokens + Tailwind config
└── components/
    └── Logo.jsx                   # React logo component

## Usage

### React Component
```jsx
import { Logo } from './components/Logo'

// Navbar
<Logo variant="horizontal" theme="light" size="md" />

// Dark mode navbar
<Logo variant="horizontal" theme="dark" size="md" showTagline />

// Icon only (sidebar collapsed, mobile)
<Logo variant="icon" theme="light" size="sm" />

// Stacked (splash screen, about page)
<Logo variant="stacked" theme="dark" size="xl" showTagline />

// Wordmark only (compact header)
<Logo variant="wordmark" theme="light" size="lg" />
```

### Vite index.html — favicon
```html
<link rel="icon" type="image/svg+xml" href="/src/assets/brand/favicon.svg" />
```

### Vite index.html — PWA meta
```html
<meta property="og:image" content="/src/assets/brand/og-image.svg" />
<meta name="theme-color" content="#1A1208" />
<link rel="apple-touch-icon" href="/src/assets/brand/app-icon-512.svg" />
```

### CSS Tokens
```css
/* In src/index.css */
@import './assets/brand/tokens.css';

/* Usage */
.my-card {
  background: var(--k-surface);
  border: 1px solid var(--k-border);
  color: var(--k-text-1);
}
.my-accent {
  color: var(--k-gold);
}
```

### Tailwind Config
```js
// tailwind.config.js
import { tailwindExtend } from './src/assets/brand/tokens.js'
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: tailwindExtend },
}
```

### Google Fonts (add to index.html)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

## Brand Colors Quick Reference

| Token           | Light Mode  | Dark Mode   | Use for                    |
|-----------------|-------------|-------------|----------------------------|
| Primary         | #1A1208     | —           | Buttons, icon bg           |
| Gold accent     | #B8860B     | #D4A92A     | Links, active state, logo  |
| Crimson accent  | #7B1E2E     | #A63248     | Badges, tags, bookmark     |
| Background      | #FAF7F0     | #0E0A04     | Page background            |
| Surface         | #FFFFFF     | #1C1508     | Cards, modals              |
| Surface 2       | #F0EBE0     | #251C0A     | Inputs, nested surfaces    |
| Border          | #E0D8C8     | #3A2E18     | All borders                |
| Text primary    | #1A1208     | #F5E6B8     | Headings, body             |
| Text muted      | #8C8070     | #8C7850     | Subtitles, placeholders    |

## Icon Concept — Open Book + Bookmark
- **Book** = lyrics/scripture — universal, every denomination connects
- **Gold pages** = warmth of the Word
- **Crimson bookmark** = devotion, your place in the song
- **Subtle text lines** = specifically lyrics, not just a generic icon
- No cross shape = denomination-neutral, welcoming to all
