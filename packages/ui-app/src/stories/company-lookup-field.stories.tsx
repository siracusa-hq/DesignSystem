import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CompanyLookupField, type CompanyCandidate } from '../components/company-lookup-field';
import { FormField, FormLabel, FormControl, FormDescription } from '../components/form-field';
import { Input } from '../components/input';

const meta: Meta<typeof CompanyLookupField> = {
  title: 'Form/CompanyLookupField',
  component: CompanyLookupField,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof CompanyLookupField>;

// 架空の法人（実在の法人番号ではありません）
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
    name: 'ミライテック株式会社',
    kana: 'ミライテック',
    address: {
      postCode: '5300001',
      prefecture: '大阪府',
      city: '大阪市北区',
      street: '梅田１丁目１番１号',
    },
  },
  {
    corporateNumber: '8000000000002',
    name: '有限会社みらい商事',
    kana: 'ミライショウジ',
    address: {
      postCode: '2200012',
      prefecture: '神奈川県',
      city: '横浜市西区',
      street: 'みなとみらい１丁目',
    },
  },
  {
    corporateNumber: '8000000000003',
    name: '合同会社みらい設計',
    kana: 'ミライセッケイ',
    address: {
      postCode: '8100001',
      prefecture: '福岡県',
      city: '福岡市中央区',
      street: '天神１丁目',
    },
  },
];

async function searchCompanies(query: string, signal: AbortSignal) {
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, 400);
    signal.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('aborted', 'AbortError'));
    });
  });
  const q = query.normalize('NFKC');
  return companies.filter((c) => c.name.includes(q) || (c.kana ?? '').includes(q));
}

export const Default: Story = {
  render: () => {
    const [name, setName] = useState('');
    return (
      <div className="w-96">
        <FormField>
          <FormLabel>会社名</FormLabel>
          <FormControl>
            <CompanyLookupField
              value={name}
              onValueChange={setName}
              searchCompanies={searchCompanies}
            />
          </FormControl>
          <FormDescription>
            「みらい」と入力すると候補が出ます。候補に無ければそのまま入力できます。
          </FormDescription>
        </FormField>
      </div>
    );
  },
};

interface CompanyForm {
  name: string;
  corporateNumber: string;
  postCode: string;
  prefecture: string;
  city: string;
  street: string;
}

const emptyForm: CompanyForm = {
  name: '',
  corporateNumber: '',
  postCode: '',
  prefecture: '',
  city: '',
  street: '',
};

/** 候補を選ぶとフォームの法人番号欄・住所欄に自動で入る例。入った後はどの欄も自由に直せる。 */
export const FillsForm: Story = {
  render: () => {
    const [form, setForm] = useState<CompanyForm>(emptyForm);

    const field = (key: keyof CompanyForm, label: string) => (
      <FormField>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        </FormControl>
      </FormField>
    );

    return (
      <div className="flex w-[28rem] flex-col gap-3">
        <FormField>
          <FormLabel>会社名</FormLabel>
          <FormControl>
            <CompanyLookupField
              value={form.name}
              onValueChange={(name) => setForm({ ...form, name })}
              searchCompanies={searchCompanies}
              onCompanySelect={(c) =>
                setForm({
                  name: c.name,
                  corporateNumber: c.corporateNumber,
                  postCode: c.address?.postCode ?? '',
                  prefecture: c.address?.prefecture ?? '',
                  city: c.address?.city ?? '',
                  street: c.address?.street ?? '',
                })
              }
            />
          </FormControl>
        </FormField>
        {field('corporateNumber', '法人番号')}
        <div className="grid grid-cols-2 gap-3">
          {field('postCode', '郵便番号')}
          {field('prefecture', '都道府県')}
        </div>
        {field('city', '市区町村')}
        {field('street', '番地・建物')}
      </div>
    );
  },
};
