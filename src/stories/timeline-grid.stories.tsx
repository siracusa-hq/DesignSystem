import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  TimelineGrid,
  TimelineRow,
  TimelineBar,
  TimelineGroup,
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

export const GroupedMilestones: Story = {
  name: '親子構造（マイルストーン＋タスク）',
  render: () => {
    const start = new Date(2025, 3, 1);
    const end = new Date(2025, 4, 15);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1;

    // Milestone 1
    const ms1: TimelineItem = {
      id: 'ms1',
      label: 'MS1: MVP リリース',
      start: new Date(2025, 3, 1),
      end: new Date(2025, 3, 20),
      color: 'primary',
      progress: 75,
    };
    const ms1Tasks: TimelineItem[] = [
      { id: 't1', label: 'ユーザー認証', start: new Date(2025, 3, 1), end: new Date(2025, 3, 7), color: 'primary', progress: 100 },
      { id: 't2', label: 'ダッシュボード', start: new Date(2025, 3, 5), end: new Date(2025, 3, 14), color: 'info', progress: 80 },
      { id: 't3', label: '設定画面', start: new Date(2025, 3, 10), end: new Date(2025, 3, 18), color: 'success', progress: 40 },
      { id: 't4', label: 'E2Eテスト', start: new Date(2025, 3, 15), end: new Date(2025, 3, 20), color: 'warning', progress: 20 },
    ];

    // Milestone 2
    const ms2: TimelineItem = {
      id: 'ms2',
      label: 'MS2: β版公開',
      start: new Date(2025, 3, 18),
      end: new Date(2025, 4, 10),
      color: 'warning',
    };
    const ms2Tasks: TimelineItem[] = [
      { id: 't5', label: 'パフォーマンス最適化', start: new Date(2025, 3, 18), end: new Date(2025, 3, 28), color: 'error' },
      { id: 't6', label: 'ドキュメント整備', start: new Date(2025, 3, 22), end: new Date(2025, 4, 5), color: 'info' },
      { id: 't7', label: 'β環境構築', start: new Date(2025, 4, 1), end: new Date(2025, 4, 10), color: 'success' },
    ];

    return (
      <TimelineGrid
        rangeStart={start}
        rangeEnd={end}
        granularity="day"
        today={new Date(2025, 3, 12)}
      >
        <TimelineGroup
          label="MS1: MVP リリース"
          bar={<TimelineBar item={ms1} rangeStart={start} totalDays={totalDays} />}
        >
          {ms1Tasks.map((task) => (
            <TimelineRow key={task.id} label={task.label}>
              <TimelineBar item={task} rangeStart={start} totalDays={totalDays} />
            </TimelineRow>
          ))}
        </TimelineGroup>

        <TimelineGroup
          label="MS2: β版公開"
          bar={<TimelineBar item={ms2} rangeStart={start} totalDays={totalDays} />}
        >
          {ms2Tasks.map((task) => (
            <TimelineRow key={task.id} label={task.label}>
              <TimelineBar item={task} rangeStart={start} totalDays={totalDays} />
            </TimelineRow>
          ))}
        </TimelineGroup>
      </TimelineGrid>
    );
  },
};

export const CollapsedGroups: Story = {
  name: '親子構造（折りたたみ状態）',
  render: () => {
    const start = new Date(2025, 3, 1);
    const end = new Date(2025, 4, 15);
    const totalDays = Math.ceil((end.getTime() - start.getTime()) / 86_400_000) + 1;

    const milestones: Array<{
      ms: TimelineItem;
      tasks: TimelineItem[];
      defaultExpanded: boolean;
    }> = [
      {
        ms: { id: 'ms1', label: 'MS1: 完了済み', start: new Date(2025, 3, 1), end: new Date(2025, 3, 14), color: 'success', progress: 100 },
        tasks: [
          { id: 't1', label: '設計', start: new Date(2025, 3, 1), end: new Date(2025, 3, 5), color: 'success', progress: 100 },
          { id: 't2', label: '実装', start: new Date(2025, 3, 5), end: new Date(2025, 3, 14), color: 'success', progress: 100 },
        ],
        defaultExpanded: false,
      },
      {
        ms: { id: 'ms2', label: 'MS2: 進行中', start: new Date(2025, 3, 10), end: new Date(2025, 3, 30), color: 'primary', progress: 40 },
        tasks: [
          { id: 't3', label: 'API開発', start: new Date(2025, 3, 10), end: new Date(2025, 3, 22), color: 'info', progress: 60 },
          { id: 't4', label: 'フロント実装', start: new Date(2025, 3, 15), end: new Date(2025, 3, 28), color: 'warning', progress: 25 },
          { id: 't5', label: 'テスト', start: new Date(2025, 3, 25), end: new Date(2025, 3, 30), color: 'error' },
        ],
        defaultExpanded: true,
      },
      {
        ms: { id: 'ms3', label: 'MS3: 未着手', start: new Date(2025, 4, 1), end: new Date(2025, 4, 15), color: 'warning' },
        tasks: [
          { id: 't6', label: 'リリース準備', start: new Date(2025, 4, 1), end: new Date(2025, 4, 10), color: 'warning' },
          { id: 't7', label: '本番デプロイ', start: new Date(2025, 4, 10), end: new Date(2025, 4, 15), color: 'error' },
        ],
        defaultExpanded: false,
      },
    ];

    return (
      <TimelineGrid
        rangeStart={start}
        rangeEnd={end}
        granularity="day"
        today={new Date(2025, 3, 18)}
      >
        {milestones.map(({ ms, tasks, defaultExpanded }) => (
          <TimelineGroup
            key={ms.id}
            label={ms.label}
            defaultExpanded={defaultExpanded}
            bar={<TimelineBar item={ms} rangeStart={start} totalDays={totalDays} />}
          >
            {tasks.map((task) => (
              <TimelineRow key={task.id} label={task.label}>
                <TimelineBar item={task} rangeStart={start} totalDays={totalDays} />
              </TimelineRow>
            ))}
          </TimelineGroup>
        ))}
      </TimelineGrid>
    );
  },
};

/** Helper used only in story */
function addDaysHelper(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}
