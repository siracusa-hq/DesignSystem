import type { Meta, StoryObj } from '@storybook/react';
import {
  Layers,
  ShieldCheck,
  Bot,
  TrendingUp,
  Handshake,
  Building2,
} from 'lucide-react';
import { defineLandingPage, LandingPage, type OfferPair } from '../../patterns';
import { ResourceRequestForm } from '../../components/sections/form';
import { MediaFrame } from '../../components/primitives/media-frame';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * defineLandingPage — LP 量産のデータ駆動 API（Stage 3 Slice 2）。
 *
 * AI の仕事は「デザインする」ことではなく「フォームを埋める」こと。
 * セクションの順序（実測12ページの最大公約数）・面と余白のリズム・
 * CTA の配置とラベルの再利用は、すべてパターンが決める。
 * 必須スロットの欠落は型エラーで落ちる。
 *
 * この棚には**獲得・訴求のランディング型**だけを置く
 * （`product` / `product-portfolio-top` / `lead-gen`）。
 * コーポレートトップは Patterns/CorporatePage、
 * 一覧・記事・詳細の回遊系（事例 / お知らせ・ブログ / 資料 / セミナー）は
 * Patterns/ContentPage を参照。
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


/** ロゴ素材の代わり（Sections/LogoCloud と同じ方式）。実運用では src に画像 URL を渡す */
const PlaceholderLogo: React.FC<{ name: string }> = ({ name }) => (
  <svg width="128" height="32" viewBox="0 0 128 32" role="img" aria-label={name}>
    <rect width="128" height="32" rx="4" fill="var(--color-surface-sunken)" />
    <text
      x="64"
      y="20"
      textAnchor="middle"
      fontSize="11"
      fontWeight="500"
      fill="var(--color-on-surface-muted)"
    >
      {name}
    </text>
  </svg>
);

/**
 * ヒーロー背景（Polastack LP 実サイトと同じ指定）。
 * ライト基調 + polastack ランプの淡色段（50: #e7efff / 100: #c6d8fd）のグロー。
 */
const polastackHeroBackdrop = (
  <div
    style={{
      width: '100%',
      height: '100%',
      background:
        'radial-gradient(70% 55% at 78% 12%, rgba(198, 216, 253, 0.55), transparent 62%), radial-gradient(55% 45% at 8% 88%, rgba(231, 239, 255, 0.9), transparent 60%), linear-gradient(180deg, #ffffff, #f7f9ff)',
    }}
  />
);

/**
 * **王道の製品LP。** Polastack 実サイト（polastack-lp.netlify.app）の構成と実コピーを
 * `product` 型のスロットに流し込んだリファレンス。実サイトはセクション部品の直組みだが、
 * ここでは同じ内容が「フォームを埋めるだけ」で成立することを示す。
 * 王道の並び: Hero → 証明 → 概要（何者か4点）→ 深掘り（showcase）→ 帯 → 料金 → 理由 → FAQ → 締め。
 *
 * 実サイトとの既知の差分（パターンの規範を優先）:
 * - デモ動画セクション（動画 + 3ステップ）は対応スロットが無く省略
 * - パートナーモデルは reasons スロットのため描画順が 料金 → パートナー になる（実サイトは逆）
 * - 実サイトは社会的証明を未掲載（プレローンチ）だが、規範（実測 19/19）に従い
 *   proof はプレースホルダのロゴ帯で置いている。実サイトへの宿題でもある
 */
export const 製品LP_Polastack_王道: Story = {
  args: defineLandingPage({
    pattern: 'product',
    brand: 'polastack',
    header: {
      logo: <strong>Polastack</strong>,
      navItems: [
        { label: '機能', href: '#features' },
        { label: 'パートナー', href: '#partners' },
        { label: '料金', href: '#pricing' },
        { label: 'ドキュメント', href: '#docs' },
      ],
      actions: [
        { label: 'ログイン', href: '#login' },
        { label: '無料で試す', href: '#signup' },
      ],
    },
    /* フッターまで含めて1ページが単体で成立する（実サイトと同じ4グループ構成） */
    footer: {
      logo: <strong>Polastack</strong>,
      description: 'Enterprise Backend Platform',
      linkGroups: [
        {
          title: 'プロダクト',
          links: [
            { label: '機能一覧', href: '#features' },
            { label: 'パートナープログラム', href: '#partners' },
            { label: '料金プラン', href: '#pricing' },
          ],
        },
        {
          title: '開発者',
          links: [
            { label: 'ドキュメント', href: '#docs' },
            { label: 'API リファレンス', href: '#api' },
            { label: 'Changelog', href: '#changelog' },
          ],
        },
        {
          title: '会社情報',
          links: [
            { label: '会社概要', href: '#company' },
            { label: 'お問い合わせ', href: '#contact' },
          ],
        },
        {
          title: 'リーガル',
          links: [
            { label: '利用規約', href: '#terms' },
            { label: 'プライバシーポリシー', href: '#privacy' },
            { label: '特定商取引法に基づく表記', href: '#tokushoho' },
          ],
        },
      ],
      copyright: '© 2026 siracusa Inc.',
      legalLinks: [
        { label: 'プライバシー', href: '#privacy' },
        { label: '利用規約', href: '#terms' },
      ],
    },
    hero: {
      title: '書くのは機能と画面だけ。',
      subtitle:
        '認証・権限・監査ログ・全文検索・分析・監視。企業品質の裏側は最初から揃っています。',
      offers: [
        { label: '無料で試す', href: '#signup' },
        { label: 'ドキュメント', href: '#docs' },
      ],
      backdrop: polastackHeroBackdrop,
      backdropTone: 'light',
      image: <MediaFrame ratio="4:3" placeholderLabel="プロダクトUI + polastack.yaml（デモ合成）" />,
      imagePlacement: 'side',
    },
    proof: {
      logos: {
        logos: [
          'あさひ製作所',
          'みなと商事',
          'そらまめ工業',
          'つばき会計事務所',
          'かもめ運輸',
          'まつり印刷',
        ].map((name) => ({ name, node: <PlaceholderLogo name={name} /> })),
      },
    },
    features: {
      eyebrow: 'Polastack とは',
      title: '受託開発会社・SaaS事業者のためのバックエンド基盤。',
      subtitle:
        'あなたのビジネスは「作って終わり」ではない。作る速さと続く収益の両方を支えます。',
      features: [
        {
          icon: <Layers />,
          title: '非機能要件は書かずに揃う',
          description:
            '認証も権限も監査も全文検索も、設定ファイルで揃う。機能と画面に集中できる。',
        },
        {
          icon: <ShieldCheck />,
          title: 'エンタープライズレベルのセキュリティ&コンプライアンス',
          description:
            'Passkey/SAML SSO、行・列レベルの権限、改ざん不可の監査ログが最初から。重い実装を抱えない。',
        },
        {
          icon: <Bot />,
          title: 'AIエージェントネイティブな開発基盤',
          description:
            'スキーマからSDK/MCPを自動生成。CursorやClaude Codeがそのまま開発に使える。',
        },
        {
          icon: <TrendingUp />,
          title: '保守を抱えず続く収益になる',
          description:
            '運用は基盤側が引き受ける。売り切りで終わらせない収益モデルが2つ。',
        },
      ],
    },
    showcase: {
      eyebrow: '設定ファイルで見る機能一覧',
      title: '機能と画面以外は全部入っている。',
      subtitle: '毎回書いていた裏側が、ひとつの設定ファイルで揃う。',
      items: [
        {
          title: '認証・認可',
          description:
            'ログインは Passkey が標準、MFA は既定で必須。SAML/OIDC の SSO も接続情報を書くだけ（有償オプション）。',
          image: <MediaFrame ratio="4:3" placeholderLabel="polastack.yaml — 認証・認可" />,
          features: [
            'テーブル・列・行・承認状態の4階層アクセス制御',
            'DB 最下層で強制。アプリのバグに左右されない',
            '改ざん不可の監査ログを自動記録（SOC 2 / ISMS）',
          ],
        },
        {
          title: 'データ・検索・分析',
          description:
            'テーブルを定義するだけで、日本語対応の全文検索が有効に。形態素解析とタイポ補正つき、ミリ秒応答。',
          image: <MediaFrame ratio="4:3" placeholderLabel="polastack.yaml — データ・検索・分析" />,
          features: [
            '形態素解析＋タイポ補正、ミリ秒応答',
            '権限が検索・分析まで貫通',
            'BI ツールも PostgreSQL 互換で直結',
          ],
        },
        {
          title: '連携・自動化',
          description:
            'データが変わったら 10 秒以内に外部へ自動通知。署名は業界標準（Standard Webhooks）準拠で、受信側の実装は数行。',
          image: <MediaFrame ratio="4:3" placeholderLabel="polastack.yaml — 連携・自動化" />,
          features: [
            '署名は業界標準（Standard Webhooks）準拠',
            '自動リトライ＋再送キュー＋配信ログ',
            'SDK・型・MCP を自動生成、1コマンド接続',
          ],
        },
        {
          title: '運用・監視',
          description: 'テナント別の利用状況が、計装コードなしで最初から見える。',
          image: <MediaFrame ratio="4:3" placeholderLabel="polastack.yaml — 運用・監視" />,
          features: [
            '障害も使いすぎも不審な操作も、同じ通知経路へ',
            '冗長化・自動バックアップは基盤側が持つ',
          ],
        },
        {
          title: '収益化',
          description:
            '自社顧客への課金を、自分で作らない。サブスクも従量課金も、請求書発行から入金消込・督促まで基盤側が持つ。',
          image: <MediaFrame ratio="4:3" placeholderLabel="polastack.yaml — 収益化" />,
          features: [
            '従量課金の計測はコード 1 行',
            '請求書発行から入金消込・督促まで自動',
            '支払い画面も請求書も自社ブランドのまま',
          ],
        },
        {
          badge: '開発体験',
          title: 'SDKひとつで繋がる。',
          description:
            'スキーマから型を自動生成。pola sdk generate を CI に組み込めば、バックエンドの変更は PR の型エラーとして落ちます。',
          image: <MediaFrame ratio="4:3" placeholderLabel="app/api/deals.ts — あなたが書くコード" />,
          features: [
            'サーバーは M2M、ブラウザは OAuth で接続',
            'TypeScript / Python SDK・REST・MCP に対応',
            'フレームワークは自由（Next.js / React / Vue / Svelte）',
          ],
        },
      ],
    },
    midCta: { title: 'まずは Sandbox で全機能を試せます', note: '無料・クレジットカード不要' },
    pricing: {
      eyebrow: '料金プラン',
      title: '全機能を無料で試せる。',
      subtitle:
        'クレジットカード不要。Sandboxから始めて、いつでもGrowthにアップグレードできます。',
      plans: [
        {
          name: 'Sandbox',
          description: '検証・試作（契約主体: 開発者本人）',
          price: '¥0',
          priceNote: '無期限・クレジットカード不要',
          features: [
            { text: '全機能を利用可能', included: true },
            { text: '開発環境のみ', included: true },
            { text: '商用利用', included: false },
          ],
          action: { label: '無料で試す', href: '#signup' },
        },
        {
          name: 'Growth',
          description: '自社・小規模本番（契約主体: エンドユーザー企業）',
          price: '¥30,000',
          priceUnit: '〜/月',
          priceNote: '税別',
          badge: 'おすすめ',
          highlighted: true,
          features: [
            { text: '全機能を利用可能', included: true },
            { text: 'ユーザー数 + 従量の課金', included: true },
            { text: '開発 + 本番環境', included: true },
          ],
          action: { label: '無料で試す', href: '#signup' },
        },
        {
          name: 'Partner',
          description: '自社ブランドでのサービス提供（OEMパートナー・承認制）',
          price: 'お問い合わせ',
          features: [
            { text: '全機能を利用可能', included: true },
            { text: '顧客の数（社数）で課金。社数が増えるほど単価が下がる', included: true },
            { text: 'エンドユーザーは何人でも ¥0', included: true },
          ],
          action: { label: 'お問い合わせ', href: '#contact' },
        },
      ],
    },
    reasons: {
      eyebrow: 'パートナープログラム',
      title: 'あなたのビジネスに合わせた2つのプログラム。',
      subtitle:
        '受託案件は既定で「紹介パートナー」。複数顧客をポートフォリオ運用する場合は「OEMパートナー」を選択できます。',
      features: [
        {
          icon: <Handshake />,
          title: '紹介パートナー — 顧客が直接契約',
          description:
            '作るのは顧客ごとの業務システム。契約は顧客が直接結ぶため、あなたの持ち出しはゼロ。顧客を紹介して、継続的な紹介報酬を受け取る。',
        },
        {
          icon: <Building2 />,
          title: 'OEMパートナー — 自社ブランドで提供',
          description:
            '自社ブランドの B2B SaaS・業務システムを、顧客テナント単位で仕入れて自社価格で販売。差額が利益になり、エンドユーザーは何人でも ¥0。',
        },
      ],
    },
    faq: {
      title: 'よくあるご質問',
      items: [
        {
          question: 'ロックインされませんか？',
          answer:
            'コードもデータも、お客様の資産です。ビジネスロジックのコードはお客様のリポジトリで管理され、そのまま持ち出せます。データは API または CSV/JSON エクスポートでいつでも取り出せます（解約後も30日間のエクスポート期間があります）。',
        },
        {
          question: '受託案件では、どう納品・契約しますか？',
          answer:
            '2通りあります。引き渡し型では、クライアント様が自社契約のテナントを保有し、貴社が構築したアプリをそのまま納品します。貴社は保守を抱えず、紹介パートナーとして継続報酬を受け取れます。マネージド運用型では、OEMパートナーとして複数クライアントのテナントをまとめて運用できます。いずれの場合も、データの所有権はクライアント様に帰属します。',
        },
        {
          question: 'セキュリティやコンプライアンスは大丈夫ですか？',
          answer:
            'セキュリティはプラットフォームの設計に組み込まれています。行・列レベルの権限制御、改ざん不可の監査ログ、テナント間のデータ分離。いずれもアプリコードに依存せず、設定だけで有効になります。',
        },
        {
          question: 'データはどこに保存されますか？',
          answer:
            '東京リージョンの Google Cloud 上に保存されます。リージョン指定や、お客様が暗号鍵を保有する構成（CMEK）が必要な場合は、専用環境プラン（承認制）で対応します。',
        },
        {
          question: '稼働率とサポート体制は？',
          answer:
            '有料プランは月次稼働率目標 99.9% で、下回った場合はサービスクレジットを提供します。重大障害は4時間以内に初動対応します。Sandbox はコミュニティサポートです。',
        },
        {
          question: 'Sandboxは本当に無料ですか？',
          answer:
            '全機能を無期限・無料で試せます。クレジットカードも不要です。1ユーザー・開発環境のみ（商用利用不可）で、検証に十分なリソース枠を設けています。モジュールの機能制限はありません。',
        },
        {
          question: '料金は予測できますか？',
          answer:
            '最低料金 ¥30,000 を起点に、ユーザー数に連動する固定部分が中心です。リソース枠を超えた分だけ自動で拡張され、自動拡張には上限（Spend Cap）を設定できます。ユーザー追加時はその場で増加額を確認できるため、請求は常に見通せます。',
        },
        {
          question: 'AIコーディングツールと連携できますか？',
          answer:
            'はい。APIからMCPサーバーが自動生成されるので、CursorやClaude CodeがAPIを理解してそのまま開発できます。CLIもAIツールから呼び出せるので、設定の適用から管理まで任せられます。',
        },
        {
          question: 'フロントエンドをVercelなど外部にホストしてもいいですか？',
          answer:
            'はい。Polastackはヘッドレスなバックエンド基盤なので、フロントエンドのホスト先は自由です。VercelやCloudflare Pagesなど、お好みの環境からSDK/APIで接続できます（ブラウザから直接呼び出す場合は、アプリのドメインを許可オリジンとして登録します）。',
        },
        {
          question: '既存のシステムから移行できますか？',
          answer:
            'CSV/JSON インポートと、API 経由の段階的な移行に対応しています。カラムマッピング付きの取り込みウィザードがあり、大量データは非同期ジョブで処理されます。移行のご相談はお問い合わせから承ります。',
        },
      ],
    },
    closing: {
      title: '裏側はもう揃っている。あとは機能と画面だけ。',
      note: 'クレジットカード不要',
    },
  }),
};

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
    /* コンテンツ回遊（実測 9/13）。FAQ の後・締めの前に入る。
       系統ごとに塊を作り、News だけ日付つきの行リストになる */
    contentHub: {
      title: '導入前に読んでおきたいもの',
      groups: [
        {
          kind: 'resource',
          title: 'お役立ち資料',
          more: { label: 'お役立ち資料を見る', href: '#resources' },
          items: [
            {
              href: '#dl1',
              title: '税理士事務所のためのDX入門',
              category: '導入の実務',
              cover: { src: photoPlaceholder('DX入門', 'green'), alt: 'DX入門資料の表紙' },
            },
            {
              href: '#dl2',
              title: '顧問先への案内テンプレート集',
              category: 'すぐ使える',
              cover: { src: photoPlaceholder('テンプレート集', 'sand'), alt: 'テンプレート集の表紙' },
            },
            {
              href: '#dl3',
              title: '導入事例集 2026',
              category: '事例',
              cover: { src: photoPlaceholder('導入事例集', 'blue'), alt: '導入事例集の表紙' },
            },
          ],
        },
        {
          kind: 'news',
          title: 'お知らせ',
          more: { label: 'お知らせ一覧', href: '#news' },
          items: [
            { href: '#n1', title: '電子帳簿保存法の改正に対応しました', publishedAt: '2026-07-30', category: '製品アップデート' },
            { href: '#n2', title: '確定申告期の受付体制についてのご案内', publishedAt: '2026-07-14', category: 'お知らせ' },
            { href: '#n3', title: '税理士向けセミナーを開催します', publishedAt: '2026-06-26', category: 'イベント' },
          ],
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
