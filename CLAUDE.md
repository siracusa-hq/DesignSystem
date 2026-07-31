# Polastack Design System - 開発ガイド（モノレポ）

このリポジトリは pnpm workspace のモノレポ。**トークンの正本は1箇所**、
UIパッケージは用途別に2つ、という構成になっている。

## パッケージ構成

| ディレクトリ | npm名 | 役割 |
|---|---|---|
| `packages/tokens` | `@polastack/tokens` | **ブランド共通トークンの正本**。カラー・タイポ・スペーシング・エレベーション・モーション。React非依存（CSS変数版 `brand.css` も同梱） |
| `packages/ui-app` | `@polastack/design-system` | 業務システムUI。高密度表示・キーボード操作前提 |
| `packages/ui-web` | `@polastack/gtm-design-system` | Web/LP・営業資料。マーケティング表現 |

各パッケージの中身:

- `src/tokens/` - デザイントークン（`@polastack/tokens` を再エクスポート + パッケージ固有の拡張）
- `src/styles/` - Tailwind CSS v4 `@theme` によるCSS変数定義
- `src/lib/` - ユーティリティ（`cn`, `createContext`）
- `src/hooks/` - カスタムフック
- `src/stories/` - Storybookストーリー

ドキュメント:

- `docs/` (ルート) - ブランド共通（BRAND_IDENTITY.md, DESIGN_PRINCIPLES.md）
- `packages/ui-app/docs/` - 業務システムUI固有（plan.md, z-index-system.md ほか）
- `packages/ui-web/docs/` - Web/LP固有（plan.md）

## トークンを変更するときの鉄則

**値を2箇所に書かない。** `packages/tokens/src/*.ts` が唯一の正本。

Tailwind v4 の `@theme` は CSS 変数の実体宣言を要求するため、
`packages/ui-app/src/styles/tokens.css` と `packages/ui-web/src/styles/theme.css`
にも同じ値が展開されている。**両方を必ず同時に更新すること。**

ズレは `pnpm test` が検出する（`packages/*/src/tokens/tokens.test.ts` が
TS定数とCSS変数を双方向で突き合わせる）。この仕組みは、GTM側だけ古いパレットのまま
約2ヶ月 WCAG AA 不適合が放置された事故を受けて入れたもの。**無効化しないこと。**

## カラー

ブランドカラーは**用途で2階層に分かれる**。同一色相（H≈173）の明度違いであり、
ブランドとしては一つの色として成立する。

- **`primary`（`#008575` アンカー）… 操作用**
  - ボタン背景・リンク・フォーカスリングなど、テキストや意味を担うUI
  - 500 単独で白文字 4.55:1 を満たし WCAG AA 適合
  - 業務システムUI・Web/LP の**両方**で同じ値
- **`brand`（`#13c3a0` アンカー）… 装飾用**
  - グラデーション・グロー・ダーク背景上のアクセント専用
  - 白背景での対比は 2.25:1 しかない。**明背景のテキスト・ボタン背景に使ってはならない**
  - Web/LP（`@polastack/gtm-design-system`）にのみ存在。業務システムUIには意図的に公開していない

その他:

- success: True Green系（H≈130、primaryのティールと44°の色相差で区別）
- warning: Amber、error: Red、info: Blue
- `fontSize` は**意図的に共通化していない**（業務UI base=14px / Web・LP base=16px）

## コマンド

ルートで実行するとワークスペース全体（`pnpm -r`）に対して走る。

- `pnpm build` - 全パッケージをtsupビルド（tokens が先に依存順で実行される）
- `pnpm test` - 全パッケージのVitest
- `pnpm typecheck` - 全パッケージの型チェック
- `pnpm size` - バンドルサイズ検証
- `pnpm storybook:app` - 業務システムUIのStorybook（ポート6006）
- `pnpm storybook:web` - Web/LPのStorybook（ポート6007）
- `pnpm build-storybook` - 2つのStorybookを `storybook-static/{app,web}/` に統合ビルド

単一パッケージだけ動かす場合:

```bash
pnpm --filter @polastack/design-system test
pnpm --filter @polastack/gtm-design-system build
```

## ブランチ運用

- 作業ごとにブランチを作成する（`feat/...`, `fix/...`, `docs/...`）
- mainブランチに直接コミットしない
- PRには「何を変えたか」「なぜ変えたか」「どう確認したか」を必ず書く

## リリース運用（changesets）

**手で `package.json` の version を編集したり `git tag` を打ったりしないこと。**
3パッケージが独立したバージョンを持つため、手動運用は破綻する。

1. 利用者から見える変更を入れたら、PR に changeset を添える

   ```bash
   pnpm changeset
   ```

   どのパッケージが patch / minor / major のどれで変わるかを選び、内容を1〜2行書く。
   生成された `.changeset/*.md` をコミットして PR に含める。
   `packages/` を触ったのに changeset が無い PR は CI が落とす。

2. PR を main にマージすると、Release ワークフローが
   **「chore: release packages」PR** を自動作成／更新する（version更新 + CHANGELOG生成）

3. その PR をマージすると、同じワークフローが npm publish とタグ作成まで実行する

npm への公開は Trusted Publishing（OIDC）。`NPM_TOKEN` は不要。
**`.github/workflows/release.yml` のファイル名は変更しないこと**
（npm側の信頼設定がリポジトリ+ワークフローファイル名に紐づいているため）。

### 未公開パッケージの初回公開について

`@polastack/tokens` は npm 未公開のため、Trusted Publishing の設定を
**事前に登録できない**（npm は既存パッケージにしか信頼発行元を設定できない）。
初回だけは npm トークンで手動公開し、その後 npmjs.com で
`siracusa-hq/DesignSystem` の `release.yml` を信頼発行元に登録すること。

## 品質ゲート（全コンポーネント）

- Vitest + Testing Library ユニットテスト
- axe-core a11yテスト
- キーボードナビゲーション検証
- 全バリアントのStorybookストーリー
- TypeScript Props型定義

### 色のコントラストについて

jsdom 上の axe-core は**色計算ができないためコントラスト違反を検出できない**。
`bg-*` と `text-*` の組み合わせを変えるときは、axe が通ったことを根拠にしないこと。
`packages/tokens/src/tokens.test.ts` が WCAG のコントラスト比を実際に計算しているので、
新しい色の組み合わせを導入する場合はそちらに期待値を追加する。
