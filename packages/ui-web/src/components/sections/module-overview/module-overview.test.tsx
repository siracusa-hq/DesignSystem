import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { ModuleOverview } from './module-overview';

const layers = [
  {
    name: 'L2: API & セキュリティ層',
    modules: [
      { name: 'PolaAuth', label: '認証', description: 'SSO/SAML/SCIM' },
      { name: 'PolaGate', label: 'Gateway', description: 'SDK自動生成' },
    ],
  },
  {
    name: 'L3: コア・データ層',
    modules: [
      { name: 'PolaStore', label: 'DB', description: 'メタデータ駆動DB' },
    ],
  },
];

describe('ModuleOverview', () => {
  it('全モジュールを表示する', () => {
    render(<ModuleOverview layers={layers} />);
    expect(screen.getByText('PolaAuth')).toBeInTheDocument();
    expect(screen.getByText('PolaGate')).toBeInTheDocument();
    expect(screen.getByText('PolaStore')).toBeInTheDocument();
  });

  it('レイヤー名を表示する', () => {
    render(<ModuleOverview layers={layers} />);
    expect(screen.getByText('L2: API & セキュリティ層')).toBeInTheDocument();
    expect(screen.getByText('L3: コア・データ層')).toBeInTheDocument();
  });

  it('タイトルを表示する', () => {
    render(<ModuleOverview title="アーキテクチャ" layers={layers} />);
    expect(screen.getByText('アーキテクチャ')).toBeInTheDocument();
  });

  it('section要素としてレンダリングする', () => {
    const { container } = render(<ModuleOverview layers={layers} />);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<ModuleOverview layers={layers} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
