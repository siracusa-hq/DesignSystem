import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ComparisonTable } from './comparison-table';

const columns = [
  { name: 'kintone' },
  { name: 'Polastack', highlighted: true },
  { name: 'Supabase' },
];
const rows = [
  { feature: '全文検索', values: [false, true, false] },
  { feature: 'FLS', values: [false, true, false] },
];

describe('ComparisonTable', () => {
  it('カラムヘッダーを表示する', () => {
    render(<ComparisonTable columns={columns} rows={rows} />);
    expect(screen.getByText('kintone')).toBeInTheDocument();
    expect(screen.getByText('Polastack')).toBeInTheDocument();
  });

  it('行を表示する', () => {
    render(<ComparisonTable columns={columns} rows={rows} />);
    expect(screen.getByText('全文検索')).toBeInTheDocument();
    expect(screen.getByText('FLS')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<ComparisonTable title="競合比較" columns={columns} rows={rows} />);
    expect(screen.getByText('競合比較')).toBeInTheDocument();
  });

  it('table要素を含む', () => {
    render(<ComparisonTable columns={columns} rows={rows} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<ComparisonTable columns={columns} rows={rows} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
