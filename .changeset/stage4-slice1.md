---
'@siracusahq/gtm-design-system': minor
---

追従 CTA 2部品を追加（Stage 4 Slice 1）

実測（国内 BtoB SaaS 19ページ）で確認できた2形態だけを部品化した。
全幅の下部固定バーは実測 0 件のため作っていない。

- `StickyHeaderCTA` — 固定ヘッダーに CTA を2本内包する追従形態。
  モバイルは CTA 2本が各 `45vw` / 高さ `40px` で横並び、行高 60px。
  高さぶんのスペーサーを部品が内蔵するので、呼び出し側で上余白を作る必要はない。
  グローバルナビは持たない（獲得 LP 用の簡易ヘッダー。
  ナビ・ドロップダウンが要る通常のページは `MarketingHeader` の領分）
- `FloatingCornerCTA` — 右下フローティングカード。
  閉じるボタンは常に描画され、消すための props を持たない
  （閉じられない追従要素はモバイルで本文を覆うため）。
  閉じた状態は永続化しない。覚えさせたい場合は `onDismiss` で受ける

どちらも CTA に `data-cta`（`sticky-header-${i}` / `floating-${i}`）を自動割当する。
両部品は `Page` の外に置かれるため `Page.onCTAClick` では拾えない。
両方を含む祖先の `onClickCapture` に張るための
`createCTAClickCapture` を公開エクスポートに追加した。

`--z-floating: 50`（固定ヘッダーより下・本文より上）をトークンに追加。
