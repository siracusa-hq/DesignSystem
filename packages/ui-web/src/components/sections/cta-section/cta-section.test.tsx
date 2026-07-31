import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { CTASection } from './cta-section';

describe('CTASection', () => {
  it('タイトルを表示する', () => {
    render(
      <CTASection
        title="無料で開発を始める"
        actions={[{ label: '始める', href: '/signup' }]}
      />,
    );
    expect(screen.getByText('無料で開発を始める')).toBeInTheDocument();
  });

  it('サブタイトルを表示する', () => {
    render(
      <CTASection
        title="タイトル"
        subtitle="クレジットカード不要"
        actions={[{ label: '始める', href: '/signup' }]}
      />,
    );
    expect(screen.getByText('クレジットカード不要')).toBeInTheDocument();
  });

  it('複数アクションをレンダリングする', () => {
    render(
      <CTASection
        title="タイトル"
        actions={[
          { label: '無料で始める', href: '/signup' },
          { label: 'デモを予約', href: '/demo', variant: 'secondary' },
        ]}
      />,
    );
    expect(screen.getByText('無料で始める')).toBeInTheDocument();
    expect(screen.getByText('デモを予約')).toBeInTheDocument();
  });

  it('注記を表示する', () => {
    render(
      <CTASection
        title="タイトル"
        actions={[{ label: '始める', href: '/signup' }]}
        note="No Credit Card Required"
      />,
    );
    expect(screen.getByText('No Credit Card Required')).toBeInTheDocument();
  });

  it('splitレイアウトをレンダリングする', () => {
    const { container } = render(
      <CTASection
        title="タイトル"
        layout="split"
        actions={[{ label: '始める', href: '/signup' }]}
      />,
    );
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <CTASection title="アクセシブル" actions={[{ label: '始める', href: '/signup' }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
