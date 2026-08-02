---
'@polastack/gtm-design-system': patch
---

README にセットアップ手順を追記した。

Tailwind CSS v4 は既定で `node_modules` を走査しないため、利用側の CSS に
`@source '../node_modules/@polastack/gtm-design-system/dist'` の指定が必要である。
指定が無い場合、コンポーネントはエラーを出さずに**無スタイルでレンダリングされる**
（実測: `@source` なしで出力CSS 9.15 kB / 生成ユーティリティ0件、ありで 67.8 kB / 全件）。

あわせて、Web フォント（Inter / Noto Sans JP / JetBrains Mono）が配布物に含まれておらず、
利用側での読み込みが必要である点を明記した。
