import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { brand } from '@siracusahq/tokens';
import { AuthLayout, AuthLayoutForm, AuthLayoutVisual } from './auth-layout';

describe('AuthLayout', () => {
  it('renders form and visual panels', () => {
    render(
      <AuthLayout>
        <AuthLayoutForm>
          <h1>ログイン</h1>
        </AuthLayoutForm>
        <AuthLayoutVisual>
          <p>製品ビジュアル</p>
        </AuthLayoutVisual>
      </AuthLayout>,
    );
    expect(screen.getByText('ログイン')).toBeInTheDocument();
    expect(screen.getByText('製品ビジュアル')).toBeInTheDocument();
  });

  it('uses a 2-column grid on lg', () => {
    const { container } = render(<AuthLayout />);
    expect(container.firstChild).toHaveClass('lg:grid-cols-2');
  });

  it('hides the visual panel below lg', () => {
    render(<AuthLayoutVisual data-testid="visual" />);
    expect(screen.getByTestId('visual')).toHaveClass('hidden', 'lg:flex');
  });

  it('paints the visual panel with the brand dark background', () => {
    render(<AuthLayoutVisual data-testid="visual" />);
    expect(screen.getByTestId('visual')).toHaveStyle({ backgroundColor: brand[950] });
  });

  it('lets a custom style override the visual background', () => {
    render(<AuthLayoutVisual data-testid="visual" style={{ backgroundColor: '#000000' }} />);
    expect(screen.getByTestId('visual')).toHaveStyle({ backgroundColor: '#000000' });
  });

  it('constrains form content width by default and allows override', () => {
    const { rerender } = render(
      <AuthLayoutForm>
        <span data-testid="child" />
      </AuthLayoutForm>,
    );
    expect(screen.getByTestId('child').parentElement).toHaveClass('max-w-sm');

    rerender(
      <AuthLayoutForm contentClassName="max-w-md">
        <span data-testid="child" />
      </AuthLayoutForm>,
    );
    expect(screen.getByTestId('child').parentElement).toHaveClass('max-w-md');
  });

  it('merges custom className', () => {
    const { container } = render(<AuthLayout className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('forwards refs', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<AuthLayout ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe accessibility check', async () => {
    const { container } = render(
      <AuthLayout>
        <AuthLayoutForm>
          <h1>ログイン</h1>
          <label htmlFor="email">メールアドレス</label>
          <input id="email" type="email" />
        </AuthLayoutForm>
        <AuthLayoutVisual>
          <p>ビジュアル領域</p>
        </AuthLayoutVisual>
      </AuthLayout>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
