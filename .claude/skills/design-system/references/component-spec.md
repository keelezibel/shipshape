# Component spec template

Copy per component into `docs/design-system.md`. Every interactive component ships with this table filled in BEFORE implementation.

## Button (example)

| Property | Default | Hover | Active | Focus-visible | Disabled | Loading |
|---|---|---|---|---|---|---|
| Background | `--button-bg` | `--button-bg-hover` | `--button-bg-active` | as default | `--color-surface-muted` | as default |
| Text | `--color-on-primary` | same | same | same | `--color-text-muted` | transparent (spinner shown) |
| Border/ring | none | none | none | 2px `--color-focus-ring`, 2px offset | none | none |
| Cursor | pointer | pointer | pointer | — | not-allowed | wait |
| Extra | — | 150ms ease-out | scale(0.98) ok if reduced-motion off | never remove outline | `aria-disabled` | `aria-busy`, min-width preserved |

## Rules

- Focus-visible is NEVER just "as hover" — it must survive on touch devices and pass 3:1 contrast against adjacent colors.
- Disabled states stay ≥ 3:1 legible; prefer preventing invalid actions over disabling without explanation.
- Loading states preserve dimensions (no layout shift) and announce via `aria-busy`/`role="status"`.
- Variants (primary/secondary/ghost/destructive) are separate columns or separate tables — never boolean-prop spaghetti (see `composition-patterns`).
- Sizes: sm/md/lg from the spacing scale; touch target ≥ 44px on mobile even when visual height is smaller (use padding or pseudo-element hit area).
