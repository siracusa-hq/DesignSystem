import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import {
  CaseStudyArticleSection,
  CaseStudyRelatedSection,
  type CaseStudyArticleSectionProps,
  type CaseChapter,
} from './case-study-article';
import { resolvePageSurface } from '@/lib/page-surface';

const chapters: [CaseChapter, CaseChapter] = [
  {
    heading: '導入前は、期限の3日前から電話をかけ続けていた',
    paragraphs: ['期日の3日前になると、担当者は電話をかけ始めていました。', '回収の作業自体が仕事になっていました。'],
  },
  {
    heading: '運用が変わって、催促そのものが消えた',
    photo: { src: '/photo-2.jpg', alt: '担当者が提出状況ボードを見ている様子', caption: '経理部 部長 山田' },
    paragraphs: ['催促は自動で回るようになりました。'],
  },
];

const base: CaseStudyArticleSectionProps = {
  title: '書類回収の催促がゼロに。決算前の残業が消えた',
  backTo: { label: '導入事例', href: '/case' },
  profile: {
    companyName: 'あさひ製作所',
    industry: '製造業',
    employeeRange: '51〜300名',
    service: 'タックスピア',
    challenges: ['書類回収', '月次決算'],
  },
  chapters,
};

const article = (props: Partial<CaseStudyArticleSectionProps> = {}) => (
  <CaseStudyArticleSection {...base} {...props} />
);

/** DOM の出現順（前から数えたインデックス）を返す */
function order(container: HTMLElement, elements: (Element | null)[]): number[] {
  const all = Array.prototype.slice.call(container.querySelectorAll('*'));
  return elements.map((el) => all.indexOf(el as Element));
}

describe('CaseStudyArticleSection', () => {
  it('実測の標準構成順（パンくず → h1 → プロフィール → 写真 → サマリー → 章）で描画する', () => {
    const { container } = render(
      article({
        photo: { src: '/hero.jpg', alt: '工場の事務所で打ち合わせをする様子' },
        summary: { challenge: ['催促に時間がかかる'], effect: ['残業がゼロに'] },
      }),
    );
    const positions = order(container, [
      screen.getByRole('navigation', { name: 'パンくず' }),
      screen.getByRole('heading', { level: 1 }),
      screen.getByText('業種'),
      screen.getByAltText('工場の事務所で打ち合わせをする様子'),
      screen.getByText('催促に時間がかかる'),
      screen.getByRole('heading', { level: 2, name: chapters[0].heading }),
    ]);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(positions.every((p) => p >= 0)).toBe(true);
  });

  it('記事タイトルが h1（ヒーローを持たないページ型のため）', () => {
    render(article());
    expect(screen.getByRole('heading', { level: 1, name: base.title })).toBeInTheDocument();
  });

  it('パンくずは一覧へのリンクと現在地（実測 9/9 が戻り導線を持つ）', () => {
    render(article());
    const nav = screen.getByRole('navigation', { name: 'パンくず' });
    expect(within(nav).getByRole('link', { name: '導入事例' })).toHaveAttribute('href', '/case');
    expect(within(nav).getByText(base.title)).toHaveAttribute('aria-current', 'page');
  });

  it('プロフィールは一覧のフィルタ軸と同じ語彙で、値が無い軸は行ごと出さない', () => {
    render(article({ profile: { companyName: 'みなと商事', industry: '卸売業' } }));
    expect(screen.getByText('業種')).toBeInTheDocument();
    expect(screen.getByText('卸売業')).toBeInTheDocument();
    expect(screen.queryByText('従業員規模')).toBeNull();
    expect(screen.queryByText('利用サービス')).toBeNull();
  });

  it('章は地の文（paragraphs）で描ける', () => {
    render(article());
    expect(screen.getByText('期日の3日前になると、担当者は電話をかけ始めていました。')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(2);
    // 質問見出し（h3）は問答形式のときだけ出る
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
  });

  it('章は問答（qa）でも描ける。質問は h3、回答は段落', () => {
    render(
      article({
        chapters: [
          {
            heading: '導入の経緯',
            qa: [
              { question: '導入前の課題は何でしたか?', answer: ['書類の回収に時間がかかっていました。'] },
              { question: '決め手は?', answer: ['顧問先にアプリが要らないことです。'] },
            ],
          },
          { heading: '導入後', paragraphs: ['残業が消えました。'] },
        ],
      }),
    );
    // 「―― 」はシステムが自動付与する（書き手は書かない。2026-08-14 決定）
    expect(
      screen.getByRole('heading', { level: 3, name: '―― 導入前の課題は何でしたか?' }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
    expect(screen.getByText('書類の回収に時間がかかっていました。')).toBeInTheDocument();
  });

  it('サマリーは任意。省略すればラベルごと出ない（実測 5/9 しか持たない）', () => {
    render(article());
    expect(screen.queryByText('効果')).toBeNull();
    expect(screen.queryByText('決め手')).toBeNull();
  });

  it('サマリーの「決め手」は任意（課題 + 効果の2ブロックが実測 2/9）', () => {
    render(article({ summary: { challenge: ['催促の電話'], effect: ['残業ゼロ'] } }));
    /* 「課題」はプロフィールの軸ラベルとサマリーのラベルの2箇所に出る
       （実測でも ANDPAD などが両方に持つ）。ここでは本文の有無で見る */
    expect(screen.getByText('催促の電話')).toBeInTheDocument();
    expect(screen.getByText('効果')).toBeInTheDocument();
    expect(screen.getByText('残業ゼロ')).toBeInTheDocument();
    expect(screen.queryByText('決め手')).toBeNull();
  });

  it('サマリーは3ブロックも描ける（実測 3/9）', () => {
    render(
      article({
        summary: { challenge: ['催促の電話'], reason: ['顧問先アプリ不要'], effect: ['残業ゼロ'] },
      }),
    );
    expect(screen.getByText('決め手')).toBeInTheDocument();
  });

  it('写真は figure + figcaption（キャプションは話者名と肩書き）', () => {
    const { container } = render(
      article({ photo: { src: '/hero.jpg', alt: '現場の様子', caption: '左から、経理部 山田' } }),
    );
    expect(container.querySelector('figure')).not.toBeNull();
    expect(screen.getByText('左から、経理部 山田')).toBeInTheDocument();
    expect(screen.getByAltText('現場の様子')).toBeInTheDocument();
  });

  it('話者は最大4名まで並ぶ（実測の最大）', () => {
    render(
      article({
        speakers: [
          { name: '山田 太郎', title: 'あさひ製作所 経理部 部長' },
          { name: '鈴木 花子', title: 'あさひ製作所 経理部' },
        ],
      }),
    );
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
    expect(screen.getByText('あさひ製作所 経理部')).toBeInTheDocument();
  });

  it('公開日は任意。dev 警告は出さない（実測 2/9 で必須化の根拠が無い）', () => {
    render(article({ publishedAt: '2026.07.31' }));
    expect(screen.getByText('2026.07.31')).toBeInTheDocument();
  });

  it('labels で UI 語彙を英語に差し替えられる', () => {
    render(
      article({
        labels: { breadcrumb: 'Breadcrumb', industry: 'Industry', challenge: 'Challenge', effect: 'Impact' },
        summary: { challenge: ['Chasing documents'], effect: ['No more overtime'] },
      }),
    );
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Industry')).toBeInTheDocument();
    expect(screen.getByText('Impact')).toBeInTheDocument();
  });

  it('pageSurface は default（記事本体は単一面。Page の面リズムに従う）', () => {
    expect(resolvePageSurface(CaseStudyArticleSection, {})).toBe('default');
  });

  describe('型で落ちるもの（実測に無い形を渡せない）', () => {
    it('章が1つ（実測の最小は2章）', () => {
      // @ts-expect-error -- chapters は最低2章のタプル
      const oneChapter: CaseStudyArticleSectionProps = { ...base, chapters: [chapters[0]] };
      expect(oneChapter).toBeTruthy();
    });

    it('話者5人（実測の最大は4名）', () => {
      const speakers = [
        { name: 'a', title: 'a' },
        { name: 'b', title: 'b' },
        { name: 'c', title: 'c' },
        { name: 'd', title: 'd' },
        { name: 'e', title: 'e' },
      ];
      // @ts-expect-error -- CaseSpeakerList は最大4要素のタプル
      const fiveSpeakers: CaseStudyArticleSectionProps = { ...base, speakers };
      expect(fiveSpeakers).toBeTruthy();
    });

    it('写真の alt 欠落（写真は実在性の証拠。alt は必須）', () => {
      // @ts-expect-error -- CasePhoto.alt は必須
      const noAlt: CaseStudyArticleSectionProps = { ...base, photo: { src: '/hero.jpg' } };
      expect(noAlt).toBeTruthy();
    });

    it('className は受け付けない', () => {
      // @ts-expect-error -- 公開 API から className は全廃済み
      const withClassName: CaseStudyArticleSectionProps = { ...base, className: 'p-10' };
      expect(withClassName).toBeTruthy();
    });
  });

  it('a11y 違反なし', async () => {
    const { container } = render(
      article({
        photo: { src: '/hero.jpg', alt: '工場の事務所で打ち合わせをする様子', caption: '左から、山田' },
        publishedAt: '2026.07.31',
        speakers: [{ name: '山田 太郎', title: 'あさひ製作所 経理部 部長' }],
        summary: { challenge: ['催促の電話'], reason: ['顧問先アプリ不要'], effect: ['残業ゼロ'] },
        lead: '同社は3年前から月次決算の早期化に取り組んでいる。',
      }),
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);
});

describe('CaseStudyRelatedSection', () => {
  const related = [
    { companyName: 'みなと商事', summary: '月次決算が5営業日早まりました。', href: '/case/minato' },
    { companyName: 'そらまめ工業', summary: '書類の紛失がなくなりました。', href: '/case/soramame' },
  ];

  it('一覧と同じカードで関連事例を並べ、一覧への戻りリンクを持つ（実測 9/9）', () => {
    render(<CaseStudyRelatedSection cases={related} backTo={{ label: '導入事例', href: '/case' }} />);
    expect(screen.getByRole('heading', { name: '関連事例' })).toBeInTheDocument();
    expect(screen.getByText('みなと商事')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: '詳しく見る' })).toHaveLength(2);
    expect(screen.getByRole('link', { name: '事例一覧をみる' })).toHaveAttribute('href', '/case');
  });

  it('labels で語彙を差し替えられる', () => {
    render(
      <CaseStudyRelatedSection
        cases={related}
        backTo={{ label: 'Case studies', href: '/en/case' }}
        labels={{ related: 'Related stories', readMore: 'Read more', backToList: 'See all case studies' }}
      />,
    );
    expect(screen.getByRole('heading', { name: 'Related stories' })).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'Read more' })).toHaveLength(2);
    expect(screen.getByRole('link', { name: 'See all case studies' })).toBeInTheDocument();
  });

  it('a11y 違反なし', async () => {
    const { container } = render(
      <CaseStudyRelatedSection cases={related} backTo={{ label: '導入事例', href: '/case' }} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);
});
