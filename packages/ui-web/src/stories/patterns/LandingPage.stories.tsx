import type { Meta, StoryObj } from '@storybook/react';
import { defineLandingPage, LandingPage } from '../../patterns';
import { ResourceRequestForm } from '../../components/sections/form';

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

const offers = [
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
      badge: '税理士事務所 向け',
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
          badge: '人気',
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
    },
    form: <ResourceRequestForm eyebrow="Download" title="資料請求フォーム" />,
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
          summary: '紙で回っていた経費精算をやめ、月次決算が5営業日早まりました。',
          service: 'タックスピア',
          industry: '卸売業',
          employeeRange: '1〜50名',
          challenges: ['月次決算'],
          href: '/case/minato',
        },
        {
          companyName: 'そらまめ工業',
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
export const 計測_onCTAClick: Story = {
  /* args では渡さない。actions アドオンに onCTAClick を差し込ませ、
     受け取った { id, label, href } をそのまま Actions パネルに出す */
  argTypes: { onCTAClick: { action: 'onCTAClick' } },
  args: 製品LP_タックスピア.args,
};

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
