import type { Meta, StoryObj } from '@storybook/react';
import {
  PrintDocument,
  PrintHeader,
  PrintFooter,
  PrintTable,
  PrintTableHeader,
  PrintTableBody,
  PrintTableRow,
  PrintTableHead,
  PrintTableCell,
  PrintField,
  PrintFieldGroup,
  PrintDivider,
} from '../../components/print';

const meta: Meta = {
  title: 'Print/Examples/Invoice',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: [
          '## 請求書テンプレート',
          '',
          'PrintDocument コンポーネントを使った請求書の実装例です。',
          '`ReactDOMServer.renderToString()` でHTMLに変換し、pdfg API でPDF出力できます。',
          '',
          '### pdfg 連携コード例',
          '',
          '```tsx',
          'import { renderToString } from "react-dom/server";',
          'import { Invoice } from "./invoice-template";',
          '',
          'const html = renderToString(<Invoice data={invoiceData} />);',
          '',
          'const response = await fetch("https://api.pdfg.net/v1", {',
          '  method: "POST",',
          '  headers: {',
          '    "Content-Type": "application/json",',
          '    Authorization: "Bearer YOUR_API_KEY",',
          '  },',
          '  body: JSON.stringify({',
          '    html,',
          '    pdfOptions: {',
          '      format: "A4",',
          '      printBackground: true,',
          '      margin: { top: "0", right: "0", bottom: "0", left: "0" },',
          '    },',
          '  }),',
          '});',
          'const pdf = await response.arrayBuffer();',
          '```',
        ].join('\n'),
      },
    },
  },
};
export default meta;

/* ----------------------------------------------------------------
   Sample invoice data
   ---------------------------------------------------------------- */

const COMPANY = {
  name: '株式会社siracusa',
  nameEn: 'siracusa Inc.',
  address: '〒150-0001 東京都渋谷区神宮前3-21-5',
  tel: '03-1234-5678',
  email: 'billing@siracusa.co.jp',
  bank: 'みずほ銀行 渋谷支店 普通 1234567',
  registrationNo: 'T1234567890123',
};

const CLIENT = {
  name: '株式会社サンプルクライアント 御中',
  department: '情報システム部',
  address: '〒100-0001 東京都千代田区丸の内1-1-1',
};

const ITEMS = [
  { name: 'Webアプリケーション開発', quantity: 1, unit: '式', unitPrice: 3000000 },
  { name: 'UIデザイン', quantity: 1, unit: '式', unitPrice: 800000 },
  { name: '技術コンサルティング', quantity: 10, unit: '時間', unitPrice: 50000 },
  { name: 'サーバー構築・設定', quantity: 1, unit: '式', unitPrice: 400000 },
  { name: '運用保守（月額）', quantity: 3, unit: 'ヶ月', unitPrice: 150000 },
];

const TAX_RATE = 0.1;

const formatCurrency = (amount: number) =>
  `¥${amount.toLocaleString('ja-JP')}`;

/* ----------------------------------------------------------------
   Invoice Story — Storybook では 70% 縮小でプレビュー
   ---------------------------------------------------------------- */

export const InvoiceTemplate: StoryObj = {
  name: '請求書',
  render: () => {
    const subtotal = ITEMS.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
    const tax = Math.floor(subtotal * TAX_RATE);
    const total = subtotal + tax;

    return (
      <div style={{ transform: 'scale(0.7)', transformOrigin: 'top center' }}>
        <PrintDocument>
          {/* Header */}
          <PrintHeader
            title="請求書"
            subtitle="INVOICE"
            meta={
              <div>
                <div style={{ fontSize: '11pt', fontWeight: 700 }}>No. INV-2026-0042</div>
                <div>発行日: 2026年3月19日</div>
                <div>お支払期限: 2026年4月30日</div>
              </div>
            }
          />

          {/* Client + Issuer info */}
          <div className="flex justify-between mb-6">
            <div>
              <p className="text-[8pt] font-medium text-neutral-500 mb-1">請求先</p>
              <p style={{ fontSize: '12pt', fontWeight: 700 }} className="text-neutral-900 mb-0.5">
                {CLIENT.name}
              </p>
              <p className="text-[9pt] text-neutral-600">{CLIENT.department}</p>
              <p className="text-[9pt] text-neutral-600">{CLIENT.address}</p>
            </div>
            <div className="text-right text-[9pt] text-neutral-600 leading-relaxed">
              <p className="font-semibold text-neutral-900">{COMPANY.name}</p>
              <p>{COMPANY.address}</p>
              <p>TEL: {COMPANY.tel}</p>
              <p>{COMPANY.email}</p>
              <p className="mt-1 text-[8pt] text-neutral-400">登録番号: {COMPANY.registrationNo}</p>
            </div>
          </div>

          {/* Total amount highlight */}
          <div className="rounded-lg px-5 py-4 mb-6 flex items-center justify-between bg-primary-50 border-2 border-primary-200">
            <p className="text-[9pt] font-medium text-neutral-600">ご請求金額（税込）</p>
            <span style={{ fontSize: '18pt', fontWeight: 700 }} className="text-neutral-900">
              {formatCurrency(total)}
            </span>
          </div>

          {/* Line items table */}
          <PrintTable>
            <PrintTableHeader>
              <PrintTableRow>
                <PrintTableHead className="w-[5%]">No.</PrintTableHead>
                <PrintTableHead>品目・内容</PrintTableHead>
                <PrintTableHead align="center" className="w-[10%]">数量</PrintTableHead>
                <PrintTableHead align="center" className="w-[8%]">単位</PrintTableHead>
                <PrintTableHead align="right" className="w-[18%]">単価</PrintTableHead>
                <PrintTableHead align="right" className="w-[18%]">金額</PrintTableHead>
              </PrintTableRow>
            </PrintTableHeader>
            <PrintTableBody>
              {ITEMS.map((item, i) => (
                <PrintTableRow key={i}>
                  <PrintTableCell className="text-neutral-400">{i + 1}</PrintTableCell>
                  <PrintTableCell>{item.name}</PrintTableCell>
                  <PrintTableCell align="center">{item.quantity}</PrintTableCell>
                  <PrintTableCell align="center" className="text-neutral-500">{item.unit}</PrintTableCell>
                  <PrintTableCell align="right">{formatCurrency(item.unitPrice)}</PrintTableCell>
                  <PrintTableCell align="right" className="font-medium">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </PrintTableCell>
                </PrintTableRow>
              ))}
            </PrintTableBody>
          </PrintTable>

          {/* Totals */}
          <div className="flex justify-end mt-3 mb-6">
            <div className="w-56">
              <div className="flex justify-between py-1 text-[9pt]">
                <span className="text-neutral-500">小計</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between py-1 text-[9pt]">
                <span className="text-neutral-500">消費税（10%）</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between py-2 font-bold border-t-2 border-primary-500 mt-1" style={{ fontSize: '11pt' }}>
                <span>合計</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <PrintDivider />

          {/* Payment info */}
          <div className="mb-5">
            <h2 className="text-[9pt] font-semibold text-neutral-700 mb-2">お振込先</h2>
            <div className="bg-neutral-50 rounded-md p-3">
              <PrintFieldGroup columns={1}>
                <PrintField label="金融機関" value={COMPANY.bank} />
              </PrintFieldGroup>
              <p className="text-[8pt] text-neutral-400 mt-2">
                ※ 恐れ入りますが振込手数料はお客様のご負担にてお願い申し上げます。
              </p>
            </div>
          </div>

          {/* Notes */}
          <div className="border-l-2 border-primary-200 pl-3 py-1.5 text-[8pt] text-neutral-500 mb-5">
            <p className="font-semibold text-neutral-600 mb-0.5">備考</p>
            <ul className="space-y-0.5">
              <li>本請求書の有効期限は発行日より30日間です。</li>
              <li>ご不明な点がございましたら上記連絡先までお問い合わせください。</li>
            </ul>
          </div>

          {/* Footer */}
          <PrintFooter>
            <p>{COMPANY.name} — {COMPANY.nameEn}</p>
            <p className="mt-0.5">{COMPANY.address} | {COMPANY.tel} | {COMPANY.email}</p>
          </PrintFooter>
        </PrintDocument>
      </div>
    );
  },
};
