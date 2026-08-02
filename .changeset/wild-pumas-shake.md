---
'@polastack/design-system': minor
'@polastack/gtm-design-system': minor
---

tree-shaking を修正し、使わない依存を配布物から外した。

## 効果（利用者が実際に配信するサイズ）

| import | 変更前 | 変更後 |
|---|---:|---:|
| `Button` のみ | 137.0 kB | **8.2 kB** |
| `Button/Input/Card/Dialog/Select/Toast/Tabs` | 137.0 kB | **40.2 kB** |
| `DataTable` のみ | 137.0 kB | **48.6 kB** |
| `MarketingButton` のみ（Web/LP） | 20.8 kB | **8.2 kB** |

## 何が起きていたか

tsup が全コンポーネントを1つの `dist/index.js` に固めていたため、
トップレベルの `cva()` / `forwardRef()` 呼び出しをバンドラが副作用ありと判断し、
未使用コードを落とせなかった。結果として **`Button` を1つ使うだけで
全70コンポーネント分（137kB）が配信されていた。**

コンポーネント単位のエントリ + `splitting: true` に変更し、
`dist/index.js` を薄い再エクスポート（298kB → 7.6kB）にした。
公開 API・エクスポート名・型定義は一切変えていない。

## 依存関係の整理（破壊的変更を含む）

ライブラリのコードから一度も import されていない依存が
`dependencies` に入っており、利用者全員がインストールしていた。

- `@polastack/design-system`: **`recharts` を削除**（8.4MB）。
  `ChartContainer` は枠を描くだけ、`chartColors` は CSS 変数名を返すだけで、
  どちらも recharts に依存していない。チャート本体は利用者が自分で組む設計のため、
  optional な `peerDependencies` に移した
- `@polastack/gtm-design-system`: **`spectacle` を optional peerDependency に変更**（5.8MB）。
  `/slides` サブパスでしか使わない。README は以前から
  「スライドコンポーネントを使用する場合 `pnpm add spectacle`」と案内しており、
  package.json の分類だけが設計意図とズレていた

**`@polastack/gtm-design-system/slides` を使っている場合は、
`pnpm add spectacle` を明示的に実行する必要がある。**

## サイズ計測の改善

`pnpm size` が「全エクスポートを一度に import した場合」しか測っておらず、
上記の tree-shaking 破綻を検知できていなかった。
利用者の使い方ごとの計測枠を追加し、特に「単一コンポーネントのみ」の枠を
tree-shaking の番人として置いた。
