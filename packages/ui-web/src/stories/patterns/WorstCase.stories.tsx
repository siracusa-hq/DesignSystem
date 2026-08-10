import type { Meta, StoryObj } from '@storybook/react';
import { defineLandingPage, LandingPage, type OfferPair } from '../../patterns';

/**
 * 和文の最悪ケース（Stage 5 Slice 0）。
 *
 * AI が書く和文コピーは長さが暴れる。「見出しが3行に折り返してヒーローが崩れる」
 * 「カードの説明文が1行しかなくて高さが揃わない」型の事故は、
 * 適度な長さのサンプルだけを見ていると最後まで表面化しない。
 *
 * そこで**実務で起こりうる最長級**と**極端に短い**の2極をページ単位で固定し、
 * VRT（`pnpm vrt`）の基準スナップショットに含める。英語側は
 * Patterns/LandingPage の `English_Product_Polastack` が担当する。
 *
 * このストーリーは目視カタログではなく**回帰検知の入力**である。
 * 文言を変えると基準 PNG が変わるため、意図した見た目の変更のときだけ
 * `pnpm vrt:update` で基準を更新すること。
 */
const meta = {
  title: 'Patterns/WorstCase',
  component: LandingPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 長文側のオファー。CTA ラベルも実務で見かける最長級にする */
const longOffers: OfferPair = [
  { label: '導入検討用の詳細資料をダウンロードする', href: '#dl' },
  { label: '料金プランと初期費用の目安を見る', href: '#pricing' },
];

/**
 * 最長級の和文。見出し 40 字超・句読点あり・カード文言も2〜3行に折り返す長さ。
 *
 * ここで見えるべきもの:
 * - Heading の和文行送り（`:lang(ja)` の line-break: strict / palt）が効き、
 *   行頭に句読点が来ないこと
 * - subtitle の clauseWrap（`Text clauseWrap`）が読点・句点でしか折らないこと
 * - 見出しが折り返してもヒーローの CTA 位置とフッターまでの面リズムが崩れないこと
 */
export const 最悪ケース_長文和文: Story = {
  args: defineLandingPage({
    pattern: 'product',
    brand: 'peerdesk-taxpeer',
    header: {
      logo: <strong>タックスピア 経理業務プラットフォーム</strong>,
      navItems: [
        { label: '機能と対応業務の一覧', href: '#features' },
        { label: '料金プランと初期費用', href: '#pricing' },
        { label: '業種別の導入事例と成果', href: '#cases' },
      ],
      actions: [{ label: '導入検討用の詳細資料をダウンロードする', href: '#dl' }],
    },
    hero: {
      title:
        '複数拠点にまたがる紙とExcelの申請業務を、監査に耐えられる形でひとつに束ね、月次決算の締めを最短化します。',
      subtitle:
        'タックスピアは、税理士事務所と顧問先企業のあいだで発生する書類の受け渡し、内容の確認、差し戻し、そして再提出の催促までを一本の流れとして扱うクラウドサービスです。担当者ごとに違っていた進め方を揃えることで、繁忙期でも回収状況が誰の目にも同じように見えるようになります。',
      offers: longOffers,
    },
    proof: {
      stats: {
        stats: [
          {
            value: '1,842',
            suffix: '事務所',
            label: '全国の税理士事務所・会計事務所での導入実績',
            numericValue: 1842,
          },
          {
            value: '92',
            suffix: '%',
            label: '期限内に書類が回収できた顧問先の割合（導入6か月後）',
            numericValue: 92,
          },
          {
            value: '3',
            suffix: '日',
            label: '契約から全顧問先の利用開始までにかかった平均日数',
            numericValue: 3,
          },
        ],
        /* 時点（asOf）と出典（note）は別スロット。両方入れた最長級のケース */
        asOf: '※2026年6月末時点',
        note: '当社調べ（導入事務所へのアンケート回答 412 件の集計による。回答率 34.6%）。',
      },
    },
    features: {
      eyebrow: 'Features',
      title:
        '「まだ出ていない書類を、誰が、いつ、どうやって催促するのか」を人が覚えておく必要をなくします。',
      features: [
        {
          title: '期日から逆算して自動で送られるリマインドと、エスカレーションの段階設定',
          description:
            '提出期限から逆算した日程で、未提出の顧問先にだけ通知が届きます。反応がない場合は担当者、さらに所長へと通知先を段階的に広げられるため、催促の判断を人が抱え込まなくて済みます。',
        },
        {
          title: '全顧問先の提出状況が一枚で見える進捗ボード',
          description:
            '誰がどこまで出しているのかを、事務所の全員が同じ画面で確認できます。電話やチャットで状況を聞いて回る時間がなくなります。',
        },
        {
          title: '顧問先側は専用アプリのインストールが不要',
          description:
            '顧問先はメールに届いたリンクを開き、スマートフォンで書類を撮影してそのまま送るだけです。ITに不慣れな担当者でも、説明なしで最後まで進めます。',
        },
      ],
    },
    midCta: {
      title: 'まずは、導入前後で業務がどう変わるかをまとめた資料からご覧ください。',
      note: '無料・入力は1分で完了します',
    },
    pricing: {
      eyebrow: 'Pricing',
      title: '顧問先数と必要な機能にあわせて選べる、わかりやすい2つの料金プラン',
      plans: [
        {
          name: 'スタンダードプラン（中小規模の事務所向け）',
          price: '¥30,000',
          priceUnit: '/月（税抜）',
          features: [
            { text: '顧問先の登録は 100 件まで。超過分は 10 件単位で追加できます', included: true },
            { text: '期日から逆算した自動リマインドとエスカレーション設定', included: true },
            { text: '会計ソフトとのデータ連携（オプション扱い）', included: false },
          ],
          action: { label: '導入検討用の詳細資料をダウンロードする', href: '#dl' },
        },
        {
          name: 'プロフェッショナルプラン（多拠点・大規模事務所向け）',
          price: '¥50,000',
          priceUnit: '/月（税抜）',
          highlighted: true,
          features: [
            { text: '顧問先の登録数は無制限。拠点をまたいだ権限設定にも対応', included: true },
            { text: '主要な会計ソフトとの双方向データ連携', included: true },
            { text: '導入時の初期設定を専任担当が代行します', included: true },
          ],
          action: { label: '導入検討用の詳細資料をダウンロードする', href: '#dl' },
        },
      ],
    },
    cases: {
      eyebrow: 'Case Study',
      title: '繁忙期の回収率と、催促にかけていた時間がどう変わったのか',
      cases: [
        {
          companyName: '税理士法人あさひ会計事務所（従業員 120 名・全国 6 拠点）',
          quote:
            '1月から3月の繁忙期でも、書類の回収率が9割を超えた状態を保てています。以前は担当者がそれぞれのやり方で電話をかけていましたが、いまはボードを見れば残りが分かるので、催促のための電話がほぼゼロになりました。',
          metrics: [
            { label: '期限内回収率（繁忙期）', value: '92%' },
            { label: '催促にかけていた時間', value: '-80%' },
          ],
        },
      ],
    },
    faq: {
      title: '導入をご検討の段階でよくいただくご質問',
      items: [
        {
          question:
            '顧問先の企業側にも利用料金が発生しますか。契約書の取り交わしは必要になりますか。',
          answer:
            '顧問先の企業側に費用は一切かかりません。契約はご契約いただく事務所様とのみ取り交わすため、顧問先ごとの手続きは不要です。顧問先はメールのリンクから、そのままご利用いただけます。',
        },
        {
          question: '契約してから実際に全顧問先が使い始めるまで、どのくらいの期間がかかりますか。',
          answer:
            '平均は3日です。顧問先リストの取り込みと通知テンプレートの初期設定は、当社の導入担当が代行しますので、事務所様側の作業は内容の確認だけで完了します。',
        },
      ],
    },
    closing: {
      kicker: '＼導入前後の業務の変化を、5分で読める資料にまとめました／',
      title: 'まずは、導入検討用の詳細資料からご覧ください。',
      socialProof: '全国 1,842 の税理士事務所・会計事務所にご利用いただいています',
    },
  }),
};

/** 極短側のオファー。ラベル4字 */
const shortOffers: OfferPair = [
  { label: '資料請求', href: '#dl' },
  { label: '料金', href: '#pricing' },
];

/**
 * 極端に短い和文。見出し4字・説明6字など、全スロットが最短。
 *
 * ここで見えるべきもの:
 * - カードの高さが揃うこと（説明文が1行でもグリッドが崩れない）
 * - ヒーローが痩せすぎて面のリズムが破綻しないこと
 * - 料金カードの機能リストが短くても2枚のカード高さが揃うこと
 */
export const 最悪ケース_極短: Story = {
  args: defineLandingPage({
    pattern: 'product',
    brand: 'peerdesk-taxpeer',
    header: {
      logo: <strong>税務</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: '料金', href: '#pricing' },
        { label: '事例', href: '#cases' },
      ],
      actions: [{ label: '資料請求', href: '#dl' }],
    },
    hero: {
      title: '書類、集まる。',
      subtitle: '追わない回収。',
      offers: shortOffers,
    },
    proof: {
      stats: {
        stats: [
          { value: '800', suffix: '件', label: '導入', numericValue: 800 },
          { value: '92', suffix: '%', label: '回収率', numericValue: 92 },
          { value: '3', suffix: '日', label: '導入', numericValue: 3 },
        ],
        /* 極短側の時点表記 */
        asOf: '26年7月時点',
      },
    },
    features: {
      eyebrow: 'Features',
      title: '3つの軸',
      features: [
        { title: '自動催促', description: '期日で送る。' },
        { title: '進捗表', description: '一枚で見る。' },
        { title: 'アプリ不要', description: '撮って送る。' },
      ],
    },
    midCta: { title: '資料はこちら', note: '無料' },
    pricing: {
      eyebrow: 'Pricing',
      title: '料金',
      plans: [
        {
          name: '標準',
          price: '¥30,000',
          priceUnit: '/月',
          features: [
            { text: '100件', included: true },
            { text: '自動催促', included: true },
          ],
          action: { label: '資料請求', href: '#dl' },
        },
        {
          name: '上位',
          price: '¥50,000',
          priceUnit: '/月',
          highlighted: true,
          features: [
            { text: '無制限', included: true },
            { text: '連携', included: true },
          ],
          action: { label: '資料請求', href: '#dl' },
        },
      ],
    },
    cases: {
      eyebrow: 'Case Study',
      title: '事例',
      cases: [
        {
          companyName: '甲会計',
          quote: '楽になった。',
          metrics: [
            { label: '回収率', value: '92%' },
            { label: '時間', value: '-80%' },
          ],
        },
      ],
    },
    faq: {
      title: 'FAQ',
      items: [
        { question: '費用は?', answer: '無料です。' },
        { question: '期間は?', answer: '3日です。' },
      ],
    },
    closing: {
      kicker: '＼無料／',
      title: '資料請求',
      socialProof: '800件',
    },
  }),
};
