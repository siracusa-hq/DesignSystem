import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Autocomplete, type AutocompleteOption } from '../components/autocomplete';
import { Label } from '../components/label';

const meta: Meta<typeof Autocomplete> = {
  title: 'Form/Autocomplete',
  component: Autocomplete,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof Autocomplete>;

const counterparties: AutocompleteOption<{ code: string }>[] = [
  { value: 'c1', label: '株式会社ミライ', description: '東京都千代田区', data: { code: 'C-001' } },
  {
    value: 'c2',
    label: 'ミライテック株式会社',
    description: '大阪府大阪市北区',
    data: { code: 'C-002' },
  },
  {
    value: 'c3',
    label: '有限会社みらい商事',
    description: '神奈川県横浜市西区',
    data: { code: 'C-003' },
  },
  {
    value: 'c4',
    label: '合同会社みらい設計',
    description: '福岡県福岡市中央区',
    data: { code: 'C-004' },
  },
  {
    value: 'c5',
    label: '株式会社サンプル',
    description: '愛知県名古屋市中区',
    data: { code: 'C-005' },
  },
];

function delay(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });
}

async function searchCounterparties(query: string, signal: AbortSignal) {
  await delay(400, signal);
  return counterparties.filter((c) => c.label.includes(query));
}

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [picked, setPicked] = useState<string | null>(null);
    return (
      <div className="flex w-80 flex-col gap-2">
        <Label htmlFor="cp">取引先</Label>
        <Autocomplete
          id="cp"
          value={value}
          onValueChange={setValue}
          loadOptions={searchCounterparties}
          onSelect={(o) => setPicked(o.data?.code ?? null)}
          placeholder="「みらい」と入力"
        />
        <p className="text-xs text-[var(--color-on-surface-muted)]">
          選択した取引先コード: {picked ?? '（未選択・自由入力のまま）'}
        </p>
      </div>
    );
  },
};

export const CustomRow: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Label htmlFor="cp2">取引先（コード付き行）</Label>
        <Autocomplete
          id="cp2"
          value={value}
          onValueChange={setValue}
          loadOptions={searchCounterparties}
          minChars={1}
          renderOption={(o, { active }) => (
            <div className="flex items-center justify-between gap-2">
              <span className={active ? 'font-medium' : undefined}>{o.label}</span>
              <span className="font-mono text-xs text-[var(--color-on-surface-muted)]">
                {o.data?.code}
              </span>
            </div>
          )}
        />
      </div>
    );
  },
};

export const LoadError: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="w-80">
        <Label htmlFor="cp3">取引先（取得失敗の表示）</Label>
        <Autocomplete
          id="cp3"
          value={value}
          onValueChange={setValue}
          loadOptions={async () => {
            throw new Error('network');
          }}
        />
      </div>
    );
  },
};
