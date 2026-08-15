import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { ArticleListSection } from './article-list';
import type { ArticleListItem } from '@/components/sections/article-card';

const articles: ArticleListItem[] = [
  {
    href: '/news/soc2',
    title: 'SOC 2 Type II 報告書を取得しました',
    publishedAt: '2026-07-30',
    category: 'プレスリリース',
    excerpt: '第三者評価を受けました。',
  },
  {
    href: '/news/audit-log',
    title: '実行ログを監査証跡として書き出せるようになりました',
    publishedAt: '2026-07-14',
    category: '製品アップデート',
  },
  {
    href: '/news/expo',
    title: 'Japan IT Week 2026 に出展します',
    publishedAt: '2025-06-26',
    category: 'イベント',
  },
];

describe('ArticleListSection', () => {
  it('記事をすべてカードとして出す', () => {
    render(<ArticleListSection title="お知らせ" articles={articles} />);
    articles.forEach((a) => {
      expect(screen.getByRole('link', { name: new RegExp(a.title) })).toHaveAttribute(
        'href',
        a.href,
      );
    });
  });

  it('ヒーローを持たないため h1 を出す', () => {
    render(<ArticleListSection title="お知らせ" articles={articles} />);
    expect(screen.getByRole('heading', { level: 1, name: 'お知らせ' })).toBeInTheDocument();
  });

  /* 実測が4通りに割れているため、書式はシステムが決める（利用側に選ばせない） */
  it('ISO の日付を YYYY.MM.DD に正規化して出す', () => {
    const { container } = render(<ArticleListSection title="お知らせ" articles={articles} />);
    const time = container.querySelector('time[datetime="2026-07-30"]');
    expect(time).toHaveTextContent('2026.07.30');
  });

  it('件数を出す', () => {
    render(<ArticleListSection title="お知らせ" articles={articles} />);
    expect(screen.getByText('3件中 3件')).toBeInTheDocument();
  });

  it('値が2種類以上ある軸だけフィルタを出す', () => {
    render(<ArticleListSection title="お知らせ" articles={articles} />);
    expect(screen.getByText('カテゴリ')).toBeInTheDocument();
    expect(screen.getByText('年')).toBeInTheDocument();
  });

  it('1種類しか値が無い軸のフィルタは出さない', () => {
    const single = articles.map((a) => ({ ...a, category: 'お知らせ' }));
    render(<ArticleListSection title="お知らせ" articles={single} />);
    expect(screen.queryByText('カテゴリ')).not.toBeInTheDocument();
  });

  it('pageSize を超えるとページ送りを出し、切り替わる', async () => {
    const user = userEvent.setup();
    render(<ArticleListSection title="お知らせ" articles={articles} pageSize={2} />);
    expect(screen.queryByText(articles[2].title)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText(articles[2].title)).toBeInTheDocument();
  });

  it('1ページに収まるときはページ送りを出さない', () => {
    render(<ArticleListSection title="お知らせ" articles={articles} />);
    expect(
      screen.queryByRole('navigation', { name: '記事一覧のページ送り' }),
    ).not.toBeInTheDocument();
  });

  it('該当が無いときは空状態を出す', () => {
    render(<ArticleListSection title="お知らせ" articles={[]} />);
    expect(screen.getByText(/条件に一致する記事はありません/)).toBeInTheDocument();
  });

  it('サムネイルは任意（無くても成立する）', () => {
    const { container } = render(<ArticleListSection title="お知らせ" articles={articles} />);
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('サムネイルの alt を出す', () => {
    render(
      <ArticleListSection
        title="お知らせ"
        articles={[{ ...articles[0], thumbnail: { src: '/a.jpg', alt: '会場の様子' } }]}
      />,
    );
    expect(screen.getByAltText('会場の様子')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <ArticleListSection title="お知らせ" articles={articles} pageSize={2} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
