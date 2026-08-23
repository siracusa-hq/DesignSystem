import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MediaFrame } from '@/components/primitives/media-frame';
import { BusinessShowcase, type BusinessLine } from './business-showcase';

const businesses: BusinessLine[] = [
  {
    name: 'プラットフォーム事業',
    lead: '企業がシステムを安全かつスピーディにリリースするためのプラットフォームを開発・提供しています',
    products: [
      {
        brand: 'polastack',
        name: 'Polastack',
        description: '企業品質の堅牢な基盤に API ひとつで繋がる Enterprise Backend Platform。',
        audience: '受託開発企業・SaaS 運営者・社内開発チーム',
        cta: { label: 'Polastack を見る', href: 'https://polastack.com' },
      },
    ],
  },
  {
    name: '社内DX事業',
    lead: '中小企業向けの業務支援パッケージと DX 伴走支援で生産性の向上を支援します',
    products: [
      {
        brand: 'peerdesk',
        name: 'ピアデスク',
        description: 'AI スタッフが雑務を引き受ける中小企業向けの業務システムパッケージ。',
        audience: '中小企業の経営層・現場',
        cta: { label: 'ピアデスクを見る', href: 'https://peerdesk.jp' },
      },
      {
        name: '顧問エンジニア',
        description: '各企業様固有のニーズに応じたシステムの開発・運営を代行します。',
        cta: { label: '1 時間の無料相談', href: '/contact' },
      },
    ],
  },
];

describe('BusinessShowcase', () => {
  it('まとまり見出し（h2）→ 事業（h3）→ プロダクト（h4）の2階層で組む', () => {
    render(<BusinessShowcase title="事業内容" businesses={businesses} />);
    expect(screen.getByRole('heading', { level: 2, name: '事業内容' })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: 'プラットフォーム事業' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: '社内DX事業' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Polastack' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'ピアデスク' })).toBeInTheDocument();
  });

  it('事業のリード文を出す', () => {
    render(<BusinessShowcase businesses={businesses} />);
    expect(
      screen.getByText(/企業がシステムを安全かつスピーディにリリースする/),
    ).toBeInTheDocument();
  });

  it('プロダクトごとに CTA リンクを出す（商談の入口なので省略不可）', () => {
    render(<BusinessShowcase businesses={businesses} />);
    expect(screen.getByRole('link', { name: 'Polastack を見る' })).toHaveAttribute(
      'href',
      'https://polastack.com',
    );
    expect(screen.getByRole('link', { name: '1 時間の無料相談' })).toHaveAttribute(
      'href',
      '/contact',
    );
  });

  it('audience 行を既定ラベル「対象」つきで出し、audienceLabel で差し替えられる', () => {
    const { container, rerender } = render(<BusinessShowcase businesses={businesses} />);
    expect(container.textContent).toContain('対象');
    expect(container.textContent).toContain('受託開発企業・SaaS 運営者・社内開発チーム');

    rerender(<BusinessShowcase businesses={businesses} audienceLabel="For" />);
    expect(container.textContent).toContain('For');
    expect(container.textContent).not.toContain('対象');
  });

  it('交互配置は事業をまたいで通しで数える（2件目のプロダクトが reversed になる）', () => {
    const { container } = render(<BusinessShowcase businesses={businesses} />);
    const rows = container.querySelectorAll('.row');
    expect(rows).toHaveLength(3);
    expect(rows[0]).not.toHaveClass('reversed');
    expect(rows[1]).toHaveClass('reversed'); // 2事業目の1件目だが、通し番号では2件目
    expect(rows[2]).not.toHaveClass('reversed');
  });

  it('プロダクトは data-brand を持ち、テーマ契約でブランド色が乗る', () => {
    const { container } = render(<BusinessShowcase businesses={businesses} />);
    expect(container.querySelector('[data-brand="polastack"]')).toBeInTheDocument();
    expect(container.querySelector('[data-brand="peerdesk"]')).toBeInTheDocument();
  });

  it('image 未指定なら MediaFrame のプレースホルダで枠を保つ（素材が揃う前に組める）', () => {
    render(<BusinessShowcase businesses={businesses} />);
    expect(screen.getByText('Polastack', { selector: 'div[aria-hidden]' })).toBeInTheDocument();
  });

  it('image に MediaFrame を渡すとそれを出す', () => {
    render(
      <BusinessShowcase
        businesses={[
          {
            name: 'プラットフォーム事業',
            products: [
              {
                name: 'Polastack',
                description: 'Enterprise Backend Platform',
                cta: { label: 'Polastack を見る', href: 'https://polastack.com' },
                image: <MediaFrame src="/polastack.png" alt="Polastack の管理画面" />,
              },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByAltText('Polastack の管理画面')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<BusinessShowcase title="事業内容" businesses={businesses} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
