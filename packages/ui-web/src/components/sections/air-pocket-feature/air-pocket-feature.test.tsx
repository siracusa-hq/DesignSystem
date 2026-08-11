import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { AirPocketFeature, type AirPocket } from './air-pocket-feature';

const airPockets = [
  {
    module: 'PolaFind',
    headline: '打ち間違えても、見つかる。',
    points: ['「田中」「たなか」「Tanaka」を横断して検索', 'タイプミスを許容する全文検索'] as [
      string,
      string,
    ],
    proof: { value: '100万件 → ミリ秒', label: '全文検索の応答' },
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

  it('要点の箇条書きと証拠の数値を表示する', () => {
    render(<AirPocketFeature airPockets={airPockets} />);
    expect(screen.getByText('タイプミスを許容する全文検索')).toBeInTheDocument();
    expect(screen.getByText('100万件 → ミリ秒')).toBeInTheDocument();
    expect(screen.getByText('全文検索の応答')).toBeInTheDocument();
  });

  it('要点は最大3点（4点目は型エラー）', () => {
    const fourPoints: AirPocket = {
      ...airPockets[0],
      // @ts-expect-error -- points は最大3要素のタプル（散文化の防止。2026-08-11 決定）
      points: ['a', 'b', 'c', 'd'],
    };
    expect(fourPoints).toBeTruthy();
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
