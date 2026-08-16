---
'@siracusahq/gtm-design-system': minor
---

セクション余白を実測レンジまで詰めた（ビジュアル微修正 #8）。`sectionSpacing` / `--spacing-section-*` は「セクションの**片側**パディング」なので、隣り合うと `下 + 上` で2倍になる。この2倍を見落として片側の値（md = 6rem = 96px）を実測の**継ぎ目の実効余白**（国内中央値 96〜104px）と突き合わせていたため、実ページの継ぎ目は 256〜352px = 実測の 2.5〜3.4倍になっていた（Chromium 実レンダリングで計測。research-eyebrow.md §4-2 追記）。3トーンとも同率で半減し、本文セクション同士の継ぎ目は product 128px / trust 160px / campaign 96px（実測レンジ 96〜174px の内側）になる。値: product `sm 2.5 / md 3 / lg 4 / xl 5rem`、trust `3 / 4 / 5 / 6rem`、campaign `2 / 2.5 / 3 / 4rem`。LandingPage の章内従属余白（`.attached`）も同率で縮小。
