import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { CaseStudySection } from './case-study-card';
import { LogoMark } from '@/components/primitives/logo-mark';

const cases = [
  {
    companyName: 'A社',
    quote: '認証実装の工数がゼロになった。',
    metrics: [{ label: '工数削減', value: '100%' }],
    href: '/cases/a',
  },
  { companyName: 'B社', quote: '検索が速くなった。' },
];

describe('CaseStudySection', () => {
  it('全事例を表示する', () => {
    render(<CaseStudySection cases={cases} />);
    expect(screen.getByText(/認証実装の工数がゼロになった/)).toBeInTheDocument();
    expect(screen.getByText(/検索が速くなった/)).toBeInTheDocument();
  });

  it('ロゴが無い事例は社名を文字で出す', () => {
    render(<CaseStudySection cases={cases} />);
    expect(screen.getByText('A社')).toBeInTheDocument();
  });

  it('companyLogo に LogoMark を渡すと社名テキストの代わりに表示する', () => {
    const { container } = render(
      <CaseStudySection
        cases={[
          {
            companyName: 'C社',
            quote: 'q',
            companyLogo: <LogoMark src="/c.svg" alt="C社" />,
          },
        ]}
      />,
    );
    expect(container.querySelector('.logoMark')).toBeInTheDocument();
    expect(screen.getByAltText('C社')).toBeInTheDocument();
  });

  it('メトリクスとリンクを表示する', () => {
    render(<CaseStudySection cases={cases} />);
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /詳しく見る/ })).toHaveAttribute('href', '/cases/a');
  });

  const make = (n: number) =>
    Array.from({ length: n }, (_, i) => ({ companyName: `c${i}`, quote: `q${i}` }));

  it('列数を件数から導出する（1→1 / 2→2 / 3→3。見た目の選択肢は持たない）', () => {
    const grid = (n: number) =>
      render(<CaseStudySection cases={make(n)} />).container.querySelector('.grid');

    expect(grid(1)).toHaveClass('cols1');
    expect(grid(2)).toHaveClass('cols2');
    expect(grid(3)).toHaveClass('cols3');
  });

  it('4件以上はカルーセルになる（送りボタン・グリッド不使用。2026-08-13 決定）', async () => {
    const user = userEvent.setup();
    const { container } = render(<CaseStudySection cases={make(5)} />);
    expect(container.querySelector('.grid')).toBeNull();
    const prev = screen.getByRole('button', { name: '前の事例' });
    const next = screen.getByRole('button', { name: '次の事例' });
    // 先頭では「前へ」が無効
    expect(prev).toBeDisabled();
    // 「次へ」でトラックが1枚ぶんスクロールされる。
    // jsdom はレイアウト寸法が全て 0 で「末尾到達」と判定されボタンが無効化されるため、
    // 寸法を与えて scroll イベントで再判定させてから押す
    const track = container.querySelector('[class*="track"]') as HTMLElement;
    Object.defineProperty(track, 'scrollWidth', { configurable: true, value: 1200 });
    Object.defineProperty(track, 'clientWidth', { configurable: true, value: 600 });
    const scrollBy = vi.fn();
    track.scrollBy = scrollBy as never;
    fireEvent.scroll(track);
    expect(next).toBeEnabled();
    await user.click(next);
    expect(scrollBy).toHaveBeenCalledOnce();
  });

  it('3件以下では送りボタンを出さない', () => {
    render(<CaseStudySection cases={make(3)} />);
    expect(screen.queryByRole('button', { name: '次の事例' })).toBeNull();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<CaseStudySection title="導入事例" cases={cases} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('インタビュー写真（2026-08-11 追加）', () => {
  it('photo 指定時に img が alt 付きで描画される', () => {
    render(
      <CaseStudySection
        cases={[
          {
            companyName: 'A社',
            quote: '引用',
            photo: { src: 'data:image/svg+xml;utf8,<svg/>', alt: '担当者が現場で作業する様子' },
          },
        ]}
      />,
    );
    expect(screen.getByRole('img', { name: '担当者が現場で作業する様子' })).toBeInTheDocument();
  });

  it('photo 未指定なら img を描画しない（後方互換）', () => {
    const { container } = render(
      <CaseStudySection cases={[{ companyName: 'A社', quote: '引用' }]} />,
    );
    expect(container.querySelector('img')).toBeNull();
  });
});
