import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MarketingFooter } from './marketing-footer';

describe('MarketingFooter', () => {
  it('footer要素としてレンダリングする', () => {
    render(<MarketingFooter />);
    expect(document.querySelector('footer')).toBeInTheDocument();
  });

  it('コピーライトを表示する', () => {
    render(<MarketingFooter copyright="© 2025 Polastack" />);
    expect(screen.getByText('© 2025 Polastack')).toBeInTheDocument();
  });

  it('リンクグループを表示する', () => {
    render(
      <MarketingFooter
        linkGroups={[
          {
            title: 'プロダクト',
            links: [{ label: '機能', href: '/features' }],
          },
        ]}
      />,
    );
    expect(screen.getByText('プロダクト')).toBeInTheDocument();
    expect(screen.getByText('機能')).toBeInTheDocument();
  });

  it('法的リンクを表示する', () => {
    render(
      <MarketingFooter
        legalLinks={[
          { label: 'プライバシーポリシー', href: '/privacy' },
          { label: '利用規約', href: '/terms' },
        ]}
      />,
    );
    expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument();
    expect(screen.getByText('利用規約')).toBeInTheDocument();
  });

  it('ソーシャルリンクを表示する', () => {
    render(
      <MarketingFooter
        socialLinks={[
          { label: 'X', href: 'https://x.com', icon: <span data-testid="x-icon">X</span> },
        ]}
      />,
    );
    expect(screen.getByLabelText('X')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <MarketingFooter
        copyright="© 2025 Polastack"
        linkGroups={[{ title: 'Product', links: [{ label: 'Features', href: '/features' }] }]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
