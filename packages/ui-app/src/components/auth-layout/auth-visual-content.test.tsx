import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe } from 'vitest-axe';
import { brand } from '@siracusahq/tokens';
import { AuthLayout, AuthLayoutForm, AuthLayoutVisual } from './auth-layout';
import {
  AuthVisualContent,
  AuthVisualBackdrop,
  AuthVisualTitle,
  AuthVisualAccent,
  AuthVisualDescription,
  AuthVisualFeatures,
  AuthVisualFeature,
  AuthVisualQuote,
  AuthVisualLogos,
  AuthVisualStat,
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

  it('renders the backdrop as decoration, hidden from the a11y tree', () => {
    render(<AuthVisualBackdrop data-testid="backdrop" />);
    const backdrop = screen.getByTestId('backdrop');
    expect(backdrop).toHaveAttribute('aria-hidden', 'true');
    expect(backdrop).toHaveClass('pointer-events-none', 'absolute');
    expect(backdrop.children).toHaveLength(2);
  });

  it('lets backdrop layers be disabled individually', () => {
    render(<AuthVisualBackdrop data-testid="backdrop" glow={false} grid={false} />);
    expect(screen.getByTestId('backdrop').children).toHaveLength(0);
  });

  it('renders quote with author, role and logo', () => {
    render(
      <AuthVisualQuote author="佐藤 誠" role="経営管理部長" logo={<span>LOGO</span>}>
        月次決算が2営業日になりました。
      </AuthVisualQuote>,
    );
    expect(screen.getByText('月次決算が2営業日になりました。')).toBeInTheDocument();
    expect(screen.getByText('佐藤 誠')).toBeInTheDocument();
    expect(screen.getByText('経営管理部長')).toBeInTheDocument();
    expect(screen.getByText('LOGO')).toBeInTheDocument();
  });

  it('renders logos as a labeled list', () => {
    render(
      <AuthVisualLogos label="導入企業">
        <span>A社</span>
        <span>B社</span>
        <span>C社</span>
      </AuthVisualLogos>,
    );
    expect(screen.getByText('導入企業')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('renders stat value and label', () => {
    render(<AuthVisualStat value="月間 12万時間" label="の定型業務を自動化" />);
    expect(screen.getByText('月間 12万時間')).toBeInTheDocument();
    expect(screen.getByText('の定型業務を自動化')).toBeInTheDocument();
  });

  it('passes axe accessibility check for the trust wall composition', async () => {
    const { container } = render(
      <AuthLayout>
        <AuthLayoutForm>
          <h1>ログイン</h1>
        </AuthLayoutForm>
        <AuthLayoutVisual>
          <AuthVisualBackdrop />
          <AuthVisualContent>
            <AuthVisualStat value="月間 12万時間" label="の定型業務を自動化" />
            <AuthVisualQuote author="佐藤 誠" role="経営管理部長">
              引用文
            </AuthVisualQuote>
            <AuthVisualLogos label="導入企業">
              <span>A社</span>
            </AuthVisualLogos>
          </AuthVisualContent>
        </AuthLayoutVisual>
      </AuthLayout>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
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
