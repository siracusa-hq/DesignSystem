import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { FeatureShowcase } from './feature-showcase';

const items = [
  { title: 'PolaAuth', description: '認証基盤', features: ['SSO/SAML', 'SCIM'] },
  { title: 'PolaStore', description: 'メタデータ駆動DB' },
];

describe('FeatureShowcase', () => {
  it('全アイテムを表示する', () => {
    render(<FeatureShowcase items={items} />);
    expect(screen.getByText('PolaAuth')).toBeInTheDocument();
    expect(screen.getByText('PolaStore')).toBeInTheDocument();
  });

  it('フィーチャーリストを表示する', () => {
    render(<FeatureShowcase items={items} />);
    expect(screen.getByText('SSO/SAML')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<FeatureShowcase title="機能紹介" items={items} />);
    expect(screen.getByText('機能紹介')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<FeatureShowcase items={items} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<FeatureShowcase items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
