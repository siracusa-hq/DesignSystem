import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ResourceListSection } from './resource-list';
import type { ResourceListItem } from '@/components/sections/resource-card';

const resources: ResourceListItem[] = [
  {
    href: '/dl/onboarding',
    title: 'オンボーディング設計ガイド',
    category: '導入の実務',
    description: '入社初日から3か月までの設計手順をまとめました。',
    cover: { src: '/cover1.png', alt: 'オンボーディング設計ガイドの表紙' },
  },
  { href: '/form/download_cases', title: '導入事例集', category: '事例' },
  { href: '/dl/checklist', title: '権限設計チェックリスト', category: '導入の実務' },
];

describe('ResourceListSection', () => {
  it('資料をすべてカードとして出す', () => {
    render(<ResourceListSection title="お役立ち資料" resources={resources} />);
    resources.forEach((r) => {
      expect(screen.getByRole('link', { name: new RegExp(r.title) })).toHaveAttribute(
        'href',
        r.href,
      );
    });
  });

  /* 実測に「詳細ページ経由」と「フォーム直行」の両方が存在するため、
     href の意味を型でも実装でも固定しない（§9-1） */
  it('遷移先がフォーム直行でもそのまま出す', () => {
    render(<ResourceListSection title="お役立ち資料" resources={resources} />);
    expect(screen.getByRole('link', { name: /導入事例集/ })).toHaveAttribute(
      'href',
      '/form/download_cases',
    );
  });

  it('ヒーローを持たないため h1 を出す', () => {
    render(<ResourceListSection title="お役立ち資料" resources={resources} />);
    expect(screen.getByRole('heading', { level: 1, name: 'お役立ち資料' })).toBeInTheDocument();
  });

  /* 記事一覧との最大の違い。実測 0/7 */
  it('日付を出さない', () => {
    const { container } = render(<ResourceListSection title="資料" resources={resources} />);
    expect(container.querySelector('time')).toBeNull();
  });

  /* 実測 0/7・無限スクロールも 0/31 */
  it('ページ送りを出さない', () => {
    const { container } = render(
      <ResourceListSection
        title="資料"
        resources={Array.from({ length: 40 }, (_, i) => ({ href: `/dl/${i}`, title: `資料${i}` }))}
      />,
    );
    expect(container.querySelector('nav')).toBeNull();
  });

  it('カテゴリが2種類以上あるときだけフィルタを出す', () => {
    render(<ResourceListSection title="資料" resources={resources} />);
    expect(screen.getByText('カテゴリ')).toBeInTheDocument();

    const single = resources.map((r) => ({ ...r, category: '事例' }));
    render(<ResourceListSection title="資料" resources={single} />);
    // 1種類しかない方は増えない（最初の1つだけが残る）
    expect(screen.getAllByText('カテゴリ')).toHaveLength(1);
  });

  it('ピックアップを先頭に出す', () => {
    render(
      <ResourceListSection title="資料" resources={resources} pickup={[resources[0]]} />,
    );
    expect(screen.getAllByRole('link', { name: /オンボーディング設計ガイド/ })).toHaveLength(2);
  });

  it('表紙の alt を出す', () => {
    render(<ResourceListSection title="資料" resources={resources} />);
    expect(screen.getByAltText('オンボーディング設計ガイドの表紙')).toBeInTheDocument();
  });

  it('該当が無いときは空状態を出す', () => {
    render(<ResourceListSection title="資料" resources={[]} />);
    expect(screen.getByText(/条件に一致する資料はありません/)).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <ResourceListSection title="お役立ち資料" resources={resources} pickup={[resources[0]]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
