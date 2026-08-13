import type { Meta, StoryObj } from '@storybook/react';
import {
  CaseStudyListSection,
  type CaseStudyListItem,
} from '../../components/sections/case-study-list';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * CaseStudyListSection — 事例一覧ページの本体（case-study-list 型）。
 *
 * 実測（SmartHR `/case/`、バクラク `/case/` の 2/2）に合わせて、
 * キャッチコピー型ヒーローではなく短いページタイトルから始まり、
 * ピックアップ + 多軸フィルタ + カードグリッド + ページネーションで構成する。
 * フィルタとページ送りは実際に動く（状態は内部 useState。URL 同期はしない）。
 */
const meta: Meta<typeof CaseStudyListSection> = {
  title: 'Sections/CaseStudyList',
  component: CaseStudyListSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof CaseStudyListSection>;

const jaCases: CaseStudyListItem[] = [
  {
    companyName: 'あさひ製作所',
    photo: {
      src: photoPlaceholder('インタビュー写真', 'green'),
      alt: 'あさひ製作所の担当者が現場で作業する様子（プレースホルダ）',
    },
    summary: '未提出の顧問先を追いかける仕事がなくなり、決算前の残業がゼロになりました。',
    service: 'タックスピア',
    industry: '製造業',
    employeeRange: '51〜300名',
    challenges: ['書類回収', '月次決算'],
    metrics: [{ label: '期限内回収率', value: '98%' }],
    href: '/case/asahi',
  },
  {
    companyName: 'みなと商事',
    photo: {
      src: photoPlaceholder('インタビュー写真', 'blue'),
      alt: 'みなと商事の担当者が現場で作業する様子（プレースホルダ）',
    },
    summary: '紙で回っていた経費精算をやめ、月次決算が5営業日早まりました。',
    service: 'タックスピア',
    industry: '卸売業',
    employeeRange: '1〜50名',
    challenges: ['月次決算'],
    metrics: [{ label: '決算短縮', value: '5営業日' }],
    href: '/case/minato',
  },
  {
    companyName: 'そらまめ工業',
    photo: {
      src: photoPlaceholder('インタビュー写真', 'sand'),
      alt: 'そらまめ工業の担当者が現場で作業する様子（プレースホルダ）',
    },
    summary: '書類の紛失と再依頼がなくなり、担当者の問い合わせ対応が半分になりました。',
    service: 'ピアデスク',
    industry: '製造業',
    employeeRange: '301名〜',
    challenges: ['書類回収', '問い合わせ対応'],
    href: '/case/soramame',
  },
  {
    companyName: 'かもめ運輸',
    summary: 'ドライバーからの申請をスマートフォンで完結させ、事務所への持ち込みをなくしました。',
    service: 'ピアデスク',
    industry: '運輸業',
    employeeRange: '51〜300名',
    challenges: ['問い合わせ対応'],
    href: '/case/kamome',
  },
  {
    companyName: '北里フーズ',
    summary: '複数拠点の申請フォーマットを統一し、本社での差し戻しが激減しました。',
    service: 'ピアデスク',
    industry: '食品製造',
    employeeRange: '301名〜',
    challenges: ['書類回収'],
    href: '/case/kitazato',
  },
  {
    companyName: 'つばき会計事務所',
    summary: '顧問先100社への催促を自動化し、担当者1人あたりの受け持ちが1.5倍になりました。',
    service: 'タックスピア',
    industry: '士業',
    employeeRange: '1〜50名',
    challenges: ['書類回収'],
    metrics: [{ label: '担当社数', value: '1.5倍' }],
    href: '/case/tsubaki',
  },
  {
    companyName: 'さくら不動産',
    summary: '契約書類の受け渡しをオンラインに寄せ、来店対応の時間を営業活動に回せました。',
    service: 'ピアデスク',
    industry: '不動産業',
    employeeRange: '51〜300名',
    challenges: ['書類回収'],
    href: '/case/sakura',
  },
  {
    companyName: 'ひまわり調剤',
    summary: '各店舗の提出状況が一覧で見えるようになり、本部の確認作業がなくなりました。',
    service: 'ピアデスク',
    industry: '医療・薬局',
    employeeRange: '51〜300名',
    challenges: ['書類回収', '月次決算'],
    href: '/case/himawari',
  },
  {
    companyName: 'こまつ建設',
    summary: '現場からの写真提出をアプリなしで受け取れるようになりました。',
    service: 'ピアデスク',
    industry: '建設業',
    employeeRange: '51〜300名',
    challenges: ['書類回収'],
    href: '/case/komatsu',
  },
  {
    companyName: 'まつり印刷',
    summary: '請求書の突合を自動化し、経理担当の月末残業が20時間減りました。',
    service: 'タックスピア',
    industry: '印刷業',
    employeeRange: '1〜50名',
    challenges: ['月次決算'],
    metrics: [{ label: '残業削減', value: '20時間/月' }],
    href: '/case/matsuri',
  },
  {
    companyName: 'あおば人材サービス',
    summary: '登録スタッフからの書類提出をSMSリンクで完結させました。',
    service: 'ピアデスク',
    industry: '人材サービス',
    employeeRange: '301名〜',
    challenges: ['書類回収'],
    href: '/case/aoba',
  },
  {
    companyName: 'しおかぜ水産',
    summary: '税理士とのやりとりを1つの画面に集約し、メール検索の時間がなくなりました。',
    service: 'タックスピア',
    industry: '水産業',
    employeeRange: '1〜50名',
    challenges: ['問い合わせ対応'],
    href: '/case/shiokaze',
  },
  {
    companyName: 'みどりリース',
    summary: '契約更新時の書類回収を前倒しで進められるようになりました。',
    service: 'ピアデスク',
    industry: 'リース業',
    employeeRange: '51〜300名',
    challenges: ['書類回収'],
    href: '/case/midori',
  },
  {
    companyName: 'なぎさホテル',
    summary: '季節スタッフの入社書類を、着任前にオンラインで揃えられるようになりました。',
    service: 'ピアデスク',
    industry: '宿泊業',
    employeeRange: '51〜300名',
    challenges: ['書類回収'],
    href: '/case/nagisa',
  },
  {
    companyName: 'やまびこ運送',
    summary: '軽減税率の判定を自動化し、記帳の差し戻しがほぼなくなりました。',
    service: 'タックスピア',
    industry: '運輸業',
    employeeRange: '51〜300名',
    challenges: ['月次決算'],
    href: '/case/yamabiko',
  },
];

const enCases: CaseStudyListItem[] = [
  {
    companyName: 'Northwind Manufacturing',
    summary: 'Chasing missing documents disappeared. Month-end overtime dropped to zero.',
    service: 'TaxPeer',
    industry: 'Manufacturing',
    employeeRange: '51–300',
    challenges: ['Document collection', 'Monthly close'],
    metrics: [{ label: 'On-time collection', value: '98%' }],
    href: '/case/northwind',
  },
  {
    companyName: 'Harbor Trading',
    summary: 'Paper expense reports are gone. The monthly close is five business days faster.',
    service: 'TaxPeer',
    industry: 'Wholesale',
    employeeRange: '1–50',
    challenges: ['Monthly close'],
    href: '/case/harbor',
  },
  {
    companyName: 'Fieldstone Logistics',
    summary: 'Drivers submit everything from their phones. Nothing gets carried to the office.',
    service: 'PeerDesk',
    industry: 'Logistics',
    employeeRange: '51–300',
    challenges: ['Support load'],
    href: '/case/fieldstone',
  },
  {
    companyName: 'Bluebird Staffing',
    summary: 'Onboarding paperwork is collected before day one, through a single SMS link.',
    service: 'PeerDesk',
    industry: 'Staffing',
    employeeRange: '301+',
    challenges: ['Document collection'],
    href: '/case/bluebird',
  },
];

/** 日本語・15件。ピックアップ2件 + 4軸フィルタ + 2ページのページネーション */
export const Default: Story = {
  args: {
    eyebrow: 'Case Studies',
    title: '導入事例',
    subtitle: '業種・規模・課題から、自社に近い事例を探せます。',
    pickup: [jaCases[0], jaCases[5]],
    cases: jaCases,
    pageSize: 12,
  },
};

/** ピックアップなし・1ページに収まる件数（ページネーションは出ない） */
export const ピックアップなし: Story = {
  args: {
    title: '導入事例',
    cases: jaCases.slice(0, 6),
  },
};

/** 表示するフィルタ軸を絞る（サービスを1つしか持たないサイトなど） */
export const 軸を絞る: Story = {
  args: {
    title: '導入事例',
    subtitle: '業種で絞り込めます。',
    cases: jaCases,
    filterAxes: ['industry'],
    pageSize: 6,
  },
};

/** English example — UI 語彙は labels で差し替える（ハードコードしない設計） */
export const English: Story = {
  args: {
    eyebrow: 'Case Studies',
    title: 'Customer stories',
    subtitle: 'Filter by industry, company size, or the problem you are solving.',
    pickup: [enCases[0]],
    cases: enCases,
    pageSize: 3,
    labels: {
      service: 'Product',
      industry: 'Industry',
      employeeRange: 'Company size',
      challenges: 'Challenge',
      all: 'All',
      resultCount: (shown, total) => `${shown} of ${total} stories`,
      empty: 'No stories match these filters. Try a different combination.',
      previous: 'Previous',
      next: 'Next',
      pagination: 'Case study pages',
      readMore: 'Read the story',
    },
  },
};
