---
'@siracusahq/gtm-design-system': minor
---

AI エージェント向けの規範ファイルを配布物に同梱（Stage 6 Slice 0）

- `AGENTS.md` — 入口。導入1行・語彙（ブランド4 / トーン3 / ページ型5）・組み方2択・Astro の注意
- `GUIDELINES.md` — Do's & Don'ts の正本。ページ型ごとの選び方と素材チェックリスト、
  横断規則（CTA / 面と余白 / ロゴと数値 / フォーム / 色 / 和文）、選べない理由、
  型と dev 警告が守っていることの一覧。すべてのルールに実測の根拠つき

`node_modules/@siracusahq/gtm-design-system/AGENTS.md` を読ませる導線を README（日英）に追加した。
併せて、ページ型を実行時に列挙できる `LANDING_PAGE_PATTERNS` を公開する。
