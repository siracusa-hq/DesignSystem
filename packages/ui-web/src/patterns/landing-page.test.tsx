import * as React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

const caseListInput = defineLandingPage({
  pattern: 'case-study-list',
  brand: 'peerdesk-taxpeer',
  page: {
    eyebrow: 'Case Studies',
    title: '導入事例',
    description: '業種・規模から近い事例を探せます。',
  },
  list: {
    cases: [
      {
        companyName: 'あさひ製作所',
        summary: '書類回収の催促がゼロになりました。',
        industry: '製造業',
        employeeRange: '51〜300名',
      },
    ],
  },
  closing: {
    title: '自社の事例を見つけてください',
    actions: [{ label: '資料をダウンロード', href: '#dl' }],
  },
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
    expect(
      defineLandingPage({
        pattern: 'case-study-list',
        brand: 'corporate',
        page: { title: '導入事例' },
        list: { cases: [] },
      }).tone,
    ).toBe('product');
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
      const el = screen.getAllByText(
        (content, node) => node?.textContent === t || content === t,
      )[0];
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

  it('case-study-list: ページタイトル（h1）→ 一覧 → 締めの順。ヒーローは持たない', () => {
    const { container } = render(<LandingPage {...caseListInput} />);
    // キャッチコピー型ヒーローではなく短いページタイトル（実測）
    expect(screen.getByRole('heading', { level: 1, name: '導入事例' })).toBeInTheDocument();
    const texts = ['導入事例', 'あさひ製作所', '自社の事例を見つけてください'];
    const positions = texts.map((t) => {
      const el = screen.getAllByText(
        (content, node) => node?.textContent === t || content === t,
      )[0];
      return Array.prototype.indexOf.call(container.querySelectorAll('*'), el);
    });
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('case-study-list: closing 省略時は最終 CTA を描画しない', () => {
    const { closing: _closing, ...withoutClosing } = caseListInput;
    render(<LandingPage {...(withoutClosing as typeof caseListInput)} />);
    expect(screen.queryByText('自社の事例を見つけてください')).toBeNull();
    expect(screen.getByRole('heading', { level: 1, name: '導入事例' })).toBeInTheDocument();
  });

  it('a11y 違反なし（case-study-list パターン全体）', async () => {
    const { container } = render(<LandingPage {...caseListInput} />);
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);

  it('a11y 違反なし（product パターン全体）', async () => {
    const { container } = render(<LandingPage {...productInput} />);
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);
});

/* ============================================================
   計測フック（Stage 4 Slice 0）
   ============================================================ */

const ctaIdsOf = (container: HTMLElement) =>
  Array.from(container.querySelectorAll('[data-cta]')).map((el) => el.getAttribute('data-cta'));

const withHeader = {
  ...productInput,
  header: { actions: [{ label: '資料をダウンロード', href: '#dl' }] },
};

describe('data-cta の自動割当', () => {
  it('product: ヘッダー → hero → 帯 → 料金 → 締め の順に一意な id が付く', () => {
    const { container } = render(<LandingPage {...withHeader} />);
    /* id はセクションが割り当てる（呼び出し側は命名しない）。
       DOM 順 = ページ上の出現順 */
    expect(ctaIdsOf(container)).toEqual([
      'header-0',
      'hero-0',
      'hero-1',
      'cta-band-0',
      'cta-band-1',
      'pricing-0',
      'closing-0',
      'closing-1',
    ]);
  });

  it('料金プランが複数ならインデックスで区別される', () => {
    const { container } = render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'product',
          brand: 'corporate',
          hero: { title: 't', offers: [] },
          features: { features: [] },
          pricing: {
            plans: [
              { name: 'A', price: '¥1', features: [], action: { label: 'x', href: '#a' } },
              { name: 'B', price: '¥2', features: [], action: { label: 'x', href: '#b' } },
            ],
          },
          closing: { title: '締め', actions: [] },
        })}
      />,
    );
    expect(ctaIdsOf(container)).toEqual(['pricing-0', 'pricing-1']);
  });

  it('lead-gen: フォームの送信ボタンは form-submit（form-name で区別できるため一律）', () => {
    const { container } = render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'lead-gen',
          brand: 'peerdesk',
          hero: { title: '5分でわかるピアデスク', offers: [{ label: '資料へ', href: '#form' }] },
          contents: { features: [] },
          form: <ResourceRequestForm title="資料請求" ichisanEnabled={false} />,
        })}
      />,
    );
    expect(ctaIdsOf(container)).toEqual(['hero-0', 'form-submit']);
  });

  it('case-study-list: 締めの CTA だけが id を持つ', () => {
    const { container } = render(<LandingPage {...caseListInput} />);
    expect(ctaIdsOf(container)).toEqual(['closing-0']);
  });
});

describe('LandingPage.onCTAClick', () => {
  it('ページ内の全 CTA のクリックを1つのハンドラで受け取る（ヘッダー含む）', async () => {
    const onCTAClick = vi.fn();
    render(<LandingPage {...withHeader} onCTAClick={onCTAClick} />);

    /* ヘッダーは Page ではなく PageLayout の直下に描画される。
       委譲を PageLayout に張っているので、ここも取りこぼさない（§7） */
    await userEvent.click(
      within(screen.getByRole('banner')).getByRole('link', { name: '資料をダウンロード' }),
    );
    expect(onCTAClick).toHaveBeenLastCalledWith(
      { id: 'header-0', label: '資料をダウンロード', href: '#dl' },
      expect.anything(),
    );

    // 同じラベルが hero と締めで反復される（ラベル2種ルール）ので先頭 = hero を押す
    await userEvent.click(screen.getAllByRole('link', { name: '料金を見る' })[0]);
    expect(onCTAClick).toHaveBeenLastCalledWith(
      { id: 'hero-1', label: '料金を見る', href: '#price' },
      expect.anything(),
    );
    expect(onCTAClick).toHaveBeenCalledTimes(2);
  });

  it('CTA 以外のリンク（ナビゲーション）では発火しない', async () => {
    const onCTAClick = vi.fn();
    render(
      <LandingPage
        {...productInput}
        header={{ navItems: [{ label: '機能', href: '#features' }] }}
        onCTAClick={onCTAClick}
      />,
    );
    await userEvent.click(screen.getByRole('link', { name: '機能' }));
    expect(onCTAClick).not.toHaveBeenCalled();
  });
});
