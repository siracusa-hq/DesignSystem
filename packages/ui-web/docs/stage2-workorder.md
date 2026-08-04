# Stage 2 作業指示書 — 全コンポーネント1周

方針の正本は [composition-redesign.md](./composition-redesign.md)。本書はその Stage 2 を
**実行可能な単位**に落とした指示書であり、1コンポーネント=1回だけ触る原則のもとで
「何を消し・何をスロットに乗せ換え・どう CSS Modules 化するか」を確定させる。

**検証関門: コーポレートトップ（product-portfolio-top 型）を実際に組む。**
Slice 2 完了時点で Storybook 上に実ページを作り、設計の破綻を残り工程の前に洗い出す。

---

## 0. 全コンポーネント共通の Definition of Done

1コンポーネントの「完了」は以下すべてを満たすこと。

- [ ] `*.module.css` + 生成された `*.module.css.d.ts` がコミットされている
- [ ] コンポーネント内に Tailwind ユーティリティ文字列が残っていない
- [ ] 色は**抽象スロットのみ**参照（`--color-*-brand-*` / `--color-cta-*` / semantic）。
      `--ramp-*` 直参照と生 hex は stylelint が落とす
- [ ] 削除対象 props（§3）が消えている。`className` は**公開 props から削除**
      （案Cの核心: 迂回路を閉じる）
- [ ] 意匠は役割トークン（`--radius-control/media/card/panel/pill`、
      `--shadow-raised/card/card-hover/overlay`、演出は `--duration-reveal` + `--ease-entrance`）
- [ ] 和文タイポ: 見出しサイズは §5 の per-size 値（`:lang(ja)` 分岐）を module 側に実装
- [ ] ストーリー更新（日英・全バリアント）+ 既存テスト通過 + `pnpm size` 枠内

### 移行の書き方（規約）

```
component-name/
  component-name.tsx          … cva の第1引数等に styles.xxx を渡す（cva は継続使用）
  component-name.module.css   … 素のCSS。値は必ず var(--…) 経由
  component-name.module.css.d.ts … scripts/css-modules-dts.mjs が生成（手書き禁止）
  component-name.test.tsx / index.ts … 既存のまま
```

- クラス名は camelCase（`styles.sizeLg`）。d.ts 生成が typo を型エラーにする
- メディアクエリはコンテナ幅トークンに合わせる（`@media (min-width: 48rem)` = md）
- ダーク対応は既存どおり `.dark` 祖先（`:global(.dark)` セレクタ）

---

## 1. Slice 構成（縦切りの順序）

| Slice | 内容                                                                                                                                                                                                                                                                                                                                                                                | 完了の意味                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **0** | CSS Modules 基盤: `scripts/css-modules-dts.mjs`（d.ts 生成・codegen と同じ「生成物コミット + CI差分検査」方式）/ stylelint 導入（生hex禁止・`--ramp-*` 直参照禁止・未知の `var()` 禁止）/ tsup で `.module.css` が dist に出ることの実証（esbuild ネイティブ対応は検証済み）                                                                                                        | 移行パイプラインが1コンポーネント（Container）で end-to-end に通る              |
| **1** | コーポレートトップに必要なプリミティブ移行: Container / Section / Heading / Text / MarketingButton / Badge / Link / Logo + **新規: Eyebrow, LogoMark**                                                                                                                                                                                                                              | ページの部品が揃う                                                              |
| **2** | 同セクション移行: HeroSection / **新規: ServicePortfolio** / StatsSection / SecurityBadges / CTASection + レイアウト: MarketingHeader / MarketingFooter / PageLayout                                                                                                                                                                                                                | ページの構成要素が揃う                                                          |
| **3** | **検証関門: コーポレートトップを Storybook に実装**（`Examples/CorporateTop`）。4ブランドのサービスチップ（data-brand 切替）・数値訴求・信頼バッジ・2オファーCTA を含む実ページ                                                                                                                                                                                                     | ここで見つかった設計不備を §7 に記録し、必要なら指示書を改訂してから Slice 4 へ |
| **4** | 残りのセクション移行: FeatureGrid / FeatureShowcase / BentoGrid / ComparisonTable / TestimonialSection / LogoCloud / CaseStudySection / FAQSection / PricingTable+Card / CodeBlock / ModuleOverview / MigrationComparison / AirPocketFeature + プリミティブ残り（Grid / Divider / GradientText / AnimatedCounter / AnimateOnScroll※済 / **新規: MediaFrame, ProductShot, Avatar**） | 全コンポーネント移行完了                                                        |
| **5** | フォーム3種の移行 + `onSubmit` の口（Formspree を便利オプションに降格）。LandingPage ストーリーの更新                                                                                                                                                                                                                                                                               |                                                                                 |
| **6** | **配布切替**: コンパイル済み CSS + `@font-face` 同梱 / Tailwind クラス依存の完全除去 / `@source` 手順を README から削除 / `pnpm size` に CSS 枠 / Astro 消費側スモークを CI へ                                                                                                                                                                                                      | Stage 2 完了 = 0.x 最大の minor                                                 |

Slides（27種）は別エントリのため Stage 2 対象外（現状維持）。

---

## 2. 全コンポーネント共通の変更

| 変更                                | 内容                                                                                                                                                                 |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background` / `spacing` props 削除 | 全18セクション。面と余白はページ（Stage 3 の `<Page>`）が割り当てる。移行期間中（Stage 3 まで）はセクションの既定面 = `--color-surface`、余白 = 現行 `md` 相当で固定 |
| `eyebrow` 系                        | `eyebrowStyle` 削除。`Text` の overline 7種 → **`Eyebrow` コンポーネント**（トーン連動は Stage 3。当面 pill 形1種のみ）                                              |
| `className` 公開の廃止              | 全コンポーネント。内部用途は `cn` を維持                                                                                                                             |
| 色参照                              | `primary-*` → 操作系スロット / `brand-*` 装飾 → `--color-decor-brand` / `--shadow-glow-primary` → `--shadow-glow-brand`                                              |
| `actions[].variant`                 | 削除。1つ目 primary / 以降 secondary を自動割当                                                                                                                      |

## 3. 個別の削除・導出（確定済みリストの再掲 + スロット対応）

| コンポーネント          | 削除                                                        | 置き換え / 導出                                                                                                                       |
| ----------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| HeroSection             | `titleGradient`（実装破綻）/ `backgroundPattern` / `layout` | `image` 有無 + `imagePlacement: 'side'\|'below'`。背景パターンはトーン（Stage 3）へ                                                   |
| CTASection              | `backgroundMesh` / `logoStrip`                              | kicker スロット**追加**（LP調査: 実測7種）                                                                                            |
| FeatureGrid             | `cardStyle` / `columns`                                     | columns は件数導出（2→2, 3→3, 4→2×2, 5+→3）                                                                                           |
| CodeBlock               | `alignment` / `layout`                                      | layout は `description` 有無から導出                                                                                                  |
| StatsSection            | `animated`                                                  | 常時ON（reduced-motion はトークン層が処理済み）。**追加**: 時点注記フィールド（景表法）・4スロット指針（導入規模/No.1/継続率/削減率） |
| LogoCloud               | `scrolling`                                                 | 8件以上でスクロール。**追加**: 数値バッジ代替の案内を JSDoc に                                                                        |
| CaseStudy / Testimonial | `columns`                                                   | 件数導出                                                                                                                              |
| BentoGrid               | `BentoItem.variant`                                         | 位置で自動（1件目のみ featured）                                                                                                      |
| SecurityBadges          | —                                                           | **拡張**: 3系統（認証 / 受賞 / 法定表示）を `category` で                                                                             |
| MarketingButton         | `gradient` バリアント（トーン連動になるまで一旦削除）       | CTA用途には `--color-cta-*` を使う `cta` バリアント**追加**                                                                           |
| Text                    | overline 系 size 7種                                        | `Eyebrow` へ                                                                                                                          |

## 4. ビジュアルスロットの型付け（`ReactNode` 素通しの廃止）

| 新プリミティブ | 仕様                                                                                                                                                           |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MediaFrame`   | `src/alt` or `children`。`ratio: '16:9'\|'4:3'\|'3:2'\|'1:1'` 固定。`--radius-media`。プレースホルダ内蔵（src 未指定時にドット地+ラベル）                      |
| `ProductShot`  | MediaFrame 特化。`frame: 'browser'\|'none'`。**正対のみ・傾き/パース無し**（8社実測0件）。影 = `--shadow-card`                                                 |
| `LogoMark`     | ロゴの光学サイズ正規化（面積基準で高さ補正）。`grayscale?: boolean`                                                                                            |
| `Avatar`       | 1:1・`--radius-pill`。`src` 無しはイニシャル                                                                                                                   |
| 適用           | `HeroSection.image` / `ShowcaseItem.image` → `MediaFrame\|ProductShot` 要素のみ受理（型で制約）。`LogoItem.logo` → `LogoMark`。`Testimonial.avatar` → `Avatar` |

## 5. 和文タイポの per-size 実装（Heading module）

`:lang(ja)` 分岐で以下を実装（@layer 外の全体ガードは安全網として残す）:

| size        | 和文 line-height | 和文 letter-spacing | 欧文（現行維持） |
| ----------- | ---------------- | ------------------- | ---------------- |
| display-2xl | 1.30             | 0                   | 1.11 / -0.04em   |
| display-xl  | 1.32             | 0                   | 1.13 / -0.035em  |
| display-lg  | 1.35             | 0                   | 1.17 / -0.03em   |
| display-md  | 1.40             | 0                   | 1.22 / -0.025em  |
| heading-*   | 1.45             | 0                   | 現行             |

本文（Text）: 和文 1.75 維持。ウェイト補正字送り（Regular +0.04em / Bold +0.03em）は
**本文以外のラベル類（Eyebrow・Badge）に適用**して様子を見る。

## 6. コーポレートトップ（検証関門）の構成

LP調査の product-portfolio-top 実測（7ページ）に基づく:

```
MarketingHeader（サービスチップ = data-brand 切替の実演）
HeroSection（会社としての一枚。CTAは「会社紹介資料」+「採用情報」の2オファー）
ServicePortfolio（新規: Polastack / ピアデスクシリーズ / タックスピア のカード。
                  各カードが data-brand を持ち、チップ・リンク色が各ブランド色になる）
StatsSection（数値訴求4スロット + 時点注記）
SecurityBadges（3系統）
CTASection（kicker つき）
MarketingFooter
```

## 7. 検証関門で見つかった設計不備（Slice 3 で記入）

- [ ] （実施後に記入）

---

## 進捗

- [x] Slice 0（基盤）— 2026-08-04 完了。備考: theme.css に spacing スケールの実体宣言を追加（Tailwind v4 は --spacing-N を変数として持たないため。小数キーは変数化しない）。className はレイアウトプリミティブのみ @deprecated で暫定存置（未移行コンポーネントが利用中のため。Slice 6 で削除）
- [ ] Slice 1（プリミティブ 8 + 新規 2）
- [ ] Slice 2（セクション 5 + 新規 1 + レイアウト 3）
- [ ] Slice 3（コーポレートトップ = 検証関門）
- [ ] Slice 4（残りセクション 13 + プリミティブ残り + 新規 3）
- [ ] Slice 5（フォーム + LandingPage 更新）
- [ ] Slice 6（配布切替）
