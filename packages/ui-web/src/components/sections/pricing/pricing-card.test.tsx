import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { PricingCard } from './pricing-card';

const defaultProps = {
  name: 'Free',
  description: '開発・評価用途',
  price: '¥0',
  features: [
    { text: '全モジュール利用可能', included: true },
    { text: '3ユーザーまで', included: true },
    { text: '本番環境', included: false },
  ],
  action: { label: '無料で始める', href: '/signup' },
};

describe('PricingCard', () => {
  it('プラン名を表示する', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
  });

  it('価格を表示する', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText('¥0')).toBeInTheDocument();
  });

  it('機能リストを表示する', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText('全モジュール利用可能')).toBeInTheDocument();
    expect(screen.getByText('本番環境')).toBeInTheDocument();
  });

  it('アクションボタンをレンダリングする', () => {
    render(<PricingCard {...defaultProps} />);
    expect(screen.getByText('無料で始める')).toBeInTheDocument();
  });

  it('バッジを表示する', () => {
    render(<PricingCard {...defaultProps} badge="おすすめ" />);
    expect(screen.getByText('おすすめ')).toBeInTheDocument();
  });

  it('ハイライトスタイルを適用する', () => {
    const { container } = render(<PricingCard {...defaultProps} highlighted />);
    expect(container.firstChild).toHaveClass('border-primary-500');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<PricingCard {...defaultProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
