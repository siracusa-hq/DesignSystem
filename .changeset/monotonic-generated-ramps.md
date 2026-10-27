---
"@siracusahq/tokens": minor
"@siracusahq/design-system": minor
"@siracusahq/gtm-design-system": minor
---

ブランドの段を「数字が大きいほど暗い」に統一し、全ブランドを生成＋アンカー（公開済みの決定色を固定）にした。

- Polastack・Proofline・ピアデスク・タックスピアの 600〜950 を、500 より暗い順に並べ直した（ホバー・押下が暗くなる）。ホバーはどのブランドも 600、押下は 700
- コーポレートを生成に移した。操作色 #008575・装飾色 #13c3a0 は変わらない。ほかの段（primary-50〜200・400・600〜950）がわずかに変わる
- 値を手で書く登録（explicit）・`slotOverrides`・`EXPLICIT_L_TOLERANCE` を廃止。`anchors`・`stepLightness` を追加
