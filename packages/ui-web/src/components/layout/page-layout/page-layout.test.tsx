import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { PageLayout } from './page-layout';

describe('PageLayout', () => {
  it('main要素内に子要素をレンダリングする', () => {
    render(<PageLayout>コンテンツ</PageLayout>);
    const main = document.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveTextContent('コンテンツ');
  });

  it('headerPropsでヘッダーをレンダリングする', () => {
    render(
      <PageLayout
        headerProps={{ navItems: [{ label: 'テスト', href: '/test' }] }}
      >
        コンテンツ
      </PageLayout>,
    );
    expect(document.querySelector('header')).toBeInTheDocument();
  });

  it('footerPropsでフッターをレンダリングする', () => {
    render(
      <PageLayout footerProps={{ copyright: '© 2025' }}>
        コンテンツ
      </PageLayout>,
    );
    expect(document.querySelector('footer')).toBeInTheDocument();
  });

  it('カスタムheader/footerを受け付ける', () => {
    render(
      <PageLayout
        header={<div data-testid="custom-header">Header</div>}
        footer={<div data-testid="custom-footer">Footer</div>}
      >
        コンテンツ
      </PageLayout>,
    );
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<PageLayout>アクセシブルなページ</PageLayout>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
