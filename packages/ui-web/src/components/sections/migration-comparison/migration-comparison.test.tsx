import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MigrationComparison } from './migration-comparison';

const paths = [
  {
    from: 'kintone卒業',
    tagline: 'kintoneの限界を超える',
    description: '大規模データ対応へ',
    triggers: [
      { trigger: 'データ量の壁', pain: '検索が遅くなる', solution: 'PostgreSQLベースで数百万件対応' },
    ],
    action: { label: '移行ガイド', href: '/migration/kintone' },
  },
];

describe('MigrationComparison', () => {
  it('移行パスを表示する', () => {
    render(<MigrationComparison paths={paths} />);
    expect(screen.getByText('kintone卒業')).toBeInTheDocument();
    expect(screen.getByText('kintoneの限界を超える')).toBeInTheDocument();
  });

  it('トリガーを表示する', () => {
    render(<MigrationComparison paths={paths} />);
    expect(screen.getByText('データ量の壁')).toBeInTheDocument();
  });

  it('アクションボタンを表示する', () => {
    render(<MigrationComparison paths={paths} />);
    expect(screen.getByText('移行ガイド')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<MigrationComparison paths={paths} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<MigrationComparison paths={paths} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
