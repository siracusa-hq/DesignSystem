import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { BentoGrid } from './bento-grid';

const items = [
  { title: 'PolaAuth', description: '認証基盤', span: 2 as const },
  { title: 'PolaStore', description: 'DB' },
  { title: 'PolaGate', description: 'Gateway' },
];

describe('BentoGrid', () => {
  it('全アイテムを表示する', () => {
    render(<BentoGrid items={items} />);
    expect(screen.getByText('PolaAuth')).toBeInTheDocument();
    expect(screen.getByText('PolaStore')).toBeInTheDocument();
    expect(screen.getByText('PolaGate')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<BentoGrid title="機能" items={items} />);
    expect(screen.getByText('機能')).toBeInTheDocument();
  });

  it('spanクラスを適用する', () => {
    const { container } = render(<BentoGrid items={items} />);
    const firstCard = container.querySelector('.md\\:col-span-2');
    expect(firstCard).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<BentoGrid items={items} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<BentoGrid items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
