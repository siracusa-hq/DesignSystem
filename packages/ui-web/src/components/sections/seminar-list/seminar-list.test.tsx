import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { SeminarListSection } from './seminar-list';
import type { SeminarListItem } from '@/components/sections/seminar-card';

const seminars: SeminarListItem[] = [
  { status: 'upcoming', href: '/seminar/1', title: '現場DXの始め方', startAt: '2026-09-10T14:00' },
  { status: 'closed', href: '/seminar/2', title: '生成AI導入の落とし穴', startAt: '2026-07-02T13:00' },
  { status: 'archive', href: '/seminar/3', title: '権限設計の実務', viewableUntil: '2026-12-31' },
  { status: 'upcoming', href: '/seminar/4', title: '監査対応の勘所', startAt: '2026-09-24T15:00', format: 'venue' },
];

describe('SeminarListSection', () => {
  it('全件をカードとして出す', () => {
    render(<SeminarListSection title="セミナー" seminars={seminars} />);
    seminars.forEach((s) => {
      expect(screen.getByRole('link', { name: new RegExp(s.title) })).toHaveAttribute('href', s.href);
    });
  });

  /* 実測 0/8。8サイトすべてが同じ一覧で両方を扱う */
  it('予定と終了を1つの一覧にまとめ、状態ごとに見出しを立てる', () => {
    render(<SeminarListSection title="セミナー" seminars={seminars} />);
    expect(screen.getByRole('heading', { level: 2, name: '開催予定のセミナー' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'アーカイブ配信' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '終了したセミナー' })).toBeInTheDocument();
  });

  it('申し込めるものを先に並べる（開催予定 → アーカイブ → 終了）', () => {
    const { container } = render(<SeminarListSection title="セミナー" seminars={seminars} />);
    const headings = [...container.querySelectorAll('h2')].map((h) => h.textContent);
    expect(headings).toEqual(['開催予定のセミナー', 'アーカイブ配信', '終了したセミナー']);
  });

  it('該当が無い状態の見出しは出さない', () => {
    render(<SeminarListSection title="セミナー" seminars={[seminars[0]]} />);
    expect(screen.queryByText('終了したセミナー')).not.toBeInTheDocument();
  });

  /* 色だけで状態を伝えない（色覚特性で判別できなくなるため） */
  it('状態を必ず文言で出す', () => {
    render(<SeminarListSection title="セミナー" seminars={seminars} />);
    expect(screen.getAllByText('受付中')).toHaveLength(2);
    expect(screen.getByText('受付終了')).toBeInTheDocument();
    expect(screen.getByText('アーカイブ配信中')).toBeInTheDocument();
  });

  it('日時をシステムの書式で出す（実測が6通りに割れているため）', () => {
    const { container } = render(<SeminarListSection title="セミナー" seminars={seminars} />);
    expect(container.querySelector('time[datetime="2026-09-10T14:00"]')).toHaveTextContent(
      '2026.09.10 14:00',
    );
  });

  it('アーカイブは開催日時ではなく視聴期限を出す', () => {
    const { container } = render(<SeminarListSection title="セミナー" seminars={[seminars[2]]} />);
    expect(container.querySelector('time[datetime="2026-12-31"]')).toHaveTextContent('2026.12.31');
    expect(screen.getByText(/視聴期限/)).toBeInTheDocument();
  });

  it('開催形式を出す', () => {
    render(<SeminarListSection title="セミナー" seminars={seminars} />);
    expect(screen.getByText('会場開催')).toBeInTheDocument();
  });

  it('ページ送り・検索・並べ替えを出さない', () => {
    const { container } = render(<SeminarListSection title="セミナー" seminars={seminars} />);
    expect(container.querySelector('nav')).toBeNull();
    expect(container.querySelector('input[type="search"]')).toBeNull();
  });

  it('英語ラベルに差し替えられる', () => {
    render(
      <SeminarListSection
        title="Seminars"
        seminars={[seminars[0]]}
        labels={{
          status: { upcoming: 'Open', closed: 'Closed', archive: 'On demand' },
          groupHeading: { upcoming: 'Upcoming', closed: 'Past', archive: 'On demand' },
        }}
      />,
    );
    expect(screen.getByText('Open')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Upcoming' })).toBeInTheDocument();
  });

  it('該当が無いときは空状態を出す', () => {
    render(<SeminarListSection title="セミナー" seminars={[]} />);
    expect(screen.getByText(/現在公開中のセミナーはありません/)).toBeInTheDocument();
  });

  it('a11y違反がない', async () => {
    const { container } = render(<SeminarListSection title="セミナー" seminars={seminars} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
