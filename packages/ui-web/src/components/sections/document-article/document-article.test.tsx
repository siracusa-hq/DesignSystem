import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { DocumentArticle } from './document-article';

const backTo = { label: 'ホームへ', href: '/' };

describe('DocumentArticle', () => {
  it('タイトルを h1 で出す（静的ページのタイトルを担う）', () => {
    render(
      <DocumentArticle title="プライバシーポリシー">
        <p>本文</p>
      </DocumentArticle>,
    );
    expect(
      screen.getByRole('heading', { level: 1, name: 'プライバシーポリシー' }),
    ).toBeInTheDocument();
  });

  it('backTo は任意（法務文書は単独で成立する）', () => {
    const { container } = render(
      <DocumentArticle title="プライバシーポリシー">
        <p>本文</p>
      </DocumentArticle>,
    );
    expect(container.querySelector('nav')).toBeNull();
  });

  it('backTo を渡すと戻り導線とパンくずを出す', () => {
    render(
      <DocumentArticle title="ページが見つかりません" backTo={backTo}>
        <p>本文</p>
      </DocumentArticle>,
    );
    expect(screen.getByRole('link', { name: 'ホームへ' })).toHaveAttribute('href', '/');
  });

  it('パンくずの現在地はリンクにしない', () => {
    const { container } = render(
      <DocumentArticle title="利用規約" backTo={backTo}>
        <p>本文</p>
      </DocumentArticle>,
    );
    const current = container.querySelector('[aria-current="page"]');
    expect(current).toHaveTextContent('利用規約');
    expect(current?.querySelector('a')).toBeNull();
  });

  it('本文（children）をそのまま組版する', () => {
    render(
      <DocumentArticle title="利用規約">
        <h2>第1条（適用）</h2>
        <p>本規約は、当社が提供するサービスの利用条件を定めるものです。</p>
      </DocumentArticle>,
    );
    expect(screen.getByRole('heading', { level: 2, name: '第1条（適用）' })).toBeInTheDocument();
    expect(
      screen.getByText('本規約は、当社が提供するサービスの利用条件を定めるものです。'),
    ).toBeInTheDocument();
  });

  it('リード文と要点パネルを出す', () => {
    render(
      <DocumentArticle
        title="特定商取引法に基づく表記"
        lead={['本ページは特定商取引法第11条に基づく表記です。']}
        panel={[{ label: '事業者名', body: 'シラクサ株式会社' }]}
      >
        <p>本文</p>
      </DocumentArticle>,
    );
    expect(screen.getByText('本ページは特定商取引法第11条に基づく表記です。')).toBeInTheDocument();
    expect(screen.getByText('事業者名')).toBeInTheDocument();
    expect(screen.getByText('シラクサ株式会社')).toBeInTheDocument();
  });

  it('制定日と改定日を出す', () => {
    render(
      <DocumentArticle
        title="プライバシーポリシー"
        publishedAt="2024年4月1日 制定"
        updatedAt="2026年8月1日"
      >
        <p>本文</p>
      </DocumentArticle>,
    );
    expect(screen.getByText('2024年4月1日 制定')).toBeInTheDocument();
    expect(screen.getByText(/最終更新/)).toHaveTextContent('2026年8月1日');
  });

  /* 記事は article-detail ページ型（ArticleBodySection）の担当。
     カテゴリ・著者・関連記事といった記事固有の語彙をここに足さないこと
     （packages/ui-web/docs/article-pages-workorder.md） */
  it('記事固有の語彙（カテゴリ）を受け取らない', () => {
    render(
      // @ts-expect-error category は記事の語彙なのでこの部品には存在しない
      <DocumentArticle title="利用規約" category="プレスリリース">
        <p>本文</p>
      </DocumentArticle>,
    );
    expect(screen.queryByText('プレスリリース')).not.toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <DocumentArticle
        title="プライバシーポリシー"
        backTo={backTo}
        publishedAt="2024年4月1日 制定"
        lead={['リード文']}
        panel={[{ label: '事業者名', body: 'シラクサ株式会社' }]}
      >
        <h2>第1条（適用）</h2>
        <p>本文</p>
        <ul>
          <li>項目</li>
        </ul>
      </DocumentArticle>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
