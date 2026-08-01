import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AirPocketFeature } from './air-pocket-feature';

const airPockets = [
  {
    module: 'PolaFind',
    headline: '打ち間違えても、見つかる。',
    description: 'typo tolerant全文検索を標準搭載。',
    proof: '100万件でもミリ秒で応答',
    competitors: [
      { name: 'kintone', status: '部分一致のみ' },
      { name: 'Supabase', status: 'PGroonga拡張が必要' },
    ],
  },
];

describe('AirPocketFeature', () => {
  it('エアポケットを表示する', () => {
    render(<AirPocketFeature airPockets={airPockets} />);
    expect(screen.getByText('打ち間違えても、見つかる。')).toBeInTheDocument();
    expect(screen.getByText('PolaFind')).toBeInTheDocument();
  });

  it('競合ステータスを表示する', () => {
    render(<AirPocketFeature airPockets={airPockets} />);
    expect(screen.getByText('部分一致のみ')).toBeInTheDocument();
    expect(screen.getByText('PGroonga拡張が必要')).toBeInTheDocument();
  });

  it('Polastackの標準搭載を表示する', () => {
    render(<AirPocketFeature airPockets={airPockets} />);
    expect(screen.getByText('✓ 標準搭載')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<AirPocketFeature airPockets={airPockets} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<AirPocketFeature airPockets={airPockets} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
