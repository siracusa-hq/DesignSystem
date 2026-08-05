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
    expect(container.firstChild).toHaveClass('highlighted');
  });

  it('CTA ボタンは常に cta バリアント（action.variant は選べない）', () => {
    render(<PricingCard {...defaultProps} />);
    const link = screen.getByRole('link', { name: '無料で始める' });
    expect(link).toHaveClass('cta');
    expect(link).toHaveClass('fullWidth');
  });

  it('priceUnit を金額の脇に小さく添える', () => {
    const { container } = render(<PricingCard {...defaultProps} price="¥30,000" priceUnit="/月" />);
    expect(container.querySelector('.priceUnit')).toHaveTextContent('/月');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<PricingCard {...defaultProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
