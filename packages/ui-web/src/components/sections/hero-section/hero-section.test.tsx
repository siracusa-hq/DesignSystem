import { describe, it, expect } from 'vitest';
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
          { label: 'ドキュメント', href: '/docs', variant: 'secondary' },
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
        layout="split-image"
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
