# 国内BtoBコンパウンド企業のマルチブランドWeb設計 調査記録

調査日: 2026-08-02
調査対象スコープ: **公開Webサイト（コーポレートサイト / プロダクト紹介サイト / LP）のみ**。
ログイン後のプロダクトUI、および業務システム向けデザインシステム（freee vibes、SmartHR Design System、Money Forward MFUI 等）は**本調査の結論に使用しない**。
ブランドレベルの情報（ブランドカラー体系・ロゴ体系）に限り参照し、その場合は必ず「プロダクトUI由来」と明記する。

---

## 0. 調査方法と証拠の強度

### 方法

各サイトを `curl`（ブラウザUA + `--compressed`）で取得し、HTML内インラインCSSおよびリンクされた実CSSファイルから
以下を機械的に抽出した。したがって**色・書体・トークン名はレンダリング結果の目視推定ではなく、配信されているCSSの実値**である。

- `--*` CSSカスタムプロパティの定義（名前と値）
- `font-family` 宣言
- hexカラーの出現頻度

色の「トーンが揃っているか」の判定は、抽出したhexを CIE L\*a\*b\* に変換して
L\*（明度）、C\*（彩度）、h°（色相角）、白背景に対するコントラスト比を計算して行った（`scratchpad/tone.py`）。
**これも推定ではなく計算値。**

### 証拠の強度ラベル

本文中で以下を区別する。

- **[実測]** … 実際に配信されているCSS/HTMLから抽出した値
- **[計算]** … 実測hexから算出した L\*C\*h / コントラスト比
- **[推測]** … 上記から導いた解釈。断定ではない

### 取得に失敗したもの（内容は捏造していない）

| URL                                     | 結果                                                                                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `https://www.eight-app.com/`            | 接続失敗（HTTP 000、レスポンスなし）。Eight は `8card.net` で取得した                                                                                              |
| `https://ai-workforce.layerx.co.jp/`    | 接続失敗（HTTP 000）。存在しないサブドメインと判断。正しくは `getaiworkforce.com`（検索で特定）                                                                    |
| `https://biz.moneyforward.com/*`        | 素の curl では Cloudflare が **HTTP 403 "Just a moment..."**。フルブラウザヘッダ（Accept / Accept-Language / Sec-Fetch-*）付与で 200 取得に成功                    |
| `https://corp.moneyforward.com/`        | HTML は 200 で取得できたが、CSSが autoptimize の `.php` バンドル参照になっており実体が 151〜912 バイトしか返らず**パレット抽出不能**。MFコーポレートの配色は未確認 |
| `https://bakuraku.jp/keihi`             | **404**。バクラクの経費精算LPの正しいパスは `/expense/`                                                                                                            |
| `https://vibes.freee.co.jp/`            | Storybook のシェル（980バイト）のみ返り、本文はJSレンダリングで取得不能。**かつプロダクトUI用のため本調査の結論には不使用**                                        |
| `https://smarthr.design/basics/colors/` | 調査スコープ外（プロダクトUIデザインシステム）と判断し取得中止                                                                                                     |

---

## 1. Sansan グループ

### 参照URL

- コーポレート: `https://jp.corp-sansan.com/` （WordPress、テーマ `sansan-corp4`）
- Sansan（営業AX）: `https://jp.sansan.com/` （Next.js + vanilla-extract）
- Bill One: `https://bill-one.com/` （Next.js + vanilla-extract）
- Eight: `https://8card.net/` （静的HTML + 手書きCSS）
- Contract One: `https://www.contractone.com/` （WordPress + Astra + Elementor）
- CSS実体: `https://jp.corp-sansan.com/corp/wp-content/themes/sansan-corp4/css/style.css`

### 共通している要素 [実測]

**コーポレートとSansan本体は、ブランドの赤と青を共有している。**
コーポレート `style.css` の頻出色は `#e6e6e6`(42) / `#d70c18`(31) / `#004e98`(23) / `#f7f7f7`(22)。
Sansan LP (`jp.sansan.com`) のトークンは `--_1l3pi610:#004e98`（青）と `--_1l3pi612:#d70c18`（赤）。
**`#004E98` と `#D70C18` の2色がコーポレートとSansan LPで完全一致。**

さらに Bill One のトークンにも `--nofd2f:#D70C18` が存在する。
つまり **Sansanコーポレートレッド `#D70C18` は3サイトを横断する唯一の共有ブランド資産** [実測]。

書体はSansanとBill Oneで共通。

- `jp.sansan.com`: `font-family:sofia-pro, Helvetica Neue, Yu Gothic, YuGothic, ヒラギノ角ゴ Pro W3, ...`
- `bill-one.com`: `font-family:sofia-pro, 游ゴシック体, YuGothic, 游ゴシック, ..., Hiragino Sans, Helvetica, Roboto, sans-serif`
- **欧文 `sofia-pro`（Adobe Fonts）+ 和文 游ゴシック という組み合わせが両者で一致** [実測]

（注: `jp.sansan.com` の一部チャンクに `Geist` が出るが、これは Next.js のデフォルトフォント定義であり本文書体ではない [推測]）

コーポレート `style.css` は `Avenir` / `Helvetica Neue` / `Yu Gothic` を使っており、
**欧文書体だけコーポレート(Avenir)とプロダクトLP(sofia-pro)で食い違っている** [実測]。

### プロダクト間で変えている要素

| サイト       | 主アクセント [実測]               | 地の色/インク [実測]            | ニュートラルの傾向 [計算]                                                                    |
| ------------ | --------------------------------- | ------------------------------- | -------------------------------------------------------------------------------------------- |
| Sansan       | `#004E98`（濃紺）                 | `#1a1a1a`                       | 純グレー中心（`#f8f8f8` `#eeeeee` `#cccccc` `#b5b5b5` `#5f5f5f`）+ 青み面色 `#f1f5f9` を併用 |
| Bill One     | `#0075B5`（明るい青）             | `#231815`（**墨色・暖色寄り**） | 純〜暖グレー（`#FBFBFB` `#F5F5F5` `#E2E2E3` `#717171` `#444444`）                            |
| Eight        | `#0054FF`（鮮烈な青）             | `#0e202e`                       | `#ededed` `#e0e0e0` `#595959`（純グレー）                                                    |
| Contract One | `#013660` / `#01254a`（ネイビー） | `#111111`                       | `#FAFAFA` `#E8E8E8` `#D9D9D9` `#888888`（純グレー）                                          |

- **ドメイン構造は完全にバラバラ**: `jp.sansan.com`（サブドメイン）/ `bill-one.com`（別ドメイン）/ `8card.net`（別ドメイン・別TLD）/ `contractone.com`（別ドメイン）。**配下パス型は1つもない** [実測]
- **ロゴ体系は個別ブランド型**。Eight は「Sansan」の名を冠さず、`8card.net` という無関係なドメインで運用されている [実測]
- Contract One は `--c1-head: 'Playfair Display', Georgia, serif` / `--c1-body: 'Inter', sans-serif` [実測]。
  **セリフ見出し + Inter という、グループ内の他3サイト（sofia-pro + 游ゴシック）と全く異なるタイポグラフィ**。
  フッターは `© 2026 ContractOne. All Rights Reserved. Designed by ...` で、Sansan社名の表記がHTML中に見当たらなかった [実測]

### トーンの揃い方 [計算]

|                        | L\*  | C\*   | h°    | 白地コントラスト |
| ---------------------- | ---- | ----- | ----- | ---------------- |
| Sansan `#004E98`       | 33.4 | 47.1  | 282.0 | 8.26:1           |
| Bill One `#0075B5`     | 47.1 | 41.5  | 265.3 | 4.99:1           |
| Eight `#0054FF`        | 43.6 | 100.5 | 297.5 | 5.66:1           |
| Contract One `#013660` | 21.9 | 29.4  | 274.0 | 12.37:1          |

**色相は265〜298°の狭い範囲（全部「青」）に収まっているが、明度L\*は21.9〜47.1で25ポイント、彩度C\*は29〜100で3倍以上ばらついている。**
→ **「同一トーンで色相違い」ではない。むしろ逆で、「同一色相帯（青）で、トーンがバラバラ」** [計算]。
グループとして色相を揃える意図は見えるが、正規化された設計トークンによる統制の痕跡はない [推測]。

### デザインシステムの公開

本調査の範囲では、Sansanグループが**Webサイト向けの統一ガイドラインを公開している証拠は発見できなかった**。
実装スタックも WordPress / Next.js+vanilla-extract / 静的HTML / Astra+Elementor と4種に分裂しており、
共通実装基盤が存在しないことを示唆する [実測 + 推測]。

---

## 2. freee

### 参照URL

- コーポレート: `https://corp.freee.co.jp/` （CSS: `/corp-freee-global.css`、182KB）
- サービスサイト: `https://www.freee.co.jp/`
- 会計: `https://www.freee.co.jp/accounting/`
- 人事労務: `https://www.freee.co.jp/hr/`
- 共通CSS: `https://www.freee.co.jp/www-freee-global.css` （**2.74MB**）

### 共通している要素 [実測]

**freee は6社中もっとも徹底した「単一アクセント」型。**

`www-freee-global.css` は `www.freee.co.jp` 配下の**全プロダクトページで同一ファイルが読み込まれている**（トップ / 会計 / 人事労務すべてで確認）。
その頻出色は以下で、**プロダクトが変わっても一切変化しない** [実測]。

```
584  #2864f0   freee ブルー（プライマリ）
204  #1e46aa   ブルー暗
199  #323232   テキスト
126  #ebf3ff   ブルー最淡（面）
 89  #f7f5f5   面（わずかに暖色）
 83  #e6e6e6
 72  #e1dcdc   （暖色寄りグレー）
 63  #dce8ff
 54  #245ad6
 45  #fbfbfb
 43  #23418c
 41  #143278
 38  #f2f6fe
 36  #285ac8
 33  #fa6414   オレンジ（セカンダリ）
 31  #dc1e32   レッド（セカンダリ）
```

コーポレートサイト `corp-freee-global.css` の頻出色も `#2864f0`(53) / `#1e46aa`(8) / `#285ac8`(6) / `#323232`(10) と**同一**。
セカンダリとして `#ffb91e` `#fa6414` `#82c31e` `#00b9b9` `#26bfbf` も共有 [実測]。

- **コーポレートとプロダクトのプライマリが完全一致（`#2864F0`）** [実測]
- ニュートラルは**純グレー〜わずかに暖色**（`#323232` は純グレー、`#f7f5f5` `#e1dcdc` `#e9e7e7` は赤み寄り）。**青みグレーではない** [実測/計算]
- ドメイン構造: **`www.freee.co.jp/<product>/` の配下パス型**。会計 `/accounting/`、人事労務 `/hr/`。プロダクトごとの別ドメインは使っていない [実測]
- ページ固有CSS（`component---src-pages-accounting-index-tsx.*.css` 等）は存在するが、**その中の色も `#2864f0` `#1e46aa` `#ebf3ff` と共通トークンのみ**。プロダクト固有の色相は定義されていない [実測]

### 書体 [実測]

- コーポレート: `museo-sans, sans-serif`（欧文）+ ヒラギノ角ゴ / メイリオ、および `noto-sans-cjk-jp, museo-sans, sans-serif`
- サービスサイト: `Noto Sans, Noto Sans JP, sans-serif`（76箇所）、`Noto Sans, museo-sans, sans-serif`（14箇所）
- → **`museo-sans` + Noto Sans 系という骨格は共通**だが、コーポレート側が `museo-sans` 主体、サービス側が `Noto Sans` 主体で重心がずれている [実測]

### プロダクト間で変えている要素

**ほぼ何も変えていない。** 会計・人事労務の各LPで、プライマリ・ニュートラル・書体・共通CSSがすべて同一 [実測]。
差分はページ固有のイラストとレイアウトのみ [推測]。

### デザインシステムの公開

freee は2023年12月にデザインシステム **「vibes」** を公開（`https://vibes.freee.co.jp/`、
発表: `https://corp.freee.co.jp/news/20231219_design.html`）。
ただし **vibes は主体がプロダクトUI向け**（React コンポーネント + Sketch ファイル、アクセシビリティ規約）であり、
**本調査の「Webサイト/LPの共通化」の結論には使用しない**。
ブランドレベルで参照できる事実としては「コントラスト問題が起きにくいようカラーパレットを整備している」という方針表明のみ。
なお `vibes.freee.co.jp` 自体は Storybook のシェルしか取得できず、パレットの実値は未確認（**取得失敗**）。

---

## 3. マネーフォワード

### 参照URL

- コーポレート: `https://corp.moneyforward.com/` （WordPress + autoptimize）
- クラウド ポータル: `https://biz.moneyforward.com/`
- 会計: `https://biz.moneyforward.com/accounting/`
- 経費: `https://biz.moneyforward.com/expense/`
- 給与: `https://biz.moneyforward.com/payroll/`
- 請求書: `https://biz.moneyforward.com/invoice/`
- 人事管理: `https://biz.moneyforward.com/employee/`
- 勤怠: `https://biz.moneyforward.com/attendance/`
- 契約: `https://biz.moneyforward.com/contract/`（CSSバンドル名は `stampless.*`）
- CSS実体: `https://assets-biz-portal.moneyforward.com/packs/dist/{top,expense,payroll,invoice,employee,attendance}.*.css`

### 共通している要素 [実測]

**freee と並ぶ徹底した単一アクセント型。しかもプロダクトごとにCSSバンドルが分かれているのに、中身の色が完全に同一。**

プロダクトごとに別バンドル（`top` / `expense` / `payroll` / `invoice` / `employee` / `attendance` / `stampless`）が配信されているが、
**上位頻出色の並びが6バンドルすべてで同一** [実測]。

| 色                           | top | expense | payroll | invoice | employee | attendance |
| ---------------------------- | --- | ------- | ------- | ------- | -------- | ---------- |
| `#0054ac` プライマリ         | 155 | 71      | 78      | 77      | 68       | 72         |
| `#d6d8e0` ボーダー           | 141 | 62      | 75      | 64      | 58       | 61         |
| `#f2f5ff` 面                 | 82  | 41      | 40      | 39      | 35       | 43         |
| `#2d344b` テキスト           | 50  | 27      | 33      | 24      | 23       | 26         |
| `#3171ca`                    | 43  | 22      | 22      | 22      | 21       | 24         |
| `#00348a`                    | 38  | 12      | 13      | 12      | 12       | 13         |
| `#b8bcc9`                    | 30  | 14      | 14      | 12      | 12       | 13         |
| `#63697f`                    | 17  | 13      | —       | —       | —        | 13         |
| `#ffb300` / `#ffc631` 警告黄 | 8/6 | 4/4     | あり    | あり    | あり     | あり       |

**全プロダクトLPのHTMLインラインhexも `#0054ac` ただ1色** [実測]。

- **ニュートラルが明確に青み寄り**。`#d6d8e0`（青みグレー）、`#2d344b`（青みチャコール）、`#63697f`、`#b8bcc9`、面色 `#f2f5ff`。**6社中もっとも青みグレーが徹底している** [実測]
- 書体: `"Noto Sans JP", "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif` が**全バンドルで完全に同一の文字列** [実測]
- ドメイン構造: **`biz.moneyforward.com/<product>/` の配下パス型**。マスターブランド型（「マネーフォワード クラウド◯◯」という命名） [実測]
- ヘッダー/フッター: 全プロダクトLPで共通のポータルナビゲーション。フッターに Money Forward ME / Money Plus 等の関連プロパティを集約 [WebFetch実測]

### プロダクト間で変えている要素

**色・書体・ニュートラルのレベルでは何も変えていない** [実測]。
プロダクト固有バンドルはレイアウト差分のみを担っている [推測]。

### 未確認

コーポレートサイト `corp.moneyforward.com` の配色は**CSS実体が取得できず未確認**（上記「取得に失敗したもの」参照）。
したがって「コーポレートとプロダクトでプライマリが一致しているか」は**本調査では確認できていない**。

### デザインシステムの公開

Money Forward は **MFUI** というデザインシステムを持つ（Money Forward Tech Day 2024 / Zenn 記事 / Goodpatch ブログで言及）。
ただし **MFUI は Web プロダクト向け共通UIライブラリ = プロダクトUI由来**であり、**本調査の結論には使用しない**。
社内にデザイナー約70名の横断組織があるという記述は、ブランドレベルの体制情報として参考になる [記事由来・未検証]。

---

## 4. LayerX

### 参照URL

- コーポレート: `https://layerx.co.jp/` （WordPress）
- プレスキット: `https://layerx.co.jp/presskit/`
- バクラク（シリーズトップ）: `https://bakuraku.jp/` （WordPress + Astra + Elementor、テーマ `bakuraku-lp-theme-202205/rebranding`）
- バクラク各LP: `/expense/` `/invoice/` `/attendance/` `/card/` `/payroll/` `/clm/` `/doc-issue/` `/ar-management/` `/denshichobo/` `/workflow/` `/helpdesk-agent/` `/intelligence/`
- Ai Workforce: `https://getaiworkforce.com/` （Nuxt）
- **トークン実体（最重要）**: `https://bakuraku.jp/wp-content/themes/bakuraku-lp-theme-202205/rebranding/assets/css/base.css`

### これが依頼元の構想とほぼ同型の実例

**バクラクのLPテーマ `base.css` は、まさに「共通ニュートラル＋共通タイポ＋共通余白/角丸 ＋ プロダクトごとの色相ランプ ＋ セマンティックなテーマ契約層」という3層構造で書かれている** [実測]。

#### 層1: 全プロダクト共通の骨格トークン [実測]

```css
/* ニュートラルが2系統ある */
--neutral-5: #f7f7f7 --neutral-10: #ededed --neutral-20: #e1e1e1 --neutral-30: #cecece
  --neutral-40: #bfbfbf --neutral-50: #ababab --neutral-60: #8f8f8f --neutral-70: #5b5b5b
  --neutral-80: #313131 --neutral-90: #1b1b1b /* ← 純グレー */ --smoke-5: #f2f5f9
  --smoke-10: #eaedf1 --smoke-20: #dde2e8 --smoke-30: #cad2dc --smoke-40: #b3c1cf
  --smoke-50: #9facbd --smoke-60: #7e90a3 --smoke-70: #4c6075 --smoke-80: #233447
  --smoke-90: #001226 /* ← 青みグレー */ /* タイポ */ --font-family-jp: 'Noto Sans JP'
  --font-family-en: 'Montserrat' --font-size-xxs: 10px 2s: 12px xs: 14px sm: 16px md: 18px lg: 20px
  xl: 24px 2xl: 28px 2l: 32px 3l: 40px 4l: 56px 5l: 64px --font-weight-r: 400 m: 500 b: 600 xb: 700
  --line-height-xs: 100% sm: 125% md: 150% lg: 175% xl: 200% --letter-spacing-sm: 0% md: 0.02em
  lg: 0.05em /* 余白リズム */ --spacing_2xs: 4 xs: 8 sm: 12 md: 16 lg: 24 xl: 32 2xl: 40 3xl: 56
  4xl: 64 5xl: 80 full: 120 (px) --section-spacing-pc: 120px --section-spacing-sp: 80px
  --section-title-spacing-pc: 64px --section-title-spacing-sp: 40px --inner-main-pc: 1130px
  --inner-sub-pc: 1040px --gutter-sp: 24px /* 形状 */ --radius_xs: 4px sm: 6px md: 8px lg: 10px
  section: 20px section-inner-md: 10px full: 9999px;
```

**注目: テキスト既定色は `--color-text-primary: var(--smoke-80)` = `#233447`。純グレーではなく青みグレーを本文に採用している** [実測]。
そして境界線も `--color-border-primary: var(--smoke-40)`、`--color-bg-secondary: var(--neutral-5)`。
**青みグレー(smoke)を「文字・罫線」に、純グレー(neutral)を「面・入力欄」に使い分けている** [実測]。

#### 層2: プロダクトごとの色相ランプ（5〜90の10段、完全に同じ刻み構造）[実測]

| プロダクト                    | 5         | 10        | 20        | 30        | 40        | 50        | 60        | 70        | 80        | 90        |
| ----------------------------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| bakuraku（シリーズ・青）      | `#f4f9ff` | `#e2eeff` | `#cfe3ff` | `#b4d3ff` | `#9dc5fd` | `#70abfd` | `#2d81ec` | `#0e63c4` | `#01358a` | `#00193d` |
| expense（経費・緑）           | `#effef9` | `#c9f7e9` | `#a4f0db` | `#74e8ca` | `#38dbb7` | `#0cba9a` | `#00967b` | `#09695f` | `#00473d` | `#02312d` |
| invoice（請求書受取・藍）     | `#f2f5fc` | `#e1e8f8` | `#cedbf9` | `#bad2ff` | `#9bbcff` | `#79a2f9` | `#5974e2` | `#3e4fbf` | `#2e3782` | `#172152` |
| attendance（勤怠・橙）        | `#fff6ed` | `#ffeada` | `#ffdab7` | `#ffca98` | `#feb170` | `#ff8738` | `#db6800` | `#a64d00` | `#612a00` | `#3d1800` |
| card（ビジネスカード・青緑）  | `#effaf6` | `#d8f3e8` | `#beeedd` | `#97e5ce` | `#72d5b9` | `#4db59b` | `#21846f` | `#005c4f` | `#044033` | `#0a2421` |
| payroll（給与・黄）           | `#fffbea` | `#fff1c2` | `#ffe694` | `#f7d05f` | `#f0b421` | `#dc9800` | `#b57800` | `#825500` | `#533400` | `#422800` |
| docissue（書類発行・黄緑）    | `#fdffe5` | `#ecf692` | `#daeb57` | `#c8e234` | `#a8d028` | `#8eb500` | `#6d8a12` | `#4c6600` | `#3a4d0c` | `#243201` |
| denshichobo（電子帳簿・水）   | `#edfcfe` | `#d3f4fa` | `#ace9f5` | `#84defb` | `#5fcbf5` | `#2cb0d7` | `#157fa5` | `#1b627c` | `#01394f` | `#022434` |
| ar-management（債権管理・藍） | `#f2f5fc` | `#e1e8f8` | `#cedbf9` | `#bad2ff` | `#9bbcff` | `#79a2f9` | `#5974e2` | `#3e4fbf` | `#2e3782` | `#172152` |

さらにランプを持たない単発指定として `--brand-color-aihelpdesk-primary:#7a69d8`、`--brand-color-clm-primary:#7A3B7A`。

**プロダクト横断で共有される「アクセント」も別に定義されている** [実測]:

```
--accent-leaf:#b5de00  --accent-light-leaf:#ddfc54
--accent-sun:#fcce08   --accent-light-sun:#ffdd4a
--accent-orange:#ffad0d --accent-light-orange:#ffbd3e
--accent-purple:#9675f7 --accent-light-purple:#b49df8
--accent-red:#f9415e    --accent-light-red:#ffacaf
```

#### 層3: セマンティックなテーマ契約層 [実測]

各プロダクトのランプは、**役割名に正規化**される。

```css
--brand-color-expense-primary: var(--expense-60) --brand-color-expense-medium: var(--expense-70)
  --brand-color-expense-medium-light: var(--expense-20)
  --brand-color-expense-light: var(--expense-5) --brand-color-expense-dark: var(--expense-80)
  --brand-color-expense-accent: var(--accent-light-leaf);
```

（同じ6役割が bakuraku / attendance / card / payroll / docissue / invoice / ar-management / denshichobo / workflow に対して定義されている）

そのうえで**「今表示しているプロダクト」を指す抽象スロット**がある。

```css
--color-bg-product-primary / -medium / -medium-light / -light / -dark
--color-text-product-primary / -accent
--color-button-product-primary
```

`base.css` の既定値はシリーズ色（bakuraku）に向いており、
**プロダクトLPごとに読み込まれる1ファイルがこのスロットだけを差し替える** [実測]。

`assets/css/expense.css`（**803バイトしかない**）の中身:

```css
--color-bg-product-primary: var(--brand-color-expense-primary);
--color-bg-product-medium: var(--brand-color-expense-medium);
--color-bg-product-medium-light: var(--brand-color-expense-medium-light);
--color-text-product-medium: var(--brand-color-expense-medium);
--hero-bg-color: var(--color-bg-product-medium);
--hero-bg-color-sub: var(--color-bg-product-primary);
```

同様に `card.css` / `attendance.css` / `invoice.css` / `payroll.css` / `doc-issue.css` /
`ar-management.css` / `denshichobo.css` が、それぞれ自プロダクトのランプへスロットを向け替えている [実測]。

**さらに共通ヘッダー(`common.css`)は、ナビ内のサービスラベルのチップ色を同じトークンで出し分けている** [実測]:

```css
--c-service-label-bg-color: var(--brand-color-bakuraku-primary)
  --c-service-label-bg-color: var(--brand-color-expense-primary)
  --c-service-label-bg-color: var(--brand-color-attendance-primary)
  --c-service-label-bg-color: var(--brand-color-card-medium)
  --c-service-label-bg-color: var(--brand-color-clm-primary)... （全13プロダクト分）;
```

→ **1つの共通ヘッダーコンポーネントの中で、プロダクト色だけが視覚デバイスとして変化する。**

#### 例外も実測できた

`clm.css`（契約管理）だけはトークンを経由せず**生hexを直接書いている** [実測]:

```css
--color-bg-product-primary: #a35ea1;
--color-bg-product-medium: #7a3b7a;
--color-bg-product-dark: #541454;
--color-bg-product-medium-light: #ffdbff;
--color-text-product-accent: #ffdd4a;
```

また `attendance.css` / `ar-management.css` に `--color-product-10: var(--docissue-10)` という
**他プロダクトのランプを参照した明らかなコピペ残り**が混入している [実測]。
→ **この方式は運用すると必ずこの種のズレが出る、という実証。**

### トーンが揃っているか [計算]

バクラクの各プロダクト primary（ランプの `-60` を採用しているもの）:

| プロダクト    | hex       | L\*  | C\*  | h°    | 白地コントラスト |
| ------------- | --------- | ---- | ---- | ----- | ---------------- |
| expense       | `#00967b` | 55.3 | 40.7 | 173.2 | 3.72:1           |
| attendance    | `#db6800` | 57.0 | 77.0 | 58.1  | 3.50:1           |
| card          | `#21846f` | 49.5 | 33.3 | 174.3 | 4.57:1           |
| payroll       | `#b57800` | 55.3 | 63.8 | 75.3  | 3.72:1           |
| docissue      | `#6d8a12` | 53.5 | 59.9 | 116.0 | 3.97:1           |
| denshichobo   | `#157fa5` | 49.6 | 31.6 | 243.1 | 4.55:1           |
| ar-management | `#5974e2` | 52.0 | 63.6 | 291.7 | 4.18:1           |

**`-60` を採る7プロダクトの L\* は 49.5〜57.0（幅 7.5）に収まっている。色相は58°〜292°と全周に散っているのに、明度はほぼ一定。**
→ **「同一トーンで色相違い」が、意図的に、かつ数値的に成立している** [計算]。

一方 `-70` を primary にしている bakuraku(`#0e63c4`, L\*42.8) / invoice(`#3e4fbf`, L\*38.5) と、
トークン外の clm(`#7A3B7A`, L\*35.3) はこの帯から外れる。
全11色をまとめると L\* は 35.3〜57.0（幅21.7）[計算]。
→ **ランプ位置を揃えている限りトーンは揃う。位置を変えた瞬間に崩れる、という構造がそのまま数値に出ている** [推測]。

**なお `-60` 系の白地コントラストは 3.50:1〜4.57:1 で、7色中4色が WCAG AA (4.5:1) を下回る** [計算]。
LP用途（大見出し・面色）としては 3:1 で足りる場面が多いが、**このランプ位置をそのまま本文リンクやボタン文字に使うと落ちる** [推測]。

### コーポレート vs プロダクトの断絶 [実測]

| サイト                       | 主色                                                 | 書体                                     | 実装                   |
| ---------------------------- | ---------------------------------------------------- | ---------------------------------------- | ---------------------- |
| layerx.co.jp（コーポレート） | `#534dff`（16回）/ `#4111ff` / インク `#152632`      | Noto Sans JP（Google Fonts）             | WordPress              |
| bakuraku.jp                  | `#0e63c4`（シリーズ青）/ インク `#001226`            | Noto Sans JP + Montserrat                | WordPress + 独自テーマ |
| getaiworkforce.com           | `#007cff` / `#4b9cfb` / `#f84f65` / インク `#1a1a1a` | Inter + Noto Sans JP、見出しに `grandam` | Nuxt                   |

- **和文 Noto Sans JP は3サイト共通**。ただし**欧文は Montserrat / Inter / grandam でバラバラ** [実測]
- **コーポレートの `#534DFF`（青紫）はバクラクにもAi Workforceにも登場しない**。プレスキットページでも `#534dff` が最頻出で、コーポレートブランドカラーと判断できる [実測]
- ドメインは `layerx.co.jp` / `bakuraku.jp` / `getaiworkforce.com` の**3別ドメイン** [実測]
- → **LayerXは「コーポレート」「バクラク」「Ai Workforce」を3つの独立したブランドとして運用し、統合は和文書体レベルにとどまる** [推測]。
  **一方でバクラク“シリーズ内部”は極めて厳格に統一されている。**「統一の単位はシリーズであって会社ではない」[推測]

---

## 5. ラクス

### 参照URL

- コーポレート: `https://www.rakus.co.jp/` （CSS: `/assets/css/style.css`、360KB）
- 楽楽精算: `https://www.rakurakuseisan.jp/` → **`https://www.rakus.co.jp/rakurakucloud/seisan/` へ301リダイレクト**
- 楽楽明細: `https://www.rakurakumeisai.jp/` → `https://www.rakus.co.jp/rakurakucloud/meisai/`
- 楽楽販売: `https://www.rakurakuhanbai.jp/` → `https://www.rakus.co.jp/rakurakucloud/hanbai/`

### 共通している要素 [実測]

**ドメイン戦略がこの6社で最も特徴的。**
`rakurakuseisan.jp` / `rakurakumeisai.jp` / `rakurakuhanbai.jp` という**製品ごとのバニティドメインを保持しつつ、
実体は全て `www.rakus.co.jp/rakurakucloud/<product>/` の配下パスに集約している** [実測]。
→ SEO/認知の資産（各製品の指名検索）を残しながら、配信基盤を1つにまとめている [推測]。

**コーポレートの `style.css` が全プロダクト色のレジストリを持っている** [実測]:

```css
--color-seisan: #007bc7 /* 楽楽精算 */ --color-meisai: #267d00 /* 楽楽明細 */
  --color-hanbai: #f53c20 /* 楽楽販売 */ --color-seikyu: #0ba578 /* 楽楽請求 */
  --color-kintai: #2531b7 /* 楽楽勤怠 */ --color-mail: #172a88 /* メールディーラー */
  --color-denshihozon: #a43fd1 /* 楽楽電子保存 */ --color-saimu: #00ad0e /* 楽楽債務 */
  --color-jidou: #f08300 /* ＝コーポレートのオレンジと同値 */ --color-r-jinjiroumu: #107de8
  --color-r-jugyoinportal: #464646;
```

**コーポレートサイト1枚のCSSに、10製品のブランドカラーが名前付きで登録されている。**
`base.css` で全ブランド色を持つバクラクと同じ発想 [推測]。

**グレースケールが完全な純グレーで、全サイト共通** [実測]:

```css
--color-gray-50/100: #f5f5f5 --color-gray-200: #e6e6e6 --color-gray-300: #d2d2d2
  --color-gray-400: #bebebe --color-gray-500: #6e6e6e --color-gray-600: #5a5a5a
  --color-gray-700: #323232;
```

各製品LPの `top-fv.css` でも `#323232` `#e6e6e6` `#d2d2d2` `#bebebe` `#f6f6f6` が共通して頻出 [実測]。
→ **6社中、ニュートラルの「純グレーぶり」が最も明確。青みも赤みもない** [計算]。

各製品LPの書体も共通 [実測]:

```
font-family:"IBM Plex Sans JP","ヒラギノ角ゴ Pro W3","Hiragino Kaku Gothic Pro",
            Osaka, Meiryo, YuGothic,"Yu Gothic medium","Hiragino Sans", ...
```

**楽楽精算・楽楽明細・楽楽販売の3LPで一字一句同一の宣言。** CSSファイル名も全て `assets/css/top-fv.css` + `swiper.min.css` で揃っている [実測]。

### コーポレートとプロダクトで**違う**要素 [実測]

- **書体が違う。** コーポレートは `--font-jp:"Noto Sans JP"` / `--font-en:"Roboto"`。
  製品LPは **IBM Plex Sans JP**。→ **「書体は共通」が成り立っていない唯一の例**
- コーポレートの主色は `#ea6f00`(30) / `#f08300`(12) のオレンジ [実測]

### プロダクト間で変えている要素 [実測]

各製品LPは**「製品色 + CTA用の暖色」の2色構成**になっている。

| LP                  | 頻出1位       | 頻出2位       | 解釈                     |
| ------------------- | ------------- | ------------- | ------------------------ |
| 楽楽精算 `/seisan/` | `#007bc7`(89) | `#ff852b`(48) | 製品ブルー + オレンジCTA |
| 楽楽明細 `/meisai/` | `#e55927`(86) | `#267d00`(47) | オレンジ + 製品グリーン  |
| 楽楽販売 `/hanbai/` | `#f53c20`(41) | `#00b383`(35) | 製品レッド + グリーン    |

**3LPすべてに橙〜赤系（`#ff852b` / `#e55927` / `#f53c20`）が高頻度で出る。**
コーポレートのオレンジ `#f08300` / `#ea6f00` と合わせて、**「ラクスの橙」がシリーズ横断のCTA/共通アクセントとして機能している** [推測]。
また各LPには他製品の色（`#2531b7` `#0ba578` `#267d00` `#007bc7` `#f53c20` `#1558d6`）も少数含まれ、
**シリーズ内クロスセル導線を製品色で色分けしている** [推測]。

### トーンが揃っているか [計算]

| 製品             | hex       | L\*  | C\*  | h°    | 白地コントラスト |
| ---------------- | --------- | ---- | ---- | ----- | ---------------- |
| 楽楽精算         | `#007BC7` | 49.8 | 47.3 | 270.1 | 4.51:1           |
| 楽楽明細         | `#267D00` | 45.7 | 67.6 | 132.6 | 5.23:1           |
| 楽楽販売         | `#F53C20` | 54.8 | 89.0 | 40.2  | 3.78:1           |
| 楽楽請求         | `#0BA578` | 60.2 | 48.7 | 164.0 | 3.15:1           |
| 楽楽勤怠         | `#2531B7` | 29.4 | 83.3 | 301.4 | 9.54:1           |
| メールディーラー | `#172A88` | 22.4 | 61.7 | 298.6 | 12.19:1          |
| 楽楽電子保存     | `#A43FD1` | 47.0 | 85.2 | 318.0 | 4.99:1           |
| 楽楽債務         | `#00AD0E` | 61.6 | 88.0 | 136.7 | 3.01:1           |
| コーポレート橙   | `#F08300` | 65.6 | 80.3 | 63.8  | 2.64:1           |

**L\* は 22.4〜65.6（幅43.2）、C\* は 47〜89（幅42）。6社中もっともバラついている** [計算]。
→ **「シリーズ統一ブランディングの教科書例」と目される一方で、色そのものはトーン正規化されていない。**
`#172A88`（12.19:1）と `#F08300`（2.64:1）ではコントラストが5倍近く違い、
**同じコンポーネントに流し込めば見え方が破綻する水準** [計算]。
ラクスの統一感は**色のトーンではなく、純グレー・IBM Plex Sans JP・共通レイアウト・製品ロゴの造形ルールで作られている** [推測]。

### デザインシステムの公開

Webサイト向けの公開ガイドラインは本調査では発見できなかった。
ただし**コーポレートCSSに全製品色レジストリが存在すること自体が、社内に統一ルールがある強い証拠** [実測 + 推測]。

---

## 6. SmartHR

### 参照URL

- コーポレート: `https://smarthr.co.jp/` （Astro）
- プロダクト紹介サイト: `https://smarthr.jp/` （Astro）
- （参考・スコープ外）SmartHR Design System: `https://smarthr.design/`

### 共通している要素 [実測]

**`#00C4CC`（SmartHRブルー）がコーポレート・プロダクトサイト双方の中核。**

コーポレート `smarthr.co.jp` のトークン [実測]:

```css
--color--primary-100: #d4f4f5 --color--primary-200: #55fffd --color--primary-300: #88eaf6
  --color--primary-400: #69d9de --color--primary-500: #00c4cc --color--primary-600: #12abb1
  --color--primary-700: #0a767c --color--secondary-500: #ffe556 --color--grayscale-100: #ffffff
  --200: #f1f1f1 --300: #e6e9e9 --400: #dcdfdf --500: rgba(29, 28, 27, 0.18) --600: #acacac
  --700: #6a6a6a --800: #484644 --900: #1d1c1b --color--error-100: #fff1ee
  --color--error-200: #f9350a;
```

プロダクト紹介サイト `smarthr.jp` のトークン [実測]:

```css
--basic-shr-blue: #00c4cc --basic-aqua-3: #12abb1 --basic-aqua-4: #0f7f85 --basic-orange: #f69018
  --basic-red: #ff1100 --basic-pink: #fdefee --basic-primary: #f4f8f9 --basic-secondary: #e3eff1
  --black-0: #fff --black-5: #f8f8f8 --black-20: #e1e1e1 --black-25: #dadada --black-30: #c6c6c6
  --black-50: #969696 --black-60: #8d8d8d --black-90: #4c4c4c --black-100: #23221f
  --service-background-cta-kv-base: #005a64 --service-background-cta-kv-hover: #12abb1
  --service-background-cta-button-hover: #0a565a;
```

- **`#00C4CC` と `#12ABB1` が両サイトで一致** [実測]
- **ニュートラルは「わずかに暖色寄りの黒」**。`#23221f`（smarthr.jp）/ `#1d1c1b`（smarthr.co.jp）はどちらも R>G>B の暖色ブラック。中間グレーは `#969696` `#c6c6c6` `#acacac` とほぼ純グレー。**青みグレーではない** [計算]
- 実装は**両サイトとも Astro**（`/_astro/*.css`）。**6社中、コーポレートとプロダクトサイトで実装スタックが一致している唯一の例** [実測]

### コーポレートとプロダクトサイトで**違う**要素 [実測]

**書体が明確に違う。**

| サイト                        | 和文                                                   | 欧文              |
| ----------------------------- | ------------------------------------------------------ | ----------------- |
| smarthr.co.jp（コーポレート） | `Noto Sans JP`（248箇所）、`YakuHanJP` 併用            | `Heebo`（20箇所） |
| smarthr.jp（プロダクト紹介）  | `AdjustedYuGothic, Yu Gothic, YuGothic, Hiragino Sans` | `Roboto`          |

→ **コーポレートは Noto Sans JP + Heebo、プロダクト紹介は 游ゴシック + Roboto。ラクスと同様、書体は共通化されていない** [実測]。

トークンの命名も違う（`--color--primary-*` vs `--basic-*` / `--black-*` / `--service-background-*`）。
**同じ会社・同じフレームワークでありながら、2サイトは別々のトークン体系で書かれている** [実測]。

### プロダクト間で変えている要素

**該当なし。** SmartHR は事実上の単一プロダクト（+ 機能オプション）であり、
プロダクトごとに色相を振り分ける構造は確認できなかった [実測]。
`#00C4CC` L\*=72.1 / 白地コントラスト **2.15:1** [計算] — 明度が高く、テキスト色には使えない色 [推測]。

### デザインシステムの公開（**プロダクトUI由来 — 結論には不使用**）

`https://smarthr.design/` を公開しているが、
`--color-smarthr-blue:#00c4cc` / `--color-main-darken:#0065a9` / `--color-text-black:#23221f` /
`--color-light-grey-1:#d6d3d0` / `--color-danger:#e01e5a` といった**業務システムUI向けのトークン**が中心。
`#0077c7` が24回と最頻出で、これは**プロダクトUIの操作色であり、ブランドカラー `#00C4CC` とは別物** [実測]。
→ **「装飾に使うブランド色」と「操作に使う色」を分けている実例**として参考にはなるが、
本調査の対象であるWebサイト側の話ではないため、結論には用いない。

---

# 横断比較マトリクス

## A. コーポレートとプロダクトサイトで「共通化」されている要素

| 要素                     | Sansan                                    | freee                    | マネーフォワード                                 | LayerX                                      | ラクス                                        | SmartHR                          |
| ------------------------ | ----------------------------------------- | ------------------------ | ------------------------------------------------ | ------------------------------------------- | --------------------------------------------- | -------------------------------- |
| **プライマリ色**         | △ 赤 `#D70C18` のみ共有。青は各社バラバラ | ◎ `#2864F0` 完全一致     | ? コーポレート未取得 / プロダクト間は◎ `#0054AC` | ✕ コーポレート `#534DFF` はプロダクトに不在 | ✕ コーポレート橙 vs 製品色                    | ◎ `#00C4CC` 一致                 |
| **和文書体**             | ○ 游ゴシック系                            | ○ Noto Sans 系           | ◎ Noto Sans JP 完全一致                          | ○ Noto Sans JP 共通                         | ✕ Noto Sans JP vs IBM Plex Sans JP            | ✕ Noto Sans JP vs 游ゴシック     |
| **欧文書体**             | ✕ Avenir vs sofia-pro                     | △ museo-sans の重心差    | ◎ 完全一致                                       | ✕ Montserrat / Inter / grandam              | ✕ Roboto vs（製品LPは欧文指定なし）           | ✕ Heebo vs Roboto                |
| **ニュートラル**         | △ 純グレー基調だが各サイト別定義          | ○ 純〜暖グレー共通       | ◎ 青みグレー完全共通                             | ◎ neutral/smoke 2系統をシリーズ内で共通     | ◎ 純グレー完全共通                            | ○ 暖色ブラック基調（値は別定義） |
| **ニュートラルの色味**   | 純グレー                                  | 純〜やや暖               | **青み（最も明確）**                             | 純グレー + 青みグレーの二重系統             | **純グレー（最も明確）**                      | やや暖（`#23221f`）              |
| **レイアウト骨格**       | ✕ 実装4種で分裂                           | ◎ 同一Gatsbyビルド       | ◎ 同一ポータル基盤                               | ◎ シリーズ内は同一テーマ                    | ◎ 同一パス配下・同一CSS名                     | △ 同じAstroだがトークン別体系    |
| **ヘッダー/フッター**    | ✕ サイトごとに別                          | ◎ 共通                   | ◎ 共通ポータルナビ                               | ◎ 共通ヘッダー（チップ色のみ可変）          | ○ 共通                                        | △ サイトごとに別                 |
| **共通トークンファイル** | ✕ 無し                                    | ○ `www-freee-global.css` | ○ プロダクト別バンドルだが内容同一               | ◎ `base.css`（3層トークン）                 | ◎ `style.css`（製品色レジストリ）+ 共通グレー | ✕ 2サイトで別体系                |
| **余白/角丸トークン**    | ✕ 確認できず                              | ✕ 確認できず             | ✕ 確認できず                                     | ◎ `--spacing_*` `--radius_*` 明示           | △ 部分的                                      | ✕ 確認できず                     |

## B. プロダクト間で「変えている」要素

| 要素                        | Sansan                                       | freee                       | マネーフォワード                                | LayerX（バクラク）                              | ラクス                               | SmartHR                    |
| --------------------------- | -------------------------------------------- | --------------------------- | ----------------------------------------------- | ----------------------------------------------- | ------------------------------------ | -------------------------- |
| **アクセント色を変えるか**  | 変える（各社独立）                           | **変えない**                | **変えない**                                    | **変える（設計として）**                        | **変える（設計として）**             | 変えない（単一プロダクト） |
| **色数**                    | 4サイト4色                                   | 1色                         | 1色                                             | 13プロダクト分のランプ                          | 10製品分のレジストリ                 | 1色                        |
| **色相の散り方**            | 265〜298°（青のみ）                          | —                           | —                                               | 58〜327°（全周）                                | 40〜318°（全周）                     | —                          |
| **L\* のばらつき**          | 21.9〜47.1（幅25.1）                         | —                           | —                                               | **-60採用の7色は49.5〜57.0（幅7.5）**           | 22.4〜65.6（**幅43.2**）             | —                          |
| **同一トーン設計か** [計算] | **✕**（同色相・異トーン）                    | 該当なし                    | 該当なし                                        | **◎**（ランプ位置で正規化）                     | **✕**（トーン不揃い）                | 該当なし                   |
| **ロゴ体系**                | 個別ブランド型（Eight は社名を冠さない）     | マスターブランド（freee◯◯） | マスターブランド（マネーフォワード クラウド◯◯） | シリーズブランド（バクラク◯◯）/ 会社とは別      | シリーズブランド（楽楽◯◯）           | 単一                       |
| **ドメイン構造**            | サブドメイン + 別ドメイン3種（**最も分散**） | 配下パス `/accounting/`     | 配下パス `/expense/`                            | 別ドメイン `bakuraku.jp` + 配下パス `/expense/` | **バニティドメイン → 配下パスへ301** | 単一ドメイン2枚            |

## C. 「同一トーン・色相違い」の成立度（計算値サマリ）

| グループ                                    | 色相レンジ           | L\* レンジ              | 判定                           |
| ------------------------------------------- | -------------------- | ----------------------- | ------------------------------ |
| バクラク（`-60` 採用の7プロダクト）         | 58°〜292°（全周）    | **49.5〜57.0（幅7.5）** | **成立している**               |
| バクラク（全11プロダクト、`-70`/生hex含む） | 58°〜327°            | 35.3〜57.0（幅21.7）    | ランプ位置を外すと崩れる       |
| ラクス（10製品）                            | 40°〜318°            | 22.4〜65.6（幅43.2）    | 成立していない                 |
| Sansanグループ（4サイト）                   | 265°〜298°（青のみ） | 21.9〜47.1（幅25.1）    | 成立していない（色相のみ近い） |

---

# 「アクセント色相だけ変えて他を固定する」戦略の妥当性

依頼元の方針は「neutral・書体・余白リズム・形状は共通、アクセント色相と視覚デバイスだけブランドごとに変える」。
これを**実測ベース**で検証する。

## 一致するもの

### 1. バクラク（LayerX）は、この方針をほぼそのまま実装している唯一の実例 [実測]

`bakuraku.jp` のLPテーマは、

- 共通: `--neutral-*` / `--smoke-*`（ニュートラル）、`--font-family-jp/en` + `--font-size-*` `--line-height-*` `--letter-spacing-*`（書体）、`--spacing_*` `--section-spacing-*` `--inner-main-pc`（余白リズム）、`--radius_*`（形状）
- 可変: プロダクトごとの10段ランプ + `--color-bg-product-*` / `--color-text-product-*` / `--color-button-product-*` という**抽象スロット**
- 切替: プロダクトLPごとに **800バイト程度のCSS 1枚**がスロットを差し替えるだけ

という構造。**依頼元が検討している「CSS変数によるテーマ契約」と設計思想が一致している。**
しかも `--color-bg-product-*` という命名は、依頼元の想定する「テーマ契約」そのもの。

### 2. 「同一トーン・色相違い」は、実現可能であることが数値で確認できた [計算]

バクラクは全プロダクトのランプを **5/10/20/30/40/50/60/70/80/90 の同一刻み**で作り、
primary を原則 `-60` に固定している。
その結果、**色相が58°〜292°と全周に散っているのに L\* は 49.5〜57.0（幅7.5）に収まる。**
「トーンを固定して色相だけ回す」は、**ランプ構造を先に決めれば機械的に達成できる**ことの実証。

### 3. 「視覚デバイスだけ変える」も実例がある [実測]

バクラクの共通ヘッダー `common.css` は、13プロダクト分の
`--c-service-label-bg-color: var(--brand-color-<product>-primary)` を持つ。
**1つのヘッダーコンポーネントの中で、サービスラベルのチップ色だけがブランド色として振る舞う。**

### 4. ニュートラルの共通化は、色を変える会社ほど徹底している [実測]

- ラクス（10製品色）: `--color-gray-50〜700` を**完全な純グレー**で全サイト共有
- バクラク（13プロダクト色）: `--neutral-*`（純）と `--smoke-*`（青み）の2系統を全プロダクト共有

→ **「アクセントを振るなら、ニュートラルは絶対に固定する」という運用が、実際に色を振っている2社で共通して観察された。**
依頼元の方針の中核部分は、実態に裏付けられている。

## 一致しないもの / 注意すべきもの

### 5. **6社中4社は、そもそもプロダクト間でアクセントを変えていない** [実測]

freee（`#2864F0`）、マネーフォワード（`#0054AC`）、SmartHR（`#00C4CC`）は、
**全プロダクトサイトで単一のプライマリを貫いている。**
特にマネーフォワードは、プロダクトごとにCSSバンドルを分けているにもかかわらず
`#0054ac` `#d6d8e0` `#f2f5ff` `#2d344b` の出現順位が6バンドルで完全一致するという徹底ぶり。

→ **「国内コンパウンドスタートアップの主流は、色相を振らないこと」。**
色相を振っているのはバクラクとラクスの2社で、**どちらも「10製品以上を1シリーズに束ねている」ケース**。
**3ブランド（Polastack / ピアデスク / コーポレート）という規模で色相を振る必然性は、他社実態からは導けない** [推測]。

### 6. 「書体は共通」が成り立っていない会社が複数ある [実測]

依頼元は書体を共通側に置いているが、実測では

- **ラクス**: コーポレート Noto Sans JP + Roboto ↔ 製品LP **IBM Plex Sans JP**
- **SmartHR**: コーポレート Noto Sans JP + Heebo ↔ プロダクト紹介 **游ゴシック + Roboto**
- **Sansan**: コーポレート Avenir ↔ プロダクト sofia-pro
- **LayerX**: 和文は Noto Sans JP 共通だが欧文は Montserrat / Inter / grandam

書体が完全一致していたのは **freee とマネーフォワードだけ**。
→ **「書体共通」は理想としては正しいが、コーポレートサイトはブランド表現の都合で先に別書体へ動きがちという実態がある** [推測]。
Polastack/ピアデスク/コーポレートを1つのシステムで支えるなら、
**書体を「固定」と宣言する前に、コーポレートサイト側が将来別書体を要求してこないかを確認しておくべき** [推測]。

### 7. 「同一トーン」は放っておくと必ず崩れる [実測]

バクラクですら、

- `clm.css` は**トークンを経由せず生hex**（`#A35EA1` `#7A3B7A` `#541454` `#FFDBFF`）を直書き
- `attendance.css` と `ar-management.css` に **`--color-product-10: var(--docissue-10)` というコピペ残り**（自プロダクトと無関係なランプを参照）
- primary のランプ位置が `-60` と `-70` で混在し、L\* が 38.5〜57.0 にばらける

→ **テーマ契約を作っただけでは守られない。**
依頼元のリポジトリが既に `tokens.test.ts` で TS定数とCSS変数の突き合わせを自動検証しているのは、
**この失敗モードに対する正しい対処**にあたる [推測]。
加えて「**ブランド色は必ずランプの同じ段から採る**」という制約をテストで縛れれば、
バクラクが取りこぼしている部分をカバーできる [推測]。

### 8. アクセント色をそのまま操作色に使うとコントラストが破綻する [計算]

- バクラクの `-60` 系7色の白地コントラストは **3.50:1〜4.57:1** で、7色中4色が WCAG AA (4.5:1) 未満
- ラクスは `#F08300`（2.64:1）から `#172A88`（12.19:1）まで**5倍近い開き**
- SmartHR の `#00C4CC` は **2.15:1** で、テキストにはまったく使えない

→ **色相を振るなら、「装飾用の色相」と「操作用の色」を分離しないと必ずAA不適合が出る。**
SmartHR が Webサイトで `#00C4CC`(2.15:1) を使いつつ、
プロダクトUI側では別途 `#0077c7` を操作色として持っている（**プロダクトUI由来のため参考情報**）のは、この分離の一例。
**依頼元が既に `primary`（操作用・`#008575`・4.55:1）と `brand`（装飾用・`#13c3a0`・2.25:1）を分けている設計は、
本調査で観察された各社の失敗パターンを先回りして回避できている** [推測]。

### 9. ドメイン構造は「共通デザインシステム」とは独立の判断 [実測]

- 配下パス型: freee `/accounting/`、マネーフォワード `/expense/`
- バニティドメイン→配下パス301: ラクス（`rakurakuseisan.jp` → `rakus.co.jp/rakurakucloud/seisan/`）
- 別ドメイン: LayerX（`bakuraku.jp` / `getaiworkforce.com`）、Sansan（4サイトすべて別）

**別ドメインでも共通デザインシステムは成立する（バクラク）し、
同一ドメインでも共通化されないことはあり得る**。
→ **ドメインをどうするかは、デザインシステムの共通化方針とは切り離して決めてよい** [推測]。

## 総括（事実ベース）

| 依頼元の方針                             | 実態との一致                               | 根拠                                                                                                 |
| ---------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| ニュートラルを共通化する                 | **一致する**                               | 色相を振っているラクス・バクラクの両社が、純グレー/2系統グレーを全サイト共有 [実測]                  |
| 余白リズム・形状を共通化する             | **一致する（ただし実例はバクラクのみ）**   | `--spacing_*` `--radius_*` `--section-spacing-*` を明示的にトークン化しているのはバクラクだけ [実測] |
| 書体を共通化する                         | **半分しか一致しない**                     | 6社中、コーポレートとプロダクトで書体が完全一致したのは freee とマネーフォワードのみ [実測]          |
| アクセント色相だけをブランドごとに変える | **主流ではない。ただし採るなら手本がある** | 6社中4社は単一アクセント。振っているのは10製品以上を束ねるバクラク・ラクスのみ [実測]                |
| 「同一トーンで色相違い」にする           | **技術的に成立する。バクラクが実証済み**   | `-60` 固定の7色で色相58〜292°・L\*幅7.5 [計算]。ただしラクスは幅43.2で成立せず                       |
| 視覚デバイスだけブランドごとに変える     | **一致する**                               | バクラク共通ヘッダーのサービスラベルチップ色が13プロダクト分定義されている [実測]                    |

**最大の論点は「3ブランドで色相を振る必要が本当にあるか」。**
実測上、色相を振る運用が観察されたのは**プロダクトが10個以上あり、シリーズ内で製品を識別させる必要がある**ケースのみだった。
Polastack / ピアデスク / コーポレートという3つの単位は、
**freee・マネーフォワード・SmartHR が採っている「単一アクセント + ニュートラル/書体/レイアウト共通」型のほうが実態に近い** [推測]。
色相を振る設計を採るのであれば、バクラクの3層構造（骨格トークン → プロダクトランプ → 抽象スロット）が
唯一まねる価値のある実装であり、同時にその**破れ方（生hex直書き・コピペ残り・ランプ位置の混在）も併せて観察しておくべき**である。
