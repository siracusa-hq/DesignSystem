import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it } from 'vitest';
import { ServicePortfolio } from './service-portfolio';

const services = [
  { brand: 'polastack', name: 'Polastack', description: 'Agent基盤', href: '/polastack' },
  { brand: 'peerdesk-taxpeer', name: 'タックスピア', description: '税務', href: '/taxpeer' },
];

describe('ServicePortfolio', () => {
  it('カードが data-brand を持つ（テーマ契約でブランド色が切り替わる）', () => {
    render(<ServicePortfolio services={services} />);
    const link = screen.getByRole('link', { name: /Polastack/ });
    expect(link).toHaveAttribute('data-brand', 'polastack');
  });

  it('全サービスがリンクとして描画される', () => {
    render(<ServicePortfolio title="サービス" services={services} />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('a11y違反がない', async () => {
    const { container } = render(<ServicePortfolio title="サービス" services={services} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
