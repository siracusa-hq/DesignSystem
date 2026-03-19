# Changelog

## 0.1.12 (2026-03-18)

- Add accent surface tokens (`--color-surface-accent`, `--color-on-surface-accent`) for sidebar active states
- Apply accent tokens to APP Standard sidebar and App Shell story
- Add active state to PWA profile menu items

## 0.1.11 (2026-03-18)

- Add accent surface tokens for selected/active nav items
- Fix App Shell story: replace hardcoded neutral colors with semantic tokens

## 0.1.10 (2026-03-18)

- Refine dark mode surfaces from near-black (#09090b) to industry-standard range (#121215)
- Hand-picked elevation ladder: sunken → surface → raised → muted
- Align with Material Design, Linear, GitHub dark mode standards

## 0.1.9 (2026-03-18)

- Redesign chart color palette: hand-curated Tableau-style categorical colors
- Replace auto-derived semantic-token palette with perceptually balanced independent colors
- Simplify structure: categorical + subtle pair (replace fill/stroke/area/semantic 4-tier)

## 0.1.8 (2026-03-18)

- Refine chart color palette: softer 400-level tones, add stroke series

## 0.1.7 (2026-03-18)

- Add chart/dashboard support: StatCard, ChartContainer, chart theme tokens
- Add chart color palette Storybook story and dashboard composition example

## 0.1.6 (2026-03-18)

- Redesign APP PWA example story (mobile-first, modern patterns)

## 0.1.5 (2026-03-18)

- Redesign APP Standard example story (WorkOS/GitHub-inspired sidebar, dashboard)

## 0.1.4 (2026-03-18)

- Avatar: colorful fallback by default (React.useId auto-seed)

## 0.1.3 (2026-03-18)

- Avatar redesign: colorful fallbacks, shape variants, AvatarStatus, AvatarGroup

## 0.1.2 (2026-03-17)

- Add cursor: pointer to all clickable elements via global CSS rule

## 0.1.1 (2026-03-17)

- Fix Tailwind CSS v4 arbitrary value syntax: add var() wrapper across all components

## 0.1.0 (2026-03-16)

### Initial Release

- 38 components (core atoms, form, data display, navigation, layout, PWA)
- Dark mode support (semantic CSS variable tokens + ThemeProvider)
- 350+ tests with axe-core a11y validation
- Storybook documentation with dark mode toggle
- CI/CD pipeline (GitHub Actions)
- Bundle size monitoring with size-limit
