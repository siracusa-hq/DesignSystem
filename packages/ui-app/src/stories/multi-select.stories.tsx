import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect } from '../components/multi-select';
import { Label } from '../components/label';

const meta: Meta<typeof MultiSelect> = {
  title: 'Form/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof MultiSelect>;

const memberOptions = [
  { value: 'sato', label: '佐藤' },
  { value: 'suzuki', label: '鈴木' },
  { value: 'takahashi', label: '高橋' },
  { value: 'tanaka', label: '田中' },
  { value: 'ito', label: '伊藤' },
  { value: 'watanabe', label: '渡辺' },
  { value: 'yamamoto', label: '山本' },
  { value: 'nakamura', label: '中村' },
];

const prefectureOptions = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県', '岐阜県',
  '静岡県', '愛知県', '三重県', '滋賀県', '京都府', '大阪府', '兵庫県',
  '奈良県', '和歌山県', '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県', '福岡県', '佐賀県', '長崎県',
  '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県',
].map((label, i) => ({ value: String(i + 1).padStart(2, '0'), label }));

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['sato']);
    return (
      <div className="w-72">
        <Label>担当者</Label>
        <MultiSelect
          options={memberOptions}
          value={value}
          onValueChange={setValue}
          placeholder="担当者を選択"
          aria-label="担当者"
        />
      </div>
    );
  },
};

export const ManyOptions: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="w-72">
        <Label>対象地域</Label>
        <MultiSelect
          options={prefectureOptions}
          value={value}
          onValueChange={setValue}
          placeholder="都道府県を選択"
          aria-label="対象地域"
        />
      </div>
    );
  },
};

export const WithMaxDisplay: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([
      'sato', 'suzuki', 'takahashi', 'tanaka', 'ito',
    ]);
    return (
      <div className="w-72">
        <Label>担当者（maxDisplay=2）</Label>
        <MultiSelect
          options={memberOptions}
          value={value}
          onValueChange={setValue}
          maxDisplay={2}
          aria-label="担当者"
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-72">
      <Label>担当者</Label>
      <MultiSelect
        options={memberOptions}
        value={['sato', 'suzuki']}
        disabled
        aria-label="担当者"
      />
    </div>
  ),
};
