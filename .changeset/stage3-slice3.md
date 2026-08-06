---
'@siracusahq/gtm-design-system': minor
---

`CaseStudyListSection` と `case-study-list` パターンを追加（Stage 3 Slice 3）。事例一覧ページの実測形（SmartHR `/case/`・バクラク `/case/` の 2/2）をそのまま部品にした: 短いページタイトル + ピックアップ + 多軸フィルタ（サービス / 業種 / 従業員規模 / 課題。軸間 AND、選択肢はデータから自動生成）+ カードグリッド + ページネーション。UI 語彙は `labels` で差し替えできる。状態は内部 useState のみで URL とは同期しないため、静的サイトに置く場合はクライアントでの hydration が必要。
