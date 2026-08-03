# Siracusa Design System - 開発ガイド（モノレポ）

このリポジトリは pnpm workspace のモノレポ。**トークンの正本は1箇所**、
UIパッケージは用途別に2つ、という構成になっている。

## パッケージ構成

| ディレクトリ      | npm名                           | 役割                                                                                                                                  |
| ----------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/tokens` | `@siracusahq/tokens`            | **ブランド共通トークンの正本**。カラー・タイポ・スペーシング・エレベーション・モーション。React非依存（CSS変数版 `brand.css` も同梱） |
| `packages/ui-app` | `@siracusahq/design-system`     | 業務システムUI。高密度表示・キーボード操作前提                                                                                        |
| `packages/ui-web` | `@siracusahq/gtm-design-system` | Web/LP・営業資料。マーケティング表現                                                                                                  |

各パッケージの中身:

- `src/tokens/` - デザイントークン（`@siracusahq/tokens` を再エクスポート + パッケージ固有の拡張）
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

ブランドカラーは**用途で2階層に分かれる**。近接色相（OKLCH H≈173〜180）の明度違いであり、
ブランドとしては一つの色として成立する。

- **`primary`（`#008575` アンカー）… 操作用**
  - ボタン背景・リンク・フォーカスリングなど、テキストや意味を担うUI
  - 500 単独で白文字 4.55:1 を満たし WCAG AA 適合
  - 業務システムUI・Web/LP の**両方**で同じ値
- **`brand`（`#13c3a0` アンカー）… 装飾用**
  - グラデーション・グロー・ダーク背景上のアクセント専用
  - 白背景での対比は 2.25:1 しかない。**明背景のテキスト・ボタン背景に使ってはならない**
  - Web/LP（`@siracusahq/gtm-design-system`）にのみ存在。業務システムUIには意図的に公開していない

その他:

- success: True Green系（H≈130、primaryのティールと44°の色相差で区別）
- warning: Amber、error: Red、info: Blue
- `fontSize` は**意図的に共通化していない**（業務UI base=14px / Web・LP base=16px）

## コマンド

ルートで実行するとワークスペース全体（`pnpm -r`）に対して走る。

**クローン直後や `pnpm install` 直後は、まず `pnpm build` を実行すること。**
`ui-app` / `ui-web` は `@siracusahq/tokens` を `dist/index.d.ts` 経由で型解決するため、
tokens が未ビルドだと `pnpm typecheck` も `pnpm test` も TS2307 で落ちる。
CI も Build → Typecheck → Test → Size の順で回している。

- `pnpm build` - 全パッケージをtsupビルド（tokens が先に依存順で実行される）
- `pnpm test` - 全パッケージのVitest
- `pnpm typecheck` - 全パッケージの型チェック
- `pnpm size` - バンドルサイズ検証
- `pnpm storybook:app` - 業務システムUIのStorybook（ポート6006）
- `pnpm storybook:web` - Web/LPのStorybook（ポート6007）
- `pnpm build-storybook` - 2つのStorybookを `storybook-static/{app,web}/` に統合ビルド

## Storybook の配信

**Netlify に一本化している。** 1サイトで2つの Storybook をディレクトリで出し分ける。

| URL                                                | 中身                     |
| -------------------------------------------------- | ------------------------ |
| <https://polastack-design-system.netlify.app/>     | 行き先を選ぶランディング |
| <https://polastack-design-system.netlify.app/app/> | 業務システムUI           |
| <https://polastack-design-system.netlify.app/web/> | Web / LP                 |

設定は `netlify.toml`（build command / publish dir / Node バージョン）。
main への push で本番が更新され、PR にはデプロイプレビューが付く。
**色やレイアウトを変える PR は、マージ前にプレビューで見ること。**

GitHub Pages への配信は廃止した（`storybook.yml` を削除済み）。
旧 URL `https://siracusa-hq.github.io/DesignSystem/` は過去のビルドが残っているだけで
更新されないため、参照しないこと。

単一パッケージだけ動かす場合:

```bash
pnpm --filter @siracusahq/design-system test
pnpm --filter @siracusahq/gtm-design-system build
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

2. PR を main にマージすると、Release ワークフローが version 更新と CHANGELOG 生成を行い、
   その結果を **`changeset-release/main` ブランチに push する**（ここまでは自動）

3. **そのブランチから Version PR を手動で作る**（下記「Version PR を手で作る理由」参照）

   ```bash
   gh pr create --base main --head changeset-release/main \
     --title "chore: release packages" --fill
   ```

4. その PR をマージすると、同じワークフローが npm publish とタグ作成まで実行する

npm への公開は Trusted Publishing（OIDC）。`NPM_TOKEN` は不要。
**`.github/workflows/release.yml` のファイル名は変更しないこと**
（npm側の信頼設定がリポジトリ+ワークフローファイル名に紐づいているため）。

### Version PR を手で作る理由

changesets は本来この PR を自動で作るが、**org のポリシーで
GitHub Actions による PR 作成が禁止されている**ため 403 で失敗する
（`The organization does not allow GitHub Actions to create or approve pull requests`）。
リポジトリ単位では上書きできない（API が 409 を返す）。

**これは異常ではなく想定どおりの運用。** Release ワークフローのログに
「creating pull request」で失敗した記録が残るが、その手前までは成功しており、
`changeset-release/main` ブランチには正しい内容が入っている。

自動化したくなった場合の選択肢は2つ。

- org 設定 `Allow GitHub Actions to create and approve pull requests` を開放する
  （org 配下の全リポジトリに影響する）
- Fine-grained PAT を `RELEASE_TOKEN` として登録し、`changesets/action` の
  `GITHUB_TOKEN` env に渡す（このリポジトリだけに権限を限定できる）

なお、Version PR を人が開く運用には副次的な利点がある。
破壊的変更（例: Web/LP のプライマリカラー変更）を公開前に必ず一度目視する機会になる。

### 未公開パッケージの初回公開について

npm は**既存パッケージにしか信頼発行元を設定できない**ため、新規パッケージは
Trusted Publishing を事前登録できない。初回だけ手動で公開する。

```bash
pnpm build
cd packages/<new-package>
npm login
npm publish --access public --no-provenance
```

`--no-provenance` は必須。`publishConfig.provenance: true` により
npm が SLSA 由来証明を作ろうとして GitHub Actions 外では失敗する。

公開後、npmjs.com のパッケージ設定で Trusted Publisher を登録すること。

| 項目                 | 値                     |
| -------------------- | ---------------------- |
| Organization or user | `siracusa-hq`          |
| Repository           | `DesignSystem`         |
| Workflow filename    | `release.yml`          |
| Allowed actions      | Allow npm publish のみ |

## 品質ゲート（全コンポーネント）

- Vitest + Testing Library ユニットテスト
- axe-core a11yテスト
- キーボードナビゲーション検証
- 全バリアントのStorybookストーリー
- TypeScript Props型定義

### バンドルサイズについて

`pnpm size` は**回帰検知器であって目標値ではない**。上限は現在値 + 1〜2割で置く。
緩すぎると何も検知せず、厳しすぎると正当な追加でも落ちて上限を上げる作業が常態化する。

計測は**利用者の使い方ごとに複数**用意している。特に重要なのが
**「Button のみ」「MarketingButton のみ」の枠で、これは tree-shaking の番人**。

過去に tsup が全コンポーネントを1ファイルに固めており、トップレベルの
`cva()` / `forwardRef()` 呼び出しをバンドラが副作用ありと判断して落とせず、
**`Button` を1つ import しただけで 137kB 配信されていた**（現在は 8.2kB）。
バレル import の数値だけ見ていると、この事故は最後まで見えない。

そのため tsup は**コンポーネント単位のエントリ + `splitting: true`** で構成している。
`dist/index.js` は薄い再エクスポートであるべきで、ここが肥大していたら分割が壊れている。

型定義は公開エントリ（`index` / `tokens` / `slides`）のみ生成する。
全エントリ分を生成するとメモリを使い切って OOM で落ちる。

### 依存を追加するときの判断

**サブパスや一部コンポーネントでしか使わない重いライブラリは
`dependencies` に入れない。** optional な `peerDependencies` にして
README に導入方法を書く（`shiki` / `spectacle` / `recharts` がこの扱い）。

`dependencies` に入れると、その機能を使わない利用者全員が
インストールの重さを負担する（recharts 8.4MB / spectacle 5.8MB の実績あり）。

### 色のコントラストについて

jsdom 上の axe-core は**色計算ができないためコントラスト違反を検出できない**。
`bg-*` と `text-*` の組み合わせを変えるときは、axe が通ったことを根拠にしないこと。
`packages/tokens/src/tokens.test.ts` が WCAG のコントラスト比を実際に計算しているので、
新しい色の組み合わせを導入する場合はそちらに期待値を追加する。
