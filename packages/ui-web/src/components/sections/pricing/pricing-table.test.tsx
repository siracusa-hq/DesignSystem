import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { PricingTable } from './pricing-table';

const mockPlans = [
  {
    name: 'Free',
    price: '¥0',
    features: [{ text: '開発環境のみ', included: true }],
    action: { label: '無料で始める', href: '/signup' },
  },
  {
    name: 'Platform',
    price: '¥30,000',
    priceNote: '/月',
    features: [{ text: '全モジュール', included: true }],
    action: { label: '申し込む', href: '/signup/platform' },
  },
];

describe('PricingTable', () => {
  it('全プランカードをレンダリングする', () => {
    render(<PricingTable plans={mockPlans} />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<PricingTable title="料金プラン" plans={mockPlans} />);
    expect(screen.getByText('料金プラン')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<PricingTable plans={mockPlans} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<PricingTable plans={mockPlans} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
