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
} from '../components/print';

const meta: Meta = {
  title: 'Print/Components',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

export const Document: StoryObj = {
  name: 'PrintDocument (A4)',
  render: () => (
    <div style={{ transform: 'scale(0.7)', transformOrigin: 'top center' }}>
      <PrintDocument>
        <PrintHeader
          title="Sample Document"
          subtitle="サンプルドキュメント"
          meta={
            <div>
              <div style={{ fontWeight: 600 }}>DOC-2026-001</div>
              <div>Date: 2026-03-19</div>
            </div>
          }
        />
        <p className="text-[10pt] text-neutral-600 mb-4">
          A4サイズ（210mm × 297mm）のドキュメントプレビューです。
          padding: 20mm がデフォルトで設定されています。
        </p>
        <PrintDivider />
        <p className="text-[10pt] text-neutral-600">Content area</p>
        <PrintFooter>
          <p>株式会社siracusa — Confidential</p>
        </PrintFooter>
      </PrintDocument>
    </div>
  ),
};

export const DocumentLandscape: StoryObj = {
  name: 'PrintDocument (Landscape)',
  render: () => (
    <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center' }}>
      <PrintDocument orientation="landscape">
        <PrintHeader title="Landscape Report" />
        <p className="text-[10pt]">Landscape A4 layout (297mm × 210mm)</p>
        <PrintFooter>Footer</PrintFooter>
      </PrintDocument>
    </div>
  ),
};

export const TableExample: StoryObj = {
  name: 'PrintTable',
  render: () => (
    <div className="w-[600px] bg-white p-6" style={{ fontFamily: 'Inter, "Noto Sans JP", sans-serif' }}>
      <PrintTable>
        <PrintTableHeader>
          <PrintTableRow>
            <PrintTableHead>No.</PrintTableHead>
            <PrintTableHead>品目</PrintTableHead>
            <PrintTableHead align="center">数量</PrintTableHead>
            <PrintTableHead align="right">単価</PrintTableHead>
            <PrintTableHead align="right">金額</PrintTableHead>
          </PrintTableRow>
        </PrintTableHeader>
        <PrintTableBody>
          <PrintTableRow>
            <PrintTableCell>1</PrintTableCell>
            <PrintTableCell>システム開発費</PrintTableCell>
            <PrintTableCell align="center">1</PrintTableCell>
            <PrintTableCell align="right">¥3,000,000</PrintTableCell>
            <PrintTableCell align="right">¥3,000,000</PrintTableCell>
          </PrintTableRow>
          <PrintTableRow>
            <PrintTableCell>2</PrintTableCell>
            <PrintTableCell>コンサルティング</PrintTableCell>
            <PrintTableCell align="center">10</PrintTableCell>
            <PrintTableCell align="right">¥150,000</PrintTableCell>
            <PrintTableCell align="right">¥1,500,000</PrintTableCell>
          </PrintTableRow>
          <PrintTableRow>
            <PrintTableCell>3</PrintTableCell>
            <PrintTableCell>サーバー保守（月額）</PrintTableCell>
            <PrintTableCell align="center">12</PrintTableCell>
            <PrintTableCell align="right">¥50,000</PrintTableCell>
            <PrintTableCell align="right">¥600,000</PrintTableCell>
          </PrintTableRow>
        </PrintTableBody>
      </PrintTable>
    </div>
  ),
};

export const FieldExamples: StoryObj = {
  name: 'PrintField / PrintFieldGroup',
  render: () => (
    <div className="w-[600px] bg-white p-6" style={{ fontFamily: 'Inter, "Noto Sans JP", sans-serif' }}>
      <h3 className="text-[9pt] font-semibold mb-3">2 Columns (default)</h3>
      <PrintFieldGroup>
        <PrintField label="請求先" value="株式会社siracusa" />
        <PrintField label="請求日" value="2026年3月19日" />
        <PrintField label="住所" value="東京都渋谷区神宮前1-2-3" />
        <PrintField label="お支払期限" value="2026年4月30日" />
      </PrintFieldGroup>

      <PrintDivider />

      <h3 className="text-[9pt] font-semibold mb-3">3 Columns</h3>
      <PrintFieldGroup columns={3}>
        <PrintField label="担当者" value="田中太郎" />
        <PrintField label="部署" value="営業部" />
        <PrintField label="電話" value="03-1234-5678" />
      </PrintFieldGroup>
    </div>
  ),
};
