# StudyBrew NYC — Design System

> **Living doc.** This file is hand-maintained, not generated. If you add or
> change a color token, a `Button` variant, an icon, or introduce a new
> shared UI pattern, update this file in the same PR. It will drift out of
> sync otherwise.

## Overview

Next.js 14 (App Router) + plain CSS Modules — no Tailwind, no CSS-in-JS.
Every component's styles live in a sibling `*.module.css` file. Global
design tokens live in `src/app/globals.css` as CSS custom properties.

The app runs **two parallel visual systems**, and knowing which one you're
in matters:

| System | Where it lives | Used for |
|---|---|---|
| **Monochrome UI** | `src/app/globals.css` `:root` | Form pages (`/add`), filter dropdown panels, generic layout chrome |
| **Watercolor / paper** | `MapContainer.module.css` (map-scoped) + `--color-paper*` tokens in `globals.css` | The map, nav bar, list panel, café cards, café detail page, map popup — i.e. anywhere the hand-drawn "paper card" look applies |

Typography is shared across both: a single custom hand-drawn font,
`'Shadows Into Light'` (file-based `@font-face` at the top of
`globals.css`, sourced from `public/fonts/ShadowsIntoLight.ttf`), used
everywhere via `--font-sans`.

---

## Color tokens

### Monochrome palette (`globals.css`, global — available everywhere)

| Token | Value | Notes |
|---|---|---|
| `--color-black` | `#0a0a0a` | |
| `--color-gray-900` | `#171717` | |
| `--color-gray-800` | `#262626` | |
| `--color-gray-700` | `#404040` | |
| `--color-gray-600` | `#525252` | |
| `--color-gray-500` | `#737373` | |
| `--color-gray-400` | `#a3a3a3` | |
| `--color-gray-300` | `#d4d4d4` | |
| `--color-gray-200` | `#e5e5e5` | |
| `--color-gray-100` | `#f5f5f5` | |
| `--color-white` | `#ffffff` | |

Semantic aliases (prefer these over the raw grays):

| Token | Resolves to | Used for |
|---|---|---|
| `--color-bg` | `--color-white` | Page/panel backgrounds outside the watercolor system |
| `--color-bg-subtle` | `--color-gray-100` | Badges, subtle fills |
| `--color-bg-muted` | `--color-gray-200` | Chips |
| `--color-border` | `--color-gray-300` | Default hairline borders |
| `--color-border-strong` | `--color-gray-700` | Emphasized borders |
| `--color-text` | `--color-gray-900` | Primary text |
| `--color-text-muted` | `--color-gray-500` | Secondary text |
| `--color-text-subtle` | `--color-gray-400` | Placeholder-level text |
| `--color-ink` | `--color-black` | High-contrast text/icons, `Button` primary fill |

### Watercolor / paper palette

Two separately-scoped token sets that are visually related but **not
merged** — the map's own background/chrome has an independent lifecycle
from card surfaces, so they get independent tokens:

**App-wide** (`globals.css` `:root`) — used by nav bar, list panel, cards,
detail page, popup, and their buttons:

| Token | Value | Used for |
|---|---|---|
| `--color-paper` | `#FBF8F1` | Base watercolor card background (via `WatercolorSurface`) |
| `--color-paper-render` | `#F6F0E2` | Watercolor wash tint; also the solid fill for `Button` `secondary` variant and `FilterBar` pills |
| `--color-accent-brown` | `#7a5e42` | Primary CTA fill (`Button` `accent` variant, active filter pills) |

**Map-scoped** (`MapContainer.module.css` `.wrapper`, only resolvable
inside the map subtree):

| Token | Value | Used for |
|---|---|---|
| `--map-paper` | `#f6f0e2` | Leaflet's own popup chrome + base map background |
| `--map-paper-edge` | `#eee0c4` | Popup chrome border |
| `--map-water-light` / `--map-water-deep` | `#cfe4e6` / `#a9cdd0` | Water polygon fill |
| `--map-park` / `--map-park-deep` | `#cfe3c9` / `#a3c896` | Park polygon fill |
| `--map-road` | `#f9f5ea` | Road tint |
| `--map-ink` | `#3c3a34` | Map labels, popup title |
| `--map-label` / `--map-label-soft` | `#4a4741` / `#6b675e` | Map/popup body text |
| `--map-accent-positive` | `#7fa66b` | Wifi/outlets present (green) |
| `--map-accent-negative` | `#b5484a` | Wifi/outlets absent (red) |
| `--map-shadow` | `0 4px 14px rgba(60,58,52,0.22), 0 1px 3px rgba(60,58,52,0.15)` | Popup drop shadow |

---

## Typography

```css
--font-sans: 'Shadows Into Light', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-address: 'Arial Narrow 7', Arial, sans-serif;
```

`--font-address` is a second, narrower font used **only** for displayed
address text (`CafeCard`/`CafeDetail`'s `.copy-address`, `CafePopcard`'s
`.address`) — everything else stays on `--font-sans`. Both fonts are
declared as file-based `@font-face`s at the top of `globals.css`, sourced
from `public/fonts/ShadowsIntoLight.ttf` and `public/fonts/arial_narrow_7.ttf`
respectively.

| Token | Value (px) |
|---|---|
| `--text-xs` | 12 |
| `--text-sm` | 14 |
| `--text-base` | 16 |
| `--text-lg` | 18 |
| `--text-xl` | 20 |
| `--text-2xl` | 24 |
| `--text-3xl` | 30 |
| `--text-4xl` | 36 |

Line heights: `--leading-tight` 1.25 · `--leading-snug` 1.375 · `--leading-normal` 1.5 · `--leading-relaxed` 1.625
Weights: `--weight-normal` 400 · `--weight-medium` 500 · `--weight-semibold` 600 · `--weight-bold` 700
Letter spacing: `--tracking-tight` -0.02em · `--tracking-normal` 0 · `--tracking-wide` 0.04em · `--tracking-widest` 0.1em

---

## Spacing, radius, shadow, z-index, transitions

| Spacing | | Radius | | Shadow | |
|---|---|---|---|---|---|
| `--space-1` | 4px | `--radius-sm` | 2px | `--shadow-sm` | `0 1px 2px rgba(0,0,0,.06)` |
| `--space-2` | 8px | `--radius-md` | 4px | `--shadow-md` | `0 2px 8px rgba(0,0,0,.10)` |
| `--space-3` | 12px | `--radius-lg` | 8px | `--shadow-lg` | `0 4px 16px rgba(0,0,0,.12)` |
| `--space-4` | 16px | `--radius-xl` | 12px | `--shadow-xl` | `0 8px 32px rgba(0,0,0,.16)` |
| `--space-5` | 20px | `--radius-full` | 9999px | | |
| `--space-6` | 24px | | | | |
| `--space-8` | 32px | | | | |
| `--space-10` | 40px | | | | |
| `--space-12` | 48px | | | | |
| `--space-16` | 64px | | | | |
| `--space-20` | 80px | | | | |

Z-index: `--z-map` 0 · `--z-panel` 10 · `--z-filter` 20 · `--z-popup` 30 · `--z-modal` 40 · `--z-toast` 50 · `--z-overlay` 60
Transitions: `--transition-fast` 120ms ease · `--transition-base` 200ms ease
Layout: `--panel-width` 400px · `--header-height` / `--filter-height` 56px

---

## Components (`src/components/ui/`)

### `Button`
```tsx
<Button variant="accent" size="sm">Add a café</Button>
```
- `variant`: `'primary' | 'secondary' | 'ghost' | 'accent'`
- `size`: `'sm' | 'md' | 'lg'`
- `loading?: boolean` — shows `Spinner` inline, disables the button

| Variant | Fill | Text | When to use |
|---|---|---|---|
| `primary` | `--color-ink` (black) | white | Monochrome-system primary actions (mobile map/list toggle) |
| `secondary` | `--color-paper-render` (`#F6F0E2`) | `--color-ink` | Secondary actions inside the watercolor system (popup CTAs, "Clear filters") |
| `accent` | `--color-accent-brown` (`#7a5e42`) | white | The single primary CTA per screen (e.g. "Add a café") |
| `ghost` | transparent | `--color-text` | Low-emphasis inline actions |

### `Input` / `Select`
Form field primitives — `label?`, `error?` (renders red-bordered + error text below), forward refs. `Select` additionally takes `options: {value,label}[]`.

### `Toast`
```tsx
<Toast message="Saved!" type="success" onDismiss={() => {}} />
```
`type: 'success' | 'error'`, auto-dismisses after 4s.

### `Spinner`
```tsx
<Spinner size={16} />
```
Inline SVG loading indicator, stroked in `--color-ink`.

### `WatercolorSurface` + `WatercolorDefs`
The hand-drawn "paper card" background layer — used by the nav bar,
filter bar, list panel, every café card, the café detail page, and the
map popup.

**How it works** (3 layers, back to front):
1. `.sbEdge` — `position:absolute; inset:0; overflow:hidden; border-radius:inherit`, filled with `--color-paper`, with `filter: url(#sb-jitter-N)` applied directly to it. Because the filter is on the *already-clipped* rounded rect, the `feDisplacementMap` jitters the rectangle's own edge into a hand-drawn wobble.
2. Two organic blob `<div>`s inside `.sbEdge` (8-value `border-radius`, `linear-gradient` fill, `mix-blend-mode:multiply`, `blur(13px)`, slow `sbflow` scale/rotate animation) — simulate overlapping watercolor pigment.
3. A `feTurbulence`-based paper-grain texture `<div>`, also `multiply`-blended.

Content is **never** inside `.sbEdge` — it's a sibling, so it's untouched
by the filter/blur. That's why every consumer follows the same pattern:

```tsx
<div className={styles.card /* position:relative; explicit border-radius */}>
  <WatercolorSurface seed={1} />
  <div className={styles.content /* position:relative; z-index:1 */}>
    {/* real content */}
  </div>
</div>
```

- `seed?: 1 | 2 | 3` — picks one of 3 jitter filter variants (different `feTurbulence` seed/frequency) so adjacent cards don't look identical. `CafeCard` derives its seed from a hash of `cafe.id` so each card is stable-but-varied.
- The 3 filters (`#sb-jitter-1/2/3`) live in `WatercolorDefs.tsx`, mounted once in the root `layout.tsx`. SVG `filter: url(#id)` resolves document-wide, so any component anywhere (including inside Leaflet's popup DOM) can reference them without re-mounting defs.
- **Required on the wrapper**: `position: relative` and an explicit `border-radius` (even `0`) — `.sbEdge` uses `border-radius: inherit` to match it.

---

## Icons

Two systems:

1. **Custom illustrated PNGs** — `public/icons/`: `wifi.png`, `table.png`, `seat.png`, `outlet.png` (amenity icons, referenced via `AMENITY_ICONS` in `src/lib/constants.ts`), plus `coffee_cup_transparent.png` (map pin) and `pin-default.svg`/`pin-unknown.svg` (Leaflet default markers). Use these for anything amenity- or map-related — they match the hand-drawn illustration style.
2. **`lucide-react`** — generic UI icons, used sparingly: `Volume2` (noise attribute, `CafeDetail.tsx`), `X` (toast dismiss, `Toast.tsx`). Reach for lucide only when there's no matching custom illustration and the icon is UI-chrome, not domain content.

---

## App-specific patterns (not formal `ui/` components, but consistent conventions)

- **Card pattern** (`CafeCard`, `CafePopcard`, `CafeDetail`): `WatercolorSurface` + a `position:relative;z-index:1` content wrapper, per the pattern above.
- **Filter pill pattern** (`FilterBar.module.css` `.trigger`/`.triggerActive`): inactive = `--color-paper-render` fill; active (has a selection) = `--color-accent-brown` fill + white text. Dropdown panels underneath stay in the monochrome system (white bg, `--shadow-lg`).
- **Label-map pattern** (`src/lib/constants.ts`): every enum field (`WifiEnum`, `OutletsEnum`, `DeskSizeEnum`, `SeatsEnum`, `NoiseEnum`, `BoroughEnum`) has a matching `*_LABELS: Record<Enum, string>` for display text — keeps enum→copy mapping in one place instead of scattered switch statements. Note `WIFI_LABELS` vs `WIFI_FORM_LABELS`: the former collapses `free`/`paid_or_login` into "Free WiFi" for browsing UI, the latter keeps the 3-way distinction for the add/edit form.
