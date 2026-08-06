import * as React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { defineLandingPage, LandingPage } from './index';
import { ResourceRequestForm } from '@/components/sections/form';

const offers = [
  { label: '資料をダウンロード', href: '#dl' },
  { label: '料金を見る', href: '#price' },
];

const productInput = defineLandingPage({
  pattern: 'product',
  brand: 'peerdesk-taxpeer',
  hero: {
    title: '税務書類の収集を、追いかけずに終わらせる。',
    subtitle: 'タックスピアは税理士事務所と顧問先をつなぐ書類収集ツールです。',
    offers,
  },
  proof: { stats: { stats: [{ value: '800事務所', label: '導入' }] } },
  features: {
    title: '主要機能',
    features: [
      { title: '自動リマインド', description: '未提出の顧問先に自動で催促します。' },
      { title: '進捗ボード', description: '全顧問先の提出状況を一覧できます。' },
    ],
  },
  midCta: { title: 'まずは資料からご覧ください', note: '無料・1分で完了' },
  pricing: {
    title: '料金',
    plans: [
      {
        name: 'スタンダード',
        price: '¥30,000',
        features: [],
        action: { label: '資料をダウンロード', href: '#dl' },
      },
    ],
  },
  cases: {
    title: '導入事例',
    cases: [{ companyName: 'サンプル会計事務所', quote: '回収率が9割を超えました。' }],
  },
  faq: { title: 'よくある質問', items: [{ question: '導入期間は?', answer: '平均3日です。' }] },
  closing: { title: 'まずは資料からご覧ください', socialProof: '800事務所が利用中' },
});

afterEach(() => vi.restoreAllMocks());

describe('defineLandingPage', () => {
  it('パターンごとの tone 既定を充填する', () => {
    expect(productInput.tone).toBe('product');
    expect(
      defineLandingPage({
        pattern: 'lead-gen',
        brand: 'corporate',
        hero: { title: 't' },
        contents: { features: [] },
        form: <ResourceRequestForm title="資料請求" />,
      }).tone,
    ).toBe('campaign');
    expect(
      defineLandingPage({
        pattern: 'corporate-top',
        brand: 'corporate',
        hero: { title: 't' },
        services: { services: [] },
      }).tone,
    ).toBe('trust');
  });

  it('明示した tone は上書きしない', () => {
    expect(defineLandingPage({ ...productInput, tone: 'trust' }).tone).toBe('trust');
  });

  it('必須スロットの欠落は型エラーになる', () => {
    // @ts-expect-error -- product は closing 必須
    const missingClosing: Parameters<typeof defineLandingPage>[0] = {
      pattern: 'product',
      brand: 'corporate',
      hero: { title: 't', offers },
      features: { features: [] },
    };
    expect(missingClosing).toBeTruthy();
  });
});

describe('LandingPage', () => {
  it('product: 実測順（Hero → 証明 → 機能 → 帯 → 料金 → 事例 → FAQ → 締め）で描画する', () => {
    const { container } = render(<LandingPage {...productInput} />);
    const texts = [
      '税務書類の収集を、追いかけずに終わらせる。',
      '800事務所',
      '主要機能',
      'まずは資料からご覧ください', // 帯
      '料金',
      '導入事例',
      'よくある質問',
      '800事務所が利用中', // 締め
    ];
    const positions = texts.map((t) => {
      const el = screen.getAllByText((content, node) => node?.textContent === t || content === t)[0];
      return Array.prototype.indexOf.call(container.querySelectorAll('*'), el);
    });
    const sorted = [...positions].sort((a, b) => a - b);
    expect(positions).toEqual(sorted);
  });

  it('midCta と closing は hero と同じオファーを再利用する（ラベル2種ルールの構造的担保）', () => {
    render(<LandingPage {...productInput} />);
    const dlLinks = screen.getAllByRole('link', { name: '資料をダウンロード' });
    // hero + 帯 + 締め（+ 料金カード）で同一ラベルが反復される
    expect(dlLinks.length).toBeGreaterThanOrEqual(3);
    expect(new Set(dlLinks.map((l) => l.textContent)).size).toBe(1);
  });

  it('brand / tone を data 属性で伝播する', () => {
    const { container } = render(<LandingPage {...productInput} />);
    expect(container.querySelector('[data-brand="peerdesk-taxpeer"]')).not.toBeNull();
    expect(container.querySelector('[data-tone="product"]')).not.toBeNull();
  });

  it('lead-gen: グローバルナビを持たず、締めはフォーム（Netlify 属性込み）', () => {
    const { container } = render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'lead-gen',
          brand: 'peerdesk',
          hero: { title: '5分でわかるピアデスク', subtitle: '資料を無料配布中。' },
          contents: {
            title: '資料の内容',
            features: [{ title: '機能一覧', description: '全機能の概要を掲載。' }],
          },
          form: <ResourceRequestForm title="資料請求" ichisanEnabled={false} />,
        })}
      />,
    );
    expect(screen.queryByRole('navigation')).toBeNull();
    expect(container.querySelector('form[data-netlify="true"]')).not.toBeNull();
  });

  it('corporate-top: closing 省略時はコンバージョン CTA を持たない', () => {
    render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'corporate-top',
          brand: 'corporate',
          hero: { title: '事業の裏側を、まっすぐに。' },
          services: {
            title: '事業内容',
            services: [
              { brand: 'polastack', name: 'Polastack', description: 'Agent 基盤', href: '#' },
            ],
          },
        })}
      />,
    );
    expect(screen.queryByText('まずは資料からご覧ください')).toBeNull();
  });

  it('a11y 違反なし（product パターン全体）', async () => {
    const { container } = render(<LandingPage {...productInput} />);
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);
});
