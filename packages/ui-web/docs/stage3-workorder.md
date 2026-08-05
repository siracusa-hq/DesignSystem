# Stage 3 作業指示書 — ページ層（リズムエンジン + defineLandingPage）

設計の正本は [composition-redesign.md](./composition-redesign.md) §Stage 3。
本書はそれを実装スライスに落としたもの。Stage 2 と同じ運用
（縦切りスライス・PR ごとにユーザー承認でマージ・検証関門で目視）で進める。

## 1. 狙い

AI の品質事故はコンポーネント単体ではなく**構成**で起きる。Stage 3 は
「セクションの並べ方・面と余白の割り当て・CTA の規範」をシステム側が持つ層を作る。

- **`<Page brand tone>`** — コンポジション API。並べ方は自由、リズムは自動
- **`defineLandingPage()`** — データ駆動 API。AI の仕事を「デザインする」から
  「フォームを埋める」に変える。必須項目の欠落は型エラーで落とす
- ページ型5種: `lead-gen` / `product` / **`product-portfolio-top`（最重要）** /
  `case-study-list` / `corporate-top`

## 2. 決定事項（設計文書からの確定分）

| 項目 | 決定 |
| --- | --- |
| 面リズム | 交互（default ↔ muted）は**自分たちの決定**として実装（他社実態は未検証。基準は Stage 5 の VRT で作る） |
| 暗面の連続 | **禁止**（3連続で dev 警告）。これは可読性の問題で確定 |
| CTA | 「2箇所まで」は撤回済み。**プライマリ CTA のラベルは2種類まで**（3種目で dev 警告）。反復は自由 |
| 順序 | 料金 → 事例（実測 4:1）。FAQ は任意（5/12） |
| トーン | `trust` / `product` / `campaign`。**ブランド軸と直交**、組み合わせを禁止しない |
| case-study-detail | 作らない（実測データ 0 件。推測で構成を配らない） |

## 3. アーキテクチャ（Slice 0 で確定させる機構）

### 面リズムの機構

セクションは Stage 2 で面を選ぶ props を失った（内部固定）。Page は
**子を走査してラッパー要素で面を割り当てる**。

- 割り当ては CSS 変数の再定義で行う: `.slotMuted { --color-surface: var(--color-surface-sunken) }`。
  セクション側は `var(--color-surface)` を塗るだけなので、無改修で面が変わる
  （Slice 3 の暗面セマンティック反転と同じ技法）
- **自己申告の契約 `pageSurface`**: 自分で暗面を塗るセクション
  （ModuleOverview / CTASection / backdropTone=dark の HeroSection）は
  コンポーネントの静的プロパティで申告する。Page はこれを読んで
  交互割当をスキップし、暗面連続の検査に使う。props 依存の場合は関数形
- 交互カウンタは暗面でリセットする（暗面直後は必ず default から再開）
- 自己 muted だったセクション（ServicePortfolio / SecurityBadges)は default に正規化する
  （面はページが決める。単体ストーリーでは白面になるが、それが正しい既定）

### トーン軸

`data-tone` 属性 + theme.css のスコープ付き変数再定義。ブランド軸（`data-brand`）と同じ機構で直交する。

- `trust`: セクション余白を1段広く（余白広め・装飾最小）
- `product`: 基準値そのまま（規則を持たない = 基準トーン）
- `campaign`: セクション余白を1段詰める（コントラスト・CTA 強調は Slice 1 以降で追加）

## 4. スライス

| # | 内容 | 完了条件 |
| --- | --- | --- |
| **0** | `<Page brand tone>` + 面リズムエンジン + `pageSurface` 契約 + トーン軸の骨格 | CorporateTop 相当を Page で組んだストーリーが交互リズム・暗面警告込みで成立 |
| **1** | CTA 規範: プライマリ CTA ラベル2種ルール（dev 警告）+ `CTABand`（繰り返し置ける CTA 帯。「特別な部品」ではない） | ラベル3種目で警告。CTABand をセクション区切りに反復配置できる |
| **2** | `defineLandingPage()` + `<LandingPage>` + パターン4種（product-portfolio-top / product / lead-gen / corporate-top）+ 章立て余白（関連セクション間を詰める） | 各パターンが型チェックだけで正しい構成になる。product-portfolio-top が最優先 |
| **3** | `case-study-list` パターン（新規部品: 多軸フィルタ + ページネーション） | SmartHR/バクラク /case/ 型の一覧が成立 |
| **4** | ストーリー整備（パターン × ブランド × トーンの実例・日英）+ ドキュメント + README 更新 | 検証関門: Netlify プレビューでの目視 |

## 5. Stage 3 でやらないこと

- 計測フック（`data-cta` / `onCTAClick` / フォームイベント）→ Stage 4
- 追従 CTA 2部品 → Stage 4
- ページ単位 VRT・背景リズムの自基準づくり → Stage 5
- AI 規範ファイル同梱 → Stage 6
- `MarketingButton` の gradient 復活（campaign トーン限定とする案)は、
  campaign トーンの装飾設計と同時に判断する（Slice 1 以降。Stage 2 で削除済みのまま）

## 6. 進捗

- [x] Slice 0 — 2026-08-05 完了。`<Page brand tone>` + `pageSurface` 契約（lib/page-surface.ts）+
      面リズム（muted はスロットの `--color-surface` 再定義。セクション無改修）+
      トーン軸（theme.css の `[data-tone]`、trust=1段広く / campaign=1段詰める / product=基準）。
      ServicePortfolio / SecurityBadges の自己 muted を default に正規化。
      dev 警告は lib/dev.ts（`process.env.NODE_ENV` をリテラルで残し消費側バンドラの DCE に乗せる。
      tsup の dts ビルドは node types を持たないため型はローカル宣言）
- [ ] Slice 1
- [ ] Slice 2
- [ ] Slice 3
- [ ] Slice 4

## 7. 実装で判明した事項

（Stage 2 の §7 と同じく、あとから効く発見をここに記録する）
