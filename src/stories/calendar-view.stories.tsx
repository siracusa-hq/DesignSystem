import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  CalendarView,
  type CalendarEvent,
} from '../components/calendar-view';
import { Badge } from '../components/badge';

const meta: Meta<typeof CalendarView> = {
  title: 'Data Display/CalendarView',
  component: CalendarView,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj<typeof CalendarView>;

/* ------------------------------------------------------------------ */
/*  Sample data                                                        */
/* ------------------------------------------------------------------ */

const JUNE_EVENTS: CalendarEvent[] = [
  { date: '2024-06-03', title: '週次ミーティング', color: 'primary' },
  { date: '2024-06-05', title: 'コードレビュー', color: 'info' },
  { date: '2024-06-05', title: 'デザインレビュー', color: 'warning' },
  { date: '2024-06-10', title: 'スプリント開始', color: 'success' },
  { date: '2024-06-10', title: 'プランニング', color: 'primary' },
  { date: '2024-06-12', title: 'ランチ会', color: 'primary' },
  { date: '2024-06-14', title: 'デプロイ', color: 'error' },
  { date: '2024-06-17', title: '週次ミーティング', color: 'primary' },
  { date: '2024-06-20', title: '中間レビュー', color: 'warning' },
  { date: '2024-06-21', title: 'リリース準備', color: 'error' },
  { date: '2024-06-24', title: 'スプリント終了', color: 'success' },
  { date: '2024-06-24', title: '振り返り', color: 'info' },
  { date: '2024-06-25', title: '本番リリース', color: 'error' },
  { date: '2024-06-28', title: '月末レポート', color: 'warning' },
];

/* ------------------------------------------------------------------ */
/*  Stories                                                            */
/* ------------------------------------------------------------------ */

export const Default: Story = {
  render: () => (
    <div className="w-[640px]">
      <CalendarView defaultMonth="2024-06" events={JUNE_EVENTS} />
    </div>
  ),
};

export const Empty: Story = {
  render: () => (
    <div className="w-[640px]">
      <CalendarView defaultMonth="2024-06" />
    </div>
  ),
};

export const WithClickHandler: Story = {
  render: function WithClickHandlerExample() {
    const [selected, setSelected] = React.useState<{
      date: string;
      events: CalendarEvent[];
    } | null>(null);

    return (
      <div className="flex gap-6">
        <div className="w-[640px]">
          <CalendarView
            defaultMonth="2024-06"
            events={JUNE_EVENTS}
            onDateClick={(date, events) => setSelected({ date, events })}
          />
        </div>
        <div className="w-60 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <h3 className="text-sm font-semibold mb-2">
            {selected ? selected.date : '日付を選択してください'}
          </h3>
          {selected && selected.events.length > 0 ? (
            <ul className="space-y-1.5">
              {selected.events.map((e, i) => (
                <li key={i} className="text-sm text-[var(--color-on-surface)]">
                  {e.title}
                </li>
              ))}
            </ul>
          ) : selected ? (
            <p className="text-sm text-[var(--color-on-surface-muted)]">
              イベントなし
            </p>
          ) : null}
        </div>
      </div>
    );
  },
};

export const TodoList: Story = {
  render: function TodoListExample() {
    const todos: CalendarEvent[] = [
      { date: '2024-06-03', title: '企画書提出', color: 'error' },
      { date: '2024-06-05', title: 'APIドキュメント更新', color: 'warning' },
      { date: '2024-06-07', title: 'テスト追加', color: 'primary' },
      { date: '2024-06-10', title: 'DB移行スクリプト', color: 'error' },
      { date: '2024-06-10', title: 'CI/CD設定', color: 'warning' },
      { date: '2024-06-10', title: 'ドキュメント整理', color: 'info' },
      { date: '2024-06-12', title: 'コンポーネント実装', color: 'primary' },
      { date: '2024-06-14', title: 'セキュリティ監査', color: 'error' },
      { date: '2024-06-18', title: 'パフォーマンス改善', color: 'success' },
      { date: '2024-06-21', title: 'E2Eテスト', color: 'warning' },
      { date: '2024-06-25', title: 'QAレビュー', color: 'info' },
      { date: '2024-06-28', title: 'リリースノート', color: 'success' },
    ];

    return (
      <div className="w-[640px]">
        <CalendarView defaultMonth="2024-06" events={todos} />
        <div className="mt-3 flex items-center gap-4 text-xs text-[var(--color-on-surface-muted)]">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[var(--color-error)]" />
            緊急
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[var(--color-warning)]" />
            高
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary-500" />
            中
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[var(--color-info)]" />
            低
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[var(--color-success)]" />
            完了
          </span>
        </div>
      </div>
    );
  },
};

export const CustomRenderDay: Story = {
  render: () => {
    const events: CalendarEvent[] = [
      { date: '2024-06-05', title: 'A' },
      { date: '2024-06-05', title: 'B' },
      { date: '2024-06-10', title: 'C' },
      { date: '2024-06-15', title: 'D' },
      { date: '2024-06-15', title: 'E' },
      { date: '2024-06-15', title: 'F' },
    ];

    return (
      <div className="w-[640px]">
        <CalendarView
          defaultMonth="2024-06"
          events={events}
          renderDay={(_date, dayEvents) =>
            dayEvents.length > 0 ? (
              <Badge variant="secondary" size="sm" className="mt-0.5 text-[10px]">
                {dayEvents.length}件
              </Badge>
            ) : null
          }
        />
      </div>
    );
  },
};

export const Controlled: Story = {
  render: function ControlledExample() {
    const [month, setMonth] = React.useState('2024-06');

    return (
      <div className="w-[640px] space-y-3">
        <CalendarView
          month={month}
          onMonthChange={setMonth}
          events={JUNE_EVENTS}
        />
        <p className="text-sm text-[var(--color-on-surface-muted)] text-center">
          表示中: {month}
        </p>
      </div>
    );
  },
};
