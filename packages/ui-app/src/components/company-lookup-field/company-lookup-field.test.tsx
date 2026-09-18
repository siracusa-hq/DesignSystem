import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { CompanyLookupField, type CompanyCandidate } from './company-lookup-field';

const companies: CompanyCandidate[] = [
  {
    corporateNumber: '7123456789012',
    name: '株式会社ミライ',
    kana: 'ミライ',
    address: {
      postCode: '1000013',
      prefecture: '東京都',
      city: '千代田区',
      street: '霞が関３丁目１番１号',
    },
  },
  {
    corporateNumber: '8000000000001',
    name: '有限会社みらい商事',
    address: { prefecture: '神奈川県', city: '横浜市西区', street: 'みなとみらい１丁目' },
  },
];

function search(query: string) {
  return companies.filter((c) => c.name.includes(query));
}

function Harness({ onCompanySelect }: { onCompanySelect?: (c: CompanyCandidate) => void }) {
  const [value, setValue] = useState('');
  return (
    <>
      <CompanyLookupField
        aria-label="会社名"
        value={value}
        onValueChange={setValue}
        debounceMs={0}
        searchCompanies={async (q) => search(q)}
        onCompanySelect={onCompanySelect}
      />
      <output data-testid="value">{value}</output>
    </>
  );
}

describe('CompanyLookupField', () => {
  it('候補に社名・法人番号・所在地（郵便番号なし）を出す', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole('combobox'), 'ミライ');

    const option = await screen.findByRole('option', { name: /株式会社ミライ/ });
    expect(option).toHaveTextContent('7123456789012');
    expect(option).toHaveTextContent('東京都千代田区霞が関３丁目１番１号');
    expect(option).not.toHaveTextContent('100-0013');
    expect(option).not.toHaveTextContent('1000013');
    expect(screen.queryByRole('option', { name: /有限会社みらい商事/ })).not.toBeInTheDocument();
  });

  it('候補を選ぶと社名が入力欄に入り、候補がそのまま onCompanySelect に渡る', async () => {
    const user = userEvent.setup();
    const onCompanySelect = vi.fn();
    render(<Harness onCompanySelect={onCompanySelect} />);
    await user.type(screen.getByRole('combobox'), 'ミライ');
    await user.click(await screen.findByRole('option', { name: /株式会社ミライ/ }));

    expect(screen.getByTestId('value')).toHaveTextContent('株式会社ミライ');
    expect(onCompanySelect).toHaveBeenCalledWith(companies[0]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('候補が無くても入力はそのまま残る', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole('combobox'), '存在しない会社');
    expect(await screen.findByText(/該当する法人が見つかりません/)).toBeInTheDocument();
    expect(screen.getByTestId('value')).toHaveTextContent('存在しない会社');
  });

  it('has no a11y violations with candidates open', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    await user.type(screen.getByRole('combobox'), 'みらい');
    await screen.findAllByRole('option');
    expect(await axe(container)).toHaveNoViolations();
  });
});
