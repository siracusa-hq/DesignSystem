# Polastack Design System - 実装プラン

> Polastackヘッドレスプラットフォーム上の業務アプリ開発を
> 「品質高く」「早く」「ブランド統一して」行うためのデザインシステム。

---

## 目的

| 目的 | 実現方法 | 主担当フェーズ |
|------|---------|--------------|
| **品質を高く保つ** | テスト・a11yを初日から組込み、全コンポーネントに品質ゲート適用 | Phase 0, 2, 8 |
| **早く開発する** | ドメイン別コンポーネント群で即座に画面構築可能 + 採用支援 | Phase 4, 5, 7 |
| **ブランディング** | 戦略的なデザイン原則・トークン定義 + アプリ骨格の統一 | Phase 1, 6 |
| **PWA対応** | タッチ最適化・Safe Area・オフライン対応でネイティブ品質のPWA | Phase 3 |

---

## BtoB業務システム デザインシステム事例調査

### 主要事例

| デザインシステム | 提供元 | 特徴 |
|----------------|--------|------|
| **Atlassian Design System** | Atlassian | デザイントークン中心、Atomic Design、4pxグリッド、WCAG AA |
| **Carbon Design System** | IBM | エンタープライズ向け、React/Web Components両対応 |
| **Ant Design** | Ant Group | アジア圏最普及、ProComponentsで業務向け高機能コンポーネント群 |
| **Lightning Design System** | Salesforce | CRM/業務アプリ特化、マルチテナント対応 |
| **Polaris** | Shopify | 2025年Web Components化、フレームワーク非依存 |
| **Pajamas** | GitLab | AI対応パターン拡充、ブランド個性の視覚的表現強化 |
| **shadcn/ui** | コミュニティ | Radix UI + Tailwind CSS、コード所有型、カスタマイズ性最高 |

### 2024-2025年のトレンド

1. **デザイントークンのファーストクラス化** - 全プラットフォーム一貫性の主要メカニズム
2. **ヘッドレス/コンポーザブル設計** - 未スタイルプリミティブ + Tailwind CSSが主流
3. **コード所有モデル** - shadcn/ui型のコピー＆カスタマイズ方式の台頭
4. **AI対応** - AIがデザインシステムルールを理解しコード生成に活用
5. **アクセシビリティの標準化** - WCAG 2.1 AA準拠が最低基準として定着

### 技術選定

shadcn/ui型アプローチを採用：

| レイヤー | 技術 | 理由 |
|---------|------|------|
| コンポーネント基盤 | **React 18/19** | エコシステム、RSC対応 |
| スタイリング | **Tailwind CSS v4** | ゼロランタイム、@themeでトークン統合 |
| アクセシビリティ基盤 | **Radix UI** | ARIA/キーボード/フォーカス自動管理 |
| バリアント管理 | **CVA** | 型安全なバリアント定義 |
| ビルド | **tsup** | ESMライブラリ出力、dts生成 |
| ドキュメント | **Storybook 8** | コンポーネントカタログ、a11yアドオン |
| テスト | **Vitest + Testing Library + axe-core** | Phase 0から全フェーズで使用 |
| 型システム | **TypeScript** | 型安全性 |

---

## 実装フェーズ

### ~~Phase 0: プロジェクト基盤 + 品質パイプライン~~ ✅ 完了

> **品質**(主) / 速度(副)

テストとa11yチェックをインフラとして最初に構築。以降の全フェーズの品質ゲート。

- [x] プロジェクト初期化（package.json, TypeScript, tsup）
- [x] Vitest + Testing Library セットアップ
- [x] axe-core アクセシビリティテスト統合
- [x] Storybook 8 + addon-a11y セットアップ
- [x] `cn()` ユーティリティ（clsx + tailwind-merge）
- [x] `createContext()` 型安全コンテキストファクトリ
- [x] .gitignore, .prettierrc

**成果物:** テスト・ビルド・Storybookが動作する空のデザインシステムパッケージ

### ~~Phase 1: ブランド基盤 + デザイントークン~~ ✅ 完了

> **ブランディング**(主) / 品質(副)

デザイン原則とトークンを**戦略的意思決定**として策定。全後続フェーズの判断基準。

- [x] デザイン原則ドキュメント（明快さ、一貫性、効率性、適応的密度、段階的開示）
- [x] ブランドアイデンティティ定義（カラー方針、タイポグラフィ、アイコン、ボイス&トーン）
- [x] デザイントークン実装（`globals.css` - Tailwind v4 `@theme`）
  - カラー: primary(teal #1BA491, 50-950), neutral(zinc系), semantic(success/warning/error/info)
  - タイポグラフィ: Inter + Noto Sans JP, サイズスケール(base=14px), ウェイト
  - スペーシング: 4pxグリッド
  - エレベーション: shadow-xs～xl + shadow-drawer, radius-none～full
  - アニメーション: duration, easing, keyframes
  - Z-index: dropdown(50)～tooltip(600)
- [x] TypeScriptトークン定数（プログラム的アクセス用）
- [x] レスポンシブ方針 + `useBreakpoint` フック
- [x] トークンのStorybookドキュメント（Colors, Typography, Spacing, Elevation）

**成果物:** トークンパッケージ + ブランドガイドライン

### ~~Phase 2: コアアトム~~ ✅ 完了

> **品質**(主) / 速度(副)

ドメイン横断で使われる基礎コンポーネント。全ドメインスライスの前提。

- [x] Button（variant: default/destructive/outline/ghost/link, size: sm/md/lg/icon）
- [x] Badge（variant: default/success/warning/error/info/outline）
- [x] Avatar（Avatar + AvatarImage + AvatarFallback, createContextで状態共有）
- [x] Separator（horizontal/vertical, decorative）
- [x] Skeleton（animate-pulse, aria-hidden）
- [x] Spinner（SVGベース, role="status", size: sm/md/lg）
- [x] Card（Card + CardHeader/Title/Description/Content/Footer）
- [x] Tooltip（Radix UI, タッチデバイスでは非表示）
- [x] Toast（Radix UI, variant: default/success/error, useToast + toast()）

**品質ゲート（Phase 2以降の全コンポーネントに適用）:**
- Vitest + Testing Library ユニットテスト
- axe-core a11yテスト（自動）
- キーボードナビゲーション検証
- 全バリアントのStorybookストーリー
- TypeScript Props型ドキュメント

**成果物:** 基本UIコンポーネントライブラリ（9コンポーネント, 96テスト）

### ~~Phase 3: PWA対応~~ ✅ 完了

> **品質**(主) / 速度(副)

デスクトップファーストの業務アプリをPWAとしてもネイティブ品質で動作させるための基盤。
既存コンポーネントのタッチ最適化と、PWA固有のトークン・フック・UIパターンを提供する。

#### 3-A: トークン + ユーティリティ拡張
- [x] Safe Area Insetsトークン（`env(safe-area-inset-*)` をCSS変数化）
- [x] Viewport単位トークン（`dvh`, `svh` ユーティリティ）
- [x] タッチターゲットトークン（最小44px保証の変数）
- [x] スタンドアロンモード用スタイル（`@media (display-mode: standalone)` ユーティリティ）
- [x] `touch:` カスタムバリアント（`@media (pointer: coarse)`）

#### 3-B: フック
- [x] `useDisplayMode()` — standalone / browser / minimal-ui / fullscreen 検出
- [x] `useOnlineStatus()` — オンライン/オフライン状態監視
- [x] `useViewportHeight()` — visualViewport APIでアドレスバー考慮した実高さ
- [x] `useInstallPrompt()` — PWAインストールプロンプト制御（`beforeinstallprompt` イベント）

#### 3-C: 既存コンポーネントのタッチ最適化
- [x] Button: `touch:min-h-[--touch-target-min]` で44px保証
- [x] Toast: モバイルでは下部中央full-width、デスクトップ(sm+)では右寄せ
- [x] Tooltip: `touch:hidden` でタッチデバイスでは非表示

#### 3-D: PWA固有コンポーネント
- [x] BottomNavigation（モバイルアプリ型ナビゲーション、Safe Area対応）
- [x] OfflineIndicator（オフライン状態バナー、role="alert"）
- [x] InstallPrompt（PWAインストール誘導UI、role="dialog"）
- [x] PullToRefresh（タッチイベントベース、Spinner連携）

#### 3-E: ドキュメント + ガイド
- [x] PWA対応ガイドライン（`docs/PWA_GUIDELINES.md`）
- [x] レスポンシブ + PWAのStorybookストーリー（PWA/Overview）

**成果物:** PWA対応済みコンポーネントライブラリ + PWAガイドライン（96テスト）

### ~~Phase 4: フォームドメイン~~ ✅ 完了

> **速度**(主) / 品質(副)

業務アプリ最高価値のドメイン。CRUD・設定・データ入力すべてにフォームが必要。

- [x] アトム: Label, Input (CVA size), Textarea (CVA size), Checkbox (Radix UI), RadioGroup (Radix UI), Switch (Radix UI, CVA size)
- [x] コンポジット: Select（Radix UI, 7サブコンポーネント）, Combobox（cmdk + Radix Popover）, DatePicker（native input[type=date]）, NumberInput（inputMode="numeric" + 増減ボタン）
- [x] パターン: FormField（createContextで複合コンポーネント — FormField/FormLabel/FormControl/FormDescription/FormMessage）
- [x] パターン: DynamicFormField（16データ型→コンポーネント自動マッピング + getFieldComponent()）
- [x] フォームレイアウトパターン: FormLayout (vertical/horizontal/grid), FormSection (fieldset), FormActions
- [x] バリデーション統合ガイド（`docs/form-validation-guide.md` — react-hook-form + zod連携）

**設計判断:**
- `aria-invalid`属性でエラースタイル自動適用（カスタムprop不要）
- react-hook-form非依存 — FormFieldは純粋なプレゼンテーションパターン
- native date input採用（将来カスタムカレンダーに拡張可能）
- `inputMode="numeric"`でNumberInputのブラウザ差異を回避

**成果物:** 完全なフォームツールキット（13コンポーネント, 223テスト累計）

### ~~Phase 5: データ表示ドメイン~~ ✅ 完了

> **速度**(主) / ブランディング(副)

業務アプリ中核画面「一覧→フィルタ→詳細」を実現。

- [x] Tabs（Radix UI、default/underline variant、createContext variant伝播）
- [x] EmptyState（複合コンポーネント、sm/md/lg size variant）
- [x] Table（スタイル付きHTMLプリミティブ8種、横スクロール対応）
- [x] DataTable（@tanstack/react-table、ソート/ページネーション/行選択/カラム表示切替）
- [x] FilterBar（FilterChip/ActiveFilters/FilterBarActions、コンポーザブルUI部品）

**設計判断:**
- Table = スタイルプリミティブ（Cardと同パターン）、DataTable = @tanstack/react-table構成
- FilterBarはAND/OR条件ビルダーではなくコンポーザブルUI部品（ビジネスロジック非依存）
- @tanstack/react-table採用（ヘッドレス、tree-shakeable、ソート/ページネーション/選択を再発明しない）

**成果物:** データ一覧画面の完全なツールキット（5コンポーネント群, 278テスト累計）

### ~~Phase 6: ナビゲーション + レイアウトドメイン~~ ✅ 完了

> **ブランディング**(主) / 速度(副)

アプリの「骨格」を定義。Polastackアプリの外観と操作感を統一。

- [x] Popover（Radix UI、Tooltipと同パターン簡易ラッパー）
- [x] DropdownMenu（Radix UI、14サブコンポーネント、destructive/inset variant）
- [x] Dialog / Modal（Radix UI、レスポンシブ対応 — モバイル:フルスクリーン、デスクトップ:中央モーダル）
- [x] CommandPalette（Dialog + cmdk構成、グループ/ショートカット/アイコン対応）
- [x] Drawer（Radix Dialog primitives、left/right side、sm/md/lg/xl size、ピン/アンピン、DrawerProviderスタッキング）
- [x] AppShell（createContextベース複合コンポーネント、レスポンシブサイドバー、モバイルDrawer連携、PWA BottomNav padding）

**設計判断:**
- Dialog モバイル → フルスクリーン（業務アプリのフォーム入力領域最大化）
- Drawer → Radix Dialog primitives基盤（フォーカストラップ、Escape、aria-modal無料）
- モバイルサイドバー → Drawer(side='left')再利用（DRY）
- CommandPalette Cmd+K → 消費者側制御（Radix controlled component哲学）

**成果物:** Phase 4-5と組み合わせて完全な業務アプリケーション構築可能（6コンポーネント群, 337テスト累計）

### Phase 7: 統合 + 採用支援

> **速度**(主) / 品質(副) / ブランディング(副)

デザインシステムを「作った」から「使われている」にする。

- [ ] Ant Design → Polastack DS 移行ガイド（コンポーネント対応表、共存戦略）
- [ ] project-renacer パイロット移行（1-2画面を実際に置換し検証）
- [ ] アプリスターターテンプレート（AppShell + 共通パターン、PWA対応テンプレート含む）
- [ ] ユースケースドキュメント（「CRUD画面の作り方」「設定画面の作り方」）
- [ ] パフォーマンス監査（バンドルサイズ、tree-shaking検証）
- [ ] 開発者オンボーディングガイド

**成果物:** 実証済みの移行パス + テンプレート

### Phase 8: ガバナンス + 進化

> **品質**(主) / ブランディング(副) / 速度(副)

実利用フィードバックに基づく持続的改善プロセス。

- [ ] コンポーネントライフサイクル定義（提案→レビュー→実装→ドキュメント→リリース）
- [ ] セマンティックバージョニング方針
- [ ] コントリビューションガイドライン
- [ ] CHANGELOG運用
- [ ] ヘルスメトリクス（採用率、コンポーネントカバレッジ、a11yスコア）
- [ ] アプリチームとの定期フィードバックループ

---

## 進め方の原則

1. **品質はインフラ** - テスト・a11yは別フェーズでなく、Phase 0で構築し全フェーズのゲートとする
2. **ドメイン価値順** - 技術的複雑さでなく、業務アプリへの価値でコンポーネントを優先順位付け
3. **各フェーズが独立価値** - どのフェーズ完了時点でも、利用可能な成果物がある
4. **採用なくして速度なし** - 統合・採用支援なしに「早く開発する」目的は達成されない
5. **ブランドは戦略** - デザイン原則・トークンはサブタスクでなく、独立した意思決定フェーズ
6. **PWAは後付けでなく基盤** - タッチ最適化とレスポンシブ対応をコアアトム完成直後に組み込み、後続フェーズの全コンポーネントがPWA対応前提で設計される

---

## 現在のステータス

| Phase | 内容 | 状態 | コンポーネント数 | テスト数 |
|-------|------|------|----------------|---------|
| Phase 0-1 | プロジェクト基盤 + デザイントークン | ✅ 完了 | — | — |
| Phase 2 | コアアトム | ✅ 完了 | 9 | 96 |
| Phase 3 | PWA対応 | ✅ 完了 | +4（フック4種 + タッチ最適化） | 96 |
| Phase 4 | フォームドメイン | ✅ 完了 | +13 | 223 |
| Phase 5 | データ表示ドメイン | ✅ 完了 | +5 | 278 |
| Phase 6 | ナビゲーション + レイアウト | ✅ 完了 | +6 | 337 |
| ダークモード | セマンティックトークン + ThemeProvider | ✅ 完了 | +2 | 350 |
| Phase 7 | 統合 + 採用支援 | 未着手 | — | — |
| Phase 8 | ガバナンス + 進化 | 未着手 | — | — |
