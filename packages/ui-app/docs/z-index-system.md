# Z-Index System

Polastack Design System の z-index 階層と利用規約。

## 目的と背景

レイヤー崩れが 2 種発覚:

- **Home でタイムアウト Dialog 表示時、API トラフィック chart の Tabs が Dialog 上に表示される**
- **モバイル sidebar Drawer から開いた Dialog の重なりが不安定**

原因は以下:

1. `tabs.tsx` の TabsTrigger が任意値 `z-[1]` を持ち、親 TabsList が `isolate` を持たないため stacking context が root に漏れ出す
2. `drawer.tsx` が inline 数値 hardcoded で `z-index: 200 + stackOffset`、token (`--z-drawer=200`) と二重管理
3. `--z-dropdown: 50` だと Dialog (300) 内で DropdownMenu/ContextMenu が下に潜る
4. flow 内深層階層 (timeline-grid / timeline / resizable) が `isolate` を持たない

0.2.0 でこれらを **3 層階層 + isolate 原則** に再設計し、機械的防御 test を導入する。

## 3 層階層

```
┌─────────────────────────────────────────────────────────────┐
│ Floating overlays (Modal の上に積む portal)                  │
│   z-toast    = 1500   Toast, OfflineIndicator                │
│   z-tooltip  = 1400   Tooltip                                │
│   z-popover  = 1300   Popover, Select, Combobox, FilterBar   │
│   z-dropdown = 1300   DropdownMenu, ContextMenu (popover alias)│
├─────────────────────────────────────────────────────────────┤
│ Backdrop floating (背景遮断系)                                │
│   z-modal    = 1200   Dialog, AlertDialog, CommandPalette    │
│   z-drawer   = 1100   Drawer (mobile sidebar, side panel)    │
├─────────────────────────────────────────────────────────────┤
│ In-flow layers (page content)                                │
│   z-overlay-inline = 30   InstallPrompt 等 fixed bottom banner│
│   z-header         = 20   AppShellHeader 等 sticky page header│
│   z-sticky         = 10   sticky row/column (DataTable 等)   │
│   z-content        = 1    Tabs trigger 等 flow 内インライン要素 │
│   z-base           = 0    default                            │
└─────────────────────────────────────────────────────────────┘
```

数値は 100 単位で離している → 中間値を future reserve として確保。

## token と利用 component の対応表

| Token                      | 値   | Tier     | 利用箇所                                                                                                                                  |
| -------------------------- | ---- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `--z-index-base`           | 0    | flow     | default、汎用                                                                                                                             |
| `--z-index-content`        | 1    | flow     | `tabs` (TabsTrigger)                                                                                                                      |
| `--z-index-sticky`         | 10   | flow     | `bottom-navigation`、DataTable/TimelineGrid 内部 sticky cell                                                                              |
| `--z-index-header`         | 20   | flow     | `app-shell` (AppShellHeader)                                                                                                              |
| `--z-index-overlay-inline` | 30   | flow     | `install-prompt` (fixed bottom banner)                                                                                                    |
| `--z-index-drawer`         | 1100 | backdrop | `drawer` (Overlay + Content、stackOffset 加算)                                                                                            |
| `--z-index-modal`          | 1200 | backdrop | `dialog`, `alert-dialog`, `command-palette`                                                                                               |
| `--z-index-popover`        | 1300 | floating | `popover`, `select`, `combobox`, `notification-center`, `filter-bar`, `tag-input`, `data-table-toolbar`, `data-table-column-pin-selector` |
| `--z-index-dropdown`       | 1300 | floating | `dropdown-menu`, `context-menu` (popover と同値 alias)                                                                                    |
| `--z-index-tooltip`        | 1400 | floating | `tooltip`                                                                                                                                 |
| `--z-index-toast`          | 1500 | floating | `toast`, `offline-indicator`                                                                                                              |

## 利用規約

### 1. 任意値 `z-[N]` 禁止

```tsx
// ❌ NG
<div className="z-[1]" />
<div style={{ zIndex: 100 }} />

// ✅ OK
<div className="z-content" />
<div style={{ zIndex: `calc(var(--z-index-drawer) + ${offset})` }} /> {/* allowlist 内 */}
```

機械的防御: `src/test/z-index-guard.test.ts` が repo 全体を grep して任意値を検出 → CI で fail。

### 2. flow 内で z-index を使う component の root は `isolate` 必須

flow 内 token (`z-content` / `z-sticky` / `z-header` / `z-overlay-inline`) を内部で使う component は、root element に `isolate` を付けて stacking context を component 内に閉じる。

```tsx
// ✅ TabsList の例
const tabsListVariants = cva(
  'inline-flex ... relative isolate',  // ← isolate 必須
  { ... }
);
```

これがないと、内部の `z-content` (= 1) が ancestor (例: Dialog の z-modal=1200) より上に積まれてしまう。

### 3. Portal で float する component は backdrop / floating 層を使う

Dialog / Drawer / Popover / Select / DropdownMenu / Tooltip / Toast 等は Radix Portal で document.body 直下に mount される。これらは backdrop floating または floating overlays の token を使う。

## UX 設計ルール

z-index 階層上は技術的に成立しても、UX として推奨しない / 設計判断として固定するパターンを記録する。

### Drawer は閉じてから Dialog を開く

Drawer 表示中に Dialog を重ねて開くことは技術上可能 (`z-modal=1200 > z-drawer=1100`) だが、視覚的なコンテキストの積層が深くなりユーザーが現在位置を見失いやすい。Drawer 内のアクションから Dialog を開く場合は、Drawer を閉じてから Dialog を表示する。

### Toast は Modal 表示中も最前面で表示する

Dialog / AlertDialog 表示中であっても Toast (`z-toast=1500`) は最前面で表示する。背景の重要操作 (保存完了、エラー通知等) はモーダル状態にかかわらずユーザーに届ける必要があるため、Modal の裏に隠さない。

## 組合せ別期待挙動

| シナリオ                                   | 期待                                                          |
| ------------------------------------------ | ------------------------------------------------------------- |
| Dialog 内 Select / DropdownMenu / Combobox | popover (1300) > modal (1200)、候補が Dialog の上に表示される |
| Dialog 内 Tooltip                          | tooltip (1400) > modal (1200)、tooltip が最前面               |
| Drawer から Dialog を開く                  | modal (1200) > drawer (1100)、Dialog が Drawer の上           |
| Drawer 内 Drawer (nested、stackOffset)     | 後から開いた Drawer が上 (drawer + offset で順序保証)         |
| Dialog 表示中の Toast                      | toast (1500) > modal (1200)、Toast が最前面                   |
| AppShell の header と Dialog               | header (20) < modal (1200)、Dialog が header を覆う           |
| InstallPrompt と Drawer                    | drawer (1100) > overlay-inline (30)、Drawer が banner を覆う  |

## 新 component 追加時の decision tree

```
1. その element は portal で document.body 直下に mount される?
   ├─ Yes (Radix Portal 等)
   │    └─ 背景を遮断 (overlay で覆う) する?
   │         ├─ Yes
   │         │    └─ Modal レベル → `z-modal` (= 1200)
   │         │         または Drawer (側面 slide) → `z-drawer` (= 1100)
   │         └─ No (Modal の上に積む浮遊系)
   │              ├─ 候補リスト (Select, Combobox 等) → `z-popover` (= 1300)
   │              ├─ メニュー (DropdownMenu, ContextMenu) → `z-dropdown` (= 1300)
   │              ├─ Tooltip → `z-tooltip` (= 1400)
   │              └─ Toast / Notification → `z-toast` (= 1500)
   └─ No (flow 内 element)
        ├─ sticky で配置? (固定スクロール追従)
        │    ├─ row/column 単位 (DataTable 内) → `z-sticky` (= 10)
        │    ├─ page header → `z-header` (= 20)
        │    └─ fixed bottom banner → `z-overlay-inline` (= 30)
        ├─ インラインの装飾 (Tabs trigger 等) → `z-content` (= 1)
        └─ default → `z-base` (= 0) または z-index 指定なし

2. その component が内部で flow 内 z-index utility を使う場合
   → root element に必ず `isolate` を付ける
   → src/test/z-index-guard.test.ts で自動 assertion
```

## アンチパターン集

| ❌ アンチパターン                                        | ✅ 推奨                                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `className="z-[1]"`                                      | `className="z-content"`                                                         |
| `className="z-[1000]"`                                   | `className="z-modal"` または用途に応じた token                                  |
| `style={{ zIndex: 50 }}`                                 | token utility 経由 (例: `className="z-dropdown"`)、allowlist 例外は test に登録 |
| 内部で `z-10` を使う component の root に `isolate` 無し | root を `relative isolate` にして閉じ込める                                     |
| `--z-index-modal` の値だけ別 utility で上書き            | tokens.css で値を変える (全体に伝播)                                            |

## 後方互換性メモ (0.2.0 リリース)

| token                | 旧値 (0.1.x) | 新値 (0.2.0)                        |
| -------------------- | ------------ | ----------------------------------- |
| `--z-index-dropdown` | 50           | **1300** (Modal 内で使う前提に変更) |
| `--z-index-sticky`   | 100          | **10** (in-flow 階層に再分類)       |
| `--z-index-drawer`   | 200          | **1100**                            |
| `--z-index-modal`    | 300          | **1200**                            |
| `--z-index-popover`  | 400          | **1300**                            |
| `--z-index-toast`    | 500          | **1500**                            |
| `--z-index-tooltip`  | 600          | **1400**                            |

- 既存 utility 名 (`z-modal` 等) は不変、token 名利用なら自動追従
- hardcoded 数値 (例: polastack 側で `style={{zIndex: 250}}`) は手動 audit が必要

## 関連ファイル

- `src/styles/tokens.css` — token 定義
- `src/test/z-index-guard.test.ts` — 機械的防御 test
- `src/stories/dialog.stories.tsx` — `WithSelect` / `WithDropdownMenu` で Dialog 内 floating の UX を確認
- `src/stories/drawer.stories.tsx` — `Stacked` で nested Drawer の stackOffset 挙動を確認
- 各 overlay component の実装
