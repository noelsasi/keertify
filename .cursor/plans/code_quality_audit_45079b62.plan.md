---
name: Code Quality Audit
overview: "A comprehensive audit of the Keertify codebase. The verdict: intermediate-level code, not yet lead-engineer quality. There are 4 outright bugs, ~15 structural problems, and significant duplication throughout. Below is a prioritized breakdown — bugs first, then architecture, then DRY, then type safety, then polish."
todos:
  - id: bug1
    content: Fix double <Outlet> mount in Layout.tsx — causes every page to mount twice
    status: pending
  - id: bug2
    content: "Fix Toaster: wire ui/sonner.tsx to custom useTheme; remove hardcoded dark oklch color in Layout.tsx"
    status: pending
  - id: bug3
    content: Fix 'Hymn' category in Home — derive CATEGORIES from categories.ts, not a local array
    status: pending
  - id: bug4
    content: "Add desktop layout to Favourites page (missing md: responsive variants)"
    status: pending
  - id: arch1
    content: Create src/lib/routes.ts with typed route constants; update App.tsx, TopNav, BottomNav, SongCard
    status: pending
  - id: arch2
    content: Remove CATEGORY_COLORS from mock-data.ts; use getCategoryConfig().color in SongCard
    status: pending
  - id: arch3
    content: Add Zustand selectors to app.store.ts; update SongCard and all consumers to use selective subscriptions
    status: pending
  - id: arch4
    content: "Fix SongCard accessibility: replace <div onClick> with <Link> from react-router-dom"
    status: pending
  - id: arch5
    content: Extract useReadingPreferences() hook; remove 7-prop drilling in lyrics/index.tsx
    status: pending
  - id: arch6
    content: Consolidate LANGUAGE_LABELS and Settings LANGUAGES into one source in src/lib/constants.ts
    status: pending
  - id: arch7
    content: Remove local Theme type re-declaration in settings/index.tsx; import from ThemeProvider
    status: pending
  - id: arch8
    content: Move D-key shortcut out of ThemeProvider into a dedicated useThemeShortcut hook
    status: pending
  - id: arch9
    content: Fix localeCompare in browse/index.tsx to pass language code
    status: pending
  - id: dup1
    content: Extract MobilePageHeader component (used in Home, Browse, Favourites, Settings, LyricsHero)
    status: pending
  - id: dup2
    content: Extract SongGrid and SearchInput reusable components
    status: pending
  - id: dup3
    content: Extract EmptyState component
    status: pending
  - id: dup4
    content: Move formatDate and getInitials to src/lib/utils.ts (duplicated in LyricsHero and SongMeta)
    status: pending
  - id: dup5
    content: Add FONT_SIZE_MIN/MAX/STEP/DEFAULT and READING_MODE_KEYS exports to lyrics/constants.ts
    status: pending
  - id: dup6
    content: Add getReadingModeColors() helper to lyrics/constants.ts (color ternary duplicated in 3 files)
    status: pending
  - id: dup7
    content: Create shared NAV_ITEMS constant (navItems duplicated between TopNav and BottomNav)
    status: pending
  - id: type1
    content: "Fix type issues: sourceUrl optional, LANGUAGE_LABELS Record<Language>, STREAMING_ICONS Record<platform>, getCategoryConfig parameter type, remove dead SongSection type"
    status: pending
  - id: perf1
    content: Memoize recentSongs in Home; wrap handleFavourite in useCallback in SongCard; memoize song/streamingLinks/catConfig in LyricsPage
    status: pending
  - id: polish1
    content: Fix non-standard Tailwind opacity values (bg-white/12, bg-primary/8); fix h-safe-area-inset-bottom; align max-widths between Layout and TopNav
    status: pending
isProject: false
---

# Keertify Code Quality Audit

## Verdict

Not lead-engineer written. It reads as competent junior-to-mid level work: the right stack, reasonable component structure, but with copy-paste patterns everywhere, a few real bugs hiding in plain sight, no abstractions for repeated patterns, and gaps in type safety and accessibility. The problems are fixable — nothing is fundamentally broken architecturally.

---

## Category 1 — Actual Bugs (things that are broken right now)

### BUG 1: Double `<Outlet>` mount in `[src/components/layouts/Layout.tsx](src/components/layouts/Layout.tsx)`

```tsx
// Both branches are always in the DOM — visually toggled by Tailwind, not React
<div className="hidden min-h-screen md:flex md:flex-col">
  <Outlet />   // ← desktop tree
</div>
<div className="md:hidden">
  <Outlet />   // ← mobile tree
</div>
```

Every page component mounts **twice** — two component trees, two sets of state, two sets of effects, two potential API calls. The fix is one `<Outlet>` wrapping layout-responsive containers, not two separate `<Outlet>` instances.

### BUG 2: `ui/sonner.tsx` imports from `next-themes`, not the custom `ThemeProvider`

`[src/components/ui/sonner.tsx](src/components/ui/sonner.tsx)` line 1:

```ts
import { useTheme } from "next-themes"; // wrong — app uses custom ThemeProvider
```

`next-themes`' context is never mounted. `useTheme()` returns a default/fallback value, so the Toaster never correctly reflects the app theme. The real `useTheme` is in `[src/components/layouts/ThemeProvider.tsx](src/components/layouts/ThemeProvider.tsx)`. `Layout.tsx` compounds this by bypassing `ui/sonner.tsx` entirely and using raw `sonner` with a hardcoded dark `oklch` background that breaks in light mode.

### BUG 3: `"Hymn"` in Home's category filter doesn't exist as a valid `Category`

`[src/app/home/index.tsx](src/app/home/index.tsx)` line 11:

```ts
const CATEGORIES = ["All", "Praise", "Worship", "Hymn", "Christmas"];
```

`"Hymn"` is not in the `Category` union type nor in `categories.ts`. Filtering by it silently returns zero results every time. The filter is wired to a real type from elsewhere in the codebase and these values should come from `CATEGORY_CONFIGS` in `categories.ts`.

### BUG 4: `Favourites` page has no desktop layout

`[src/app/favourites/index.tsx](src/app/favourites/index.tsx)` has no `hidden md:block` / `md:hidden` split. It renders the mobile nav-bar-covered layout on all viewports, including desktop. Every other page (Home, Browse, Settings) handles this. Favourites was missed.

---

## Category 2 — Architecture & Design Problems

### ARCH 1: Route paths are magic strings scattered across 4+ files

`"/"`, `"/browse"`, `"/song/:slug"`, `"/favourites"`, `"/settings"` appear inline in `[App.tsx](src/App.tsx)`, `[TopNav.tsx](src/components/layouts/TopNav.tsx)`, `[BottomNav.tsx](src/components/layouts/BottomNav.tsx)`, and `[SongCard.tsx](src/components/SongCard.tsx)`. A route rename requires hunting down all sites. Needs a `src/lib/routes.ts` constants file.

### ARCH 2: `SongCard.tsx` imports from mock data — a production component coupled to fixtures

`[src/components/SongCard.tsx](src/components/SongCard.tsx)` line 6:

```ts
import { CATEGORY_COLORS, LANGUAGE_LABELS } from "@/lib/mock-data";
```

`CATEGORY_COLORS` is already defined in `categories.ts` via `getCategoryConfig(song.category).color`. `LANGUAGE_LABELS` needs a proper home in a constants file. Mock data must never be imported by production UI components.

### ARCH 3: Zustand — no selectors, causing unnecessary re-renders

`[src/store/app.store.ts](src/store/app.store.ts)` and every consumer destructures the full store:

```ts
const { toggleFavourite, isFavourite } = useAppStore();
```

Any state change — language or any song's favourite toggle — re-renders every component subscribed to the full store. In a list of 50 `SongCard`s, one favourite toggle causes 50 re-renders. The correct pattern:

```ts
const toggleFavourite = useAppStore((s) => s.toggleFavourite);
const favourite = useAppStore((s) => s.favourites.includes(song.id));
```

### ARCH 4: `SongCard` uses `<div onClick>` — accessibility violation

`[src/components/SongCard.tsx](src/components/SongCard.tsx)` lines 26–28: A `<div>` with an `onClick` handler. Not keyboard-navigable, not announced by screen readers. WCAG 2.1 violation. Needs to be a `<button>` or React Router `<Link>`.

### ARCH 5: Reading preferences are prop-drilled 7 props deep into two sibling components

`[src/app/lyrics/index.tsx](src/app/lyrics/index.tsx)` passes `fontSize`, `bold`, `readingMode`, `onFontDecrease`, `onFontIncrease`, `onBoldToggle`, `onReadingModeChange` to both `LyricsToolbar` and `LyricsSidebar`. This whole unit belongs in a `useReadingPreferences()` custom hook.

### ARCH 6: `LANGUAGE_LABELS` has two separate definitions

`src/lib/mock-data.ts` defines `LANGUAGE_LABELS` as `{ te, en, hi, ta, ml }`. `src/app/settings/index.tsx` defines a `LANGUAGES` array with the same codes plus `native` script labels. Two sources of truth means adding a new language requires editing both.

### ARCH 7: `Theme` type is locally redefined in Settings

`[src/app/settings/index.tsx](src/app/settings/index.tsx)` line 8:

```ts
type Theme = "light" | "dark" | "system";
```

This type is already in `ThemeProvider.tsx`. Two definitions will drift.

### ARCH 8: Keyboard shortcut hidden inside `ThemeProvider`

`[src/components/layouts/ThemeProvider.tsx](src/components/layouts/ThemeProvider.tsx)` lines 142–180: Pressing `D` anywhere toggles dark mode. This is undocumented, undiscoverable behavior embedded in a provider. Providers handle context — not app UX interactions. Also: the keyboard handler duplicates the internals of `setTheme` instead of calling it.

### ARCH 9: `localeCompare` without locale in Browse

`[src/app/browse/index.tsx](src/app/browse/index.tsx)` line 22:

```ts
.sort((a, b) => a.title.localeCompare(b.title))
```

For Telugu, Hindi, Tamil, and Malayalam titles, sorting without the script's locale produces incorrect collation order.

---

## Category 3 — Duplication (copy-paste patterns that need abstraction)

| Pattern                                                       | Locations                                      | Fix                                                |
| ------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- |
| Mobile page header (`bg-brand-navy pt-12 pb-*` + back button) | Home, Browse, Favourites, Settings, LyricsHero | `<MobilePageHeader>` component                     |
| Search input (relative div + icon + Input)                    | Home ×2, Browse ×2                             | `<SearchInput>` component                          |
| Song grid (`space-y-2 md:grid md:grid-cols-2 md:gap-3`)       | Home ×4, Browse ×1, Favourites ×1              | `<SongGrid>` component                             |
| Empty state (icon + heading + body text)                      | Browse, Favourites, Home                       | `<EmptyState>` component                           |
| `formatDate()` function                                       | `LyricsHero.tsx`, `SongMeta.tsx`               | Move to `src/lib/utils.ts`                         |
| Reading mode icon color ternary chain                         | LyricsToolbar, LyricsSidebar, LyricsReader     | `getReadingModeColors(mode)` in `constants.ts`     |
| Section label class string (8 occurrences)                    | Settings, SongMeta, LyricsSidebar              | Named Tailwind component class or React component  |
| Font size min/max constants (`12`, `28`, step `2`)            | `LyricsPage/index.tsx`, `LyricsSidebar.tsx`    | `FONT_SIZE_MIN/MAX/STEP/DEFAULT` in `constants.ts` |
| `["light","warm","night"] as ReadingMode[]` cast              | LyricsToolbar, LyricsSidebar                   | Export `READING_MODE_KEYS` from `constants.ts`     |
| `navItems` arrays for route navigation                        | TopNav, BottomNav                              | Single shared `NAV_ITEMS` constant in `routes.ts`  |
| `CATEGORY_COLORS` map                                         | `mock-data.ts`, `categories.ts`                | Remove from mock-data, use `getCategoryConfig`     |
| Close button JSX in Dialog and Sheet                          | `dialog.tsx`, `sheet.tsx`                      | Internal `<CloseButton>` component                 |
| `s.language === language` filter expression                   | Home ×4, Browse ×1, Favourites ×1              | `useSongFilter()` hook                             |

### LyricsHero is the worst offender

`[src/app/lyrics/LyricsHero.tsx](src/app/lyrics/LyricsHero.tsx)` duplicates the entire hero layout twice (mobile and desktop) — two full JSX trees, ~150 lines of duplication, sharing zero internal components. The noise overlay, song thumbnail, artist badge, title, and action buttons are all copy-pasted. The entire component needs to be rebuilt with responsive primitives.

---

## Category 4 — Type Safety Issues

| Issue                                                     | File                            | Fix                                                           |
| --------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------- |
| `createdAt: string` — no date shape                       | `song.types.ts`                 | Keep as `string` but document ISO format, or use branded type |
| `sourceUrl: string` with `""` as null sentinel            | `song.types.ts`, `mock-data.ts` | Change to `sourceUrl?: string`                                |
| `LANGUAGE_LABELS: Record<string, string>`                 | `mock-data.ts`                  | Should be `Record<Language, string>`                          |
| `STREAMING_ICONS: Record<string, ...>`                    | `mock-data.ts`                  | Should be `Record<StreamingLink['platform'], ...>`            |
| `getCategoryConfig(category: string)`                     | `categories.ts`                 | Should accept `Category`, not raw `string`                    |
| `CategoryGroup` union declared twice                      | `categories.ts`                 | One definition, one reference                                 |
| `SongSection` type is dead code                           | `song.types.ts`                 | Either wire it to `Song.lyrics` parsing or remove it          |
| `CATEGORIES_BY_GROUP` is a function named like a constant | `categories.ts`                 | Rename to `getCategoriesByGroup`                              |

---

## Category 5 — Performance & Polish Issues

| Issue                                                                                     | File                                                       |
| ----------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `recentSongs` not memoized (but `filtered` is, inconsistently)                            | `home/index.tsx`                                           |
| `handleFavourite` in SongCard not wrapped in `useCallback`                                | `SongCard.tsx`                                             |
| `song`, `streamingLinks`, `catConfig` recomputed on every render                          | `lyrics/index.tsx`                                         |
| Storage key `"keertify-store"` and `"keertify-theme"` are separate magic strings          | `app.store.ts`, `main.tsx`                                 |
| Max-widths misaligned: `max-w-5xl` (content) vs `max-w-6xl` (nav)                         | `Layout.tsx`, `TopNav.tsx`                                 |
| `sessionId` in store — persisted but undefined purpose                                    | `app.store.ts`                                             |
| `bg-white/12` and `bg-primary/8` are non-standard Tailwind opacity values                 | `LyricsHero.tsx`, `LyricsToolbar.tsx`, `LyricsSidebar.tsx` |
| `h-safe-area-inset-bottom` is not a standard Tailwind class                               | `BottomNav.tsx`                                            |
| Active state indicators inconsistent: dot (theme buttons) vs checkmark (language buttons) | `settings/index.tsx`                                       |
| Greeting is always "Good morning" regardless of time of day                               | `home/index.tsx`                                           |

---

## Priority Order for Fixes

1. **Fix BUG 1** — double Outlet mount (correctness, causes double effects/API calls)
2. **Fix BUG 2** — sonner theme system broken in light mode
3. **Fix BUG 3** — "Hymn" category never returns results
4. **Fix BUG 4** — Favourites broken on desktop
5. **Fix ARCH 3** — Zustand selectors (performance at scale)
6. **Extract `useReadingPreferences` hook** — removes 7-prop drilling
7. **Create `src/lib/routes.ts`** — centralize all route paths
8. **Create `MobilePageHeader`, `SongGrid`, `SearchInput`, `EmptyState`** — eliminate 5 duplicated patterns
9. **Move `formatDate`, `getInitials` to `src/lib/utils.ts`** — remove copy-pasted utilities
10. **Add `FONT_SIZE_*` and `READING_MODE_KEYS` to `constants.ts`** — remove scattered magic numbers
11. **Fix `SongCard` accessibility** — `<div onClick>` → `<Link>` or `<button>`
12. **Fix type issues** — `sourceUrl`, `LANGUAGE_LABELS`, `STREAMING_ICONS` narrowing
13. **Rebuild `LyricsHero`** — eliminate mobile/desktop full duplication
14. **Fix `localeCompare`** — pass language code for correct non-Latin sort
