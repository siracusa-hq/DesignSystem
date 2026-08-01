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
  { date: '2024-06-03', title: '週次ミーティング', color: 'primary', startTime: '10:00', endTime: '11:00' },
  { date: '2024-06-05', title: 'コードレビュー', color: 'info', startTime: '14:00', endTime: '15:00' },
  { date: '2024-06-05', title: 'デザインレビュー', color: 'warning', startTime: '16:00', endTime: '17:00' },
  { date: '2024-06-10', title: 'スプリント開始', color: 'success', startTime: '09:00', endTime: '09:30' },
  { date: '2024-06-10', title: 'プランニング', color: 'primary', startTime: '10:00', endTime: '12:00' },
  { date: '2024-06-12', title: 'ランチ会', color: 'primary', startTime: '12:00', endTime: '13:00' },
  { date: '2024-06-14', title: 'デプロイ', color: 'error', startTime: '15:00', endTime: '16:00' },
  { date: '2024-06-17', title: '週次ミーティング', color: 'primary', startTime: '10:00', endTime: '11:00' },
  { date: '2024-06-20', title: '中間レビュー', color: 'warning', startTime: '13:00', endTime: '14:00' },
  { date: '2024-06-21', title: 'リリース準備', color: 'error', startTime: '09:00', endTime: '10:00' },
  { date: '2024-06-24', title: 'スプリント終了', color: 'success', startTime: '17:00', endTime: '18:00' },
  { date: '2024-06-24', title: '振り返り', color: 'info', startTime: '15:00', endTime: '16:00' },
  { date: '2024-06-25', title: '本番リリース', color: 'error', startTime: '10:00', endTime: '11:00' },
  { date: '2024-06-28', title: '月末レポート', color: 'warning', startTime: '14:00', endTime: '15:00' },
];

/** 2024年6月の祝日（サンプル） */
const JUNE_HOLIDAYS = ['2024-06-11']; // 例: 入梅の日を祝日扱い（デモ用）

/* ================================================================== */
/*  月表示 (Month)                                                     */
/* ================================================================== */

export const Default: Story = {
  name: '月表示 — Default',
  render: () => (
    <div className="w-[640px]">
      <CalendarView defaultMonth="2024-06" events={JUNE_EVENTS} holidays={JUNE_HOLIDAYS} />
    </div>
  ),
};

export const Empty: Story = {
  name: '月表示 — Empty',
  render: () => (
    <div className="w-[640px]">
      <CalendarView defaultMonth="2024-06" holidays={JUNE_HOLIDAYS} />
    </div>
  ),
};

export const WithClickHandler: Story = {
  name: '月表示 — Click Handler',
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
                  {e.startTime && <span className="text-[var(--color-on-surface-muted)] mr-1">{e.startTime}</span>}
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
  name: '月表示 — TODO List',
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
  name: '月表示 — Custom renderDay',
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

export const ControlledMonth: Story = {
  name: '月表示 — Controlled',
  render: function ControlledExample() {
    const [month, setMonth] = React.useState('2024-06');

    return (
      <div className="w-[640px] space-y-3">
        <CalendarView month={month} onMonthChange={setMonth} events={JUNE_EVENTS} />
        <p className="text-sm text-[var(--color-on-surface-muted)] text-center">
          表示中: {month}
        </p>
      </div>
    );
  },
};

/* ================================================================== */
/*  週表示 (Week)                                                      */
/* ================================================================== */

export const WeekView: Story = {
  name: '週表示 — Default',
  render: () => (
    <div className="w-[800px]">
      <CalendarView view="week" defaultDate="2024-06-05" events={JUNE_EVENTS} holidays={JUNE_HOLIDAYS} />
    </div>
  ),
};

export const WeekViewWithClickHandler: Story = {
  name: '週表示 — Click Handler',
  render: function WeekClickExample() {
    const [selected, setSelected] = React.useState<string | null>(null);

    return (
      <div className="w-[800px] space-y-3">
        <CalendarView
          view="week"
          defaultDate="2024-06-05"
          events={JUNE_EVENTS}
          onDateClick={(date) => setSelected(date)}
        />
        {selected && (
          <p className="text-sm text-center text-[var(--color-on-surface-muted)]">
            選択: {selected}
          </p>
        )}
      </div>
    );
  },
};

export const WeekViewBusy: Story = {
  name: '週表示 — 忙しい週',
  render: () => {
    const busyEvents: CalendarEvent[] = [
      { date: '2024-06-03', title: '朝会', startTime: '09:00', endTime: '09:30', color: 'primary' },
      { date: '2024-06-03', title: 'コードレビュー', startTime: '10:00', endTime: '11:00', color: 'info' },
      { date: '2024-06-03', title: 'ランチ', startTime: '12:00', endTime: '13:00', color: 'success' },
      { date: '2024-06-03', title: '1on1', startTime: '14:00', endTime: '14:30', color: 'warning' },
      { date: '2024-06-04', title: 'スタンドアップ', startTime: '09:00', endTime: '09:15', color: 'primary' },
      { date: '2024-06-04', title: 'デザインレビュー', startTime: '11:00', endTime: '12:00', color: 'warning' },
      { date: '2024-06-04', title: 'ペアプロ', startTime: '14:00', endTime: '16:00', color: 'info' },
      { date: '2024-06-05', title: '朝会', startTime: '09:00', endTime: '09:30', color: 'primary' },
      { date: '2024-06-05', title: 'プランニング', startTime: '10:00', endTime: '12:00', color: 'error' },
      { date: '2024-06-05', title: 'デプロイ', startTime: '15:00', endTime: '16:00', color: 'error' },
      { date: '2024-06-06', title: 'スタンドアップ', startTime: '09:00', endTime: '09:15', color: 'primary' },
      { date: '2024-06-06', title: 'テスト', startTime: '13:00', endTime: '14:00', color: 'success' },
      { date: '2024-06-07', title: '朝会', startTime: '09:00', endTime: '09:30', color: 'primary' },
      { date: '2024-06-07', title: '振り返り', startTime: '16:00', endTime: '17:00', color: 'info' },
    ];

    return (
      <div className="w-[800px]">
        <CalendarView view="week" defaultDate="2024-06-05" events={busyEvents} />
      </div>
    );
  },
};

/* ================================================================== */
/*  日表示 (Day)                                                       */
/* ================================================================== */

export const DayView: Story = {
  name: '日表示 — Default',
  render: () => {
    const events: CalendarEvent[] = [
      { date: '2024-06-05', title: '朝会', startTime: '09:00', endTime: '09:30', color: 'primary' },
      { date: '2024-06-05', title: 'コードレビュー', startTime: '10:00', endTime: '11:30', color: 'info' },
      { date: '2024-06-05', title: 'ランチ', startTime: '12:00', endTime: '13:00', color: 'success' },
      { date: '2024-06-05', title: 'デザインレビュー', startTime: '14:00', endTime: '15:00', color: 'warning' },
      { date: '2024-06-05', title: 'デプロイ', startTime: '16:00', endTime: '17:00', color: 'error' },
    ];

    return (
      <div className="w-[480px]">
        <CalendarView view="day" defaultDate="2024-06-05" events={events} />
      </div>
    );
  },
};

export const DayViewEmpty: Story = {
  name: '日表示 — Empty',
  render: () => (
    <div className="w-[480px]">
      <CalendarView view="day" defaultDate="2024-06-05" />
    </div>
  ),
};

export const DayViewBusy: Story = {
  name: '日表示 — 忙しい日',
  render: () => {
    const events: CalendarEvent[] = [
      { date: '2024-06-05', title: 'メール確認', startTime: '08:00', endTime: '08:30', color: 'primary' },
      { date: '2024-06-05', title: '朝会', startTime: '09:00', endTime: '09:30', color: 'primary' },
      { date: '2024-06-05', title: 'プランニング', startTime: '10:00', endTime: '12:00', color: 'error' },
      { date: '2024-06-05', title: 'ランチ', startTime: '12:00', endTime: '13:00', color: 'success' },
      { date: '2024-06-05', title: '1on1 (マネージャー)', startTime: '13:00', endTime: '13:30', color: 'warning' },
      { date: '2024-06-05', title: 'コードレビュー', startTime: '14:00', endTime: '15:00', color: 'info' },
      { date: '2024-06-05', title: 'ペアプロ', startTime: '15:00', endTime: '16:30', color: 'info' },
      { date: '2024-06-05', title: 'デプロイ', startTime: '17:00', endTime: '18:00', color: 'error' },
      { date: '2024-06-05', title: '日報', startTime: '18:00', endTime: '18:30', color: 'primary' },
    ];

    return (
      <div className="w-[480px]">
        <CalendarView view="day" defaultDate="2024-06-05" events={events} />
      </div>
    );
  },
};
