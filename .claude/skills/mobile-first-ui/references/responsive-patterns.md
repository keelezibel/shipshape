# Responsive patterns reference

Extends the `mobile-first-ui` checklist with concrete adaptation patterns. (Breakpoint strategy informed by bencium's responsive-design reference.)

## Breakpoint ranges and layout strategy

| Range | Width | Devices | Strategy |
|---|---|---|---|
| base | 0–639px | phones | single column, bottom nav/action bar, 44px+ targets, collapsed tables→cards |
| sm | 640–767px | large phones | still single column; wider gutters |
| md | 768–1023px | tablets | 2 columns possible, sidebar can appear, some desktop affordances |
| lg | 1024–1279px | laptops | multi-column, persistent nav |
| xl | 1280px+ | desktops | max-width container (~1200–1280px), multi-panel |

## Component adaptation patterns (mobile → desktop)

- Navigation: bottom tab bar or hamburger → full horizontal nav
- Primary action: fixed bottom bar (thumb zone, above `safe-area-inset-bottom`) → inline button
- Forms: stacked full-width fields → side-by-side pairs
- Data tables: card list (label:value rows) → real `<table>`; never force horizontal scroll on phones for primary content
- Filters: bottom sheet / drawer → persistent sidebar panel
- Modals: full-screen sheet → centered dialog (max-width)
- Multi-step flows: one step per screen → wizard with visible steps

## Fluid type & spacing

```css
/* clamp(min, preferred, max) — scales between 375px and 1280px viewports */
h1 { font-size: clamp(1.75rem, 1.2rem + 2.4vw, 3rem); }
.section { padding-block: clamp(2rem, 1rem + 4vw, 5rem); }
```

Prefer `clamp()` over per-breakpoint font-size overrides; fewer jumps, no orphan breakpoints.

## Container queries (component-level responsiveness)

When a component's layout depends on its container, not the viewport (cards in a sidebar vs main column):

```css
.card-list { container-type: inline-size; }
@container (min-width: 480px) { .card { grid-template-columns: 96px 1fr; } }
```

## Images

```tsx
<Image src="/hero.jpg" alt="..." fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={aboveTheFold} />
```

- `sizes` must reflect the actual rendered width per breakpoint — wrong `sizes` silently ships 3× the bytes.
- `priority` only for the LCP image; everything below the fold lazy-loads (default).
- Art direction (different crop on mobile) → `<picture>` with `media` queries, not CSS cropping of a huge original.

## Viewport gotchas

- `100dvh` not `100vh` (mobile URL bar); `svh` for "never jumps" cases.
- `env(safe-area-inset-*)` padding on fixed bottom/top bars (notches, home indicator).
- `overflow-x: clip` on body-level wrappers to catch accidental horizontal scroll; then find and fix the offender (usually an unconstrained flex child or 100vw element).
- Test real breakage points: 320px (SE/reflow requirement), 375px, 768px, 1280px.
