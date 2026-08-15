import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { CompanyProfileSection } from './company-profile';

const items = [
  { label: '商号', value: 'シラクサ株式会社' },
  { label: '設立', value: '2024年4月' },
  { label: '事業内容', value: ['Polastack の開発・提供', 'ピアデスクの開発・提供'] },
];

describe('CompanyProfileSection', () => {
  it('ラベルと値を対で出す', () => {
    render(<CompanyProfileSection title="会社概要" items={items} />);
    expect(screen.getByText('商号')).toBeInTheDocument();
    expect(screen.getByText('シラクサ株式会社')).toBeInTheDocument();
  });

  it('定義リストとして組む（ラベルと値の対応を支援技術に伝える）', () => {
    const { container } = render(<CompanyProfileSection title="会社概要" items={items} />);
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(items.length);
    expect(container.querySelectorAll('dd')).toHaveLength(items.length);
  });

  it('配列の値は箇条書きで組む', () => {
    render(<CompanyProfileSection title="会社概要" items={items} />);
    const list = screen.getByText('Polastack の開発・提供').closest('ul');
    expect(list).toBeInTheDocument();
    expect(list?.querySelectorAll('li')).toHaveLength(2);
  });

  it('a11y違反がない', async () => {
    const { container } = render(<CompanyProfileSection title="会社概要" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
