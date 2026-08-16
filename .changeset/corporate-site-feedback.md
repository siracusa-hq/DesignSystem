---
'@siracusahq/gtm-design-system': minor
---

コーポレートサイト申し送り（2026-08-16、実装 0.14.0 / 確認 0.15.0 時点）の P1〜P4 に対応

- **BusinessShowcase を新設（P1）**: 「事業内容」ひとまとまりの中に事業の小見出し（h3）がぶら下がり、その下にプロダクト（h4）が FeatureShowcase と同じ「文 + ビジュアル」の交互配置で並ぶ2階層セクション。プロダクトごとに CTA ボタン（必須）・対象1行・data-brand のブランドアクセントを持つ。ビジュアルは MediaFrame / ProductShot を型で限定し、未指定なら MediaFrame のプレースホルダで枠を保つ（素材が揃う前に構成を組める）。推奨素材は 16:9・1600×900px 以上
- **LeadershipSection に担当と略歴の箇条書きを追加（P2）**: `focus`（担当1行、ラベルは `focusLabel` で差し替え・既定「担当」）と `bio: string | string[]`（配列で箇条書き）。従来の文字列 bio はそのまま動く
- **CompanyProfileSection の値にリンクを追加（P3）**: 値1件を `{ text, href }` で渡すとリンクで組む（窓口一覧の mailto・公式サイト行）。配列の中で文字列と混在可
- **箇条書きマーカーの復元と統一（レビュー指摘）**: CompanyProfileSection の配列値は「ブランド操作色のマーカー付き箇条書き」の設計だったが、preflight の `list-style: none` でマーカーが消え、字下げ 20px だけが残っていた（単一値の行と左端が揃わない「ズレ」に見える）。`list-style: disc` を明示して復元。LeadershipSection の略歴の箇条書きも同じ意匠（`--color-text-brand` = `#008575` のマーカー）に統一し、装飾色 `--color-decor-brand` は使わない
- **ContactForm に `company` prop を追加（P4）**: 会社名欄を off / optional / required で切替（既定 required = 従来互換）。`company="off"` と `ichisanEnabled` の併用は dev 警告（14種目）。資料請求・デモ予約は BtoB リード獲得の器なので必須のまま

P5（CTASection への窓口一覧表）は申し送りどおり記録のみで対応せず。フッターに同じ3窓口が常設されており、窓口の対応表は CompanyProfileSection + P3 のリンク値でも組める。
