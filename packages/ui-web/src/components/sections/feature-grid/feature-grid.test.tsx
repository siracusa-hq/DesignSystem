import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { FeatureGrid } from './feature-grid';

const mockFeatures = [
  { title: 'PolaAuth', description: '認証・アイデンティティ基盤' },
  { title: 'PolaStore', description: 'メタデータ駆動DB' },
  { title: 'PolaGate', description: 'Runtime Gateway' },
];

describe('FeatureGrid', () => {
  it('全フィーチャーカードをレンダリングする', () => {
    render(<FeatureGrid features={mockFeatures} />);
    expect(screen.getByText('PolaAuth')).toBeInTheDocument();
    expect(screen.getByText('PolaStore')).toBeInTheDocument();
    expect(screen.getByText('PolaGate')).toBeInTheDocument();
  });

  it('タイトルとサブタイトルを表示する', () => {
    render(
      <FeatureGrid
        title="8つのモジュール"
        subtitle="統合プラットフォーム"
        features={mockFeatures}
      />,
    );
    expect(screen.getByText('8つのモジュール')).toBeInTheDocument();
    expect(screen.getByText('統合プラットフォーム')).toBeInTheDocument();
  });

  it('eyebrowテキストを表示する', () => {
    render(<FeatureGrid eyebrow="MODULES" features={mockFeatures} />);
    expect(screen.getByText('MODULES')).toBeInTheDocument();
  });

  it('アイコンを表示する', () => {
    const features = [
      { icon: <span data-testid="icon">🔒</span>, title: 'PolaAuth', description: '認証' },
    ];
    render(<FeatureGrid features={features} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<FeatureGrid features={mockFeatures} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<FeatureGrid features={mockFeatures} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
