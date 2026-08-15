import * as React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import {
  defineLandingPage,
  LandingPage,
  LANDING_PAGE_PATTERNS,
  type OfferPair,
  type CaseStudyDetailInput,
} from './index';
import { ResourceRequestForm } from '@/components/sections/form';
import pageStyles from '@/components/layout/page/page.module.css';

const offers: OfferPair = [
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
  proof: {
    stats: { stats: [{ value: '800事務所', label: '導入' }], asOf: '2026年7月時点' },
  },
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

const caseDetailInput = defineLandingPage({
  pattern: 'case-study-detail',
  brand: 'peerdesk-taxpeer',
  article: {
    title: '書類回収の催促がゼロに。決算前の残業が消えた',
    backTo: { label: '導入事例', href: '/case' },
    photo: { src: '/hero.jpg', alt: '工場の事務所で打ち合わせをする様子' },
    lead: '同社は3年前から月次決算の早期化に取り組んでいる。',
    publishedAt: '2026.07.31',
  },
  profile: {
    companyName: 'あさひ製作所',
    industry: '製造業',
    employeeRange: '51〜300名',
    service: 'タックスピア',
    challenges: ['書類回収'],
  },
  summary: { challenge: ['催促に時間がかかる'], effect: ['残業がゼロに'] },
  chapters: [
    { heading: '導入前は電話をかけ続けていた', paragraphs: ['期日の3日前から電話をかけていました。'] },
    { heading: '催促そのものが消えた', paragraphs: ['催促は自動で回るようになりました。'] },
  ],
  related: [
    { companyName: 'みなと商事', summary: '月次決算が5営業日早まりました。', href: '/case/minato' },
    { companyName: 'そらまめ工業', summary: '書類の紛失がなくなりました。', href: '/case/soramame' },
  ],
  closing: {
    title: '自社に近い事例をお探しですか',
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
    expect(caseDetailInput.tone).toBe('product');
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

  it('case-study-detail: 記事（h1）→ 関連事例 → 締めの順。ヒーローは持たない', () => {
    const { container } = render(<LandingPage {...caseDetailInput} />);
    expect(
      screen.getByRole('heading', { level: 1, name: '書類回収の催促がゼロに。決算前の残業が消えた' }),
    ).toBeInTheDocument();
    const texts = [
      '導入前は電話をかけ続けていた', // 章（記事本体）
      '関連事例',
      'みなと商事',
      '事例一覧をみる',
      '自社に近い事例をお探しですか', // 締め
    ];
    const positions = texts.map((t) => {
      const el = screen.getAllByText(
        (content, node) => node?.textContent === t || content === t,
      )[0];
      return Array.prototype.indexOf.call(container.querySelectorAll('*'), el);
    });
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('case-study-detail: 記事本体は単一の面（章のあいだに面リズムが入らない）', () => {
    const { container } = render(<LandingPage {...caseDetailInput} />);
    const articles = container.querySelectorAll('article');
    expect(articles).toHaveLength(1);
    // 章はすべて同じ記事（= 同じ面）の中にある。面リズムは章のあいだに入らない（実測 9/9）
    const chapterHeadings = within(articles[0] as HTMLElement).getAllByRole('heading', {
      level: 2,
    });
    expect(chapterHeadings).toHaveLength(2);
    // リズムの対象は 記事本体 / 関連事例 / 締め の3スロットだけ
    expect(container.querySelectorAll('section').length).toBeGreaterThanOrEqual(3);
  });

  it('case-study-detail: related は2件以上（型で落とす）', () => {
    const oneRelated: CaseStudyDetailInput = {
      ...caseDetailInput,
      // @ts-expect-error -- related は2件以上のタプル
      related: [{ companyName: 'みなと商事', summary: '月次決算が早まりました。' }],
    };
    expect(oneRelated).toBeTruthy();
  });

  it('a11y 違反なし（case-study-detail パターン全体）', async () => {
    const { container } = render(<LandingPage {...caseDetailInput} />);
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);

  it('a11y 違反なし（case-study-list パターン全体）', async () => {
    const { container } = render(<LandingPage {...caseListInput} />);
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);

  it('a11y 違反なし（product パターン全体）', async () => {
    const { container } = render(<LandingPage {...productInput} />);
    expect(await axe(container)).toHaveNoViolations();
  }, 15000);
});

describe('社会的証明スロットの空検査（Stage 5 Slice 1）', () => {
  /** proof だけを外した product 入力 */
  const withoutProof = (() => {
    const { proof: _proof, ...rest } = productInput;
    return rest as typeof productInput;
  })();

  it('product で proof が無いと dev 警告を出す（実測 19/19 が数値訴求を持つ）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LandingPage {...withoutProof} />);
    const messages = warn.mock.calls.map((c) => String(c[0]));
    const proofWarnings = messages.filter((m) => m.includes('社会的証明スロット'));
    expect(proofWarnings).toHaveLength(1);
    expect(proofWarnings[0]).toContain('19/19');
  });

  it('product-portfolio-top でも同じ検査が効く', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'product-portfolio-top',
          brand: 'peerdesk',
          hero: { title: 'シリーズでなくす。', offers },
          products: { services: [] },
          closing: { title: '締め' },
        })}
      />,
    );
    expect(warn.mock.calls.map((c) => String(c[0])).join('\n')).toContain('社会的証明スロット');
  });

  it('proof.stats があれば警告しない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LandingPage {...productInput} />);
    expect(warn).not.toHaveBeenCalled();
  });

  it('proof.logos（6社以上）でも警告しない（ロゴと数値は代替関係）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <LandingPage
        {...defineLandingPage({
          ...productInput,
          proof: {
            logos: {
              logos: Array.from({ length: 6 }, (_, i) => ({ name: `Company ${i}` })),
            },
          },
        })}
      />,
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it('proof スロットを持たないパターン（lead-gen / corporate-top / case-study-list）では出さない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LandingPage {...caseListInput} />);
    render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'corporate-top',
          brand: 'corporate',
          hero: { title: '事業の裏側を、まっすぐに。' },
          services: { title: '事業内容', services: [] },
        })}
      />,
    );
    expect(warn.mock.calls.map((c) => String(c[0])).join('\n')).not.toContain('社会的証明スロット');
  });
});

/* ============================================================
   面の割当（2026-08）

   LP 系のパターンは「白の連続の中に社会的証明だけがティントで浮かぶ」割当を持つ。
   機械的な ABAB ゼブラの実サイトは実測で確認できておらず、面交替は 1〜3 回が主流
   （docs/research/research-eyebrow.md §4-3）。どのスロットが浮くかは
   パターンの設計判断そのものなので、ここで固定する。
   ============================================================ */

/** そのテキストを含むセクションに割り当てられた面（スロットの有無から読む） */
const surfaceOfText = (text: string) => {
  const el = screen.getAllByText(text)[0];
  if (el.closest(`.${pageStyles.slotTinted}`)) return 'tinted';
  if (el.closest(`.${pageStyles.slotMuted}`)) return 'muted';
  return 'default';
};

describe('パターンごとの面シーケンス', () => {
  it('product: 社会的証明（proof / 事例）だけがティント、他は白（交替2回）', () => {
    render(<LandingPage {...productInput} />);
    expect(surfaceOfText('税務書類の収集を、追いかけずに終わらせる。')).toBe('default'); // hero
    expect(surfaceOfText('800事務所')).toBe('tinted'); // proof
    expect(surfaceOfText('主要機能')).toBe('default'); // features
    expect(surfaceOfText('料金')).toBe('default'); // pricing
    expect(surfaceOfText('導入事例')).toBe('tinted'); // cases
    expect(surfaceOfText('よくある質問')).toBe('default'); // faq
    // ニュートラルの沈んだ面は LP 系パターンでは使わない
    expect(document.querySelectorAll(`.${pageStyles.slotMuted}`)).toHaveLength(0);
  });

  it('product-portfolio-top: proof と事例がティント、製品カードは白', () => {
    render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'product-portfolio-top',
          brand: 'corporate',
          hero: { title: 'シリーズで、まとめてなくす。', offers },
          proof: {
            stats: { stats: [{ value: '2,000社', label: '導入' }], asOf: '2026年7月時点' },
          },
          products: {
            title: 'プロダクト',
            services: [
              { brand: 'polastack', name: 'Polastack', description: 'Agent 基盤', href: '#' },
            ],
          },
          midCta: { title: 'まずは資料からご覧ください' },
          cases: {
            title: '導入事例',
            cases: [{ companyName: 'あさひ製作所', quote: '書類回収が自動化されました。' }],
          },
          closing: { title: '締めの見出し' },
        })}
      />,
    );
    expect(surfaceOfText('2,000社')).toBe('tinted'); // proof
    expect(surfaceOfText('プロダクト')).toBe('default'); // products
    expect(surfaceOfText('導入事例')).toBe('tinted'); // cases
    expect(document.querySelectorAll(`.${pageStyles.slotMuted}`)).toHaveLength(0);
  });

  it('lead-gen: 資料の中身とフォームがティント、数値は白', () => {
    render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'lead-gen',
          brand: 'peerdesk',
          hero: { title: '5分でわかるピアデスク' },
          contents: {
            title: '資料の内容',
            features: [{ title: '機能一覧', description: '全機能の概要を掲載。' }],
          },
          stats: { title: '数字で見るピアデスク', stats: [{ value: '98%', label: '継続率' }], asOf: '2026年7月時点' },
          form: <ResourceRequestForm title="資料請求" ichisanEnabled={false} />,
        })}
      />,
    );
    expect(surfaceOfText('5分でわかるピアデスク')).toBe('default'); // hero
    expect(surfaceOfText('資料の内容')).toBe('tinted'); // contents
    expect(surfaceOfText('数字で見るピアデスク')).toBe('default'); // stats
    expect(surfaceOfText('資料請求')).toBe('tinted'); // form
  });

  it('corporate-top: 従来どおりニュートラルの自動ゼブラ（ティントは使わない）', () => {
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
          stats: { title: '数字で見る', stats: [{ value: '3期', label: '連続黒字' }], asOf: '2026年7月時点' },
        })}
      />,
    );
    expect(surfaceOfText('事業の裏側を、まっすぐに。')).toBe('default');
    // hero=default → services=muted → stats=default（about 省略なので stats が3番目）
    expect(surfaceOfText('事業内容')).toBe('muted');
    expect(surfaceOfText('数字で見る')).toBe('default');
    expect(document.querySelectorAll(`.${pageStyles.slotTinted}`)).toHaveLength(0);
  });

  it('条件付きスロットを省いても面がズレない（pricing / reasons / faq なし）', () => {
    const { pricing: _p, reasons: _r, faq: _f, ...withoutOptional } = productInput as typeof productInput & {
      reasons?: unknown;
    };
    render(<LandingPage {...(withoutOptional as typeof productInput)} />);
    // 落ちたスロットの surface も一緒に落ちるので、事例はティントのまま
    expect(surfaceOfText('800事務所')).toBe('tinted');
    expect(surfaceOfText('主要機能')).toBe('default');
    expect(surfaceOfText('導入事例')).toBe('tinted');
  });
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
          hero: { title: 't', offers: [{ label: 'x', href: '#x' }] },
          proof: { stats: { stats: [{ value: '1', label: 'n' }], asOf: '2026年7月時点' } },
          features: { features: [] },
          pricing: {
            plans: [
              { name: 'A', price: '¥1', features: [], action: { label: 'x', href: '#a' } },
              { name: 'B', price: '¥2', features: [], action: { label: 'x', href: '#b' } },
            ],
          },
          closing: { title: '締め' },
        })}
      />,
    );
    expect(ctaIdsOf(container)).toEqual(['hero-0', 'pricing-0', 'pricing-1', 'closing-0']);
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

/* ============================================================
   獲得系ページ型（2026-08-15。acquisition-pages-workorder.md）
   ============================================================ */

describe('lead-gen の header? 緩和が非破壊であること', () => {
  /** 資料個票は 6/6 がグローバルナビを持つため header を渡せるようにした。
      ただし**省略時に剥がす既定は据え置き**で、既存の呼び出しは変わらない */
  it('header を渡さなければグローバルナビは出ない（既存の挙動）', () => {
    const { container } = render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'lead-gen',
          brand: 'peerdesk',
          hero: { title: '5分でわかるピアデスク' },
          contents: { features: [{ title: '機能一覧', description: '全機能の概要を掲載。' }] },
          form: <ResourceRequestForm title="資料請求" ichisanEnabled={false} />,
        })}
      />,
    );
    expect(container.querySelector('header')).toBeNull();
  });

  it('header を渡すとグローバルナビが出る（資料個票）', () => {
    render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'lead-gen',
          brand: 'peerdesk',
          header: { navItems: [{ label: '機能', href: '#f' }] },
          hero: { title: '5分でわかるピアデスク' },
          contents: { features: [{ title: '機能一覧', description: '全機能の概要を掲載。' }] },
          form: <ResourceRequestForm title="資料請求" ichisanEnabled={false} />,
        })}
      />,
    );
    expect(screen.getByRole('link', { name: '機能' })).toBeInTheDocument();
  });
});

describe('獲得系3型の tone は campaign', () => {
  it.each(['resources-library', 'seminar-list', 'seminar-detail'] as const)('%s', (pattern) => {
    const input =
      pattern === 'seminar-detail'
        ? { pattern, brand: 'corporate' as const, seminar: { status: 'upcoming' as const, title: 't', startAt: '2026-09-10' } }
        : pattern === 'seminar-list'
          ? { pattern, brand: 'corporate' as const, page: { title: 't' }, list: { seminars: [] } }
          : { pattern, brand: 'corporate' as const, page: { title: 't' }, list: { resources: [] } };
    expect(defineLandingPage(input).tone).toBe('campaign');
  });
});

describe('resources-library / seminar-* の描画', () => {
  it('資料ライブラリは末尾 CTA を持たない（資料そのものがオファー）', () => {
    const { container } = render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'resources-library',
          brand: 'corporate',
          page: { title: 'お役立ち資料' },
          list: { resources: [{ href: '/dl/1', title: '導入事例集' }] },
        })}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'お役立ち資料' })).toBeInTheDocument();
    // CTASection は中央寄せの見出し + オファーを持つ。ここには無い
    expect(container.querySelectorAll('section')).toHaveLength(1);
  });

  it('セミナー詳細は1セクションで完結し、フォームが締めになる', () => {
    const { container } = render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'seminar-detail',
          brand: 'corporate',
          seminar: {
            status: 'upcoming',
            title: '現場DXの始め方',
            startAt: '2026-09-10T14:00',
            form: <ResourceRequestForm title="お申し込み" ichisanEnabled={false} />,
          },
        })}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: '現場DXの始め方' })).toBeInTheDocument();
    expect(container.querySelector('form')).toBeInTheDocument();
  });
});

/* ============================================================
   ContentHub（2026-08-15。content-hub-workorder.md）
   ============================================================ */

describe('contentHub スロットの追加が非破壊であること', () => {
  const productBase = {
    pattern: 'product' as const,
    brand: 'corporate' as const,
    hero: { title: 't', offers: [{ label: '資料をダウンロード', href: '#dl' }] as OfferPair },
    features: { features: [{ title: 'f', description: 'd' }] },
    closing: { title: 'c' },
  };

  it('contentHub を渡さなければ描画されるセクション数が変わらない', () => {
    const { container } = render(<LandingPage {...defineLandingPage(productBase)} />);
    const before = container.querySelectorAll('section').length;

    const { container: after } = render(
      <LandingPage
        {...defineLandingPage({
          ...productBase,
          contentHub: {
            groups: [{ kind: 'resource', items: [{ href: '#dl1', title: '資料' }] }],
          },
        })}
      />,
    );
    expect(after.querySelectorAll('section').length).toBeGreaterThan(before);
  });

  it('コンテンツ回遊は FAQ の後・締めの前に入る（実測 11/11 が最終CTAの前）', () => {
    const { container } = render(
      <LandingPage
        {...defineLandingPage({
          ...productBase,
          faq: { title: 'よくある質問', items: [{ question: 'q', answer: 'a' }] },
          contentHub: {
            title: '関連コンテンツ',
            groups: [{ kind: 'resource', title: 'お役立ち資料', items: [{ href: '#dl1', title: '資料' }] }],
          },
          closing: { title: '締めの見出し' },
        })}
      />,
    );
    const text = container.textContent ?? '';
    expect(text.indexOf('よくある質問')).toBeLessThan(text.indexOf('関連コンテンツ'));
    expect(text.indexOf('関連コンテンツ')).toBeLessThan(text.indexOf('締めの見出し'));
  });

  it('product-portfolio-top でも使える', () => {
    render(
      <LandingPage
        {...defineLandingPage({
          pattern: 'product-portfolio-top',
          brand: 'corporate',
          hero: { title: 't', offers: [{ label: '資料をダウンロード', href: '#dl' }] },
          products: {
            services: [{ brand: 'corporate', name: 'p', description: 'd', href: '#p' }],
          },
          contentHub: { groups: [{ kind: 'news', title: 'お知らせ', items: [{ href: '#n', title: 'n', publishedAt: '2026-07-30' }] }] },
          closing: { title: 'c' },
        })}
      />,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'お知らせ' })).toBeInTheDocument();
  });

  it('ページ型は 11 種のまま（ContentHub はセクションであってページ型ではない）', () => {
    expect(LANDING_PAGE_PATTERNS).toHaveLength(11);
  });
});
