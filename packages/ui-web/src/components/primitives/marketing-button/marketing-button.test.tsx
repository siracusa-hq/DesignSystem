import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MarketingButton } from './marketing-button';

describe('MarketingButton', () => {
  it('button要素としてレンダリングする', () => {
    render(<MarketingButton>無料で始める</MarketingButton>);
    expect(screen.getByRole('button', { name: '無料で始める' })).toBeInTheDocument();
  });

  it('href指定時にa要素としてレンダリングする', () => {
    render(<MarketingButton href="/signup">Sign Up</MarketingButton>);
    const el = screen.getByText('Sign Up');
    expect(el.tagName).toBe('A');
    expect(el).toHaveAttribute('href', '/signup');
  });

  it('variantを適用する', () => {
    const { container } = render(<MarketingButton variant="secondary">ボタン</MarketingButton>);
    expect(container.firstChild).toHaveClass('border');
  });

  it('sizeを適用する', () => {
    const { container } = render(<MarketingButton size="lg">大きいボタン</MarketingButton>);
    expect(container.firstChild).toHaveClass('h-13');
  });

  it('a11y違反がない', async () => {
    const { container } = render(<MarketingButton>アクセシブルなボタン</MarketingButton>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
