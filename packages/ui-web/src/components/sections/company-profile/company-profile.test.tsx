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

  it('href を持つ値はリンクで組む（窓口一覧の mailto・公式サイト行）', () => {
    render(
      <CompanyProfileSection
        title="お問い合わせ窓口"
        items={[
          {
            label: '営業に関するお問い合わせ',
            value: { text: 'sales@siracusa.jp', href: 'mailto:sales@siracusa.jp' },
          },
          { label: '公式サイト', value: { text: 'https://siracusa.jp', href: 'https://siracusa.jp' } },
        ]}
      />,
    );
    expect(screen.getByRole('link', { name: 'sales@siracusa.jp' })).toHaveAttribute(
      'href',
      'mailto:sales@siracusa.jp',
    );
    expect(screen.getByRole('link', { name: 'https://siracusa.jp' })).toHaveAttribute(
      'href',
      'https://siracusa.jp',
    );
  });

  it('配列の中で文字列とリンクを混在できる', () => {
    render(
      <CompanyProfileSection
        title="会社概要"
        items={[
          {
            label: '連絡先',
            value: [
              '東京都千代田区…',
              { text: 'info@siracusa.jp', href: 'mailto:info@siracusa.jp' },
            ],
          },
        ]}
      />,
    );
    expect(screen.getByText('東京都千代田区…')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'info@siracusa.jp' })).toHaveAttribute(
      'href',
      'mailto:info@siracusa.jp',
    );
  });

  it('a11y違反がない', async () => {
    const { container } = render(<CompanyProfileSection title="会社概要" items={items} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
