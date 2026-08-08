import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { LogoCloud } from './logo-cloud';

const makeLogos = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    name: `Company ${i}`,
    node: <span>{`Logo ${i}`}</span>,
  }));

/** ロゴ帯として成立する最小構成（6社）。これ未満は dev 警告の対象 */
const logos = makeLogos(6);

/** 自動スクロールの閾値（8件）に達する件数 */
const manyLogos = makeLogos(8);

afterEach(() => {
  vi.restoreAllMocks();
});

describe('LogoCloud', () => {
  it('全ロゴを表示する', () => {
    render(<LogoCloud logos={logos} />);
    expect(screen.getByText('Logo 0')).toBeInTheDocument();
    expect(screen.getByText('Logo 5')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<LogoCloud title="導入企業" logos={logos} />);
    expect(screen.getByText('導入企業')).toBeInTheDocument();
  });

  it('8件未満は静的な帯で表示する', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelector('.row')).toBeInTheDocument();
    expect(container.querySelector('.marquee')).not.toBeInTheDocument();
  });

  it('8件以上で自動的にスクロール表示になり、ロゴを3周ぶん複製する', () => {
    const { container } = render(<LogoCloud logos={manyLogos} />);
    expect(container.querySelector('.marquee')).toBeInTheDocument();
    expect(screen.getAllByText('Logo 0')).toHaveLength(3);
  });

  it('ロゴを LogoMark で包む（高さ・彩度の正規化）', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelectorAll('.logoMark')).toHaveLength(6);
    expect(container.querySelector('.logoMark')).toHaveClass('grayscale');
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<LogoCloud logos={logos} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('ロゴ社数の切替ガイド（Stage 5 Slice 1）', () => {
  it.each([1, 3, 5])('%i 社で dev 警告を出す（実例0件の中途半端なロゴ帯）', (count) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LogoCloud logos={makeLogos(count)} />);
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('1〜5社');
    expect(warn.mock.calls[0][0]).toContain('事例カード');
  });

  it.each([6, 8, 20])('%i 社では警告しない', (count) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LogoCloud logos={makeLogos(count)} />);
    expect(warn).not.toHaveBeenCalled();
  });

  it('0 社では警告しない（ロゴ帯を置かず数値訴求に振り切る選択は実測 6/19）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<LogoCloud logos={[]} />);
    expect(warn).not.toHaveBeenCalled();
  });
});
