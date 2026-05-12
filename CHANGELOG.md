# Changelog

## 0.2.2 (2026-05-12)

### Fixes

- **Tailwind v4 で `z-*` utility が生成されない問題を修正**。Token namespace を `--z-*` から **`--z-index-*`** に rename し、Tailwind v4 公式の namespace 規約に準拠。
  - 旧: `--z-modal: 1200` → CSS 変数のみ生成、`.z-modal` utility は **未生成** (= class が無効化されて `z-index: auto` に fallback、Drawer / Dialog の stacking が想定通り動かなかった)
  - 新: `--z-index-modal: 1200` → Tailwind v4 が `.z-modal { z-index: var(--z-index-modal) }` を自動生成
- 0.2.0 の Drawer/Tabs 等のバグ修正は class 付与までは済んでいたが、本 patch で実際に CSS 値が適用されるようになる
- `drawer.tsx` inline style: `calc(var(--z-drawer) + N)` → `calc(var(--z-index-drawer) + N)`
- `src/test/z-index-guard.test.ts` の allowlist 文書を `--z-index-*` に更新
- `docs/z-index-system.md` の全 token 名を `--z-index-*` に更新

### Breaking changes (token 変数名のみ)

- CSS 変数名: `--z-{name}` → `--z-index-{name}` (11 個全部)
- consumer が `var(--z-modal)` などを **直接参照** している場合のみ手動更新が必要
- **token utility (`z-modal` 等の class) は不変** — Tailwind 経由の利用者は影響なし

## 0.2.1 (2026-05-11)

### Refactor

- **Storybook**: `Foundations/Z-Index Stacking` カテゴリを廃止し、Storybook の責務 (完成品の UX カタログ) と test の責務 (バグ再発防止) を分離。
  - UX 確認価値のあるストーリーは個別 story の variant に移動: `Navigation/Dialog/WithSelect`, `Navigation/Dialog/WithDropdownMenu`, `Navigation/Drawer/Stacked`
  - バグ再現専用ストーリー (`DialogInsideTabs` / `TooltipOverDialog` / `PopoverInsideDialog` / `DialogInsideDrawer` / `ToastOverModal`) は削除。バグ再発防止は `z-index-guard.test.ts` + 各 component の unit test で機械的に保証済み。

### Docs

- `docs/z-index-system.md` に UX 設計ルール追記
  - 「Drawer は閉じてから Dialog を開く」
  - 「Toast は Modal 表示中も最前面で表示する」

## 0.2.0 (2026-05-11)

### Breaking Changes

- **z-index scale を 3 層階層に再設計**。`--z-*` の数値が以下の通り変更:
  - `--z-dropdown`: 50 → **1300** (Dialog 内 DropdownMenu の下潜り解消)
  - `--z-sticky`: 100 → **10** (in-flow 階層に再分類)
  - `--z-drawer`: 200 → **1100**
  - `--z-modal`: 300 → **1200**
  - `--z-popover`: 400 → **1300**
  - `--z-toast`: 500 → **1500**
  - `--z-tooltip`: 600 → **1400**
- token 名 (`z-modal` 等) を使う consumer はコード変更不要。hardcoded 数値の z-index を使う consumer は audit が必要。
- 新規 token 追加: `--z-base` (0), `--z-content` (1), `--z-header` (20), `--z-overlay-inline` (30)。

### Fixes

- **Drawer**: hardcoded `style={{ zIndex: 200 + stackOffset }}` を `calc(var(--z-drawer) + N)` に変更、`z-drawer` className も併記。token との二重管理を解消。
- **Tabs**: TabsTrigger の任意値 `z-[1]` を `z-content` token に。TabsList に `isolate` を追加し、内部 stacking context を閉じ込める。これにより「Tabs trigger が Dialog の上に表示される」バグを解消。
- **TimelineGrid / Timeline / Resizable**: flow 内 `z-10..z-40` を持つ root に `isolate` を追加し stacking context を component 内に閉じる。Dialog/Drawer 等の外部レイヤーに漏れない。
- **InstallPrompt**: fixed bottom banner の `z-modal` → `z-overlay-inline` に変更 (背景遮断系ではないため)。Drawer/Dialog の下に来る。
- **AppShellHeader**: `z-header` を予防適用。将来 sticky sub-element を配置した時の安定性を確保。

### Docs

- 新規 `docs/z-index-system.md`: 3 層階層図、token 値表、利用規約、組合せ別期待挙動、新 component 追加時の decision tree、アンチパターン集、後方互換性メモ。

### Tests

- 新規 `src/test/z-index-guard.test.ts`: repo 全体を走査して任意値 `z-[N]` と inline `zIndex:` を allowlist 外で検出すれば fail。flow 内 z-utility 使用ファイルに `isolate` がなければ fail。新 contributor が docs を読まずに違反コードを書いても CI が落ちる仕組み。
- 新規 `src/stories/z-index-stacking.stories.tsx`: Foundations カテゴリに 8 シナリオ (DialogInsideTabs / SelectInsideDialog / DropdownMenuInsideDialog / DialogInsideDrawer / TooltipOverDialog / ToastOverModal / PopoverInsideDialog / StackedDrawers) を新規追加。
- 各 component test に z-class / `isolate` 含有 assertion を追加 (drawer / tabs / timeline / timeline-grid / resizable)。

## 0.1.13 (2026-03-19)

- Redesign Spinner: segmented bar chase animation (Radix/Vercel inspired)

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
