import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TimelineGrid,
  TimelineRow,
  TimelineBar,
  type TimelineItem,
} from '../components/timeline-grid';

const meta: Meta<typeof TimelineGrid> = {
  title: 'Data Display/TimelineGrid',
  component: TimelineGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj<typeof TimelineGrid>;

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

const GANTT_ITEMS: TimelineItem[] = [
  {
    id: '1',
    label: '要件定義',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 7),
    color: 'primary',
    progress: 100,
  },
  {
    id: '2',
    label: 'UIデザイン',
    start: new Date(2025, 3, 5),
    end: new Date(2025, 3, 14),
    color: 'info',
    progress: 80,
  },
  {
    id: '3',
    label: 'フロントエンド実装',
    start: new Date(2025, 3, 10),
    end: new Date(2025, 3, 25),
    color: 'success',
    progress: 45,
  },
  {
    id: '4',
    label: 'API開発',
    start: new Date(2025, 3, 8),
    end: new Date(2025, 3, 22),
    color: 'warning',
    progress: 60,
  },
  {
    id: '5',
    label: 'テスト',
    start: new Date(2025, 3, 20),
    end: new Date(2025, 3, 28),
    color: 'error',
    progress: 10,
  },
  {
    id: '6',
    label: 'リリース準備',
    start: new Date(2025, 3, 26),
    end: new Date(2025, 3, 30),
    color: 'primary',
  },
];

const RANGE_START = new Date(2025, 3, 1);
const RANGE_END = new Date(2025, 3, 30);

/* ================================================================== */
/*  Stories                                                             */
/* ================================================================== */

export const Default: Story = {
  name: '日粒度 — Default',
  render: () => (
    <TimelineGrid
      rangeStart={RANGE_START}
      rangeEnd={RANGE_END}
      granularity="day"
      today={new Date(2025, 3, 15)}
    >
      {GANTT_ITEMS.map((item) => (
        <TimelineRow key={item.id} label={item.label}>
          <TimelineBar item={item} rangeStart={RANGE_START} totalDays={30} />
        </TimelineRow>
      ))}
    </TimelineGrid>
  ),
};

export const WithProgress: Story = {
  name: '日粒度 — 進捗表示',
  render: () => (
    <TimelineGrid
      rangeStart={RANGE_START}
      rangeEnd={RANGE_END}
      granularity="day"
      rowHeight="2.5rem"
      today={new Date(2025, 3, 15)}
    >
      {GANTT_ITEMS.map((item) => (
        <TimelineRow key={item.id} label={item.label}>
          <TimelineBar item={item} rangeStart={RANGE_START} totalDays={30} />
        </TimelineRow>
      ))}
    </TimelineGrid>
  ),
};

export const WeekGranularity: Story = {
  name: '週粒度',
  render: () => {
    const start = new Date(2025, 3, 1);
    const end = new Date(2025, 5, 30);
    const items: TimelineItem[] = [
      { id: '1', label: 'フェーズ1: 企画', start: new Date(2025, 3, 1), end: new Date(2025, 3, 20), color: 'primary', progress: 100 },
      { id: '2', label: 'フェーズ2: 開発', start: new Date(2025, 3, 14), end: new Date(2025, 4, 25), color: 'success', progress: 50 },
      { id: '3', label: 'フェーズ3: テスト', start: new Date(2025, 4, 19), end: new Date(2025, 5, 15), color: 'warning' },
      { id: '4', label: 'フェーズ4: リリース', start: new Date(2025, 5, 16), end: new Date(2025, 5, 30), color: 'error' },
    ];
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1;

    return (
      <TimelineGrid rangeStart={start} rangeEnd={end} granularity="week" today={new Date(2025, 4, 1)}>
        {items.map((item) => (
          <TimelineRow key={item.id} label={item.label}>
            <TimelineBar item={item} rangeStart={start} totalDays={totalDays} />
          </TimelineRow>
        ))}
      </TimelineGrid>
    );
  },
};

export const MonthGranularity: Story = {
  name: '月粒度',
  render: () => {
    const start = new Date(2025, 0, 1);
    const end = new Date(2025, 11, 31);
    const items: TimelineItem[] = [
      { id: '1', label: 'Q1: 基盤構築', start: new Date(2025, 0, 1), end: new Date(2025, 2, 31), color: 'primary', progress: 100 },
      { id: '2', label: 'Q2: 機能開発', start: new Date(2025, 3, 1), end: new Date(2025, 5, 30), color: 'success', progress: 60 },
      { id: '3', label: 'Q3: β版公開', start: new Date(2025, 6, 1), end: new Date(2025, 8, 30), color: 'warning' },
      { id: '4', label: 'Q4: 正式リリース', start: new Date(2025, 9, 1), end: new Date(2025, 11, 31), color: 'info' },
    ];
    const totalDays = 365;

    return (
      <TimelineGrid
        rangeStart={start}
        rangeEnd={end}
        granularity="month"
        labelWidth="12rem"
        today={new Date(2025, 3, 5)}
      >
        {items.map((item) => (
          <TimelineRow key={item.id} label={item.label}>
            <TimelineBar item={item} rangeStart={start} totalDays={totalDays} />
          </TimelineRow>
        ))}
      </TimelineGrid>
    );
  },
};

export const WithClickHandler: Story = {
  name: 'クリックイベント',
  render: () => {
    const [selected, setSelected] = React.useState<string | null>(null);

    return (
      <div className="space-y-3">
        <TimelineGrid
          rangeStart={RANGE_START}
          rangeEnd={RANGE_END}
          granularity="day"
          today={new Date(2025, 3, 15)}
        >
          {GANTT_ITEMS.map((item) => (
            <TimelineRow key={item.id} label={item.label}>
              <TimelineBar
                item={item}
                rangeStart={RANGE_START}
                totalDays={30}
                onClick={(it) => setSelected(it.id)}
                className={
                  selected === item.id
                    ? 'ring-2 ring-[var(--color-ring)] ring-offset-1'
                    : ''
                }
              />
            </TimelineRow>
          ))}
        </TimelineGrid>
        {selected && (
          <p className="text-sm text-[var(--color-on-surface-muted)]">
            選択中: {GANTT_ITEMS.find((i) => i.id === selected)?.label}
          </p>
        )}
      </div>
    );
  },
};

export const NoLabels: Story = {
  name: 'ラベルなし（バーのみ）',
  render: () => (
    <TimelineGrid
      rangeStart={RANGE_START}
      rangeEnd={RANGE_END}
      granularity="day"
      labelWidth="0px"
      today={new Date(2025, 3, 15)}
    >
      {GANTT_ITEMS.slice(0, 3).map((item) => (
        <TimelineRow key={item.id}>
          <TimelineBar item={item} rangeStart={RANGE_START} totalDays={30} />
        </TimelineRow>
      ))}
    </TimelineGrid>
  ),
};

export const ManyRows: Story = {
  name: '多数行',
  render: () => {
    const items: TimelineItem[] = Array.from({ length: 15 }, (_, i) => ({
      id: String(i + 1),
      label: `タスク ${i + 1}`,
      start: addDaysHelper(RANGE_START, Math.floor(Math.random() * 15)),
      end: addDaysHelper(RANGE_START, 15 + Math.floor(Math.random() * 14)),
      color: (['primary', 'info', 'success', 'warning', 'error'] as const)[i % 5],
      progress: Math.floor(Math.random() * 101),
    }));

    return (
      <TimelineGrid
        rangeStart={RANGE_START}
        rangeEnd={RANGE_END}
        granularity="day"
        className="max-h-[420px]"
        today={new Date(2025, 3, 15)}
      >
        {items.map((item) => (
          <TimelineRow key={item.id} label={item.label}>
            <TimelineBar item={item} rangeStart={RANGE_START} totalDays={30} />
          </TimelineRow>
        ))}
      </TimelineGrid>
    );
  },
};

/** Helper used only in story — seeded for consistent snapshots */
function addDaysHelper(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
