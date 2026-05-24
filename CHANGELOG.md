# Changelog

## 0.3.7 (2026-05-24)

### CI (Trusted Publishing 完全動作 — environment claim mismatch 解消)

0.3.6 では Trusted Publishing の OIDC 取得まで成功していたが、npm 側
Trusted Publisher 設定の **Environment name に `npm-publish` が入っていた**
ため、workflow 側の OIDC claims (environment = 空) と mismatch を起こし、
publish API が permission denied (404) を返していた。

npm 側 Trusted Publisher 設定の Environment name を **空に変更**することで
解決。本リリースは 0.3.6 と完全同一コード、動作確認のための patch release。

## 0.3.6 (2026-05-24)

### CI (Trusted Publishing 完全動作 — registry-url 保持 + placeholder 削除)

0.3.5 で `registry-url` を外したら ENEEDAUTH になり、OIDC trigger 条件が
失われたことが判明。`registry-url` は復活させて registry エントリは保持しつつ、
**placeholder `_authToken=XXXXX-XXXXX-XXXXX-XXXXX` の行のみを sed で削除**
する step を追加する (#97)。これで:

- registry エントリは残る → OIDC trigger 条件を満たす
- placeholder token は削除 → npm publish が OIDC を取りに行く

本リリースは 0.3.5 と完全同一コード。Trusted Publishing 完全動作確認の
ための patch release。

### 経緯

| version | workflow 設定 | publish step ログ | 結果 |
| ------- | ------------- | ----------------- | ---- |
| v0.3.0 ~ v0.3.3 | `NPM_TOKEN` 使用 | token 期限切れ | 404 |
| v0.3.4 | Trusted Publishing 移行、`registry-url` あり | Signed provenance + 404 | OIDC 取れたが placeholder 優先 |
| v0.3.5 | `registry-url` 削除 | provenance 行ナシ + ENEEDAUTH | OIDC trigger されず |
| **v0.3.6 (本リリース)** | `registry-url` 復活 + placeholder 削除 | (確認中) | publish 成功想定 |

## 0.3.5 (2026-05-24)

### CI (Trusted Publishing 完成 — setup-node placeholder 問題の解消)

0.3.4 で導入した Trusted Publishing は **provenance statement の発行までは
成功** していたが、`setup-node` の `registry-url` 設定が `~/.npmrc` に書く
`_authToken=XXXXX-XXXXX-XXXXX-XXXXX` placeholder が OIDC fallback を
阻害し、publish は 404 で失敗していた。

#96 で `setup-node` から `registry-url` を削除することで `.npmrc` に auth
設定が書かれなくなり、npm CLI が OIDC ベースの Trusted Publishing を正しく
使用するようになる。npmjs.org はデフォルト registry のため、`registry-url`
は元々不要だった。

本リリースは 0.3.4 と完全同一コード。Trusted Publishing 完全動作確認のため
新 tag を切る。

## 0.3.4 (2026-05-24)

### CI (npm publish 復旧 — Trusted Publishing 移行)

0.3.0 〜 0.3.3 の Release workflow が npm publish step で `404 Not Found`
を出し続けていた問題を解消。`NODE_AUTH_TOKEN` (=`secrets.NPM_TOKEN`) の
期限切れが原因だったため、token を使わない **npm Trusted Publishing
(OIDC ベース、2024-07 GA)** に切り替える。

- `permissions.id-token: write` を追加 (OIDC token request)
- npm CLI を最新化する step を追加 (Trusted Publishing は npm >= 11.5.1)
- publish step から `NODE_AUTH_TOKEN` env を削除
- `--provenance --access public` flag を追加 (SLSA 由来証明を npm 上に公開)

本リリースが npm に publish できれば Trusted Publishing が動作することの
動作確認も兼ねる。コードは 0.3.3 と完全同一 (workflow 改善のみ)。

### Next steps

1. npm 側 Publishing access を **strict (disallow tokens)** に切り替え
2. GitHub repo secrets で `NPM_TOKEN` を削除

## 0.3.3 (2026-05-24)

### Fixes (0.3.2 follow-up — docs と chart-1-subtle dark の最終同期)

0.3.2 で primary palette を `#008575` 中心に再設計した際、**docs 配下のサンプル**
と **dark mode の chart-1-subtle** が旧 hex のまま取り残されていたため修正。

#### Docs sample 値の更新

- `docs/BRAND_IDENTITY.md` — primary-50..950 全 shade を新 palette と同値に書き換え
  (旧 0.2.x 時代のさらに古い hex がそのまま残っていた)
- `docs/PWA_GUIDELINES.md` — PWA manifest sample と `<meta name="theme-color">`
  サンプルの `#13C3A0` を `#008575` に
- `docs/starter-templates.md` — VitePWA manifest sample の `theme_color` を更新
- `docs/plan.md` — 戦略ドキュメントの brand 色記載を更新

これらは consumer がそのままコピペするサンプル値なので、palette と乖離していると
新規導入時に古い brand が広まる原因になる。

#### Token 整合

- `src/styles/semantic.css` — dark mode の `--color-chart-1-subtle` を
  `#003830` → `#003831` に。新 `primary-900` (`#003831`) と完全一致させ、
  palette の完全整合を達成。視覚差は 0 (R 値 1bit 違い) だが整合性のため。

### Notes

- ソースコード本体には旧 hex 残骸なし (前 release で完全置換済み)
- 本 release で **docs / token / consumer-facing sample すべてが新 palette に統一**

## 0.3.2 (2026-05-24)

### Breaking changes (primary palette brightening)

0.3.1 で確定した Material teal-700 (`#00796B`) ベースの palette は AA 余裕 (5.32:1)
を持つが、ブランド表現として暗すぎた。WCAG AA 4.5:1 を満たす範囲内で限界まで
明るくした `#008575` (4.55:1) を新 `primary-500` に据え、palette を再設計する。

### Palette

50-400 は前 release の Material teal light shade を踏襲、600-950 は H=173 S=100%
で L を 4% ずつ smooth に下げた hue-consistent な dark shade。

| shade   | 旧 (0.3.1)    | 新 (0.3.2)    | contrast vs white |
| ------- | ------------- | ------------- | ----------------- |
| 50      | `#e0f2f1`     | `#e0f2f1`     | 1.16              |
| 100     | `#b2dfdb`     | `#b2dfdb`     | 1.45              |
| 200     | `#80cbc4`     | `#80cbc4`     | 1.87              |
| 300     | `#4db6ac`     | `#4db6ac`     | 2.44              |
| 400     | `#26a69a`     | `#26a69a`     | 3.00              |
| **500** | **`#00796b`** | **`#008575`** | **4.55 ✅ AA**    |
| 600     | `#006d60`     | `#007567`     | 5.61 ✅           |
| 700     | `#005850`     | `#006055`     | 7.49 ✅           |
| 800     | `#004d44`     | `#004c43`     | 9.93 ✅           |
| 900     | `#003830`     | `#003831`     | 13.04 ✅          |
| 950     | `#002822`     | `#00231f`     | 16.66 ✅          |

### 連動変更

- `src/tokens/colors.ts` — TypeScript export を新 palette と同期
- `src/tokens/chart-theme.ts` — `hex.categorical[0]` を `#00796B` → `#008575`
- `src/styles/semantic.css` — `--color-chart-1` (light) を `#008575` に。
  dark mode の chart-1 / surface-accent は brand hue (H≈173) が不変なので変更不要
- `src/components/chart/chart.test.tsx` — fixture と rgb assertion を新 hex 対応に
- `CLAUDE.md` — メインカラー記載を更新

### Breaking impact

- `primary-500` ~ `primary-950` の hex 値が変更。 hex 直書きで参照している
  consumer は手動 audit が必要 (CSS var / Tailwind class 経由なら自動追従)
- `primary-50` ~ `primary-400` は 0.3.1 と同値で変更なし

## 0.3.1 (2026-05-24)

### Fixes (0.3.0 follow-up — token export & chart-1 brand anchor の同期漏れ修正)

0.3.0 で `primary` パレットを Material teal-700 系に刷新したが、以下が
**旧 hex (`#13C3A0` 系) のまま取り残されていた** ため、それらを新 brand に同期。

- **`src/tokens/colors.ts`** — TypeScript export の `colors.primary.{50..950}` を
  新 palette と同値に揃える。これが古いままだと、Storybook の Tokens > Colors
  Tokens 表示が旧 hex を出し続け、また `import { colors } from
'@polastack/design-system/tokens'` を使う consumer に旧値が返っていた。
- **`src/tokens/chart-theme.ts`** — `hex.categorical[0]` の brand anchor fallback
  を `#13C3A0` → `#00796B` に。
- **`src/styles/semantic.css`** — chart-1 brand anchor を新 palette と整合:
  - light: `--color-chart-1: #13C3A0` → `#00796B` (primary-500)
  - light: `--color-chart-1-subtle: #E8FAF6` → `#E0F2F1` (primary-50)
  - dark : `--color-chart-1: #2EE0BC` → `#4DB6AC` (primary-300)
  - dark : `--color-chart-1-subtle: #0C2B26` → `#003830` (primary-900)
- **`src/components/chart/chart.test.tsx`** — test fixture の hardcoded
  `#13C3A0` を `#00796B` に。

### Notes

- 0.3.0 で行うべきだった同期作業の追加分。consumer 側で 0.3.0 を pin している
  場合は 0.3.1 に上げることで Storybook 表示・JS 定数・chart brand anchor が
  全て一貫した状態になる。

## 0.3.0 (2026-05-24)

### Breaking changes (Brand color redesign)

**`primary` パレット全面刷新**。旧 `#13C3A0` (Vivid Teal, H≈168 S≈82% L≈42%) は
white text と組み合わせると contrast 2.24:1 で WCAG AA 不適合だったため、0.2.3
では「brand 色は不変、操作 UI のみ `primary-700` (#137663) に逃がす」二段運用で
回避していた。しかし結果として Button / Stepper / DatePicker など主要操作 UI が
暗めの teal-700 になり、ブランド表現としての洗練さを損なっていた。

本リリースでは **Material Design teal-700 (`#00796B`) を新 `primary-500` に据えた
AA-first パレット**に再設計。500 単独で白文字 5.32:1 を満たすため、操作 UI に
`primary-500` を直接適用しつつ AA 準拠を維持できる。

| shade   | 旧 (#13C3A0 系) | 新 (#00796B 系, Material teal) | contrast vs white |
| ------- | --------------- | ------------------------------ | ----------------- |
| 50      | `#f2fdfb`       | `#e0f2f1`                      | 1.16              |
| 100     | `#dbfaf4`       | `#b2dfdb`                      | 1.45              |
| 200     | `#b4f3e6`       | `#80cbc4`                      | 1.87              |
| 300     | `#7ee7d2`       | `#4db6ac`                      | 2.44              |
| 400     | `#2ee0bc`       | `#26a69a`                      | 3.00              |
| **500** | **`#13c3a0`**   | **`#00796b`**                  | **5.32 ✅ AA**    |
| 600     | `#109e81`       | `#006d60`                      | 6.26 ✅           |
| 700     | `#137663`       | `#005850`                      | 8.36 ✅           |
| 800     | `#165a4c`       | `#004d44`                      | 9.79 ✅           |
| 900     | `#164b40`       | `#003830`                      | 13.06 ✅          |
| 950     | `#072c25`       | `#002822`                      | 15.83 ✅          |

#### 連動変更

- **0.2.3 で `primary-700` に逃がしていた箇所を `primary-500` に戻す** (Button default /
  Stepper active|completed|loading / DatePicker selected / DateRangePicker
  range endpoints / TimelineGrid today / CalendarView today)。新 500 が AA pass
  するため二段運用は不要に。
- `--color-surface-accent` (light: `#E4F5F1` → `#E6F3F2`, dark: `#0F2926` →
  `#0E2926`) を新 brand hue (H≈174) に整合。視覚差は微少だが palette と一貫性を確保。
- `CLAUDE.md` のメインカラー記載を更新。

#### Breaking impact

- `primary-{50..950}` を hex 直書きで参照している consumer は手動 audit が必要
  (CSS `var(--color-primary-*)` または Tailwind class `bg-primary-*` 経由なら自動追従)。
- ブランドカラーの hue が H≈168 (green-teal) → H≈174 (neutral teal) に約 6° シフト。
  ロゴ/外部素材との並列展示が必要な場合は再確認推奨。

## 0.2.3 (2026-05-12)

### Fixes (WCAG 2.1 AA Color Contrast Compliance)

**Brand color `primary-500` (#13c3a0) と white text の組み合わせは contrast 2.24:1 で
WCAG AA (4.5:1 必須) 不適合**。Polastack のブランドカラー `#13c3a0` 自体は変えず、
**操作 UI で白文字を載せる箇所のみ `primary-700` (#137663) に揃える** ことで AA pass
(5.34:1) する設計に変更。primary-500 は Badge / Tabs indicator / Switch on state /
ProgressBar fill / accent 装飾用途で継続利用 (text を載せない場面では問題なし)。

業界の標準的アプローチ (Stripe / Linear / Atlassian 等が同様):

- brand color → accent 装飾用
- 操作 UI (Button, 選択状態の塗り) → brand color の暗いシェード (tonal palette 内)

#### 修正対象

| component                                         | 変更前                                                      | 変更後                                                      |
| ------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| Button (default variant)                          | `bg-primary-500 hover:bg-primary-600 active:bg-primary-700` | `bg-primary-700 hover:bg-primary-800 active:bg-primary-900` |
| Stepper (active / completed / loading)            | `border-primary-500 bg-primary-500 text-white`              | `border-primary-700 bg-primary-700 text-white`              |
| DatePicker (selected)                             | `bg-primary-500 hover:bg-primary-600`                       | `bg-primary-700 hover:bg-primary-800`                       |
| DateRangePicker (range endpoint / in-range start) | 同上                                                        | 同上                                                        |
| TimelineGrid (today marker)                       | `bg-primary-500`                                            | `bg-primary-700`                                            |
| CalendarView (today)                              | `bg-primary-500`                                            | `bg-primary-700`                                            |

その他の `bg-primary-500` 利用 (Tabs indicator / Switch on / Progress fill / Slider range /
Stepper line / Kanban dot / FileUpload border / TimelineGrid milestone bar 等) は
text を載せないため WCAG 非対象、変更なし。

#### Tests

- 既存の `bg-primary-500` 含有 assertion を `bg-primary-700` に更新 (button / calendar-view)

### Notes

- ブランド定義 `primary-500: #13c3a0` 自体は変更なし
- consumer 側で hardcoded `bg-primary-500 text-white` パターンを使っているコードは手動 audit 推奨

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
