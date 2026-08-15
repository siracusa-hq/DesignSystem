import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ArticleBodySection, ArticleRelatedSection, type ArticleChapter } from './article-body';

const chapters: [ArticleChapter, ...ArticleChapter[]] = [
  { heading: '取得の概要', paragraphs: ['Type II は一定期間の統制を検証します。'] },
  { heading: 'お客様への影響', paragraphs: ['既存のご契約に変更はありません。'] },
];

describe('ArticleBodySection（共通）', () => {
  it('タイトルを h1 で出す', () => {
    render(
      <ArticleBodySection kind="news" title="SOC 2 を取得" publishedAt="2026-07-30" chapters={chapters} />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'SOC 2 を取得' })).toBeInTheDocument();
  });

  /* 公開日は News 12/12・ブログ 15/15 が持つ（事例記事の 6/27 とは逆転） */
  it('公開日を ISO から正規化して出す', () => {
    const { container } = render(
      <ArticleBodySection kind="news" title="x" publishedAt="2026-07-30" chapters={chapters} />,
    );
    expect(container.querySelector('time[datetime="2026-07-30"]')).toHaveTextContent('2026.07.30');
  });

  it('章を h2 として順に出す', () => {
    render(
      <ArticleBodySection kind="news" title="x" publishedAt="2026-07-30" chapters={chapters} />,
    );
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(['取得の概要', 'お客様への影響']);
  });

  /* 実測 News 10/12・ブログ 11/15。事例記事の 27/27 とは違い必須ではない */
  it('戻り導線は任意', () => {
    const { container } = render(
      <ArticleBodySection kind="news" title="x" publishedAt="2026-07-30" chapters={chapters} />,
    );
    expect(container.querySelector('nav')).toBeNull();
  });

  it('backTo を渡すとパンくずを出す', () => {
    render(
      <ArticleBodySection
        kind="news"
        title="x"
        publishedAt="2026-07-30"
        backTo={{ label: 'お知らせ一覧', href: '/news' }}
        chapters={chapters}
      />,
    );
    expect(screen.getByRole('link', { name: 'お知らせ一覧' })).toHaveAttribute('href', '/news');
  });

  it('share を渡すとシェアボタンを出す', () => {
    render(
      <ArticleBodySection
        kind="news"
        title="x"
        publishedAt="2026-07-30"
        chapters={chapters}
        share={{ url: 'https://example.com/news/1' }}
      />,
    );
    expect(screen.getByRole('link', { name: 'X でシェア' })).toBeInTheDocument();
  });
});

describe('kind による型の分岐（実測 0/12 を型で固定する）', () => {
  it('News は著者・目次・更新日を型として持たない', () => {
    render(
      <ArticleBodySection
        kind="news"
        title="x"
        publishedAt="2026-07-30"
        chapters={chapters}
        // @ts-expect-error 著者は News に存在しない（実測 0/12）
        author={{ name: '金子 卓也' }}
      />,
    );
    expect(screen.queryByText('金子 卓也')).not.toBeInTheDocument();
  });

  it('News では目次を出さない', () => {
    render(
      <ArticleBodySection
        kind="news"
        title="x"
        publishedAt="2026-07-30"
        chapters={chapters}
        // @ts-expect-error 目次は News に存在しない（実測 0/12）
        toc
      />,
    );
    expect(screen.queryByText('目次')).not.toBeInTheDocument();
  });

  it('ブログは著者を出す', () => {
    render(
      <ArticleBodySection
        kind="blog"
        title="x"
        publishedAt="2026-07-30"
        chapters={chapters}
        author={{ name: '金子 卓也', role: '編集部' }}
      />,
    );
    expect(screen.getByText('金子 卓也')).toBeInTheDocument();
    expect(screen.getByText('執筆 / 編集部')).toBeInTheDocument();
  });

  it('ブログは監修者を出す', () => {
    render(
      <ArticleBodySection
        kind="blog"
        title="x"
        publishedAt="2026-07-30"
        chapters={chapters}
        supervisor={{ name: '田中 太郎', role: '社会保険労務士' }}
      />,
    );
    expect(screen.getByText('監修 / 社会保険労務士')).toBeInTheDocument();
  });

  it('ブログは更新日を出す', () => {
    render(
      <ArticleBodySection
        kind="blog"
        title="x"
        publishedAt="2026-07-30"
        updatedAt="2026-08-01"
        chapters={chapters}
      />,
    );
    expect(screen.getByText(/最終更新/)).toHaveTextContent('2026.08.01');
  });

  it('ブログの目次は章見出しへのアンカーになる', () => {
    const { container } = render(
      <ArticleBodySection kind="blog" title="x" publishedAt="2026-07-30" chapters={chapters} toc />,
    );
    const link = screen.getByRole('link', { name: '取得の概要' });
    const href = link.getAttribute('href')!;
    expect(container.querySelector(href)).toBeInTheDocument();
  });

  it('章が1つしか無いときは目次を出さない（選ぶ意味がない）', () => {
    render(
      <ArticleBodySection
        kind="blog"
        title="x"
        publishedAt="2026-07-30"
        chapters={[chapters[0]]}
        toc
      />,
    );
    expect(screen.queryByText('目次')).not.toBeInTheDocument();
  });

  it('ブログ固有の props が DOM 属性へ漏れない', () => {
    const { container } = render(
      <ArticleBodySection
        kind="blog"
        title="x"
        publishedAt="2026-07-30"
        chapters={chapters}
        author={{ name: '金子 卓也' }}
        toc
      />,
    );
    const section = container.querySelector('section')!;
    expect(section.getAttribute('author')).toBeNull();
    expect(section.getAttribute('toc')).toBeNull();
  });

  it('a11y違反がない（ブログのフル構成）', async () => {
    const { container } = render(
      <ArticleBodySection
        kind="blog"
        title="人事評価の作り方"
        publishedAt="2026-07-30"
        updatedAt="2026-08-01"
        category="人事評価"
        backTo={{ label: 'ブログ一覧', href: '/blog' }}
        author={{ name: '金子 卓也', role: '編集部', bio: '人事領域を担当。' }}
        chapters={chapters}
        toc
        share={{ url: 'https://example.com/blog/1' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ArticleRelatedSection', () => {
  const related = [
    { href: '/news/a', title: '記事A', publishedAt: '2026-07-01' },
    { href: '/news/b', title: '記事B', publishedAt: '2026-06-01' },
  ];

  it('関連記事をカードで出す', () => {
    render(<ArticleRelatedSection title="関連記事" articles={related} />);
    expect(screen.getByRole('heading', { level: 2, name: '関連記事' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /記事A/ })).toHaveAttribute('href', '/news/a');
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <ArticleRelatedSection
        title="関連記事"
        articles={related}
        backTo={{ label: '一覧へ', href: '/news' }}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
