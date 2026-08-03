---
'@siracusahq/tokens': minor
'@siracusahq/design-system': minor
'@siracusahq/gtm-design-system': minor
---

マルチブランドのテーマ契約（Stage 1・追加のみ / 非破壊）を導入した。

**tokens**: OKLCH ベースのランプ生成器・ブランドレジストリ・抽象スロット契約を追加。
4ブランドを初期登録した — corporate（現行ティール explicit・300段は #13c3a0）/
polastack（H265・deep型 #3d5eaf）/ peerdesk（濃鼠 #4a464e・額縁戦略）/
peerdesk-taxpeer（千歳緑 #2F6847 既存3色維持）。
codegen が `css/brand.css` にランプ実体（`--ramp-*`）と抽象スロット
（`--color-bg-brand-primary` 等14種 + `--shadow-glow-brand`）を出力し、
`data-brand` 属性でブランドを切り替えられる。
新エクスポート: `generateRamp` / `registry` / `resolveAllBrands` / `SLOTS` / 色計算ユーティリティ。

**design-system / gtm-design-system**: 生成物 `src/styles/generated-brand.css` を
同梱し、`tokens.css` / `theme.css` から読み込むようにした。
**既存の `primary-*` / `brand-*` 変数・エクスポートは一切変更していない**（スロットは併存）。
コンポーネントのスロット移行は次段階で行う。
