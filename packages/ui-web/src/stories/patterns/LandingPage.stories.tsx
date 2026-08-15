import type { Meta, StoryObj } from '@storybook/react';
import { defineLandingPage, LandingPage, type OfferPair } from '../../patterns';
import { ResourceRequestForm } from '../../components/sections/form';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * defineLandingPage — LP 量産のデータ駆動 API（Stage 3 Slice 2）。
 *
 * AI の仕事は「デザインする」ことではなく「フォームを埋める」こと。
 * セクションの順序（実測12ページの最大公約数）・面と余白のリズム・
 * CTA の配置とラベルの再利用は、すべてパターンが決める。
 * 必須スロットの欠落は型エラーで落ちる。
 */
const meta = {
  title: 'Patterns/LandingPage',
  component: LandingPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof LandingPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const offers: OfferPair = [
  { label: '資料をダウンロード', href: '#dl' },
  { label: '料金を見る', href: '#pricing' },
];

/** 単一製品 LP（実測最多の型）。順序: Hero → 証明 → 機能 → 帯 → 料金 → 事例 → FAQ → 締め */
export const 製品LP_タックスピア: Story = {
  args: defineLandingPage({
    pattern: 'product',
    brand: 'peerdesk-taxpeer',
    header: {
      logo: <strong>タックスピア</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: '料金', href: '#pricing' },
        { label: '導入事例', href: '#cases' },
      ],
      actions: [{ label: '資料をダウンロード', href: '#dl' }],
    },
    hero: {
      title: '税務書類の収集を、追いかけずに終わらせる。',
      subtitle:
        'タックスピアは、税理士事務所と顧問先をつなぐ書類収集ツールです。未提出の催促も、進捗の確認も、自動で回ります。',
      offers,
    },
    proof: {
      stats: {
        stats: [
          { value: '800', suffix: '事務所', label: '導入実績', numericValue: 800 },
          { value: '92', suffix: '%', label: '期限内回収率', numericValue: 92 },
          { value: '3', suffix: '日', label: '平均導入期間', numericValue: 3 },
        ],
        /* 実績数値には基準時点が要る（景表法。未指定だと dev 警告） */
        asOf: '※2026年7月末時点',
      },
    },
    features: {
      eyebrow: 'Features',
      title: '書類回収の「催促する仕事」をなくす',
      features: [
        {
          title: '自動リマインド',
          description: '未提出の顧問先に、期日から逆算して自動で催促します。',
        },
        { title: '進捗ボード', description: '全顧問先の提出状況が一枚のボードで見えます。' },
        {
          title: '顧問先アプリ不要',
          description: '顧問先はメールのリンクから撮影・アップロードするだけ。',
        },
      ],
    },
    midCta: { title: 'まずは資料からご覧ください', note: '無料・1分で完了' },
    pricing: {
      eyebrow: 'Pricing',
      title: '料金プラン',
      plans: [
        {
          name: 'スタンダード',
          price: '¥30,000',
          priceUnit: '/月',
          features: [
            { text: '顧問先 100件まで', included: true },
            { text: '自動リマインド', included: true },
          ],
          action: { label: '資料をダウンロード', href: '#dl' },
        },
        {
          name: 'プロフェッショナル',
          price: '¥50,000',
          priceUnit: '/月',
          highlighted: true,
          features: [
            { text: '顧問先 無制限', included: true },
            { text: '会計ソフト連携', included: true },
          ],
          action: { label: '資料をダウンロード', href: '#dl' },
        },
      ],
    },
    cases: {
      eyebrow: 'Case Study',
      title: '導入事例',
      cases: [
        {
          companyName: 'サンプル会計事務所',
          photo: {
            src: photoPlaceholder('インタビュー写真', 'green'),
            alt: '所長が事務所で提出状況ボードを確認する様子（プレースホルダ）',
          },
          quote:
            '1月の繁忙期でも、書類の回収率が9割を超えました。電話での催促がほぼゼロになっています。',
          metrics: [
            { label: '回収率', value: '92%' },
            { label: '催促時間', value: '-80%' },
          ],
        },
      ],
    },
    faq: {
      title: 'よくある質問',
      items: [
        {
          question: '顧問先にも費用がかかりますか?',
          answer: 'かかりません。顧問先は無料でご利用いただけます。',
        },
        {
          question: '導入までどのくらいかかりますか?',
          answer: '平均3日です。初期設定は導入担当が代行します。',
        },
      ],
    },
    closing: {
      kicker: '＼5分でわかる資料をプレゼント／',
      title: 'まずは資料からご覧ください',
      socialProof: '800事務所が利用中',
    },
  }),
};

/**
 * トーンはパターン既定を上書きできる（ブランド軸と直交）。
 * 同じ製品 LP でも campaign トーンでは全セクションの余白が1段詰まり、
 * ファーストビューに入る情報量が増える。製品LP_タックスピア と見比べること。
 */
export const 製品LP_campaignトーン: Story = {
  args: { ...製品LP_タックスピア.args, tone: 'campaign' },
};

/** コンパウンド企業の玄関（実測 7/19 で最重要の型）。カードグリッドで下層 LP へ分岐 */
export const ポートフォリオトップ_ピアデスク: Story = {
  args: defineLandingPage({
    pattern: 'product-portfolio-top',
    brand: 'peerdesk',
    hero: {
      title: '管理部門の定型業務を、シリーズでなくす。',
      subtitle: 'ピアデスクは、非IT企業の管理部門のための業務効率化シリーズです。',
      offers: [
        { label: '資料をダウンロード', href: '#dl' },
        { label: '導入の相談をする', href: '#contact' },
      ],
    },
    proof: {
      stats: {
        stats: [
          { value: '1,200', suffix: '社', label: '導入企業', numericValue: 1200 },
          { value: '98', suffix: '%', label: '継続率', numericValue: 98 },
        ],
        asOf: '※2026年7月末時点',
      },
    },
    products: {
      eyebrow: 'Products',
      title: 'シリーズ製品',
      services: [
        {
          brand: 'peerdesk-taxpeer',
          name: 'タックスピア',
          tagline: '税務書類の収集',
          description: '税理士事務所と顧問先をつなぐ書類収集ツール。',
          href: '#taxpeer',
        },
        {
          brand: 'peerdesk',
          name: 'ピアデスク 経費',
          tagline: '経費精算の自動化',
          description: '紙の領収書をその日のうちにデータに。',
          href: '#expense',
        },
      ],
    },
    midCta: { title: 'シリーズまとめて資料でご覧いただけます', note: '無料・1分で完了' },
    cases: {
      title: '導入事例',
      cases: [
        {
          companyName: '株式会社サンプル製作所',
          photo: {
            src: photoPlaceholder('インタビュー写真', 'sand'),
            alt: '経理担当者が工場事務所で作業する様子（プレースホルダ）',
          },
          quote:
            '月末の残業がなくなりました。紙の山と格闘していた時間が、まるごと戻ってきた感覚です。',
        },
      ],
    },
    closing: {
      title: 'まずは資料からご覧ください',
      socialProof: '1,200社が利用中',
    },
  }),
};

/** 獲得専用 LP。グローバルナビなし（実測 2/2）・締めはフォーム・campaign トーン既定 */
export const 獲得LP_資料ダウンロード: Story = {
  args: defineLandingPage({
    pattern: 'lead-gen',
    brand: 'peerdesk',
    hero: {
      title: '5分でわかる、ピアデスク。',
      subtitle: '管理部門の業務がどう変わるかを、導入前後の実例でまとめた資料を無料配布中です。',
    },
    contents: {
      title: '資料の内容',
      features: [
        { title: '機能一覧と画面例', description: '全機能の概要をスクリーンショット付きで。' },
        { title: '導入前後の比較', description: '月次業務の時間がどう変わったか、実例で。' },
        { title: '料金と導入の流れ', description: '見積りの前に全体感がつかめます。' },
      ],
    },
    stats: {
      stats: [
        { value: '1,200', suffix: '社', label: '導入企業', numericValue: 1200 },
        { value: '3', suffix: '日', label: '平均導入期間', numericValue: 3 },
      ],
      asOf: '※2026年7月末時点',
    },
    form: <ResourceRequestForm title="資料請求フォーム" />,
  }),
};

/** コーポレートトップ（ビジョン型・trust トーン既定）。コンバージョン CTA を持たない */
export const コーポレートトップ: Story = {
  args: defineLandingPage({
    pattern: 'corporate-top',
    brand: 'corporate',
    hero: {
      title: '確かな業務の、確かな道具を。',
      subtitle: 'シラクサは、企業の業務とAIの間に立つソフトウェアをつくる会社です。',
    },
    services: {
      eyebrow: 'Business',
      title: '事業内容',
      services: [
        {
          brand: 'polastack',
          name: 'Polastack',
          tagline: 'エンタープライズ Agent 基盤',
          description: 'AI エージェントを監査可能なままスケールさせる。',
          href: '#polastack',
        },
        {
          brand: 'peerdesk',
          name: 'ピアデスク シリーズ',
          tagline: '管理部門の業務効率化',
          description: '非IT企業の管理部門のための業務効率化シリーズ。',
          href: '#peerdesk',
        },
      ],
    },
    stats: {
      stats: [
        { value: '2', suffix: '事業', label: 'プロダクトライン', numericValue: 2 },
        { value: '1,200', suffix: '社', label: '取引社数', numericValue: 1200 },
      ],
      asOf: '※2026年7月末時点',
    },
  }),
};

/**
 * 事例一覧ページ（実測 2/2: SmartHR `/case/`、バクラク `/case/`）。
 * この型だけキャッチコピー型ヒーローを持たず、短いページタイトルから始まる。
 * ピックアップ + 多軸フィルタ + カードグリッド + ページネーション。
 */
export const 事例一覧_タックスピア: Story = {
  args: defineLandingPage({
    pattern: 'case-study-list',
    brand: 'peerdesk-taxpeer',
    header: {
      logo: <strong>タックスピア</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: '料金', href: '#pricing' },
        { label: '導入事例', href: '#cases' },
      ],
      actions: [{ label: '資料をダウンロード', href: '#dl' }],
    },
    page: {
      eyebrow: 'Case Studies',
      title: '導入事例',
      description: '業種・規模・課題から、自社に近い事例を探せます。',
    },
    list: {
      pickup: [
        {
          companyName: 'あさひ製作所',
          photo: {
            src: photoPlaceholder('インタビュー写真', 'green'),
            alt: '製造現場の担当者（プレースホルダ）',
          },
          summary:
            '未提出の顧問先を追いかける仕事がなくなり、決算前の残業がゼロになりました。導入から3日で全顧問先が使い始めています。',
          service: 'タックスピア',
          industry: '製造業',
          employeeRange: '51〜300名',
          challenges: ['書類回収', '月次決算'],
          metrics: [{ label: '期限内回収率', value: '98%' }],
          href: '/case/asahi',
        },
      ],
      cases: [
        {
          companyName: 'みなと商事',
          photo: {
            src: photoPlaceholder('インタビュー写真', 'blue'),
            alt: '経理チームの打ち合わせ（プレースホルダ）',
          },
          summary: '紙で回っていた経費精算をやめ、月次決算が5営業日早まりました。',
          service: 'タックスピア',
          industry: '卸売業',
          employeeRange: '1〜50名',
          challenges: ['月次決算'],
          href: '/case/minato',
        },
        {
          companyName: 'そらまめ工業',
          photo: {
            src: photoPlaceholder('インタビュー写真', 'sand'),
            alt: '工場での検品作業（プレースホルダ）',
          },
          summary: '書類の紛失と再依頼がなくなり、問い合わせ対応が半分になりました。',
          service: 'ピアデスク',
          industry: '製造業',
          employeeRange: '301名〜',
          challenges: ['書類回収', '問い合わせ対応'],
          href: '/case/soramame',
        },
        {
          companyName: 'つばき会計事務所',
          summary: '顧問先100社への催促を自動化し、担当1人あたりの受け持ちが1.5倍になりました。',
          service: 'タックスピア',
          industry: '士業',
          employeeRange: '1〜50名',
          challenges: ['書類回収'],
          href: '/case/tsubaki',
        },
        {
          companyName: 'かもめ運輸',
          summary: 'ドライバーからの申請をスマートフォンで完結させました。',
          service: 'ピアデスク',
          industry: '運輸業',
          employeeRange: '51〜300名',
          challenges: ['問い合わせ対応'],
          href: '/case/kamome',
        },
        {
          companyName: 'まつり印刷',
          summary: '請求書の突合を自動化し、経理担当の月末残業が20時間減りました。',
          service: 'タックスピア',
          industry: '印刷業',
          employeeRange: '1〜50名',
          challenges: ['月次決算'],
          href: '/case/matsuri',
        },
        {
          companyName: 'ひまわり調剤',
          summary: '各店舗の提出状況が一覧で見え、本部の確認作業がなくなりました。',
          service: 'ピアデスク',
          industry: '医療・薬局',
          employeeRange: '51〜300名',
          challenges: ['書類回収', '月次決算'],
          href: '/case/himawari',
        },
      ],
      pageSize: 3,
    },
    /* ヒーローが無くオファーの再利用元が無いため、closing の actions は必須 */
    closing: {
      title: '自社に近い事例をお探しですか',
      subtitle: '業種別の導入事例集を無料で配布しています。',
      actions: [
        { label: '資料をダウンロード', href: '#dl' },
        { label: '料金を見る', href: '#pricing' },
      ],
    },
  }),
};

/**
 * 個別の事例記事（実測 9 サイト × 3 記事 = 27 記事）。`事例一覧_タックスピア` の遷移先。
 *
 * 一覧カードと**同じ1件のデータ**からプロフィールを作れるのがこの型の価値
 * （メタ情報の軸は 9/9 サイトで一致）。記事本体は単一の面に置き、
 * 面リズムの対象になるのは 記事本体 / 関連事例 / 締め の3スロットだけ。
 */
export const 事例記事_タックスピア: Story = {
  args: defineLandingPage({
    pattern: 'case-study-detail',
    brand: 'peerdesk-taxpeer',
    header: {
      logo: <strong>タックスピア</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: '料金', href: '#pricing' },
        { label: '導入事例', href: '#cases' },
      ],
      actions: [{ label: '資料をダウンロード', href: '#dl' }],
    },
    article: {
      title: '書類回収の催促がゼロに。決算前の残業が消えた',
      backTo: { label: '導入事例', href: '/case' },
      publishedAt: '2026.07.31',
      photo: {
        src: photoPlaceholder('インタビュー写真', 'green', '1.9:1'),
        alt: 'あさひ製作所の経理部と経営企画室の担当者が事務所で話している様子（プレースホルダ）',
        caption: '左から、経理部 部長 山田 太郎さん、経営企画室 鈴木 花子さん',
      },
      lead: '創業52年の金属加工メーカーであるあさひ製作所は、3年前から月次決算の早期化に取り組んできた。最後まで残った壁が、顧問先ではなく社内の各拠点からの書類回収だったという。',
    },
    profile: {
      companyName: 'あさひ製作所',
      industry: '製造業',
      employeeRange: '51〜300名',
      service: 'タックスピア',
      challenges: ['書類回収', '月次決算'],
    },
    speakers: [
      { name: '山田 太郎', title: 'あさひ製作所 経理部 部長' },
      { name: '鈴木 花子', title: 'あさひ製作所 経営企画室' },
    ],
    summary: {
      challenge: [
        '期日直前の催促に、担当者2名が毎月まる2日を使っていた',
        '提出状況が個人のメモにしかなく、引き継げなかった',
      ],
      reason: ['顧問先にアプリの導入を求めない', '既存の会計ソフトとそのままつながる'],
      effect: ['期限内回収率が98%に', '決算前の残業が月40時間からゼロに'],
    },
    chapters: [
      {
        heading: '期日の3日前から、電話をかけ続けていた',
        paragraphs: [
          '以前は、提出期日の3日前になると経理部の担当者が電話をかけ始めていました。拠点は全国に7つあり、担当者はそれぞれ別の業務を持っています。つながらなければ折り返しを待ち、届いた書類に不備があればもう一度連絡する。回収の作業そのものが、月末の主な仕事になっていました。',
          '提出状況は担当者のノートで管理していたため、休みを取ると誰も進捗が分からなくなる状態でした。',
        ],
      },
      {
        heading: '導入の決め手は「顧問先に何も求めない」ことだった',
        photo: {
          src: photoPlaceholder('提出状況ボード', 'blue', '3:2'),
          alt: '拠点ごとの提出状況が一覧になったボードを画面で確認している様子（プレースホルダ）',
        },
        /* 問答形式の実例（「―― 」はシステムが自動付与する） */
        qa: [
          {
            question: '他のツールとも比較されましたか?',
            answer: [
              '3製品を比較しました。うち2つは提出する側にアプリの導入を求めるもので、拠点の担当者に新しい操作を覚えてもらうのは現実的ではありませんでした。タックスピアはメールのリンクから撮影してアップロードするだけで、こちらの説明が要らなかった。',
            ],
          },
          {
            question: '導入の準備は大変でしたか?',
            answer: ['初期設定は導入担当の方が代行してくれたため、社内の準備は実質1日で終わりました。'],
          },
        ],
      },
      {
        heading: '催促そのものが消え、月40時間の残業がゼロになった',
        paragraphs: [
          '導入後は、期日から逆算した催促が自動で届きます。担当者が電話をかけることはなくなりました。期限内の回収率は導入前の72%から98%へ上がっています。',
          '進捗が一枚のボードで見えるようになったことで、休暇中でも引き継ぎができるようになりました。決算前に発生していた月40時間の残業は、いまはありません。',
        ],
      },
    ],
    /* 関連事例は一覧カードと同じデータ形式（実測 9/9・3件が最頻） */
    related: [
      {
        companyName: 'みなと商事',
        photo: {
          src: photoPlaceholder('インタビュー写真', 'blue'),
          alt: '経理チームの打ち合わせ（プレースホルダ）',
        },
        summary: '紙で回っていた経費精算をやめ、月次決算が5営業日早まりました。',
        service: 'タックスピア',
        industry: '卸売業',
        employeeRange: '1〜50名',
        challenges: ['月次決算'],
        href: '/case/minato',
      },
      {
        companyName: 'そらまめ工業',
        photo: {
          src: photoPlaceholder('インタビュー写真', 'sand'),
          alt: '工場での検品作業（プレースホルダ）',
        },
        summary: '書類の紛失と再依頼がなくなり、問い合わせ対応が半分になりました。',
        service: 'ピアデスク',
        industry: '製造業',
        employeeRange: '301名〜',
        challenges: ['書類回収', '問い合わせ対応'],
        href: '/case/soramame',
      },
      {
        companyName: 'つばき会計事務所',
        summary: '顧問先100社への催促を自動化し、担当1人あたりの受け持ちが1.5倍になりました。',
        service: 'タックスピア',
        industry: '士業',
        employeeRange: '1〜50名',
        challenges: ['書類回収'],
        href: '/case/tsubaki',
      },
    ],
    /* ヒーローが無くオファーの再利用元が無いため、closing の actions は必須 */
    closing: {
      kicker: '＼5分でわかる資料をプレゼント／',
      title: '自社でも同じことができるか、資料でご確認ください',
      actions: [
        { label: '資料をダウンロード', href: '#dl' },
        { label: '導入の相談をする', href: '#contact' },
      ],
      socialProof: '800事務所が利用中',
    },
  }),
};

/**
 * 計測フック（Stage 4 Slice 0）。`onCTAClick` を渡すと、ページ内のすべての CTA の
 * クリックが1つのハンドラに届く（`{ id, label, href }` + 元イベント）。
 *
 * id はセクションが自動割当する: ヘッダー `header-${i}` / FV `hero-${i}` /
 * 中間帯 `cta-band-${i}` / 料金 `pricing-${i}` / 締め `closing-${i}` /
 * フォーム送信 `form-submit`。呼び出し側に命名させないので、どのページでも
 * 同じキーで集計できる。
 *
 * **計測タグ（GA4 / GTM 等）は同梱しない。** ベンダー選択は利用側の決定であり、
 * デザインシステムが決めてはならない。ここで受けたイベントを利用側が自分の基盤へ送る。
 *
 * 下の CTA を押して、Storybook 下部の **Actions** パネルを見ること。
 */
/** English example (product pattern, Polastack) */
export const English_Product_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'product',
    brand: 'polastack',
    hero: {
      title: 'Scale your agent infrastructure, audit-ready.',
      subtitle:
        'Polastack is the enterprise agent stack. Deploy, observe, and govern AI agents without giving up compliance.',
      offers: [
        { label: 'Book a demo', href: '#demo' },
        { label: 'Read the docs', href: '#docs' },
      ],
    },
    /* 社会的証明スロットは product / product-portfolio-top で必須（実測 19/19）。
       ロゴ帯か数値訴求のどちらか。ここは数値訴求 */
    proof: {
      stats: {
        stats: [
          { value: '4,200', suffix: '+', label: 'Agents in production', numericValue: 4200 },
          { value: '99.99', suffix: '%', label: 'Control plane uptime', numericValue: 99.99 },
          { value: '40', suffix: 'ms', label: 'Median policy overhead', numericValue: 40 },
        ],
        asOf: 'As of July 2026',
      },
    },
    features: {
      eyebrow: 'Platform',
      title: 'Everything between your agents and production',
      features: [
        { title: 'Policy engine', description: 'Declarative guardrails enforced at runtime.' },
        { title: 'Audit trail', description: 'Every tool call, logged and searchable.' },
        { title: 'Zero retention', description: 'Your data never persists on our side.' },
      ],
    },
    midCta: { title: 'See Polastack in action', note: 'Free — takes one minute' },
    closing: {
      title: 'Ready to ship agents you can trust?',
    },
  }),
};

/**
 * お知らせ一覧（`article-list` 型）。
 *
 * 事例一覧と同じくヒーローを持たず、短いページタイトルから始まる。
 * 末尾 CTA は**任意**（実測 News 7/12・ブログ 11/15。事例一覧の必須とは違う）。
 */
export const お知らせ一覧_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'article-list',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: '導入事例', href: '#cases' },
        { label: 'お知らせ', href: '#news' },
      ],
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
    page: {
      title: 'お知らせ',
      description: '製品のリリース、プレスリリース、イベント出展などをお知らせします。',
    },
    list: {
      articles: [
        {
          href: '#soc2',
          title: 'Polastack が SOC 2 Type II 報告書を取得しました',
          publishedAt: '2026-07-30',
          category: 'プレスリリース',
          excerpt: 'セキュリティ・可用性・機密保持の3原則を対象に第三者評価を受けました。',
        },
        {
          href: '#audit-log',
          title: 'エージェントの実行ログを監査証跡として書き出せるようになりました',
          publishedAt: '2026-07-14',
          category: '製品アップデート',
          excerpt: '誰の依頼で、どのデータを参照し、何を出力したかを CSV / JSON で取得できます。',
        },
        {
          href: '#expo',
          title: 'Japan IT Week 2026 に出展します（小間番号 E-42）',
          publishedAt: '2026-06-26',
          category: 'イベント',
        },
        {
          href: '#scim',
          title: 'ピアデスクが Microsoft Entra ID の SCIM プロビジョニングに対応しました',
          publishedAt: '2025-12-02',
          category: '製品アップデート',
        },
        {
          href: '#seed',
          title: 'シードラウンドで 2.5億円の資金調達を実施しました',
          publishedAt: '2025-11-11',
          category: 'プレスリリース',
        },
        {
          href: '#launch',
          title: 'エンタープライズ向けエージェント基盤「Polastack」を正式提供開始しました',
          publishedAt: '2025-05-20',
          category: 'プレスリリース',
        },
      ],
    },
  }),
};

/**
 * ブログ記事（`article-detail` 型・`kind: 'blog'`）。
 *
 * 著者・監修者・目次・更新日を持つのはブログだけ（News は型として持たない。実測 0/12）。
 * 読み幅・本文寸法は事例記事と共有する（article-pages-workorder.md §9-1）。
 */
export const ブログ記事_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'article-detail',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: 'ブログ', href: '#blog' },
      ],
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
    article: {
      kind: 'blog',
      title: 'エージェントに社内データを渡すとき、最初に決める3つのこと',
      publishedAt: '2026-07-14',
      updatedAt: '2026-08-01',
      category: '導入の実務',
      backTo: { label: 'ブログ一覧', href: '#blog' },
      photo: {
        src: photoPlaceholder('記事のヒーロー写真', 'blue', '1.9:1'),
        alt: '情報システム部の担当者が権限設計を確認している様子',
        caption: '権限設計は導入初日に決めておくと後戻りが少ない',
      },
      author: {
        name: '立花 直人',
        role: '取締役 CTO',
        bio: 'Polastack のアーキテクチャ全般を担当。',
        photo: { src: photoPlaceholder('Author', 'blue', '1:1'), alt: '執筆者 立花 直人のポートレート' },
      },
      supervisor: { name: '田中 花子', role: '公認情報システム監査人' },
      lead: [
        'エージェントを社内に入れるとき、最初につまずくのは「どのデータをどこまで見せるか」です。技術の話に入る前に決めておくべきことを3つに絞って書きます。',
      ],
      chapters: [
        {
          heading: '1. 参照範囲を人と同じ単位で決める',
          paragraphs: [
            'エージェント専用の権限体系を新しく作ると、退職や異動のたびに二重管理になります。既存のグループやロールをそのまま使い、「その人が見られるものだけをエージェントも見られる」に揃えるのが結局いちばん壊れません。',
            '例外を作りたくなったときは、例外そのものではなく「なぜ既存の権限では足りないのか」を先に確かめてください。',
          ],
        },
        {
          heading: '2. 出力の保存先を先に決める',
          paragraphs: [
            '調べた結果をどこに残すかを決めないまま始めると、成果が個人のチャット履歴に散ります。共有ドライブでも社内 Wiki でも構いませんが、最初に1つ決めてください。',
          ],
          photo: {
            src: photoPlaceholder('運用の様子', 'green', '3:2'),
            alt: '共有ドライブに保存されたエージェントの出力を確認する様子',
          },
        },
        {
          heading: '3. 監査証跡の粒度を合意する',
          paragraphs: [
            '「誰の依頼で・どのデータを参照し・何を出力したか」の3点が残っていれば、後から説明できます。逆にこれが無いと、便利さの割に稟議が通りません。',
          ],
        },
      ],
      share: { url: 'https://example.com/blog/agent-data' },
    },
    related: {
      title: '関連記事',
      articles: [
        {
          href: '#a',
          title: '監査証跡を CSV で書き出す',
          publishedAt: '2026-07-01',
          category: '導入の実務',
        },
        {
          href: '#b',
          title: '情報システム部が最初に聞かれる10の質問',
          publishedAt: '2026-06-10',
          category: '導入の実務',
        },
        {
          href: '#c',
          title: 'SSO と SCIM の設定手順',
          publishedAt: '2026-05-20',
          category: '設定ガイド',
        },
      ],
    },
    closing: {
      title: '導入の相談をする',
      description: '権限設計や監査要件のご相談も承ります。',
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
  }),
};

/**
 * News 記事（`article-detail` 型・`kind: 'news'`）。
 *
 * 著者も目次も持たない（実測 0/12）。末尾 CTA も持たない構成（SmartHR ニュースは 0/3）。
 */
export const お知らせ記事_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'article-detail',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [{ label: 'お知らせ', href: '#news' }],
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
    article: {
      kind: 'news',
      title: 'Polastack が SOC 2 Type II 報告書を取得しました',
      publishedAt: '2026-07-30',
      category: 'プレスリリース',
      backTo: { label: 'お知らせ一覧', href: '#news' },
      lead: [
        '2026年7月30日付で、Polastack の運用体制について SOC 2 Type II の報告書を取得しました。監査対象期間・対象範囲・お客様への影響をお知らせします。',
      ],
      chapters: [
        {
          heading: '取得の概要',
          paragraphs: [
            '今回取得したのは、セキュリティ・可用性・機密保持の3原則を対象とした Type II 報告書です。Type I が「ある時点で統制が設計されているか」を見るのに対し、Type II は一定期間にわたって統制が実際に機能していたかを検証します。',
            '監査対象期間は2025年8月1日から2026年6月30日までの11か月間です。',
          ],
        },
        {
          heading: 'お客様への影響',
          paragraphs: [
            '既存のご契約内容および料金に変更はありません。セキュリティチェックシートへの回答時に、報告書をもって代替いただけるようになります。',
          ],
        },
      ],
      share: { url: 'https://example.com/news/soc2' },
    },
  }),
};

/**
 * 資料ライブラリ（`resources-library` 型）。
 *
 * **日付もページャも持たない**（実測 日付 0/7・無限スクロール 0/31）。
 * 末尾 CTA も持たない — 資料そのものがオファーであり、
 * フォームの手前で他ページへ逃がさないのが獲得系の設計。
 */
export const 資料ライブラリ_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'resources-library',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: '資料', href: '#resources' },
      ],
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
    page: {
      title: 'お役立ち資料',
      description: '導入の検討から運用まで、実務で使える資料を配布しています。',
    },
    list: {
      resources: [
        {
          href: '#dl1',
          title: 'エージェント導入チェックリスト（全24項目）',
          category: '導入の実務',
          description: '権限設計・監査証跡・保存先の3点を、稟議前に確認できる形にまとめました。',
          cover: { src: photoPlaceholder('導入チェックリスト', 'blue'), alt: '導入チェックリストの表紙' },
          badge: '新着',
        },
        {
          href: '#dl2',
          title: 'Polastack 導入事例集 2026',
          category: '事例',
          description: '製造・小売・金融の6社の導入前後を掲載。',
          cover: { src: photoPlaceholder('導入事例集', 'green'), alt: '導入事例集の表紙' },
        },
        {
          href: '#dl3',
          title: 'セキュリティホワイトペーパー',
          category: 'セキュリティ',
          description: 'SOC 2 Type II の対象範囲と、データの取り扱いを説明します。',
          cover: { src: photoPlaceholder('セキュリティ', 'sand'), alt: 'セキュリティ資料の表紙' },
        },
        {
          href: '#dl4',
          title: '投資対効果の考え方',
          category: '導入の実務',
          cover: { src: photoPlaceholder('投資対効果', 'blue'), alt: '投資対効果資料の表紙' },
        },
        {
          href: '#dl5',
          title: '情報システム部が最初に聞かれる10の質問',
          category: '導入の実務',
          cover: { src: photoPlaceholder('よくある質問', 'green'), alt: 'よくある質問資料の表紙' },
        },
        {
          href: '#dl6',
          title: 'エージェント基盤の選び方',
          category: '比較検討',
          cover: { src: photoPlaceholder('選び方', 'sand'), alt: '選び方資料の表紙' },
        },
      ],
    },
  }),
};

/**
 * 資料個票（`lead-gen` 型 + `header`）。
 *
 * **資料個票のページ型は新設していない。** `lead-gen` との差分がグローバルナビ 1点だけで、
 * 実測は資料個票 6/6 がナビを持つ。`header` を渡せるようにして兼ねている。
 */
export const 資料個票_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'lead-gen',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: '資料', href: '#resources' },
      ],
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
    hero: {
      title: 'エージェント導入チェックリスト（全24項目）',
      subtitle: '権限設計・監査証跡・保存先の3点を、稟議前に確認できる形にまとめました。',
    },
    contents: {
      title: 'この資料でわかること',
      features: [
        { title: '権限設計の決め方', description: '既存のロールに揃えるべき理由と、例外を作る前の確認事項。' },
        { title: '監査証跡の粒度', description: '「誰の依頼で・どのデータを・何を出力したか」の残し方。' },
        { title: '出力の保存先', description: '成果が個人のチャット履歴に散らないための運用。' },
      ],
    },
    form: (
      <ResourceRequestForm
        title="資料をダウンロード"
        resourceName="agent-checklist-2026"
        submitLabel="資料をダウンロード"
        consent={{ href: '#privacy' }}
        ichisanEnabled={false}
      />
    ),
  }),
};

/** セミナー一覧（`seminar-list` 型）。開催予定 → アーカイブ → 終了 の順に積む */
export const セミナー一覧_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'seminar-list',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [{ label: 'セミナー', href: '#seminar' }],
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
    page: {
      title: 'セミナー',
      description: '現場の実務に落とせる内容だけを扱います。参加費は無料です。',
    },
    list: {
      seminars: [
        {
          status: 'upcoming',
          href: '#s1',
          title: '現場の紙運用を、どこから置き換えるか',
          startAt: '2026-09-10T14:00',
          format: 'online',
          thumbnail: { src: photoPlaceholder('セミナー告知', 'blue'), alt: '現場DXセミナーの告知画像' },
        },
        {
          status: 'upcoming',
          href: '#s2',
          title: '監査対応の勘所 — エージェントの実行ログをどう残すか',
          startAt: '2026-09-24T15:00',
          format: 'venue',
          thumbnail: { src: photoPlaceholder('セミナー告知', 'green'), alt: '監査対応セミナーの告知画像' },
        },
        {
          status: 'archive',
          href: '#s3',
          title: '権限設計の実務（アーカイブ配信）',
          viewableUntil: '2026-12-31',
          format: 'online',
          thumbnail: { src: photoPlaceholder('アーカイブ', 'sand'), alt: '権限設計セミナーの告知画像' },
        },
        {
          status: 'closed',
          href: '#s4',
          title: '生成AI導入の落とし穴',
          startAt: '2026-07-02T13:00',
          format: 'online',
          thumbnail: { src: photoPlaceholder('終了', 'blue'), alt: '生成AIセミナーの告知画像' },
        },
      ],
    },
  }),
};

/**
 * セミナー詳細（`seminar-detail` 型・`status: 'upcoming'`）。
 *
 * 1セクションで完結し、**フォーム自体が締めになる**（末尾 CTA・関連コンテンツ・
 * SNS シェアはいずれも持たない。実測 0/21）。
 */
export const セミナー詳細_Polastack: Story = {
  args: defineLandingPage({
    pattern: 'seminar-detail',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [{ label: 'セミナー', href: '#seminar' }],
      actions: [{ label: 'お問い合わせ', href: '#contact' }],
    },
    seminar: {
      status: 'upcoming',
      startAt: '2026-09-10T14:00',
      format: 'online',
      title: '現場の紙運用を、どこから置き換えるか',
      photo: {
        src: photoPlaceholder('セミナー告知', 'blue', '1.9:1'),
        alt: '工場の現場で点検表を確認している様子',
      },
      overview: [
        '紙の点検表をそのままデジタル化しても、現場の手間は減りません。どの帳票から着手するとよいかを、3社の実例をもとに解説します。',
      ],
      recommended: [
        '製造業・食品業の情報システム部の方',
        '現場に紙の点検表・日報が残っている方',
        '過去にデジタル化を試して定着しなかった方',
      ],
      agenda: [
        { time: '14:00-14:05', title: 'オープニング' },
        {
          time: '14:05-14:40',
          title: '着手する帳票の選び方',
          description: '「頻度 × 転記の手間」で優先順位を付ける方法を解説します。',
        },
        { time: '14:40-14:55', title: '3社の実例' },
        { time: '14:55-15:00', title: '質疑応答' },
      ],
      eventMeta: [
        { label: '開催日時', value: '2026年9月10日（木）14:00-15:00' },
        { label: '申込締切', value: '2026年9月9日（水）17:00' },
        { label: '開催形式', value: 'オンライン（Zoom）' },
        { label: '参加費', value: '無料' },
        { label: '定員', value: '100名' },
      ],
      speakers: [
        {
          name: '立花 直人',
          organization: 'シラクサ株式会社',
          role: '取締役 CTO',
          bio: 'Polastack のアーキテクチャ全般を担当。',
          photo: { src: photoPlaceholder('Speaker', 'blue', '1:1'), alt: '登壇者 立花 直人のポートレート' },
        },
      ],
      form: (
        <ResourceRequestForm
          title="お申し込み"
          submitLabel="セミナーに申し込む"
          consent={{ href: '#privacy' }}
          ichisanEnabled={false}
        />
      ),
    },
  }),
};
