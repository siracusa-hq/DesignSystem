import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { HeroSection } from './hero-section';

describe('HeroSection', () => {
  it('タイトルをh1でレンダリングする', () => {
    render(<HeroSection title="テストタイトル" />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('テストタイトル');
  });

  it('サブタイトルを表示する', () => {
    render(<HeroSection title="タイトル" subtitle="サブタイトル" />);
    expect(screen.getByText('サブタイトル')).toBeInTheDocument();
  });

  it('バッジを表示する', () => {
    render(<HeroSection title="タイトル" badge="New" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('アクションボタンをレンダリングする', () => {
    render(
      <HeroSection
        title="タイトル"
        actions={[
          { label: '無料で始める', href: '/signup' },
          { label: 'ドキュメント', href: '/docs' },
        ]}
      />,
    );
    expect(screen.getByText('無料で始める')).toBeInTheDocument();
    expect(screen.getByText('ドキュメント')).toBeInTheDocument();
  });

  it('split-imageレイアウトで画像を表示する', () => {
    render(
      <HeroSection
        title="タイトル"
        imagePlacement="side"
        image={<img alt="hero" src="/test.png" />}
      />,
    );
    expect(screen.getByAltText('hero')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<HeroSection title="タイトル" />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<HeroSection title="アクセシブルなヒーロー" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('backdrop（背景演出層）', () => {
  it('backdrop は aria-hidden で描画され、コピーは左寄せになる', () => {
    const { container } = render(
      <HeroSection title="見出し" subtitle="サブ" backdrop={<svg data-testid="bg" />} />,
    );
    const backdrop = container.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
    expect(backdrop!.querySelector('svg')).toBeInTheDocument();
    // centered クラスが付かない（= start 寄せ）
    expect(container.querySelector('.centered')).not.toBeInTheDocument();
  });

  it('backdropTone=dark で暗面のセマンティック反転（Section bgDark）が効く', () => {
    const { container } = render(
      <HeroSection title="見出し" backdrop={<div />} backdropTone="dark" />,
    );
    expect(container.querySelector('section')).toHaveClass('bgDark');
  });
});

describe('FV の CTA 本数検査（Stage 4 Slice 2）', () => {
  it('2本では警告しない', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <HeroSection
        title="t"
        actions={[
          { label: 'a', href: '#' },
          { label: 'b', href: '#' },
        ]}
      />,
    );
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('3本以上で dev 警告を出す（実測: 2本が 13/17）', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <HeroSection
        title="t"
        actions={[
          { label: 'a', href: '#' },
          { label: 'b', href: '#' },
          { label: 'c', href: '#' },
        ]}
      />,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0][0]).toContain('ファーストビュー');
    warn.mockRestore();
  });
});
