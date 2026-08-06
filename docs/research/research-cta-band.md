# 中間CTA帯 実態調査 — 国内BtoB / コンパウンド SaaS の「反復するコンバージョン帯」

対象: 日本のBtoB SaaS の **Web / LP 面のみ**（`@siracusahq/gtm-design-system` 側）。
母集団は [LP アナトミー調査](./research-lp-anatomy.md) と同じ。

調査日: 2026-08-06
調査手法: curl（ブラウザ UA + `--compressed`）による生 HTML / CSS の直接取得 + WebFetch（Cloudflare 403 対策）

## 0. 調査の動機

`CTABand`（ページ中間にセクション区切りごとに反復して置くコンバージョン帯）の現行実装は

```css
.band {
  background: var(--color-bg-brand-subtle);   /* corporate-50 = #e0f2f1 */
  border-block: 1px solid var(--color-border-brand); /* corporate-200 = #80cbc4 */
  padding-block: var(--spacing-10);           /* 2.5rem = 40px */
}
```

（`packages/ui-web/src/components/sections/cta-band/cta-band.module.css`）

これに対しブランドオーナーから「**セクションの上下に線があるためか、ページ全体との調和に違和感がある**」というフィードバックが出た。
本調査は「実際に国内 BtoB SaaS が中間CTAの面と境界をどう作っているか」を実測し、設計を決め直すためのもの。

---

## 1. 手法と限界（先に読むこと）

### 事実として記録したもの

- curl で取得した生 HTML の DOM 構造（セクションのクラス名、CTAアンカーの祖先パス、ページ内の出現位置）
- 配信されている CSS から抽出した**実値**: `background` / `background-color` の hex・グラデーション、`border*` の有無と値、`border-radius`、`padding` / `margin`、幅指定
- CSS カスタムプロパティは**解決した最終値まで追った**（例: バクラク `--color-bg-product-medium-light` → `--bakuraku-20` → `#cfe3ff`）
- コントラスト比は WCAG 相対輝度式で実際に計算した

### 推測・未検証として区別したもの

- **ブラウザレンダリングはしていない。スクリーンショット確認は一切行っていない。**
  したがって「実際にどう見えるか」「帯が視覚的に浮いているか」は原則として判定できない。
- ページ内の位置は **HTML ソース上のバイト位置の百分率**であり、レンダリング後のスクロール位置ではない。
  遅延読み込み画像や JS 挿入要素の影響で実際の視覚位置とはズレうる。「中間」「末尾」の分類はこの近似に基づく。
- メディアクエリの分岐は原則追ったが、CSS の**カスケード順序による最終的な勝敗までは検証していない**。
  同じセレクタに複数の値がある場合は「PC / SP」の両方を併記した。
- 「帯が存在しない」は**取得した静的 HTML/CSS に存在しない**という意味であり、
  クライアントレンダリングや後読み CSS による注入を排除できていない。

### 取得結果

| サイト                    | URL                                    | 取得方法              | 結果                                                                   |
| ------------------------- | -------------------------------------- | --------------------- | ---------------------------------------------------------------------- |
| バクラク トップ           | <https://bakuraku.jp/>                 | curl                  | **成功**（HTML + CSS 6本）                                             |
| バクラク 経費精算         | <https://bakuraku.jp/expense/>         | curl                  | **成功**（HTML + CSS 8本）                                             |
| SmartHR                   | <https://smarthr.jp/>                  | curl                  | **成功**（HTML + Astro CSS 4本）                                       |
| freee会計                 | <https://www.freee.co.jp/accounting/>  | curl                  | **成功**（HTML + CSS 2本。※ `file` は data 判定だが中身は HTML）      |
| freee人事労務             | <https://www.freee.co.jp/hr/>          | curl                  | **成功**（HTML + 外部CSS 2本 + インライン `<style>`）                  |
| Bill One                  | <https://bill-one.com/>                | curl                  | **成功**（HTML + Next.js CSS 61本、vanilla-extract のハッシュ名を解決） |
| カミナシ                  | <https://kaminashi.jp/>                | curl                  | **成功**（HTML + インライン `<style>` 482KB。STUDIO 製）               |
| ANDPAD                    | <https://andpad.jp/>                   | curl                  | **成功**（HTML + app.css 266KB）                                       |
| HRBrain                   | <https://www.hrbrain.jp/>              | curl                  | **成功**（HTML + インライン `<style>` 263KB。Astro/Vue SFC）           |
| kintone                   | <https://kintone.cybozu.co.jp/>        | curl                  | **成功**（HTML + main.css / top.css）                                  |
| Chatwork                  | <https://go.chatwork.com/ja/>          | curl                  | **成功**（HTML + base.min.css 645KB）                                  |
| マネーフォワード クラウド | <https://biz.moneyforward.com/accounting/> | curl → **403** / WebFetch | **部分成功**。Cloudflare チャレンジで生 HTML/CSS 取得不可。構造のみ WebFetch から。**CSS 実値は判定不能** |

補助（海外・結論の主根拠にしない）

| サイト    | URL                                            | 結果                                                          |
| --------- | ---------------------------------------------- | ------------------------------------------------------------- |
| HubSpot   | <https://www.hubspot.com/products/marketing>   | **成功**（HTML + モジュール CSS 4本。トークン値まで解決）     |
| Stripe    | <https://stripe.com/jp/payments>               | **成功**（構造のみ。CTA 位置の把握に留める）                  |
| Atlassian | <https://www.atlassian.com/software/jira>      | **部分**。ページが CMS の JSON ペイロード駆動で、CSS と DOM の対応が取れず。**CSS 実値は判定不能** |

**国内 11 ページの CSS 実値を取得、1 ページ（MF）は構造のみ、合計 12 ページ。**

---

## 2. サイトごとの記録

### 2-1. バクラク トップ

URL: <https://bakuraku.jp/> ｜ 中間CTA帯: **なし（面を作らない裸ボタンの反復）**

| 項目           | 実測値                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 中間CTAの形    | `div.u-w-fit.u-mx-auto > a.top-hero__button.top-button` — **コンテンツセクションの末尾に中央寄せのボタン1本を置くだけ**            |
| 反復回数       | **5回**（hero / intro / service / product-timeline / reason / information）                                                        |
| 帯の面         | **持たない**。ボタンは所属セクション自身の背景の上に載る                                                                           |
| ボタン         | `.top-button { border-radius: 9999px; background: var(--bakuraku-accent, #ddfc54); padding: 16px 40px }`（`--accent-light-leaf`）  |
| ページの面リズム | 白 `--color-bg-primary: #fff` ↔ `#f7f7f7`（`--neutral-5`, `u-bg-color-secondary`）                                              |
| 濃い面の例     | `.top-product-timeline { background: linear-gradient(122.71deg, #00193D 0%, #0053B1 100%) }` — 本文セクション自体が暗面           |
| 最終CTA面      | `section.top-support.u-bg-color-product-primary` = `#0e63c4`（`--bakuraku-70`）full-bleed、`padding-block: 80px`（`--spacing_5xl`） |
| 上下ボーダー   | **なし**                                                                                                                           |

### 2-2. バクラク 経費精算

URL: <https://bakuraku.jp/expense/> ｜ 中間CTA帯: **あり（コンテナ内の角丸カード。1回のみ）**

`section.p-product-common-cta` は **CSS 規則を1つも持たない**（`product-top.css` に該当セレクタなし）。
= セマンティックな入れ物にすぎず、見た目はすべて内側の `.c-cta.c-cta--type2` が担う。

| 項目           | 実測値                                                                                                     |
| -------------- | ------------------------------------------------------------------------------------------------------------ |
| 形             | **角丸カード**。`border-radius: var(--radius_md, 8px)`                                                     |
| 幅             | `max-width: 1030px`（`.c-cta--type2`）。`l-inner-sub` コンテナ内。**full-bleed ではない**                  |
| 背景           | `--color-bg-product-medium-light` → `--bakuraku-20` = **`#cfe3ff`**（淡いブランド青）                     |
| 重ね           | `.c-cta::before` で `--color-bg-product-primary` = **`#0e63c4`**（濃青）を `clip-path: polygon(0% 0%, 100% 0%, 166% 100%, 0% 57%)` で斜めに重ねる → **2色の斜め分割カード** |
| 高さ / padding | PC `height: 280px; padding: 0 64px` ／ SP `height: auto; padding: 40px 15px`                                |
| **border**     | **なし**。境界は角丸 + 面の色差のみ                                                                        |
| レイアウト     | `grid-template-columns: 1fr 355px` — 左にタイトル+ボタン2本、右に資料表紙画像                              |
| タイトル       | `c-title-24b`（24px bold）、`text-align: center`、白文字（`--color-text-inverse`）                          |
| ボタン         | 白背景（`u-bg-color-primary`）、幅 294px。kicker「＼5分でわかる資料をプレゼント／」を 12px で上に載せる     |
| セクション間隔 | `.c-section-spacer { margin-bottom: var(--section-spacing-pc) }` = **120px**（SP は 80px）                 |
| **反復回数**   | **カード形は1回だけ。**他の5箇所（hero / feature / function / price / reason）は**面を持たない裸のボタン対** |
| 最終CTA面      | `top-support` = `#0e63c4` full-bleed（トップと同じ部品）                                                   |

### 2-3. SmartHR

URL: <https://smarthr.jp/> ｜ 中間CTA帯: **なし**

CTA アンカーは (a) ヒーロー内 `ul.button-list`、(b) ページ末尾の `inquiry-three-piece-set` の2箇所のみ。
**ページ中間に反復されるCTAブロックは静的 HTML に存在しない。**

| 項目             | 実測値                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 最終CTA帯        | `.inquiry-three-piece-set-container { background: var(--service-background-aqua-3); padding: 3rem 2rem }`（SP `3rem 1rem`）  |
| 帯の色           | `--service-background-aqua-3` = **`#12abb1`**（ブランド `#00c4cc` を沈めた**濃いティール**）。白との対比 **2.81:1**            |
| full-bleed       | **はい**（`.inner-content` は `width: 100%`）。中身は `max-width: 70rem` に制約                                              |
| **帯の border**  | **なし**                                                                                                                     |
| 帯の角丸         | **なし**                                                                                                                     |
| 上の余白         | 直前のラッパ `.inquiry-three-piece-set-padding-top { padding-top: 7.5rem; background: var(--service-background-body) }`（`#f8f8f8`） |
| 中のカード       | 3枚横並び `grid-template-columns: 376fr 364fr 377fr`。各カードは `border: 1px solid #dadada` + `background: #fff` + 角丸 `.5rem`（両端のみ） |
| タイトル         | `font-size: 1.625rem`（26px, PC）/ `1.25rem`（SP）                                                                           |

→ **帯そのものには線を引かず、帯の中の白カードにだけ 1px の中立色ボーダーを使っている。**

### 2-4. freee会計

URL: <https://www.freee.co.jp/accounting/> ｜ 中間CTA帯: **なし**

- 本文セクションは `accounting-top__kv` → `__value` → `__simulator` → `__reason` → `__security` → `__faq` の6つ。
  **CTA を含むのは KV とモーダル（`js-modal-slider`）のみ。**
- ページ先頭に `section.ncms-mod-common-section1.lp-direct-sign-up-section`（メール1項目 + `su_floating_container`）。
- 前回調査で見つかった `.ncms-mod-sticky-bar2`（`position: fixed; bottom: 0; background: #2864f0`）は**今回の HTML に 0 回出現**。
  `position:fixed` の文字列自体が HTML 内 0 件。
- セクション余白: `.accounting-top__reason { padding: 120px 0 312px }`、`.accounting-top__security { padding-top: 120px }`

### 2-5. freee人事労務 — **本調査の最重要サンプル**

URL: <https://www.freee.co.jp/hr/> ｜ 中間CTA帯: **あり。クラス名が literally `middle-cta`**

`<section class="l-section u-ta-center middle-cta">` が **2回**出現（本文中盤と、ページ末尾）。

| 項目            | 実測値                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| full-bleed      | **はい**。`.l-container_full { margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw) }`             |
| 背景            | `.u-bgc-p1 { background: #ebf3ff }` — **淡いブランド青**。freee のプライマリは `#2864f0`                    |
| **border**      | **なし**                                                                                                   |
| 角丸            | **なし**（帯そのものには）                                                                                 |
| padding-block   | `u-pt-x7-lg` / `u-pb-x7-lg` = **56px**（PC）、`x5-md` = **40px**（SP）                                     |
| 前後の間隔      | `.l-section { margin-top: 120px }`（PC）/ `80px`（SP）                                                     |
| レイアウト      | **中央寄せ**（`u-ta-center`）。`l-grid_item-8-lg`（12分の8カラム）                                          |
| 構成            | kicker「入力内容をもとに、あなたに最適な資料が届く！」→ **巨大な角丸CTA** → テキストリンク副次CTA → マスコット画像 |
| 中のCTA         | `.hr_whitepaper_cta.large { background: #2864f0; border-radius: 40px; width: 792px; padding: 16px 16%; min-height: 128px }`、文字 **32px 白** |
| 中の副次CTA     | `button.c-link`（ボタンではなくテキストリンク）「無料で試してみる」                                        |
| 中間 vs 末尾    | **完全に同一の部品**。末尾のものは `u-mb-x10` が付くだけ                                                   |
| 他の反復        | `hr_section` 内に「料金表をダウンロード（無料）」の**面なし裸ボタン**が別途4回                             |

**面の弱さ**: `#ebf3ff` vs 白 = **1.12:1**。我々の `#e0f2f1` vs 白（**1.16:1**）と同程度に弱い。
それでも freee は border を引いていない。代わりに

1. `padding-block: 56px` と前後 `margin: 120px` で**余白を確保**し、
2. 帯の中に **`#2864f0` の巨大（min-height 128px / 文字 32px）な角丸CTA** を置いて、**中身の濃さで面の存在を保証**している。

### 2-6. Bill One（Sansan）

URL: <https://bill-one.com/> ｜ 中間CTA帯: **あり（グラデーション帯、2回）**

vanilla-extract のハッシュクラスを解決した結果:

| クラス        | 実測値                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------- |
| `_156uznn11`  | `background: var(--nofd2h)` = **`linear-gradient(270deg, #A2D4DB, #0075B5)`**（水色→濃青） |
| `_156uznn7`   | `@media (min-width:769px) { padding-top: 48px }`                                          |
| `_156uznng`   | `@media (min-width:769px) { padding-bottom: 48px }`                                       |
| `_156uznno`   | `@media (max-width:768px) { padding-top: 28px }`                                          |
| `_156uznnu`   | `@media (max-width:768px) { padding-bottom: 28px }`                                       |
| `_156uznn1m`  | 内側コンテナ `width: 1140px`（`--f3z0c80` は PC で `0.078125vw`＝1280px 幅時に 1px、SP で `1px`） |

| 項目          | 内容                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------- |
| full-bleed    | **はい**（`section` 自体に background）                                                          |
| **border**    | **なし**                                                                                         |
| 角丸          | **なし**                                                                                         |
| padding-block | **48px（PC）/ 28px（SP）** — 調査中で**最も薄い帯**                                              |
| 構成          | 吹き出し（`.bubble-accent`）「各サービスの内容や料金体系などをまとめて紹介します」→ 下にボタン2本を横並び中央 |
| ボタン        | ①「3分でわかる Bill One / 資料ダウンロード」（資料表紙サムネイル付き）②「お問い合わせ」          |
| 反復回数      | **2回**（FV下・特長セクション後）                                                                |
| 隣接面        | 同じグラデを**濃度違いで使い分けている**。`--nofd2p = linear-gradient(270deg, #a2d4db1a, #0076b519)`（不透明度 10%）が本文セクション用、`--nofd2h`（不透明度 100%）が CTA帯用 |

→ **同一のグラデーションを「10% = 本文の面」「100% = CTAの面」として階層化**しており、
面の帰属が色相で一貫しつつ、強さだけで役割を区別している。

### 2-7. カミナシ

URL: <https://kaminashi.jp/> ｜ 中間CTA帯: **あり（濃色グラデ帯、2回）**

STUDIO の「シンボル」機能で作られた再利用部品 `div.box.symbol-4` が `main` 直下に2回。

| 項目          | 実測値                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 背景          | `.symbol-4 { background: linear-gradient(var(--g-color-0) 0%, var(--g-color-1) 100%) }`、`--g-color-0: #0360e5`, `--g-color-1: #0046a9` — **ブランド青の縦グラデ** |
| full-bleed    | **はい**（`width: 100%; overflow: hidden`）                                                                                     |
| **border**    | **なし**                                                                                                                        |
| 角丸          | **なし**                                                                                                                        |
| padding       | PC `56px 40px 47px`（内側 `width: 1440px; max-width: 100%`）／ 中間BP `40px 88px` → `40px 32px` ／ SP `24px 16px`               |
| 装飾          | 左右に絶対配置の飾り要素（`z-index: -3`、幅 35〜52vw）                                                                          |
| タイトル      | `font-size: 32px; font-weight: 900; color: #FFFFFF; letter-spacing: 0.08em`（SP 24px）。中央寄せ                                |
| ボタン        | 2本横並び（各 `calc(50% - 8px)`、SP は縦積み）。`height: 72px`（SP 56px）、`border-radius: 60px`                                |
| ボタン①      | 白系 + `border: 1px solid #004fbf` かつ **下辺のみ 4px**（押し込み表現）                                                        |
| ボタン②      | `background: #ffdb22`（黄）+ 下辺 4px `#cc9330`。**ブランド色 `#0360e5` とは別のCTA専用アクセント**                             |
| 位置          | HTML ソース上 25.9% と 36.1%（サービス群の後、導入の流れの後）                                                                  |
| 末尾CTA       | **専用の最終CTA面を持たない**。中間帯と同一部品が末尾側にも置かれるだけ                                                         |

### 2-8. ANDPAD

URL: <https://andpad.jp/> ｜ 中間CTA帯: **なし**

CTA は (a) `header.l-header#js-fixed-global-header`（追従ヘッダー内の CTA パネル）、
(b) 資料DLカードグリッド `section.c-section--gray`、(c) ページ末尾の `ul.p-cta` のみ。

| 項目          | 実測値                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| 最終CTA       | `ul.p-cta { margin: -96px auto 0; width: 994px; display: flex }` — **上のセクションに 96px 食い込ませる**  |
| タイル        | `.p-cta__item { flex: 0 0 50% }` の2枚。`.p-cta__item > a { height: 180px; font-size: 24px; color: #fff }`（SP 130px / 20px） |
| 色            | 問い合わせ `#EF3340` ／ 資料DL `#C8102E` — **同系色の濃淡2枚**                                             |
| **border**    | **なし**。角丸も**なし**。右下に `::after` の三角形アクセントのみ                                          |
| コンテンツ面  | `.c-section--gray { background-color: #F9F9F9 }`、`.c-section { margin-bottom: 60px }`                     |

### 2-9. HRBrain

URL: <https://www.hrbrain.jp/> ｜ 中間CTA帯: **あり（濃色ベタ面、2回）**

| ブロック                       | 位置（HTMLソース） | 実測値                                                                        |
| ------------------------------ | ------------------ | ------------------------------------------------------------------------------- |
| `.contact-section__container`  | 46.7%              | `background-color: #00854c`（**濃いブランド緑**）                             |
| `.contact-section__inner`      |                    | `max-width: 1200px; margin-inline: auto`、写真の背景画像（`bg_button_area`）  |
| `.contact-section__mainArea`   |                    | `min-height: 492px; padding: 56px 24px`                                       |
| `.contact-section__title`      |                    | `color: #fff; font-size: 48px; font-weight: 700`                              |
| `.cta-section`                 | 52.2%              | `background-color: #00854c`（同色）                                           |
| `.cta-section-inner`           |                    | `max-width: 800px; padding: 48px 24px`                                        |
| 中のカード                     |                    | `.contact-card { background: #fff; border-radius: 12px; padding: 24px }`      |
| 中のボタン                     |                    | `linear-gradient(92.65deg,#fff3 6.64%,#0000 95.44%), #ff8c00` + `border-radius: 25px` + `border: 1px solid transparent` |
| 電話ブロック                   |                    | `background: #006a3c; border-radius: 12px`（帯より一段濃い緑）                |
| **帯の border**                |                    | **なし**（両方とも）                                                          |

→ **同じ `#00854c` の面を2回連続で置き、中身（写真つき大見出し vs 白カード3枚）で差をつけている。**

### 2-10. kintone（サイボウズ）

URL: <https://kintone.cybozu.co.jp/> ｜ 中間CTA帯: **あり（1回、70%位置）**

| 項目            | 実測値                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 中間CTA `.cv`   | `padding: 100px var(--inline-padding) calc(var(--slack) + 80px)`（SP）／ `200px ... calc(var(--slack) + 100px)`（PC）      |
| 背景            | `background: linear-gradient(to bottom, transparent 0, transparent var(--slack), var(--color-ktn-yellow) var(--slack), var(--color-ktn-yellow) 100%)` — `--color-ktn-yellow: #ffbf00` |
| **境界の作り方** | **円弧**。`.p-top_circle { border-radius: 50%; width/height: 256〜338vw; position: absolute }` を面の上端に配置して**曲線で切り替える** |
| **border**      | **なし**                                                                                                                   |
| レイアウト      | `grid-template-columns: repeat(2, 1fr)` — 左に見出し（`font-size: 3rem` PC / `2rem` SP）+ ボタン2本、右にイラスト        |
| ボタンの kicker | `.cv_btn_label { position: absolute; top: -1.5rem; background: #fff; border-radius: 8px 8px 0 0 }` = **ボタン上端に貼り付くタブ状ラベル**（「個人情報不要！」「30日間無料！」） |
| 最終CTA `.l-cta` | 同じ `#ffbf00`。`.l-cta_circle { border-radius: 50%; width: 256.4vw; background: var(--color-ktn-yellow) }` で同じ円弧処理 |
| 本文の面リズム  | `.c-section { --ordinary-color: var(--color-white); --reversal-color: var(--color-panel) /* #f3f3f3 */ }` を交互に、`margin-top: calc(var(--section-slack) * -1)` で**負マージンでオーバーラップ** |
| 面の端の処理    | `.c-section:first-of-type { border-top-left/right-radius: 60px }`、`:last-of-type { border-bottom-*-radius: 60px }`（SP 30px）— **面の端を大きな角丸で丸める** |

→ 調査中で唯一、**境界を「線」でも「直線的な色の切り替え」でもなく、曲線シェイプと角丸で作っている**。

### 2-11. Chatwork（kubell）

URL: <https://go.chatwork.com/ja/> ｜ 中間CTA帯: **あり（2回、うち1つのクラス名が `cta-middle`）**

| ブロック                 | 位置  | 実測値                                                                                       |
| ------------------------ | ----- | ------------------------------------------------------------------------------------------- |
| `.contact.bg__red`       | 28.7% | `.bg__red { background: #f03748 }` / `.contact { padding: 24px 0 }`。h2 白 24px 中央 + 画像バナー2枚（各 460px） |
| `div.cta-middle`         | 46.2% | `background-color: #13202f`（**ほぼ黒のネイビー**）、`padding: 50px 0`（SP `48px 0`）        |
| `.cta-middle .cta__button` |     | `display: flex; justify-content: center; gap: 16px`。ボタン各 **440×85px**（SP は縦積み・100%×63px） |
| `.cta-middle` の**見出し** |     | **なし**。ボタン2本だけ                                                                      |
| `.footer-global__btns`   | 末尾  | `background-color: #f03748; padding: 40px 0`（SP は `#f8f8f8`, `padding: 20px 0 30px`）。「まずは、無料でお試ししてみませんか？」17px + ボタン2本 |
| **border**               |       | **3ブロックとも なし**。角丸も なし                                                          |

→ **中間に2種類の異なる色の帯**（赤 / 暗紺）を置き、末尾はまた赤に戻す。全部 full-bleed のベタ塗り。

### 2-12. マネーフォワード クラウド会計（部分）

URL: <https://biz.moneyforward.com/accounting/> ｜ curl は Cloudflare 403（`Just a moment...` チャレンジ）

WebFetch から得られた構造のみ:

- CTAブロックは**3回**出現。①ヒーロー直後 ②サービスの特長セクション直後 ③キャンペーン詳細セクション内
- 構成は「無料で使ってみる」+「資料ダウンロード」のボタン2本
- **キャッチコピーは無く、ボタンのみ**
- **背景色・border・角丸・padding はすべて判定不能**（生 CSS を取得できていないため。WebFetch の
  「背景色: 指定なし」という出力は markdown 変換後の推測であり、事実として採用しない）

### 2-13. 海外（補助・結論の主根拠にしない）

**HubSpot** <https://www.hubspot.com/products/marketing>

`section.csol-section.csol-full-width-cta-card` が 59.5% 位置に1回、`csol-cta-content-block` が 69.8% に1回。

| 項目       | 実測値                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| 形         | **角丸カード**。`div.cl-card.-left.-container-01.-border`                                           |
| 背景       | `--cl-color-container-01` → `--light-theme-container-01` = **`#ffffff`**                           |
| **border** | **あり**。`.cl-card.-border { --cl-card-border-width: var(--cl-border-width-medium); --cl-card-border-color: var(--cl-color-border-03) }` = **`1px solid rgba(0,0,0,0.11)`** — **全周・中立色** |
| 角丸       | `--cl-border-radius-container` = **16px**                                                           |
| 置かれる面 | セクションの `data-cl-background="background-02"` = `--light-theme-background-02` = **`#f8f5ee`**（暖かいオフホワイト） |
| 見出し     | `font-size: var(--cl-font-size-h5)`（h5 相当。**大きな見出しではない**）                            |
| ボタン     | 1本のみ（`cl-button -primary -medium`）                                                             |

→ **唯一 border を使っている例。ただし (1) 全周ボーダーであって上下線ではない、(2) 色はブランド色ではなく `rgba(0,0,0,0.11)` の中立色、(3) full-bleed の帯ではなく角丸カード、(4) カードは白でページ面が `#f8f5ee` なので、線がなくても面差で成立する上に線を足している。**

**Stripe** <https://stripe.com/jp/payments>
`CtaGroup` の出現位置は 19%（ヒーロー）と 86〜88%（末尾）のみ。**中間CTA帯なし。**
`PaymentsStickyNav__item--mobileCTA` が 35% 付近に多数 = 追従ナビ内のCTA。

**Atlassian** <https://www.atlassian.com/software/jira>
`callToAction` ブロックが CMS の JSON ペイロード内に複数存在し、「Get started」が 14/21/32/39/50% に出現。
**CSS と DOM の対応が取れず、面・境界の実値は判定不能。**

---

## 3. パターン分類と出現頻度

### 3-1. 中間CTA帯の有無（国内 12 ページ）

| 判定                                       | ページ数  | 該当                                                                       |
| ------------------------------------------ | --------- | -------------------------------------------------------------------------- |
| **あり**（面を持つ CTA ブロックが中間に）  | **7**     | バクラク経費精算、freee人事労務、Bill One、カミナシ、HRBrain、kintone、Chatwork |
| **あり**（構造のみ確認、CSS 判定不能）     | 1         | マネーフォワード                                                           |
| **なし**（面を作らない裸ボタンの反復のみ） | 1         | バクラク トップ                                                            |
| **なし**（中間CTA自体が存在しない）        | **3**     | SmartHR、freee会計、ANDPAD                                                 |

→ **「中間CTA帯を置かない」も 4/12（33%）で立派な選択肢。**
SmartHR・freee会計・ANDPAD は、いずれもヒーローと末尾だけで CTA を完結させている。

### 3-2. 境界の作り方 — **本調査の核心**

| 境界の技法                                       | 件数（国内） | 該当                                                                                                     |
| ------------------------------------------------ | ------------ | -------------------------------------------------------------------------------------------------------- |
| **面の色差のみ**（full-bleed ベタ / グラデ）     | **7**        | freee人事労務、Bill One、カミナシ、HRBrain×2、Chatwork×2、SmartHR（末尾）、ANDPAD（末尾）、バクラク（top-support） |
| **角丸カード**（コンテナ内、border なし）        | **2**        | バクラク経費精算（radius 8px）、freee人事労務の**帯の中の**巨大CTA（radius 40px）                        |
| **曲線シェイプ**（円弧・面の端の大角丸）         | **1**        | kintone（円弧 + `c-section` 端の 30/60px 角丸）                                                          |
| **オーバーラップ**（負マージンで食い込ませる）   | **2**        | ANDPAD（`margin-top: -96px`）、kintone（`--section-slack` の負マージン）                                 |
| **上下 1px ボーダー（`border-block`）**          | **0**        | **該当なし**                                                                                             |
| **全周ボーダー**（中立色・角丸カード）           | 0（国内）／ 1（海外） | HubSpot のみ。`1px solid rgba(0,0,0,0.11)` + `radius 16px`                                        |

**取得できた国内 11 ページの CSS を機械的に走査し、「セクション相当のセレクタに `border-top` / `border-bottom` / `border-block` の実値を持つ規則」を探した結果:**

| CSS                     | ヒット | 内容                                                                                             |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| bakuraku（3本）         | 0      | —                                                                                                |
| SmartHR（2本）          | 0      | —                                                                                                |
| ANDPAD                  | 0      | —                                                                                                |
| HRBrain（inline）       | 0      | —                                                                                                |
| カミナシ（inline）      | 0      | —                                                                                                |
| Bill One（61本結合）    | 0      | —                                                                                                |
| freee                   | 0      | —                                                                                                |
| kintone                 | 4      | すべて `border-*-radius`（`.c-section:first/last-of-type` の 30/60px 角丸）。**線ではない**      |
| Chatwork                | 5      | `.section-case .section+.section { border-top: 1px dotted #c9c6c0 }` = **事例記事間の点線区切り**。CTA帯ではない。他4件は見出しの下線とボタンの矢印 |

→ **セクション面を上下の線で区切っている国内 BtoB SaaS は、今回の母集団に存在しない。**

### 3-3. 面の強さ（帯の背景の明暗）

| 面のタイプ                     | 件数  | 実値                                                                                                |
| ------------------------------ | ----- | ----------------------------------------------------------------------------------------------------- |
| **濃色ベタ / グラデ**          | **6** | Bill One `#A2D4DB→#0075B5`、カミナシ `#0360e5→#0046a9`、HRBrain `#00854c`×2、Chatwork `#13202f`・`#f03748`、SmartHR `#12abb1`、ANDPAD `#EF3340`/`#C8102E`、バクラク `#0e63c4`、kintone `#ffbf00` |
| **淡色ベタ**                   | **2** | freee人事労務 `#ebf3ff`（full-bleed 帯）、バクラク経費精算 `#cfe3ff`（カード。ただし濃色 `#0e63c4` を斜めに重ねる） |
| **面なし**                     | 1     | バクラク トップ（裸ボタン反復）                                                                     |

**淡色の面がどうやって「立って」いるか（border を使わずに）**

| サイト             | 面 vs 白の対比 | 立たせている手段                                                                     |
| ------------------ | -------------- | -------------------------------------------------------------------------------------- |
| freee人事労務      | `#ebf3ff` **1.12:1** | ① padding-block 56px ② 前後の section margin 120px ③ **帯の中に `#2864f0` の min-height 128px / 文字 32px の巨大CTA** |
| バクラク経費精算   | `#cfe3ff` **1.31:1** | ① 角丸 8px ② **`#0e63c4` を `clip-path` で斜めに 6〜7割重ねる**（実質は濃色カード） ③ 前後 margin 120px |
| **我々の現行 CTABand** | `#e0f2f1` **1.16:1** | ① padding-block 40px ② **上下 1px `#80cbc4` のボーダー**（面 vs 線の対比 **1.61:1**） |

→ **淡い面を採る場合、実測はいずれも「線で輪郭を描く」のではなく「余白 + 中身の濃さ」で面を成立させている。**

### 3-4. full-bleed か、コンテナ内カードか

| 形                       | 件数 | 該当                                                                                     |
| ------------------------ | ---- | ------------------------------------------------------------------------------------------ |
| **full-bleed（帯）**     | **6** | freee人事労務、Bill One、カミナシ、HRBrain、Chatwork、kintone、SmartHR（末尾）、バクラク top-support |
| **コンテナ内カード**     | **2** | バクラク経費精算（`max-width: 1030px`）、ANDPAD 末尾（`width: 994px`、負マージンで食い込み） |

full-bleed が優勢。ただし **full-bleed でも内側のコンテンツ幅は 1030〜1440px に制約**されている。

### 3-5. レイアウトとタイトルの大きさ

| サイト             | レイアウト                        | タイトル                                                    |
| ------------------ | --------------------------------- | ------------------------------------------------------------- |
| バクラク経費精算   | 左テキスト+ボタン / 右 資料画像（`1fr 355px`） | 24px bold・**中央寄せ**                          |
| freee人事労務      | **中央寄せ**（1カラム）           | 見出しなし。kicker のみ → 巨大CTAの文字 **32px** が実質の見出し |
| Bill One           | **中央寄せ**（吹き出し → ボタン2本横並び） | 吹き出しコピーのみ。見出しなし                        |
| カミナシ           | **中央寄せ**                      | **32px / weight 900**（SP 24px）                            |
| HRBrain（中間）    | 左テキスト / 右 写真（`flex-basis: 50%`） | **48px**                                            |
| HRBrain（末尾）    | 中央寄せ → 白カード3枚横並び      | 42px（PC）/ 32px（SP）                                      |
| kintone            | 左見出し+ボタン / 右 イラスト（`repeat(2, 1fr)`） | **3rem = 48px**（SP 2rem = 32px）                 |
| Chatwork（cta-middle） | **中央寄せ・ボタン2本のみ**   | **見出しなし**                                              |
| ANDPAD（末尾）     | 2分割タイル                       | タイル内の 24px 文言のみ                                    |
| **我々の現行**     | 左テキスト / 右ボタン（`space-between`） | `--text-heading-md`                                  |

→ **中央寄せが 5、左右分割が 4。中央寄せがわずかに優勢。**
そして **「見出しを置かない」パターンが 3件**（freee・Bill One・Chatwork）ある。
「左タイトル / 右2ボタン」は我々と ANDPAD 以外だと HRBrain・kintone の**大見出し型**（48px）で、
我々の `heading-md` のような中サイズの見出しを左に置く例は少ない。

### 3-6. padding-block の規模感

| サイト             | PC              | SP              |
| ------------------ | --------------- | --------------- |
| Bill One           | **48px**        | 28px            |
| Chatwork（cta-middle） | 50px        | 48px            |
| freee人事労務      | 56px            | 40px            |
| カミナシ           | 56px（上）/47px（下） | 24px        |
| HRBrain（末尾）    | 48px            | 48px            |
| HRBrain（中間）    | 56px + min-height 492px | 56px    |
| バクラク経費精算   | height 280px 固定 | 40px          |
| kintone            | 200px（上）     | 100px（上）     |
| SmartHR（末尾）    | 48px            | 48px            |
| **我々の現行**     | **40px**        | 40px            |

→ **中央値は約 50px。我々の 40px はやや薄い側**（Bill One の 48px に近い）。
kintone だけ突出しているが、これは円弧の切り替えぶんの余裕を含む値。

### 3-7. 最終CTA面との差別化（設問2）

| 型                                            | 件数 | 該当                                                                        |
| --------------------------------------------- | ---- | ----------------------------------------------------------------------------- |
| **中間と末尾で同一部品を反復**                | **3** | freee人事労務（`middle-cta` を丸ごと2回）、カミナシ（`symbol-4` を2回）、Bill One（同じグラデ帯を2回） |
| **中間と末尾で別の形**                        | **3** | Chatwork（暗紺 → 赤）、HRBrain（写真つき大見出し → 白カード3枚）、kintone（左右分割 → 末尾レイアウト） |
| **中間なし・末尾のみ**                        | **3** | SmartHR、freee会計、ANDPAD                                                  |
| **中間はカード1回 + 面なしボタン、末尾は濃色面** | 2  | バクラク トップ / 経費精算                                                  |

→ 「中間は軽く末尾は重い」という**段階的な重み付けは少数派**。
実測の主流は **①同型を反復する ②中間を置かない** のどちらか。
段階を付けているのはバクラクのみ（**面なしボタン ×5 → カード ×1 → 濃色面 ×1**）で、これは重みの階段が3段ある。

### 3-8. **反復回数と面の強さのトレードオフ（最も設計に効く発見）**

| サイト             | 面を持つCTA帯の回数 | 面を持たない裸ボタン/ボタン対の回数 |
| ------------------ | ------------------- | ----------------------------------- |
| バクラク トップ    | 1（末尾 `#0e63c4`） | **5**                               |
| バクラク経費精算   | 2（カード1 + 末尾1）| **5**                               |
| freee人事労務      | 2（同型）           | **4**                               |
| Bill One           | 2                   | 資料カード内に多数                  |
| カミナシ           | 2                   | 各セクション内に4                   |
| HRBrain            | 2                   | 0                                   |
| Chatwork           | 2 + 末尾1           | 0                                   |
| kintone            | 1 + 末尾1           | 0                                   |
| SmartHR            | 1（末尾のみ）       | 0                                   |
| ANDPAD             | 1（末尾のみ）       | 0                                   |

→ **「面を持つ CTA 帯」を 3回以上反復しているサイトは 0件。実測の上限は 2回（+末尾1回）。**
→ **5回前後の反復をしているサイト（バクラク・freee）は、反復側を「面なしのボタン（対）」にしている。**

これは前回の LP 調査の結論
> 「プライマリCTAの"種類"は2つまで。同じ2種をセクション区切りごとに反復配置してよい（目安4〜6回）」

と矛盾しない。矛盾しないが、**「反復するもの＝帯」ではない**という重要な補正が要る。
反復されているのは**ラベル**であって**面**ではない。

### 3-9. 隣接セクションとの調和（設問4、CSS から判る範囲）

| サイト             | 本文の面リズム                                              | CTA帯との関係                                             |
| ------------------ | ----------------------------------------------------------- | ----------------------------------------------------------- |
| バクラク           | 白 `#fff` ↔ `#f7f7f7`                                      | CTA面は `#0e63c4` / 暗グラデ = **リズムから明確に外れる濃さ** |
| SmartHR            | body `#f8f8f8` / セクション `#fff`                          | CTA帯 `#12abb1`（対比 2.81:1）                            |
| freee人事労務      | 白ベース、`.l-section { margin-top: 120px }`                | `#ebf3ff`（対比 1.12:1）。**余白でリズムを作る型**        |
| Bill One           | 白 / 同じグラデの 10% 版 `#a2d4db1a→#0076b519`             | CTA帯は同じグラデの 100% 版。**濃度だけで役割を分ける**   |
| kintone            | 白 ↔ `#f3f3f3` を負マージンで重ね、端を 30/60px の角丸に   | CTA面は `#ffbf00`、境界は円弧                             |
| HRBrain            | 白ベース                                                    | `#00854c` を2連続                                         |
| Chatwork           | 白ベース                                                    | `#f03748` と `#13202f` の2色を使い分け                    |
| **我々の現行**     | Page が `--color-surface`(#fff) ↔ `--color-surface-sunken`(#fafafa) を交互割当 | `#e0f2f1`（白との対比 **1.16:1**、`#fafafa` との対比 **1.11:1**） |

→ **我々の CTABand は、Page が muted 面（`#fafafa`）を割り当てたセクションに隣接すると、面の対比が 1.11:1 になりほぼ消える。**
`markPageSurface(CTABand, 'accent')` でリズムからは除外しているが、**隣が muted になることは防いでいない。**
おそらくこれが「上下に線を引かざるを得なかった」直接の原因であり、
ブランドオーナーが感じた「調和の違和感」の構造的な理由でもある。
線は面の弱さの代償であり、実測ではその代償を払っているサイトがない。

---

## 4. 設計提案

使えるスロットは `packages/ui-web/src/styles/generated-brand.css`（層3）と `theme.css` を確認済み。

- ブランド系: `--color-bg-brand-subtle` / `-muted` / `-primary` / `-hover` / `-active` / `-strong`、
  `--color-text-brand` / `-strong` / `-on-dark`、`--color-border-brand` / `-strong`、
  `--color-decor-brand` / `-soft`、`--color-on-brand`、`--shadow-glow-brand`
- CTA 第3役割: `--color-bg-cta` / `-hover` / `-active`、`--color-on-cta`
- 中立面: `--color-surface` / `-raised` / `-sunken` / `-muted`、`--color-on-surface` 系、`--color-border`
- 形状・余白: `--radius-lg`(8px) / `-xl`(12px) / `-2xl`(16px) / `-card`(20px) / `-panel`(24px) / `-3xl`(24px)、
  `--spacing-*`、`--spacing-section-sm|md|lg|xl`、`--shadow-card` / `-sm` / `-md`
- 既存の面語彙: `Section` の `bgDefault` / `bgMuted` / `bgDark` / `bgBrand`（= `--color-bg-brand-strong`）

3案とも **`border-block` を撤廃する**点は共通。実測 0/11 という根拠が明確なため、これは案の分岐点にしない。

---

### 案A: 濃色ベタ帯（full-bleed・面の色差だけで境界を作る）

**対応する実測パターン**: 3-2 の「面の色差のみ」7件 / 3-3 の「濃色ベタ・グラデ」6件 = **最頻**
（Bill One / カミナシ / HRBrain / Chatwork / SmartHR / ANDPAD / バクラク）

```css
.band {
  background: var(--color-bg-brand-strong);   /* corporate-800 #004c43。白との対比 9.93:1 */
  color: var(--color-neutral-50);
  padding-block: var(--spacing-12);           /* 3rem = 48px。実測中央値 ≒50px */
  /* border なし・角丸なし */

  /* Section.bgBrand と同じインク反転が必要 */
  --color-on-surface: var(--color-neutral-50);
  --color-on-surface-secondary: var(--color-neutral-200);
  --color-on-surface-muted: var(--color-neutral-300);
  --color-text-brand: var(--color-text-brand-on-dark);
}
```

- 上下ボーダー: **なし**
- `markPageSurface` は `'dark'` 相当に変更が必要（暗面連続の検査対象に入れる）
- ボタンは `variant="cta"`（`--color-bg-cta`）だが、`--color-bg-cta` は既定で `--color-bg-brand-primary`（#008575）に
  フォールバックするため、`brand-strong`(#004c43) の上では面同士の対比が **2.18:1** しか出ない。
  **暗面用に白ボタン or `--color-decor-brand`(#13c3a0) 系への切替が別途必要**（カミナシ・SmartHR・HRBrain はいずれも帯の上で白 or 別色のボタンを使っている）

**トレードオフ**

- ✅ 実測最頻。面が確実に立つので線が不要になり、ブランドオーナーの指摘は完全に解消する
- ✅ `Section.bgBrand` の既存語彙をそのまま使え、新しい面の概念を増やさない
- ❌ **`CTASection`（暗面 `--color-neutral-950`）との差が「黒 vs 濃ティール」だけになり、階層が読みにくくなる**
- ❌ CTABand の設計意図（「本文の流れを切らずに導線だけ差し込む」）と正面から矛盾する。濃色帯は本文を確実に切る
- ❌ 実測では濃色帯の反復は**2回まで**。3回以上置くと1ページに強い面が乱立する
- ❌ 暗面上のボタン配色・インク反転を新たに正しく実装する必要があり、変更範囲が最も大きい

---

### 案B: 淡色ベタ帯・線なし（余白と中身の濃さで面を立たせる） — **推奨**

**対応する実測パターン**: freee人事労務 `middle-cta`（3-3「淡色ベタ」/ 3-9「余白でリズムを作る型」）
**現行実装からの差分が最も小さく、指摘された線だけを外して成立させる案。**

```css
.band {
  background: var(--color-bg-brand-subtle);   /* corporate-50 #e0f2f1 のまま */
  padding-block: var(--spacing-14);           /* 3.5rem = 56px（40px → 56px。freee 実測と一致） */
  /* border-block を削除 */
}
```

加えて、freee が線なしで面を成立させている3つの条件を移植する。

1. **前後の余白を確保する** — `Page` 側で CTABand の直前・直後のセクション間隔を
   `--spacing-section-md`(6rem = 96px) 以上にする（freee 実測 120px）
2. **中身を重くする** — ボタンを `size="md"` → **`size="lg"`** に上げる。
   `variant="cta"`（`--color-bg-cta` = #008575）は `#e0f2f1` に対して面同士の対比が **3.93:1** 出るので、
   **帯の中で最も濃い塊がボタンになる**（freee の #2864f0 巨大CTA と同じ役割）
3. **隣接面を固定する** — `markPageSurface(CTABand, 'accent')` は維持しつつ、
   **CTABand の前後のセクションには `muted`(#fafafa) を割り当てない**ルールを `Page` に追加する。
   `#e0f2f1` vs `#fafafa` = **1.11:1** で、隣が muted だと面が消える

- 上下ボーダー: **なし**
- 角丸: なし（full-bleed のまま）

**トレードオフ**

- ✅ ブランドオーナーの指摘（上下の線）を直接解消し、それ以外を変えない。変更範囲が最小
- ✅ 実測に「淡色 full-bleed 帯を border なしで運用している」実例（freee人事労務）がある
- ✅ `CTASection`（暗面）との階層が「淡 → 暗」で明確に読める
- ✅ 反復回数を増やしても本文の流れを切らない（CTABand の当初の設計意図と整合）
- ❌ **面としては弱い（1.16:1）。ボタンを `lg` にしないと帯として認識されない可能性がある**
- ❌ `Page` に「CTABand の隣に muted を置かない」というリズム制約を追加する必要がある（`resolvePageSurface` の走査ロジックに1条件追加）
- ❌ ダークモードでの `--color-bg-brand-subtle`（ramp 50 = 明るい色）の扱いを別途決める必要がある

---

### 案C: コンテナ内の角丸カード（full-bleed をやめる）

**対応する実測パターン**: バクラク経費精算 `.c-cta`（radius 8px, max-width 1030px）、
HubSpot `cl-card`（radius 16px）、freee 帯の中の巨大CTA（radius 40px）、kintone の面の端の角丸（30/60px）

```css
.card {
  background: var(--color-bg-brand-subtle);
  border-radius: var(--radius-card);          /* 1.25rem = 20px */
  padding: var(--spacing-10) var(--spacing-8);
  box-shadow: var(--shadow-card);             /* 影で浮かせる。line ではなく elevation */
  /* Container の内側に置く。full-bleed をやめる */
}
```

- 上下ボーダー: **なし**（HubSpot 型を採るなら `1px solid var(--color-border)` の**中立色・全周**。
  ブランド色の `--color-border-brand` は実測に該当例がないので使わない）
- 角丸: **あり**（20px）

**トレードオフ**

- ✅ **Page の面リズムから完全に独立する**。default 面でも muted 面でも上に置ける。
  `markPageSurface` の `'accent'` 申告すら不要になり、面の設計が単純化する
- ✅ 影（`--shadow-card`）で境界を作るので、線も強い色も要らない
- ✅ 「本文の流れを切らずに導線だけ差し込む」という設計意図に最も忠実
- ✅ 実測でも反復数の多い側（バクラク）がカード形を採っている
- ❌ **「セクション区切り」としての存在感は最も弱い**。full-bleed の帯ではなくなる
- ❌ 実測で full-bleed が 6件 vs カードが 2件で、**頻度では劣勢**
- ❌ `Container` の内側に置く前提になるため、`CTABand` が自分で `Container` を持つ現行構造を
  「Container の子として置かれる部品」に変える必要があり、`Page` の子として直接置く現在の使い方が変わる

---

### 推奨: **案B（淡色ベタ帯・線なし・余白と中身で立たせる）**

#### 根拠1: 出現頻度から言えること

- **上下 1px ボーダーで帯を区切る例は国内 11 ページで 0 件。** これは案A/B/C 共通の前提であり、
  「線を外す」こと自体は頻度で完全に裏付けられる
- 面の強さでは濃色（案A）が最頻だが、**濃色帯を置いているサイトはいずれも 1〜2回しか置いていない**（3-8）。
  一方で **CTA を 4〜6回反復しているサイト（バクラク5回 / freee4回）は、反復側を「面なし」または「淡色」にしている**
- CTABand は仕様上「セクション区切りごとに繰り返し置く」部品（`cta-band.tsx` の docstring）。
  **反復する部品に濃色を割り当てるのは、実測のどのサイトの運用とも一致しない**
- 淡色 full-bleed 帯を border なしで運用している実例が現に存在する（freee人事労務 `middle-cta`、2回反復）

#### 根拠2: ブランドオーナーの違和感が解消される理由

指摘は「セクションの上下に線があるためか、ページ全体との調和に違和感がある」。
CSS 実値から見ると、違和感の構造は次の通り。

1. `--color-bg-brand-subtle`(#e0f2f1) は白との対比が **1.16:1**、`--color-surface-sunken`(#fafafa) との対比が **1.11:1**。
   **面としてはほぼ機能していない**
2. そこに `--color-border-brand`(#80cbc4) の上下線を引いた。面と線の対比は **1.61:1** で、
   **面よりも線のほうが強い**。結果、帯は「面」ではなく「2本の水平線」として読まれる
3. Page は `--color-surface` ↔ `--color-surface-sunken` の**面の交替**でリズムを作っている。
   そこに1つだけ「線で区切る」語彙が混入するため、**境界の作り方が2種類ある状態**になる。
   これが「ページ全体との調和」の破れの正体

案B は (2) の線を外し、(1) を「余白 56px + 前後 96px + `size="lg"` のボタン」で補う。
**境界の語彙が「面の交替」1種類に統一される**ので、ページ全体との不一致が構造的に消える。
freee人事労務が同程度に弱い面（1.12:1）を線なしで成立させている以上、これは実現可能である。

#### 実装時に必ず併せて行うこと

| 項目                                             | 理由                                                                 |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| `border-block` の削除                            | 指摘の直接原因                                                       |
| `padding-block: var(--spacing-10)` → `--spacing-14`（40→56px） | 実測中央値 ≒50px、freee 実測 56px                     |
| ボタン `size="md"` → `size="lg"`                 | 淡い面を「中身の濃さ」で立たせる（freee/バクラクの共通手法）         |
| `Page` に「CTABand の隣接セクションに muted を割り当てない」制約 | `#e0f2f1` vs `#fafafa` = 1.11:1 で面が消えるため        |
| **CTABand を1ページに 3回以上置いた場合の dev 警告** | 面を持つ CTA 帯の実測上限は 2回（3-8）                            |
| 「4〜6回反復」用の**面を持たない CTA**（`InlineCTA` 相当）の追加検討 | バクラク5回 / freee4回はこの形。CTABand とは別部品にすべき |

---

## 5. 判断できなかったこと・残課題

1. **実際の見え方は一切検証していない。**
   スクリーンショットもレンダリング後 DOM も取得していないため、
   「淡色帯が border なしで本当に帯として認識されるか」は**実測で答えていない**。
   案B を採る場合、Netlify のデプロイプレビューで目視確認することが必須（`CLAUDE.md`「色やレイアウトを変える PR は、マージ前にプレビューで見ること」）。

2. **マネーフォワードの CSS 実値が取れていない。**
   Cloudflare のブラウザチャレンジを curl で突破できず、`Just a moment...` が返る。
   WebFetch では「CTAブロック3回・ボタンのみ・キャッチコピーなし」という構造しか判らず、
   背景色・border・角丸・padding はすべて不明。国内で唯一「中間CTAが3回」の可能性があるサイトなので、
   3-8 の「面を持つ帯は2回まで」という結論の反証になりうる。**ヘッドレスブラウザが使えるなら再取得を推奨。**

3. **Atlassian の面・境界が判定不能。**
   ページが CMS の JSON ペイロード駆動で、`callToAction` ブロックの存在は判るが CSS との対応が取れない。

4. **メディアクエリのカスケード最終値を検証していない。**
   同一クラスに複数の値がある場合は「PC / SP」として併記したが、
   実際にどのブレークポイントでどの値が勝つかは、ソース順とセレクタ詳細度を厳密には追っていない。
   本文中の padding の数値には ±1 段階のブレがありうる。

5. **ページ内の位置（%）は HTML ソースのバイト位置であり、視覚的なスクロール位置ではない。**
   「中間」「末尾」の分類はこの近似に基づく。特に HRBrain の 46.7% / 52.2% のように
   2つのブロックが近接している場合、視覚的には連続した1つの面に見える可能性がある。

6. **反復回数のカウントは静的 HTML 上の出現数。**
   条件付きレンダリングや A/B テスト（freee会計に `ab-accounting-top__select test-a` の痕跡あり）で
   実配信が変わる可能性を排除できていない。

7. **ダークモードでの帯の扱いは調査対象外。**
   国内 BtoB LP はいずれもライトモード固定で、`prefers-color-scheme` への対応を確認できていない。
   我々の `--color-bg-brand-subtle` は ramp 50（明色）を指すため、暗面テーマでの値を別途決める必要がある。

8. **`case-detail`（個別事例記事）や `lead-gen` ページの中間CTAは未調査。**
   今回は product / product-portfolio-top のみ。ページ型ごとに中間CTAの必要性が違う可能性がある。

---

## 付録: 調査で解決した CSS カスタムプロパティ

| サイト        | プロパティ                          | 解決値                                          |
| ------------- | ----------------------------------- | ----------------------------------------------- |
| バクラク      | `--color-bg-product-primary`        | `--bakuraku-70` = `#0e63c4`                     |
| バクラク      | `--color-bg-product-medium-light`   | `--bakuraku-20` = `#cfe3ff`                     |
| バクラク      | `--bakuraku-accent`                 | `--accent-light-leaf` = `#ddfc54`               |
| バクラク      | `--color-bg-secondary`              | `--neutral-5` = `#f7f7f7`                       |
| バクラク      | `--section-spacing-pc`              | `120px`                                         |
| SmartHR       | `--service-background-aqua-3`       | `#12abb1`（ブランドは `--service-background-shr-blue: #00c4cc`） |
| SmartHR       | `--service-background-body`         | `#f8f8f8`                                       |
| SmartHR       | `--service-separate-primary`        | `#dadada`                                       |
| freee         | `.u-bgc-p1`                         | `background: #ebf3ff`                           |
| freee         | `--` (直値)                         | プライマリ `#2864f0`                            |
| Bill One      | `--nofd2h`                          | `linear-gradient(270deg, #A2D4DB, #0075B5)`     |
| Bill One      | `--nofd2p`                          | `linear-gradient(270deg, #a2d4db1a, #0076b519)`（10%） |
| Bill One      | `--f3z0c80`                         | `1px`（SP）/ `0.078125vw`（PC）/ `0.2666vw`     |
| カミナシ      | `--g-color-0` / `--g-color-1`       | `#0360e5` / `#0046a9`                           |
| kintone       | `--color-ktn-yellow`                | `#ffbf00`                                       |
| kintone       | `--color-panel` / `--color-bg`      | `#f3f3f3` / `#fff5e1`                           |
| HubSpot       | `--cl-color-border-03`              | `rgba(0, 0, 0, 0.1098039216)`                   |
| HubSpot       | `--cl-border-radius-container`      | `16px`                                          |
| HubSpot       | `--light-theme-background-02`       | `#f8f5ee`                                       |
