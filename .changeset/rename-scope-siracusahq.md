---
'@siracusahq/tokens': minor
'@siracusahq/design-system': minor
'@siracusahq/gtm-design-system': minor
---

npm スコープを `@polastack/*` から `@siracusahq/*` へ変更した。

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
