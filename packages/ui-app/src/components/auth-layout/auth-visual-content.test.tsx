import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { brand } from '@siracusahq/tokens';
import { AuthLayout, AuthLayoutForm, AuthLayoutVisual } from './auth-layout';
import {
  AuthVisualContent,
  AuthVisualTitle,
  AuthVisualAccent,
  AuthVisualDescription,
  AuthVisualFeatures,
  AuthVisualFeature,
} from './auth-visual-content';

function renderPromo() {
  return render(
    <AuthVisualContent>
      <AuthVisualTitle>
        定型業務を、<AuthVisualAccent>自動で終わらせる。</AuthVisualAccent>
      </AuthVisualTitle>
      <AuthVisualDescription>反復作業を自動化するプラットフォーム。</AuthVisualDescription>
      <AuthVisualFeatures>
        <AuthVisualFeature>請求から入金消込までを1画面で</AuthVisualFeature>
        <AuthVisualFeature>監査ログを標準装備</AuthVisualFeature>
      </AuthVisualFeatures>
    </AuthVisualContent>,
  );
}

describe('AuthVisualContent', () => {
  it('renders title, description and features', () => {
    renderPromo();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('反復作業を自動化するプラットフォーム。')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('colors the accent with brand[300]', () => {
    renderPromo();
    expect(screen.getByText('自動で終わらせる。')).toHaveStyle({ color: brand[300] });
  });

  it('renders a default check icon per feature, hidden from a11y tree', () => {
    renderPromo();
    const items = screen.getAllByRole('listitem');
    for (const item of items) {
      const icon = item.querySelector('svg');
      expect(icon).not.toBeNull();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('lets a custom icon replace the default one', () => {
    render(
      <AuthVisualFeatures>
        <AuthVisualFeature icon={<span data-testid="custom-icon" />}>項目</AuthVisualFeature>
      </AuthVisualFeatures>,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByRole('listitem').querySelector('svg')).toBeNull();
  });

  it('merges custom className', () => {
    const { container } = render(<AuthVisualContent className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class', 'max-w-md');
  });

  it('forwards refs', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>;
    render(<AuthVisualContent ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe accessibility check inside AuthLayout', async () => {
    const { container } = render(
      <AuthLayout>
        <AuthLayoutForm>
          <h1>ログイン</h1>
        </AuthLayoutForm>
        <AuthLayoutVisual>
          <AuthVisualContent>
            <AuthVisualTitle>タイトル</AuthVisualTitle>
            <AuthVisualDescription>説明</AuthVisualDescription>
            <AuthVisualFeatures>
              <AuthVisualFeature>項目</AuthVisualFeature>
            </AuthVisualFeatures>
          </AuthVisualContent>
        </AuthLayoutVisual>
      </AuthLayout>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
