import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SeminarDetailSection } from './seminar-detail';

const base = {
  title: '現場DXの始め方',
  overview: ['現場の紙運用をどこから置き換えるかを、実例をもとに解説します。'],
  recommended: ['製造業の情報システム部の方', '現場の紙運用に課題がある方'],
  agenda: [
    { time: '14:00-14:05', title: 'オープニング' },
    { time: '14:05-14:40', title: '現場DXの進め方', description: '3社の事例をもとに解説します。' },
  ],
  eventMeta: [
    { label: '開催日時', value: '2026年9月10日（木）14:00-15:00' },
    { label: '参加費', value: '無料' },
  ],
  speakers: [{ name: '立花 直人', organization: 'シラクサ株式会社', role: '取締役 CTO' }],
};

describe('SeminarDetailSection', () => {
  it('タイトルを h1 で出す', () => {
    render(<SeminarDetailSection status="upcoming" startAt="2026-09-10T14:00" {...base} />);
    expect(screen.getByRole('heading', { level: 1, name: '現場DXの始め方' })).toBeInTheDocument();
  });

  it('概要・おすすめ・プログラム・開催要項・登壇者を出す', () => {
    render(<SeminarDetailSection status="upcoming" startAt="2026-09-10T14:00" {...base} />);
    expect(screen.getByRole('heading', { level: 2, name: 'セミナー概要' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'こんな方におすすめ' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'プログラム' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '開催要項' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '登壇者' })).toBeInTheDocument();
  });

  /* 実測で dl を使っていたのは MF 2/7 だけだが、ラベルと値の対応を
     支援技術へ伝えられる形は dl しかない（会社概要表と同じ判断） */
  it('開催要項を定義リストで組む', () => {
    const { container } = render(
      <SeminarDetailSection status="upcoming" startAt="2026-09-10T14:00" {...base} />,
    );
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(container.querySelectorAll('dd')).toHaveLength(2);
  });

  it('時間割型のアジェンダは時刻を出す', () => {
    render(<SeminarDetailSection status="upcoming" startAt="2026-09-10T14:00" {...base} />);
    expect(screen.getByText('14:00-14:05')).toBeInTheDocument();
  });

  it('章立て型のアジェンダは連番を振る（time を渡さないとき）', () => {
    render(
      <SeminarDetailSection
        status="upcoming"
        startAt="2026-09-10T14:00"
        title="x"
        agenda={[{ title: '第1部' }, { title: '第2部' }]}
      />,
    );
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('状態を必ず文言で出す', () => {
    render(<SeminarDetailSection status="closed" startAt="2026-07-02T13:00" title="x" />);
    expect(screen.getByText('受付終了')).toBeInTheDocument();
  });

  it('フォームを受け取って末尾に置く（フォーム自体が CTA）', () => {
    render(
      <SeminarDetailSection
        status="upcoming"
        startAt="2026-09-10T14:00"
        title="x"
        form={<form aria-label="申込フォーム" />}
      />,
    );
    expect(screen.getByRole('form', { name: '申込フォーム' })).toBeInTheDocument();
  });
});

describe('status による型の分岐（実測に無い構成を型で塞ぐ）', () => {
  it('アーカイブは開催日時を型として持たない', () => {
    render(
      <SeminarDetailSection
        status="archive"
        title="x"
        viewableUntil="2026-12-31"
        // @ts-expect-error アーカイブ配信に開催日時は無い
        startAt="2026-09-10T14:00"
      />,
    );
    expect(screen.getByText('2026.12.31')).toBeInTheDocument();
  });

  it('開催予定は視聴期限を型として持たない', () => {
    render(
      <SeminarDetailSection
        status="upcoming"
        title="x"
        startAt="2026-09-10T14:00"
        // @ts-expect-error 開催予定に視聴期限は無い
        viewableUntil="2026-12-31"
      />,
    );
    expect(screen.getByText('2026.09.10 14:00')).toBeInTheDocument();
  });

  it('状態ごとの props が DOM 属性へ漏れない', () => {
    const { container } = render(
      <SeminarDetailSection status="upcoming" startAt="2026-09-10T14:00" title="x" />,
    );
    const section = container.querySelector('section')!;
    expect(section.getAttribute('startAt')).toBeNull();
    expect(section.getAttribute('startat')).toBeNull();
  });

  it('a11y違反がない（開催予定のフル構成）', async () => {
    const { container } = render(
      <SeminarDetailSection
        status="upcoming"
        startAt="2026-09-10T14:00"
        format="online"
        photo={{ src: '/hero.png', alt: 'セミナーの告知画像' }}
        {...base}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
