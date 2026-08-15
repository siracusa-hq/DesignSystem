import type { Meta, StoryObj } from '@storybook/react';
import { HistorySection, type HistoryEvent } from '../../components/sections/history';

/**
 * HistorySection — 沿革。
 *
 * ここは**順序そのものが情報**なので、年の並びと節点で時系列を示す。
 * **縦の導線は引かない**（時系列は年の並びと横罫が示しており、
 * 縦線を足すと線の語彙が増えるだけになる。2026-08-15 ブランド決定）。
 * 節点はすべて同じ塗りで、強調フラグも持たない。
 */
const meta: Meta<typeof HistorySection> = {
  title: 'Sections/HistorySection',
  component: HistorySection,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof HistorySection>;

const ja: HistoryEvent[] = [
  { year: 2026, month: 7, text: 'Polastack が SOC 2 Type II 報告書を取得' },
  { year: 2026, month: 3, text: '社内ヘルプデスク SaaS「ピアデスク」を提供開始' },
  { year: 2025, month: 11, text: 'シードラウンドで 2.5億円の資金調達を実施' },
  { year: 2025, month: 5, text: 'エンタープライズ向けエージェント基盤「Polastack」を正式提供開始' },
  { year: 2024, month: 10, text: '本社を東京都渋谷区へ移転' },
  { year: 2024, month: 4, text: 'シラクサ株式会社を設立' },
];

const en: HistoryEvent[] = [
  { year: 2026, month: 7, text: 'Polastack obtained a SOC 2 Type II report' },
  { year: 2026, month: 3, text: 'Launched Peerdesk, an internal help desk SaaS' },
  { year: 2025, month: 11, text: 'Raised a seed round of ¥250M' },
  { year: 2025, month: 5, text: 'Launched Polastack, an enterprise agent platform' },
  { year: 2024, month: 4, text: 'Siracusa, Inc. founded' },
];

/** 既定は新しい順 */
export const Newest: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HistorySection
        title={isJa ? '沿革' : 'History'}
        events={isJa ? ja : en}
        formatMonth={isJa ? undefined : (m) => `/${m}`}
      />
    );
  },
};

/** 創業からの物語として読ませたいときは asc */
export const Oldest: Story = {
  render: (_, { globals }) => {
    const isJa = globals.locale === 'ja';
    return (
      <HistorySection
        title={isJa ? '沿革' : 'History'}
        events={isJa ? ja : en}
        order="asc"
        formatMonth={isJa ? undefined : (m) => `/${m}`}
      />
    );
  },
};
