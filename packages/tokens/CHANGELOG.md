# @siracusahq/tokens

## 0.3.2

### Patch Changes

- 371c35c: CTA スロット（`--color-bg-cta` ほか）が全ブランドで既定ブランドのティールに凍結されるバグを修正。カスタムプロパティ内の var() は宣言された要素で解決されてから継承されるため、`:root` だけの宣言では `[data-brand]` の切替に追従しない。codegen のセレクタを `:root, [data-brand]` に変更し、`variant="cta"` のボタン（料金カード・CTABand・CTASection の第1アクション）がページのブランド操作色に正しく追従するようにした。

## 0.3.1

### Patch Changes

- c7a347f: 顔になるページの面をニュートラルグレーからブランドティント淡色（白 50% + ramp-50）へ変更し、`<Page>` に面の割当口を2つ追加した。

  - `surfaces`: スロットごとの明示割当。LP 系（product / product-portfolio-top / lead-gen）は機械的な交互をやめ、白の連続の中に社会的証明の塊だけがティントで浮かぶ配置になる
  - `autoSurface`: 自動割当が沈んだ面に使う色。`corporate-top` は交互リズムを保ったまま色だけティントになる（既定は従来どおり `muted`）

  事例系・記事系・獲得系のページ型は従来のニュートラルの自動ゼブラのまま。既定の見た目は変わらない。

  tokens 側はティント面のコントラスト期待値（全4ブランド × 白 / CTABand 面 / 本文）をテストに追加。

## 0.3.0

### Minor Changes

- 592ede3: Stage 1 後半: 和文タイポグラフィの修正と意匠トークンの拡張。

  **gtm-design-system**

  - 和文組版を `:lang(ja)` に一本化（`<html lang="ja">` が前提）:
    `line-break: strict` / `text-spacing-trim: space-all` / `overflow-wrap: break-word` /
    見出しの `palt` が body の `cv01/cv03/cv04/tnum` を上書きするバグを修正
    （数値訴求の等幅数字を保持）/ 見出し `text-wrap: balance`・本文 `pretty`
  - **和文ガード**（@layer 外）: 和文見出しの負の字送りを構造的に無効化し、
    行間を 1.35/1.45 に補正（国内BtoB 8社実測: 負の字送り0社・見出し行間1.3〜1.4収束）
  - デッドコード `.lang-ja` / `.lang-en` を削除
  - 2層シャドウ `raised / card / card-hover / overlay` を追加（LPカード用・neutral由来の影色）
  - 役割名ラディウス `control / media / card / panel / pill` を追加
  - 演出系モーション `--duration-reveal(640ms) / --duration-ambient(1200ms)` と
    `--ease-entrance / exit / emphasis` を追加。`prefers-reduced-motion` はトークン層で一括処理
  - `AnimateOnScroll` のハードコード（600ms / ease-out）を演出系トークンに置換

  **tokens**

  - 第3のオプション役割 `--color-cta-*` を追加（既定は操作色への var() フォールバック。
    data-brand 切替に自動追従）

- 56ac3f1: マルチブランドのテーマ契約（Stage 1・追加のみ / 非破壊）を導入した。

  **tokens**: OKLCH ベースのランプ生成器・ブランドレジストリ・抽象スロット契約を追加。
  4ブランドを初期登録した — corporate（現行ティール explicit・300段は #13c3a0）/
  polastack（H265・deep型 #3d5eaf）/ peerdesk（濃鼠 #4a464e・額縁戦略）/
  peerdesk-taxpeer（千歳緑 #2F6847 既存3色維持）。
  codegen が `css/brand.css` にランプ実体（`--ramp-*`）と抽象スロット
  （`--color-bg-brand-primary` 等14種 + `--shadow-glow-brand`）を出力し、
  `data-brand` 属性でブランドを切り替えられる。
  新エクスポート: `generateRamp` / `registry` / `resolveAllBrands` / `SLOTS` / 色計算ユーティリティ。

  **gtm-design-system**: 生成物 `src/styles/generated-brand.css` を同梱し、
  `theme.css` から読み込むようにした。業務システムUI（design-system）には
  意図的に出力しない（装飾色を業務UIに公開しない原則。ui-app は当面コーポレート固定）。
  **既存の `primary-*` / `brand-*` 変数・エクスポートは一切変更していない**（スロットは併存）。
  コンポーネントのスロット移行は次段階で行う。

### Patch Changes

- 7426843: Polastack のブランドカラーを濃紺に改定した（ブランド決定 2026-08-04）。

  - 操作色: `#3d5eaf`（C×1.35 / L 0.50）→ **`#2f4989`**（C×1.10 / L 0.42、白文字 8.62:1）
  - ネイビー地: 950 `#121c33` / 900 `#202e4e`
  - 「青っぽすぎる」という評価を受け、彩度を保ち明度を沈めた「存在感のある落ち着いた濃紺」へ
  - 生成ブランドの操作段 L 帯の下限を 0.50 → 0.42 に拡大（契約改定）

  レジストリの数値変更のみで、コンポーネント・スロット構造への変更はない。

- 635b68f: Stage 2 Slice 1: コーポレートトップ用プリミティブ8個を CSS Modules + テーマ契約スロットへ移行し、新規2個を追加した。

  - 移行: Container / Section / Heading / Text / MarketingButton / Badge / Link / Logo。
    色参照はすべて抽象スロット（data-brand に自動追従）
  - 新規: `Eyebrow`（旧 Text overline 7種の後継・pill 1形）/ `LogoMark`（ロゴ表示の正規化）
  - `MarketingButton` に `cta` バリアント追加（`--color-cta-*` 第3役割）。
    `gradient` は cta へのエイリアスとして @deprecated
  - Heading に和文 per-size 組版（:lang(ja) で行間 1.30〜1.45・字送り0）を実装
  - tokens: スロット `--color-text-brand-strong`（700段）を契約に追加

## 0.2.0

### Minor Changes

- dd97e7c: npm スコープを `@polastack/*` から `@siracusahq/*` へ変更した。

  | 旧                             | 新                              |
  | ------------------------------ | ------------------------------- |
  | `@polastack/tokens`            | `@siracusahq/tokens`            |
  | `@polastack/design-system`     | `@siracusahq/design-system`     |
  | `@polastack/gtm-design-system` | `@siracusahq/gtm-design-system` |

  このデザインシステムはコーポレート / Polastack / ピアデスクシリーズの
  3ブランドを支える会社インフラであり、単一プロダクト名のスコープは実態と
  合わなくなったため（Polastack は製品ブランドとして存続する）。

  **利用側の移行**: `package.json` の依存名と import 文の `@polastack/` を
  `@siracusahq/` に置換するだけ。エクスポート名・API・値は一切変わらない。
  旧パッケージは deprecated 化し、今後の更新は新スコープでのみ行う。
