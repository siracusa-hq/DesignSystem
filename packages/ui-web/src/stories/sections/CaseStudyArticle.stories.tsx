import type { Meta, StoryObj } from '@storybook/react';
import { CaseStudyArticleSection } from '../../components/sections/case-study-article';
import { photoPlaceholder } from '../support/photo-placeholder';

/**
 * CaseStudyArticleSection — 個別事例記事の本体（case-study-detail 型）。
 *
 * 実測（9 サイト × 3 記事 = 27 記事。docs/research/research-case-study-detail.md）の
 * 標準構成をそのまま持つ: パンくず → 記事タイトル（h1）→ 会社プロフィール →
 * ヒーロー写真 → 冒頭サマリー → 章。**構成の選択肢は無い。**
 *
 * 実測に無いものは作っていない: 冒頭の数値タイル（0/27）・引用の飾り枠（0/27）・目次（2/9）。
 * 本文は単一の面に置く（9/9）。
 */
const meta: Meta<typeof CaseStudyArticleSection> = {
  title: 'Sections/CaseStudyArticle',
  component: CaseStudyArticleSection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof CaseStudyArticleSection>;

/** 地の文の記事（実測 5/9 の書き方）。サマリー3ブロック + 話者 + 章ごとの写真 */
export const 事例記事_タックスピア: Story = {
  args: {
    title: '書類回収の催促がゼロに。決算前の残業が消えた',
    backTo: { label: '導入事例', href: '/case' },
    publishedAt: '2026.07.31',
    photo: {
      src: photoPlaceholder('インタビュー写真', 'green', '1.9:1'),
      alt: 'あさひ製作所の経理部と経営企画室の担当者が事務所で話している様子（プレースホルダ）',
      caption: '左から、経理部 部長 山田 太郎さん、経営企画室 鈴木 花子さん',
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
      challenge: ['期日直前の催促に、担当者2名が毎月まる2日を使っていた', '提出状況が個人のメモにしかなく、引き継げなかった'],
      reason: ['顧問先にアプリの導入を求めない', '既存の会計ソフトとそのままつながる'],
      effect: ['期限内回収率が98%に', '決算前の残業が月40時間からゼロに'],
    },
    lead: '創業52年の金属加工メーカーであるあさひ製作所は、3年前から月次決算の早期化に取り組んできた。最後まで残った壁が、顧問先ではなく社内の各拠点からの書類回収だったという。',
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
        paragraphs: [
          '比較した3製品のうち、2つは提出する側にアプリの導入を求めるものでした。拠点の担当者に新しい操作を覚えてもらうのは現実的ではありません。タックスピアはメールのリンクから撮影してアップロードするだけで、こちらの説明が要らなかった。',
          '初期設定は導入担当の方が代行してくれたため、社内の準備は実質1日で終わりました。',
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
  },
};

/** 問答形式の記事（実測 4/9。h3 = 質問 / 段落 = 回答）。サマリーは2ブロック */
export const 事例記事_問答形式: Story = {
  args: {
    title: '月次決算が5営業日短縮。経理3名の運用はこう変わった',
    backTo: { label: '導入事例', href: '/case' },
    profile: {
      companyName: 'みなと商事',
      industry: '卸売業',
      employeeRange: '1〜50名',
      service: 'タックスピア',
      challenges: ['月次決算'],
    },
    photo: {
      src: photoPlaceholder('インタビュー写真', 'blue'),
      alt: 'みなと商事の経理チームが打ち合わせをしている様子（プレースホルダ）',
    },
    summary: {
      challenge: ['月次決算に12営業日かかっていた'],
      effect: ['月次決算が7営業日に短縮'],
    },
    chapters: [
      {
        heading: '導入前の課題',
        qa: [
          {
            question: '導入前は何に時間がかかっていましたか?',
            answer: [
              '請求書の突合です。紙で届くものとメールで届くものが混在していて、まず集めるところから始めていました。経理3名のうち1名が、月初の1週間はほぼその作業に張り付いていました。',
            ],
          },
          {
            question: '過去に別の方法は試しましたか?',
            answer: [
              '共有フォルダに置いてもらう運用を1年ほど続けましたが、置き忘れが減らず、結局こちらから催促していました。',
            ],
          },
        ],
      },
      {
        heading: '導入後の変化',
        qa: [
          {
            question: '運用はどう変わりましたか?',
            answer: [
              '提出の依頼と催促が自動で回るようになったので、こちらから連絡する必要がなくなりました。月初にボードを見れば、誰が出していないかがすぐ分かります。',
              '空いた時間は、これまで手が回らなかった予実分析にあてています。',
            ],
          },
          {
            question: '数字でいうとどのくらい変わりましたか?',
            answer: ['月次決算は12営業日から7営業日になりました。5営業日の短縮です。'],
          },
        ],
      },
    ],
  },
};

/** English example — labels ですべての UI 語彙を差し替える（ハードコードは持たない） */
export const English_CaseStudyArticle: Story = {
  args: {
    title: 'From three days of chasing documents to none at all',
    backTo: { label: 'Case studies', href: '/en/case' },
    publishedAt: 'July 31, 2026',
    photo: {
      src: photoPlaceholder('Interview photo', 'sand', '1.9:1'),
      alt: 'Finance team members reviewing submission status in their office (placeholder)',
      caption: 'Taro Yamada, Head of Finance (left), and Hanako Suzuki, Corporate Planning',
    },
    profile: {
      companyName: 'Asahi Manufacturing',
      industry: 'Manufacturing',
      employeeRange: '51–300 employees',
      service: 'Taxpeer',
      challenges: ['Document collection', 'Monthly close'],
    },
    speakers: [{ name: 'Taro Yamada', title: 'Asahi Manufacturing, Head of Finance' }],
    summary: {
      challenge: ['Two people spent two full days a month chasing submissions'],
      reason: ['Nothing to install on the submitting side'],
      effect: ['On-time collection rate reached 98%', 'Overtime before close dropped to zero'],
    },
    labels: {
      breadcrumb: 'Breadcrumb',
      challenge: 'Challenge',
      reason: 'Why Taxpeer',
      effect: 'Impact',
      industry: 'Industry',
      employeeRange: 'Company size',
      service: 'Product',
      challenges: 'Focus',
    },
    lead: 'Asahi Manufacturing has been shortening its monthly close for three years. The last obstacle was not its clients, but collecting documents from its own seven sites.',
    chapters: [
      {
        heading: 'Three days of phone calls before every deadline',
        paragraphs: [
          'Three days before each deadline, the finance team started calling every site. Each call meant waiting for a callback, and every incomplete document meant calling again. Collection had become the job.',
          'Submission status lived in one person’s notebook, so nobody could cover for them.',
        ],
      },
      {
        heading: 'Reminders now run on their own',
        photo: {
          src: photoPlaceholder('Status board', 'green', '3:2'),
          alt: 'A board showing submission status for each site (placeholder)',
        },
        paragraphs: [
          'Reminders are scheduled backwards from the deadline and go out automatically. The on-time collection rate went from 72% to 98%.',
          'Because progress is visible on a single board, the work can be handed over at any time.',
        ],
      },
    ],
  },
};
