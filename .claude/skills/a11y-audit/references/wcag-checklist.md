# WCAG 2.2 AA source-level checklist (fallback when live audit unavailable)

## Perceivable

- Informative images have meaningful `alt`; decorative images have `alt=""` (never omit the attribute)
- Text contrast ≥ 4.5:1 (≥ 3:1 for 18px+ bold / 24px+ regular); UI component boundaries ≥ 3:1
- Color is never the only signal (error states also get icon/text; links in prose are underlined)
- Media: captions for video, transcripts for audio
- Content reflows at 320px width without horizontal scroll; readable at 200% zoom (no `user-scalable=no`, no `maximum-scale<2`)

## Operable

- Everything reachable and operable by keyboard; no traps; custom widgets implement expected keys (Enter/Space/arrows/Escape)
- Visible focus indicator, ≥ 3:1 contrast against adjacent colors, not fully obscured by sticky headers/footers (WCAG 2.2 §2.4.11)
- Skip link to main content; logical focus order matching visual order
- Touch targets ≥ 24×24 CSS px minimum (2.2 §2.5.8); aim for 44×44
- No drag-only interactions without a single-pointer alternative (2.2 §2.5.7)
- Nothing flashes more than 3×/second; animations respect `prefers-reduced-motion`

## Understandable

- `<html lang>` set; page `<title>` unique and descriptive
- Every input has a programmatic label (`<label for>`, `aria-label`, or `aria-labelledby`); placeholder is not a label
- `autocomplete` attributes on identity fields (name, email, tel, address)
- Errors: identified in text, associated with the field (`aria-describedby`), suggest a fix; never rely on color alone
- No redundant re-entry of information within a flow (2.2 §3.3.7); accessible authentication — no cognitive puzzles as the only factor (2.2 §3.3.8)
- Navigation and component behavior consistent across pages

## Robust

- Semantic HTML first: `button` not clickable `div`, `nav`/`main`/`header` landmarks, one `h1`, no skipped heading levels
- ARIA only when HTML can't express it; every ARIA role has its required states/properties; no `aria-hidden` on focusable elements
- Status messages use `role="status"`/`aria-live` so they announce without focus moves
- Name/role/value programmatically determinable for all custom controls
