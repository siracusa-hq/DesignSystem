import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MarketingHeader } from './marketing-header';

const navItems = [
  { label: '機能', href: '/features' },
  { label: '料金', href: '/pricing' },
];

const actions = [
  { label: 'ログイン', href: '/login', variant: 'ghost' as const },
  { label: '無料で始める', href: '/signup', variant: 'primary' as const },
];

describe('MarketingHeader', () => {
  it('header要素としてレンダリングする', () => {
    render(<MarketingHeader />);
    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('ナビゲーションリンクを表示する', () => {
    render(<MarketingHeader navItems={navItems} />);
    expect(screen.getByText('機能')).toBeInTheDocument();
    expect(screen.getByText('料金')).toBeInTheDocument();
  });

  it('アクションボタンを表示する', () => {
    render(<MarketingHeader actions={actions} />);
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByText('無料で始める')).toBeInTheDocument();
  });

  it('モバイルメニューを開閉する', () => {
    render(<MarketingHeader navItems={navItems} />);
    const menuButton = screen.getByLabelText('Toggle menu');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('カスタムロゴを表示する', () => {
    render(<MarketingHeader logo={<span data-testid="custom-logo">Logo</span>} />);
    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(
      <MarketingHeader navItems={navItems} actions={actions} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('キーボードでモバイルメニューを操作できる', () => {
    render(<MarketingHeader navItems={navItems} />);
    const menuButton = screen.getByLabelText('Toggle menu');
    menuButton.focus();
    fireEvent.keyDown(menuButton, { key: 'Enter' });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
  });
});
