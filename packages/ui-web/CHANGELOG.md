# @polastack/gtm-design-system

## 0.16.0

### Minor Changes

- c7a347f: 顔になるページの面をニュートラルグレーからブランドティント淡色（白 50% + ramp-50）へ変更し、`<Page>` に面の割当口を2つ追加した。

  - `surfaces`: スロットごとの明示割当。LP 系（product / product-portfolio-top / lead-gen）は機械的な交互をやめ、白の連続の中に社会的証明の塊だけがティントで浮かぶ配置になる
  - `autoSurface`: 自動割当が沈んだ面に使う色。`corporate-top` は交互リズムを保ったまま色だけティントになる（既定は従来どおり `muted`）

  事例系・記事系・獲得系のページ型は従来のニュートラルの自動ゼブラのまま。既定の見た目は変わらない。

  tokens 側はティント面のコントラスト期待値（全4ブランド × 白 / CTABand 面 / 本文）をテストに追加。

### Patch Changes

- c7a347f: 沈んだ面の上でカード・フォーム部品が背景と同じ色になる不具合を修正した。

  `<Page>` の面スロットは `--color-surface` を再定義して面を塗るため、スロットの内側で自分の背景に `--color-surface` を使っていた部品（ServicePortfolio / FeatureGrid / PricingCard / CaseStudyCard / TestimonialSection / SecurityBadges / ComparisonTable / MigrationComparison / Pagination / ShareButtons / フォーム部品 / SelectField / ProductShot / MarketingButton の secondary）が面と同色になり、浮いて見えなかった。浮く面のための `--color-surface-raised` に統一した（`.bgDark` が両方を暗い値へ振り替えているため暗面でも正しく効く）。

  ニュートラルの muted 面でも起きていた（カードが `#f4f4f5` になる）が、面がほぼ白のため目視で気づきにくかった。同じ誤りを二度作らないよう、`css-modules-contract.test.ts` に「スロット内の部品は `--color-surface` を背景に使わない」検査を追加した。

- Updated dependencies [c7a347f]
  - @siracusahq/tokens@0.3.1

## 0.15.0

### Minor Changes

- 32256c2: ContentHub（LP 末尾のコンテンツ回遊セクション）を追加した

  製品系 LP の **9/13** が末尾に資料・セミナー・コラム・News の回遊を持つ（実ブラウザ計測 16ページ。`packages/ui-web/docs/content-hub-workorder.md` §9）。遷移先のページ型は 0.13.0 / 0.14.0 で揃っていたが、入口が無かった。

  **追加した部品**

  - `ContentHubSection` — 系統ごとの枠を縦に積むセクション。枠は判別ユニオン（`resource` / `seminar` / `article` / `news` / `index`）
  - `ContentHubTile`（型）— 入口タイル。個票ではなく**一覧ページへ**飛ぶ大型カード（実測 n=6 / 5社）

  **ページ型への統合（非破壊）**

  `product` / `product-portfolio-top` に任意スロット `contentHub` を追加した。FAQ（product）/ 事例（portfolio-top）の後・締めの前に入る（実測 11/11 が最終CTAの前）。**スロットを渡さない既存の呼び出しは出力が変わらない**（テストで固定）。ページ型は 11 種のまま増えていない。

  **実測が事前イメージを覆した点**

  - **複数系統を1グリッドに混ぜ、種別バッジで区別する形は実在しなかった**（0/11）。実測は「系統ごとに塊を作る」。種別ラベル自体も 0/17
  - **News だけ表示形が構造的に違う**（サムネイル 0/7・日付 7/7）。語彙は `ArticleListItem` を共有し、表示だけ枠の `kind` で分けている
  - **事例（`case`）はハブに現れない**（0/17）ため union から外した。`sold-out` 0/29 と同じ扱いで、union へのメンバー追加は非破壊なので実測が出れば足せる
  - タブ・フィルタは作らない（0/11 ページ・0/17 枠）。絞り込みは一覧ページ型の仕事

  **Slice 0 の決定を1点改めた**

  「ContentHub は4系統のカードを union で受け取る」を「3系統 + News + 入口タイル」に改めた。Slice 0 はハブ未計測時の決定で、記録自身が欠測を留保していた。経緯は `docs/composition-redesign.md` 末尾と `docs/content-hub-workorder.md` §9-3 に記録。

  **`[LP]` の分母を訂正**

  「コンテンツ回遊 9/12」は分母を再現できず、正しくは **9/13**。設計判断への影響は無い（どちらも「多数が保有・ただし必須ではない」）。

## 0.14.0

### Minor Changes

- af31066: 獲得系ページ型 `resources-library` / `seminar-list` / `seminar-detail` を追加した（ページ型 8種 → 11種）

  資料ライブラリとセミナーの一覧・詳細。実測は `docs/research/research-resources-seminar.md`（資料 7ページ + 6個票 / セミナー 8ページ + 21本）と、実装前に通したゲート計測（`packages/ui-web/docs/acquisition-pages-workorder.md` §9）。

  **追加した部品**

  - `ResourceListSection` / `ResourceCard` — 資料ライブラリ。**日付もページャも持たない**（実測 日付 0/7・無限スクロール 0/31）
  - `SeminarListSection` / `SeminarCard` — セミナー一覧。予定・終了・アーカイブを1つの一覧で扱う（実測 0/8 が分けていない）
  - `SeminarDetailSection` — セミナー詳細。概要 / おすすめ / プログラム / 開催要項 / 登壇者 / 申込フォーム

  **`status` で持てる情報が変わる**

  `SeminarDetailSection` と `SeminarListItem` は `status: 'upcoming' | 'closed' | 'archive'` の判別ユニオン。**アーカイブに開催日時は、開催予定に視聴期限は型として存在しない。** 全部 optional の1型にすると「開催日時の無い開催予定」「視聴期限のある LIVE」が型で許されてしまうため。

  `sold-out`（満席・実測 0/29）と `permanent`（常設・1/21）は型に含めていないが、判別ユニオンへの値追加は非破壊なので根拠が出れば後から足せる。

  **`lead-gen` に `header?` を戻した（非破壊）**

  資料個票のページ型は新設していない。`lead-gen` との差分がグローバルナビ1点だけで、実測は資料個票 6/6 がナビを持つため。**省略時に剥がす既定は据え置き**で、既存の呼び出しは1つも変わらない（テストで固定してある）。

  **共有語彙の決定（Slice 0）**

  `ContentImage` / `ContentPerson` を追加した。**カードは統合していない** — 事例 / 記事 / 資料 / セミナーは必須項目が違い、1型に寄せると全部 optional になって「日付の無い記事」「状態の無いセミナー」が型で通ってしまうため。詳細は `docs/composition-redesign.md` 末尾「共有語彙の決定」。

  これに伴い `article-pages-workorder.md` §2 の「ContentHub のカード語彙を `ArticleListItem` に合わせる」は撤回した（獲得系のカードは日付を持たないため寄せられない）。ContentHub は4系統のカードを union で受け取る設計になる。

  **状態を色だけで区別しない**

  「受付中」と「受付終了」を色相だけで分けると色覚特性によっては判別できないため、状態バッジは文言を必ず併記する。

  **規範の更新**

  - GUIDELINES §2 に `resources-library` / `seminar-list` / `seminar-detail` の節を追加
  - AGENTS.md / GUIDELINES.md の語彙をページ型11種に更新

## 0.13.0

### Minor Changes

- d99167e: 記事系ページ型 `article-list` / `article-detail` を追加した（ページ型 6種 → 8種）

  お知らせ（News）とブログの一覧・記事ページ。実測は `docs/research/research-news-blog.md`（7サイト / News 12記事 + ブログ 15記事）と、実装前に通したゲート計測（`packages/ui-web/docs/article-pages-workorder.md` §9-1）。

  **追加した部品**

  - `ArticleListSection` — フィルタ（カテゴリ / 年）+ カードグリッド + ページ送り。値が2種類以上ある軸だけ自動でフィルタを出す
  - `ArticleCard` / `ArticleListItem` — 記事カード。意匠は `CaseCard` と揃え、語彙は分けている（会社名・数値バッジを持たない）。**一覧・関連記事・ContentHub がこの1つの型を共有する**
  - `ArticleBodySection` / `ArticleRelatedSection` — 記事本体と関連記事
  - `ShareButtons` — X / Facebook / はてブ / LINE / Pocket

  **`kind` で News とブログを分ける**

  `ArticleBodySection` は `kind: 'news' | 'blog'` の判別ユニオン。**News には著者・監修者・目次・更新日が型として存在しない**（実測 0/12）。両方 optional の1型にすると「著者と目次を持つ News」という実測に無い構成が型で許されてしまうため。

  **日付は ISO で受ける**

  `publishedAt` は `YYYY-MM-DD` で渡す。表示書式（`YYYY.MM.DD`）はシステムが決める — 実測が4通りに割れており、利用側に選ばせる根拠が無い。`Intl` を使わないのは意図的で、SSG でロケールに依存すると「書いたとおりに出る」性質が失われるため。

  **必須にしていないもの**

  末尾 CTA（News 7/12・ブログ 11/15）と一覧への戻り導線（News 10/12・ブログ 11/15）は任意。事例記事はどちらも 27/27 で必須だったが、記事系は実測が違う。

  **読み幅は事例記事と共有する**

  実ブラウザ計測（19本 / 7サイト）でブログ中央値 690px / News 780px / 全体 730px。現行 `46.5rem`（744px）との差は 1.9% で、種別ごとに割らず1つに保つ判断をした。ブログが実測レンジの狭い側にいる事実は作業指示書に記録してある。

  **規範の更新**

  - GUIDELINES §2 に `article-list` / `article-detail` の節を追加
  - AGENTS.md / GUIDELINES.md の語彙をページ型8種に更新

## 0.12.0

### Minor Changes

- 5021d7c: コーポレートサイトの下層ページ向けに5部品を追加し、フォームに項目拡張の口を開けた

  **破壊的変更（0.x の minor に含む）**

  - `ContactForm` / `ResourceRequestForm` / `DemoRequestForm` の `ichisanEnabled` の既定値を `true` → `false` に変更した。外部スクリプト（ichisan.jp）を読み込む＝送信先が1つ増える判断であり、利用側が明示的に行うべきものと整理したため。**これまで既定のまま使っていた場合、会社名からの住所・法人番号の自動補完が静かに停止する。** 継続したい場合は `ichisanEnabled` を明示的に渡すこと。

  **追加した部品**

  - `ProseSection` — 箇条書きに割れない文章（ミッション・代表挨拶）のためのセクション。段落の寸法は `CaseStudyArticleSection` と共有する
  - `DocumentArticle` — **法務文書・404 の器**。Markdown 由来の本文を受け、読み幅 46.5rem / 本文 16px・行間 1.80 / 章見出し 26px という事例記事の実測値をそのまま使う。**Markdown → HTML の変換は同梱しない**（依存を増やさないため、変換は利用側の責務）。お知らせ・ブログの記事は `article-detail` ページ型の担当なので、記事固有の語彙は持たせていない
  - `CompanyProfileSection` — 会社概要表
  - `LeadershipSection` — 経営陣。カードの意匠は `CaseCard` と揃える
  - `HistorySection` — 沿革。縦の導線は引かず、節点だけを置く
  - `FormCheckbox` — 同意チェック等の真偽値入力。OS 標準の見た目を使わず、`FormInput` と同じ線・角丸・フォーカスリングで描く

  **フォームの拡張**

  - `inquiryTypes`（問い合わせ種別・`ContactForm` のみ）/ `phone`（電話番号）/ `consent`（個人情報同意）を props として追加した。`consent` は未チェックでは送信できない
  - `extraFields` で任意の項目を追加できるようにした。**開いているのは「項目」であって「見た目」ではない** — 受け取るのはデータだけで、描画は DS のフォーム部品に固定される（`className`・`children`・カスタムレンダラは無い）。組み込み項目と `name` が衝突すると dev 警告が出る

  **規範の更新**

  - GUIDELINES §3 に、散文規則の適用範囲（説明セクションが対象で、読み物の面は対象外）を明記した
  - GUIDELINES §4 に、「見た目を選べない」と「内容を足せない」は別であることを追記した
  - dev 警告が 9 種 → 11 種になった

  **内部の共通化**

  - ページ送りを `sections/pagination/` に切り出した。描画結果は変えていない。`article-list` ページ型（article-pages-workorder.md Slice 1）が同じものを必要とするため、先に共有可能な形にしてある

## 0.11.0

### Minor Changes

- 2f12719: 個別事例記事のページ型 `case-study-detail` を追加（実測 9 サイト × 3 記事 = 27 記事）

  - `CaseStudyArticleSection`: パンくず → 記事タイトル（h1）→ 会社プロフィール → ヒーロー写真 → 冒頭サマリー → 章、という実測の標準構成を1部品として持つ。章は地の文（`paragraphs`）と問答（`qa`）のどちらか、写真は1章1枚まで
  - パターン `case-study-detail`: 記事本体 + 関連事例 + 末尾 CTA。tone 既定は `product`
  - `CaseStudyMeta` を新設し、一覧カード（`CaseStudyListItem`）と記事のプロフィールが同じ型を共有する。一覧カードの実装（`CaseCard`）も一覧と関連事例で共有するよう切り出した（見た目の二重実装を作らない）
  - 実測に無いものは作っていない: 冒頭の数値タイル（0/27）・引用の飾り枠（0/27）・目次（2/9）・章ごとの面の交替（本文は 9/9 が単一面）

## 0.10.0

### Minor Changes

- 2cd50fb: AirPocketFeature の文章構造を再設計（ビジュアル微修正 #5）。散文の段落スロット（description）を廃止し、要点の箇条書き `points`（最大3点のタプル型）と証拠の数値 `proof: { value, label }`（大きく表示）に分解。散文は見出し1文だけになり、この規範を GUIDELINES にも追加。
- e88e22b: 事例カードにインタビュー写真スロットを追加（ビジュアル微修正 #6）。CaseStudySection / CaseStudyListSection の両方に `photo?: { src, alt }`（alt 必須・16:9 固定・トリミング自動）。未指定なら従来どおりの描画で後方互換。GUIDELINES に「事例には写真・写真つきは引用短く」の規範を追加。
- ea4d843: セクション見出しの区切りを実測に基づき再設計（ビジュアル微修正 #1）。既定は見出し下のブランド色飾り線（72×5px・自動）になり、Eyebrow はピル形を廃止して素テキスト（18px/700・700段色）の opt-in に変更。旧ピル形は国内実測 0/41 で「CTA の肩コピー」の記号と衝突しており、沈んだ面でのラベル文字 3.83:1（WCAG AA 不適合）も解消。tokens に 700 段のコントラスト検査を追加。あわせて HeroSection の badge prop を削除（対象読者バッジはヒーロー実測 0/13。国内のヒーロー内ピル型ラベル4件はすべて CTA の肩コピーで、コンテンツラベルの実例なし）。

### Patch Changes

- 1f7c58e: CodeBlock のウィンドウ枠とコード面で背景色が割れていた不具合を修正（ビジュアル微修正 #7）。shiki がテーマ背景（github-dark #24292e）をインライン style で焼き込みクラス指定の打ち消しに勝っていたため、!important で透過させ --color-neutral-950 の1色に統一。
- a141001: MarketingHeader / MarketingFooter のクリック可能要素のホバー色をブランド色（700段 = text-brand-strong）に変更（ビジュアル微修正 #4）。キーボードフォーカス（:focus-visible）にも同じフィードバックを追加。旧挙動は中立色の濃色化で、操作可能のフィードバックが弱かった。
- 8417eb4: 面リズムの知覚性を改善（ビジュアル微修正 #3）。muted 面を #fafafa（白との対比 1.044:1・国内実測の最薄側）から #f4f4f5（1.099:1・実測9サイトの中央値相当）へ変更。CorporateTop の参照実装を Page（リズムエンジン）配下に修正——白背景が4セクション連続していた原因は、Page 導入前の直置き構成が残っていたこと。
- b20ff0c: Storybook を正式版として整理: Stage 2 の内部進捗ページ（移行ステータス）を削除、内部用語のストーリー名（検証関門・リズム確認・正規化の確認）を利用者向けに改名、AJAX 送信デモを alert から実運用の型（結果をその場に表示）へ書き換え、削除済み BentoGrid への言及2箇所を修正。

## 0.9.0

### Minor Changes

- 2b9a75e: AI エージェント向けの規範ファイルを配布物に同梱（Stage 6 Slice 0）

  - `AGENTS.md` — 入口。導入1行・語彙（ブランド4 / トーン3 / ページ型5）・組み方2択・Astro の注意
  - `GUIDELINES.md` — Do's & Don'ts の正本。ページ型ごとの選び方と素材チェックリスト、
    横断規則（CTA / 面と余白 / ロゴと数値 / フォーム / 色 / 和文）、選べない理由、
    型と dev 警告が守っていることの一覧。すべてのルールに実測の根拠つき

  `node_modules/@siracusahq/gtm-design-system/AGENTS.md` を読ませる導線を README（日英）に追加した。
  併せて、ページ型を実行時に列挙できる `LANDING_PAGE_PATTERNS` を公開する。

## 0.8.0

### Minor Changes

- ab5af15: Stage 5 Slice 1: dev 警告の拡充と、警告が実際に出るようになる修正。

  **dev 警告を4種追加**（既存5種と合わせて9種。すべて開発時のみ）

  - `Page`: ページ内に `h1` が2つ以上ある（マウント後に自ルート配下を数える）
  - `LandingPage`: `product` / `product-portfolio-top` で社会的証明スロット（`proof`）が空
    （実測 19/19 のページが数値訴求を持つ）
  - `StatsSection`: 実績数値に時点表記が無い（景品表示法）
  - `LogoCloud`: ロゴが1〜5社（日本語ページに実例0件。少数なら事例カードに紐付ける）

  **新しい prop**

  - `StatsSection` に `asOf?: string`（例: 「※2026年7月末時点」）。数値グリッドの下に
    caption で控えめに表示する。`asOf` も `note` も無いと dev 警告が出る

  **不具合修正**

  - `AnimatedCounter` が `prefers-reduced-motion: reduce` を尊重するようになった。
    OS で動きを止めている環境ではカウントアップせず最終値を即座に表示する
    （rAF による JS 実装のため、CSS のトークン層では止まっていなかった）
  - **dev 警告がブラウザで一度も出ていなかった問題を修正。** `isDev` の
    `typeof process !== 'undefined'` ガードがブラウザで常に false になり、
    Stage 3〜4 で追加した警告がすべて無効化されていた

  `Patterns/規範ガード` に、各警告をコンソールで確認できるデモストーリーを追加。

- 1673934: フォームの言語を決定的に: 既定は日本語、`lang="en"` で英語（ContactForm / ResourceRequestForm / DemoRequestForm）。旧実装はブラウザの document.lang を覗いており、Astro の静的生成では和文ページでもフォームが英語で公開される事故があった。

### Patch Changes

- ab21db5: `LandingPage` が `hero.offers` を DOM 属性として出力していた問題を修正。

  生成 HTML のヒーロー `<section>` に `offers="[object Object],[object Object]"` という
  無効な属性が焼き付いていた（React は未知の props をそのまま属性として出すため）。
  画面上は何も変わらないので目視でも既存テストでも気づけず、Stage 5 Slice 2 で追加した
  Astro 消費側結合テストの生成物検査で発覚した。`offers` は `actions` に変換して渡す
  内部データであり、DOM に出す意図は元から無い。

## 0.7.0

### Minor Changes

- 980b111: 計測フックを追加（Stage 4 Slice 0）。`MarketingButton` / `FormButton` / `PricingCard` に `ctaId` を追加し、指定時に `data-cta` を出力する。id はセクションが自動割当するため呼び出し側は命名不要（ヘッダー `header-${i}` / FV `hero-${i}` / 中間帯 `cta-band-${i}` / 料金 `pricing-${i}` / 締め `closing-${i}` / フォーム送信 `form-submit`）。`Page` と `LandingPage` に `onCTAClick` を追加し、ページ内の CTA クリックを `{ id, label, href }` として一括で受け取れるようにした（capture フェーズのクリック委譲）。フォーム3種に `onResult` を追加し、指定時は Netlify Forms の AJAX 仕様（URL エンコード・`form-name` 同梱）で fetch 送信して成功/失敗を返す。既存の `onSubmit` / `action` / ネイティブ POST の挙動は変えていない。計測タグ（GA4 / GTM 等）は同梱しない。
- bfc1e66: 追従 CTA 2部品を追加（Stage 4 Slice 1）

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

- db9926c: FV の CTA 本数規範と送信ボタンラベル規範を追加（Stage 4 Slice 2）。HeroSection は CTA 3本以上で dev 警告、defineLandingPage の offers は最大2本のタプル型（3本目は型エラー）。フォームに submitLabel を追加し、ContactForm の既定を「問い合わせる」に変更（汎用の「送信する」は dev 警告対象）。

## 0.6.0

### Minor Changes

- bc21562: `<Page brand tone>` を追加（Stage 3 Slice 0）。ページが面リズム（default ↔ muted の交互割当・暗面3連続の dev 警告）とトーン軸（trust / product / campaign の余白スケール）を割り当てる。セクションは面を選ばない設計へ正規化（ServicePortfolio / SecurityBadges の自己 muted を廃止）。
- ff65393: CTA 規範と CTABand を追加（Stage 3 Slice 1）。CTABand はセクション区切りに繰り返し置くコンバージョン帯（淡いブランド面）。Page 配下ではプライマリ CTA（variant="cta"）のラベルが3種類以上になると dev 警告を出す（ラベルは2種類まで・反復は自由、LP 実測に基づく規範）。
- 1659f97: defineLandingPage() と LandingPage を追加（Stage 3 Slice 2）。LP 量産のデータ駆動 API。パターン4種（product / product-portfolio-top / lead-gen / corporate-top）が実測に基づく構成（順序・リズム・CTA 配置・トーン既定）を決め、呼び出し側は内容だけを渡す。必須スロットの欠落は型エラーで落ちる。
- 069ceb3: `CaseStudyListSection` と `case-study-list` パターンを追加（Stage 3 Slice 3）。事例一覧ページの実測形（SmartHR `/case/`・バクラク `/case/` の 2/2）をそのまま部品にした: 短いページタイトル + ピックアップ + 多軸フィルタ（サービス / 業種 / 従業員規模 / 課題。軸間 AND、選択肢はデータから自動生成）+ カードグリッド + ページネーション。UI 語彙は `labels` で差し替えできる。状態は内部 useState のみで URL とは同期しないため、静的サイトに置く場合はクライアントでの hydration が必要。

### Patch Changes

- 6085fb1: README を Stage 3 完了時点の実態に同期（削除済み BentoGrid の記載を除去、defineLandingPage / Page の使い方を追加、コンポーネント一覧と技術スタックを現状に更新）。

## 0.5.0

### Minor Changes

- 592ede3: Stage 1 後半: 和文タイポグラフィの修正と意匠トークンの拡張。

  **gtm-design-system**

  - 和文組版を `:lang(ja)` に一本化（`<html lang="ja">` が前提）:
    `line-break: strict` / `text-spacing-trim: space-all` / `overflow-wrap: break-word` /
    見出しの `palt` が body の `cv01/cv03/cv04/tnum` を上書きするバグを修正
    （数値訴求の等幅数字を保持）/ 見出し `text-wrap: balance`・本文 `pretty`
  - **和文ガード**（@layer 外）: 和文見出しの負の字送りを構造的に無効化し、
    行間を 1.35/1.45 に補正（国内BtoB 8社実測: 負の字送り0社・見出し行間1.3〜1.4収束）
  - デッドコード `.lang-ja` / `.lang-en` を削除
  - 2層シャドウ `raised / card / card-hover / overlay` を追加（LPカード用・neutral由来の影色）
  - 役割名ラディウス `control / media / card / panel / pill` を追加
  - 演出系モーション `--duration-reveal(640ms) / --duration-ambient(1200ms)` と
    `--ease-entrance / exit / emphasis` を追加。`prefers-reduced-motion` はトークン層で一括処理
  - `AnimateOnScroll` のハードコード（600ms / ease-out）を演出系トークンに置換

  **tokens**

  - 第3のオプション役割 `--color-cta-*` を追加（既定は操作色への var() フォールバック。
    data-brand 切替に自動追従）

- 635b68f: Stage 2 Slice 1: コーポレートトップ用プリミティブ8個を CSS Modules + テーマ契約スロットへ移行し、新規2個を追加した。

  - 移行: Container / Section / Heading / Text / MarketingButton / Badge / Link / Logo。
    色参照はすべて抽象スロット（data-brand に自動追従）
  - 新規: `Eyebrow`（旧 Text overline 7種の後継・pill 1形）/ `LogoMark`（ロゴ表示の正規化）
  - `MarketingButton` に `cta` バリアント追加（`--color-cta-*` 第3役割）。
    `gradient` は cta へのエイリアスとして @deprecated
  - Heading に和文 per-size 組版（:lang(ja) で行間 1.30〜1.45・字送り0）を実装
  - tokens: スロット `--color-text-brand-strong`（700段）を契約に追加

- 0fd58d2: Stage 2 Slice 2+3: コーポレートトップを構成するセクション・レイアウトを移行し、検証関門を通過した。

  - 移行: HeroSection / StatsSection / SecurityBadges / CTASection /
    MarketingHeader / MarketingFooter / PageLayout（CSS Modules + スロット参照）
  - 新規: `ServicePortfolio`（product-portfolio-top 型の主役。カードが data-brand で
    各ブランド色に切り替わる）/ SectionHeader（内部共有）
  - **破壊的**: 削除 — `background` / `spacing` / `eyebrowStyle`（対象セクション）、
    `HeroSection` の `titleGradient` / `backgroundPattern` / `layout`（→ `imagePlacement`）、
    `CTASection` の `backgroundMesh` / `logoStrip`、`StatsSection.animated`、
    `actions[].variant`（自動割当: Hero=primary/secondary、CTA=cta/secondary）
  - 追加: `CTASection.kicker` / `StatsSection.note`（時点注記）/
    `SecurityBadge.category`（認証・受賞・法定表示の3系統）
  - Storybook: `Examples/CorporateTop`（検証関門の実ページ）

- 3224c7b: Stage 2 Slice 4a: ビジュアル資産プリミティブ3種を追加した。

  - `MediaFrame` — 固定アスペクト比（16:9/4:3/3:2/1:1）のメディアスロット。
    素材未定時はプレースホルダを表示（構造を先に組める）
  - `ProductShot` — プロダクト画面専用。ブラウザ枠/枠なし・下端フェード・
    影と角丸は常に同一処理。傾き・パースは提供しない（実測8社で0件）
  - `Avatar` — 1:1 円形固定。イニシャルフォールバック
  - `HeroSection.image` を MediaFrame/ProductShot 要素のみに型制約
  - `MarketingButton.fullWidth` 追加（ヘッダーの inline style を置換）

- 8150432: Stage 2 Slice 4b: 未移行の全コンポーネントを CSS Modules + テーマ契約スロットへ移行した。
  **破壊的変更を含む**（見た目を選ばせる props の削除）。

  移行したもの:

  - プリミティブ5件 — Grid / Divider / GradientText / AnimatedCounter / AnimateOnScroll
  - セクション13件 — FeatureGrid / FeatureShowcase / BentoGrid / ComparisonTable /
    TestimonialSection / LogoCloud / CaseStudySection / FAQSection /
    PricingTable / PricingCard / CodeBlock / ModuleOverview /
    MigrationComparison / AirPocketFeature

  削除した props（面と余白はページが割り当てる / 見た目は構造から導出する）:

  - 全セクション共通: `background` / `spacing` / `eyebrowStyle`
  - `FeatureGrid`: `cardStyle` / `columns`（列数は件数から導出）
  - `TestimonialSection` / `CaseStudySection`: `columns`（同上）
  - `BentoGrid`: `BentoItem.variant`（強調は1件目に固定）
  - `LogoCloud`: `scrolling`（8件以上で自動スクロール）
  - `CodeBlock`: `alignment` / `layout`（`description` の有無から導出）
  - `PricingCard`: `action.variant`（常に `cta`）
  - `Text`: overline 系 7 バリアント（`Eyebrow` へ完全移行）
  - `MarketingButton`: `gradient`（`cta` へ移行）
  - `pricingCardVariants` の公開

  型が変わったもの:

  - `ShowcaseItem.image` → `MediaFrame` / `ProductShot` 要素のみ
  - `Testimonial.avatar: ReactNode` → `avatarSrc?: string`（Avatar を内部生成）
  - `Testimonial.companyLogo` / `CaseStudy.companyLogo` → `LogoMark` 要素のみ
  - `LogoItem.logo: ReactNode` → `{ name, src?, node? }`（内部で `LogoMark` に包む）

  追加:

  - `PricingCard.priceUnit`（「/月」等の単位スロット）
  - `AirPocketFeature.ownName` / `ownStatus`（ハードコード文言の追い出し）

- e8c510e: Stage 2 Slice 5: フォームを Netlify Forms 標準にし、BentoGrid を削除した。

  - **Formspree を完全削除**（ブランド側決定。ホスティングが Netlify に一本化済み）。
    フォーム3種は `data-netlify` / `form-name` / honeypot を標準で描画し、
    Netlify に置くだけで送信が機能する。`formName` / `action`（サンクスページ）/
    独自バックエンド用の `onSubmit` を提供。`formspreeId` / 送信状態UIは削除
  - フォーム3種とプリミティブを CSS Modules へ移行（送信ボタンは CTA 第3役割）。
    `autocomplete` / `inputmode` を標準付与（入力摩擦の削減）
  - **BentoGrid を削除**（国内BtoB実測19ページで採用ゼロ・FeatureGrid 等と役割重複）。
    海外 dev-tool 向け展開が現実になった時点で、当該セグメントの調査を踏まえ再設計する

- ac88531: Stage 2 Slice 6: 公開 API から `className` を全廃した（破壊的変更）。

  - プリミティブ8種（Container / Section / Text / Grid / Divider / GradientText /
    AnimatedCounter / AnimateOnScroll）に暫定存置していた `@deprecated className` を削除
  - `React.HTMLAttributes` 等の継承経由で `className` を型受容していた穴を全数塞いだ。
    全公開インターフェースを `Omit<…, 'className'>` に統一（sections 18 / layout 3 /
    primitives 12 / form 4）。消費側からの見た目の上書き口はこれで完全に閉じた
  - 内部でプリミティブへ `className` を渡していた14箇所は、意匠を持つラッパー要素へ
    移した（余白・読み幅・太字はラッパー、文字の役割は Text/Heading の props）。
    DOM 出力は同一で、見た目は変わらない
  - 一酸フォームの会社名オートコンプリートは class 名でしか指定できないため、
    `FormInput` に列挙で閉じた `autofillKey`（値は `'company_name'` のみ）を追加した

- ac88531: 配布をコンパイル済み単一 CSS に切り替え、公開 API から className を全廃（Stage 2 Slice 6）。セットアップは `import '@siracusahq/gtm-design-system/styles.css'` の1行になり、Tailwind と `@source` の設定は不要（旧 `./globals.css` / `./theme.css` export は削除）。全公開インターフェースから `className` を除去（イチサンフォーム連携は `FormInput.autofillKey` で維持）。
- 56ac3f1: マルチブランドのテーマ契約（Stage 1・追加のみ / 非破壊）を導入した。

  **tokens**: OKLCH ベースのランプ生成器・ブランドレジストリ・抽象スロット契約を追加。
  4ブランドを初期登録した — corporate（現行ティール explicit・300段は #13c3a0）/
  polastack（H265・deep型 #3d5eaf）/ peerdesk（濃鼠 #4a464e・額縁戦略）/
  peerdesk-taxpeer（千歳緑 #2F6847 既存3色維持）。
  codegen が `css/brand.css` にランプ実体（`--ramp-*`）と抽象スロット
  （`--color-bg-brand-primary` 等14種 + `--shadow-glow-brand`）を出力し、
  `data-brand` 属性でブランドを切り替えられる。
  新エクスポート: `generateRamp` / `registry` / `resolveAllBrands` / `SLOTS` / 色計算ユーティリティ。

  **gtm-design-system**: 生成物 `src/styles/generated-brand.css` を同梱し、
  `theme.css` から読み込むようにした。業務システムUI（design-system）には
  意図的に出力しない（装飾色を業務UIに公開しない原則。ui-app は当面コーポレート固定）。
  **既存の `primary-*` / `brand-*` 変数・エクスポートは一切変更していない**（スロットは併存）。
  コンポーネントのスロット移行は次段階で行う。

### Patch Changes

- 7426843: Polastack のブランドカラーを濃紺に改定した（ブランド決定 2026-08-04）。

  - 操作色: `#3d5eaf`（C×1.35 / L 0.50）→ **`#2f4989`**（C×1.10 / L 0.42、白文字 8.62:1）
  - ネイビー地: 950 `#121c33` / 900 `#202e4e`
  - 「青っぽすぎる」という評価を受け、彩度を保ち明度を沈めた「存在感のある落ち着いた濃紺」へ
  - 生成ブランドの操作段 L 帯の下限を 0.50 → 0.42 に拡大（契約改定）

  レジストリの数値変更のみで、コンポーネント・スロット構造への変更はない。

- 1167462: Stage 2 Slice 0: CSS Modules 移行基盤を導入した。

  - `*.module.css.d.ts` 自動生成（クラス名の typo / リネームを型エラー化）
  - stylelint 検問所（生 hex / 名前色 / `--ramp-*` 直参照を禁止）
  - 契約テスト（`var()` の未定義トークン参照を検出）
  - spacing スケールの CSS 変数実体宣言（`--spacing-0〜24`、TS との同期テスト付き）
  - Container を CSS Modules へ移行（パイプラインの end-to-end 実証。見た目は不変）

- Updated dependencies [7426843]
- Updated dependencies [592ede3]
- Updated dependencies [635b68f]
- Updated dependencies [56ac3f1]
  - @siracusahq/tokens@0.3.0

## 0.4.0

### Minor Changes

- dd97e7c: npm スコープを `@polastack/*` から `@siracusahq/*` へ変更した。

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

### Patch Changes

- 7e20989: README 記載の Storybook URL を新サイト名 `siracusa-design-system.netlify.app` に更新した
  （Netlify サイト改名に伴う変更。旧 URL `polastack-design-system.netlify.app` は改名時点で無効になる）。
- Updated dependencies [dd97e7c]
  - @siracusahq/tokens@0.2.0

## 0.3.0

### Minor Changes

- 6bd6f27: tree-shaking を修正し、使わない依存を配布物から外した。

  ## 効果（利用者が実際に配信するサイズ）

  | import                                       |   変更前 |      変更後 |
  | -------------------------------------------- | -------: | ----------: |
  | `Button` のみ                                | 137.0 kB |  **8.2 kB** |
  | `Button/Input/Card/Dialog/Select/Toast/Tabs` | 137.0 kB | **40.2 kB** |
  | `DataTable` のみ                             | 137.0 kB | **48.6 kB** |
  | `MarketingButton` のみ（Web/LP）             |  20.8 kB |  **8.2 kB** |

  ## 何が起きていたか

  tsup が全コンポーネントを1つの `dist/index.js` に固めていたため、
  トップレベルの `cva()` / `forwardRef()` 呼び出しをバンドラが副作用ありと判断し、
  未使用コードを落とせなかった。結果として **`Button` を1つ使うだけで
  全70コンポーネント分（137kB）が配信されていた。**

  コンポーネント単位のエントリ + `splitting: true` に変更し、
  `dist/index.js` を薄い再エクスポート（298kB → 7.6kB）にした。
  公開 API・エクスポート名・型定義は一切変えていない。

  ## 依存関係の整理（破壊的変更を含む）

  ライブラリのコードから一度も import されていない依存が
  `dependencies` に入っており、利用者全員がインストールしていた。

  - `@polastack/design-system`: **`recharts` を削除**（8.4MB）。
    `ChartContainer` は枠を描くだけ、`chartColors` は CSS 変数名を返すだけで、
    どちらも recharts に依存していない。チャート本体は利用者が自分で組む設計のため、
    optional な `peerDependencies` に移した
  - `@polastack/gtm-design-system`: **`spectacle` を optional peerDependency に変更**（5.8MB）。
    `/slides` サブパスでしか使わない。README は以前から
    「スライドコンポーネントを使用する場合 `pnpm add spectacle`」と案内しており、
    package.json の分類だけが設計意図とズレていた

  **`@polastack/gtm-design-system/slides` を使っている場合は、
  `pnpm add spectacle` を明示的に実行する必要がある。**

  ## サイズ計測の改善

  `pnpm size` が「全エクスポートを一度に import した場合」しか測っておらず、
  上記の tree-shaking 破綻を検知できていなかった。
  利用者の使い方ごとの計測枠を追加し、特に「単一コンポーネントのみ」の枠を
  tree-shaking の番人として置いた。

### Patch Changes

- 6bd6f27: README にセットアップ手順を追記した。

  Tailwind CSS v4 は既定で `node_modules` を走査しないため、利用側の CSS に
  `@source '../node_modules/@polastack/gtm-design-system/dist'` の指定が必要である。
  指定が無い場合、コンポーネントはエラーを出さずに**無スタイルでレンダリングされる**
  （実測: `@source` なしで出力CSS 9.15 kB / 生成ユーティリティ0件、ありで 67.8 kB / 全件）。

  あわせて、Web フォント（Inter / Noto Sans JP / JetBrains Mono）が配布物に含まれておらず、
  利用側での読み込みが必要である点を明記した。

## 0.2.0

### Minor Changes

- fb77d6b: デザイントークンの正本を `@polastack/tokens` に一本化した。

  両パッケージの `src/tokens/*.ts` は値を複製せず、`@polastack/tokens` を再エクスポートし、
  パッケージ固有の拡張（業務UIの `fontSize` / `shadows.drawer` / `zIndex`、
  Web/LPの `fontSize` / `sectionSpacing` / `gradients` / グロー / `breakpoints`）だけを重ねる。

  ## @polastack/gtm-design-system（Web/LP）: 色が変わります

  プライマリカラーが `#13c3a0` → `#008575` に変わり、**WCAG AA 適合**になった。
  `#13c3a0` は白文字との対比が 2.25:1 しかなく、`MarketingButton` の
  `bg-primary-500 !text-white` は AA（4.5:1）を満たしていなかった。新しい 500 は 4.55:1。

  彩度の高い旧トーンは装飾用の **`brand` スケール**として残している。
  グラデーション・グロー・ダーク背景アクセントは `brand-*` を使うこと。
  `text-brand-*` と `bg-brand-500` 以上は AA を満たさないため使用禁止（テストが検出する）。

  - `MarketingButton variant="gradient"` は `from-primary-600 to-primary-500` に変更。
    旧実装の `to-primary-400` は白文字 3.0:1 で AA 未達だった
  - `Divider variant="brand"`、BentoGrid の featured 背景、`.gradient-border` は `brand-*` へ
  - semantic カラー（success / warning / error / info）を業務UIと同値に修正し、全シェードを CSS に展開
  - `globals.css` が `theme.css` を丸ごと複製していたのをやめ、`@import` に一本化

  ## @polastack/design-system（業務システムUI）

  色の見た目は変わらない。以下が修正・追加。

  - `zIndex` 定数が実際に出力される CSS（`--z-index-*`、3層体系）とズレていたのを修正。
    旧: `dropdown: 50, sticky: 100, ...` → 新: `sticky: 10, drawer: 1100, modal: 1200, ...`
  - `--color-neutral-850` / `--radius-3xl` / `--duration-slower` を CSS に追加（基盤スケールと揃えた）
  - `fontWeight` に `extrabold`、`radii` に `3xl` が追加

  ## 両パッケージ共通

  TS定数とCSS変数のズレを検出するテストを追加した（`src/tokens/tokens.test.ts`）。
  jsdom 上の axe-core は色計算ができずコントラスト違反を検出できないため、
  `@polastack/tokens` 側で WCAG のコントラスト比を実際に計算して固定している。
